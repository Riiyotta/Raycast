#!/usr/bin/env python3
"""Prove verify_all.py actually catches drift.

For each check: copy the repo to a fresh temp dir, inject ONE defect, run
verify_all.py there and confirm it fails with the expected check id. Then
confirm an unmutated copy passes. The real repo is never modified.

If the clone project sits next to this repo, its source files are symlinked
next to each temp copy so the citation/quote/value checks run too; otherwise
those sibling-only cases are reported as SKIPPED (the offline range check
still runs).

    python3 extraction/prove_drift.py
"""
import json, os, shutil, subprocess, sys, tempfile
sys.dont_write_bytecode = True  # keep the package free of __pycache__

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(HERE)
PROJECT = os.path.dirname(REPO)
SIBLING_FILES = ["src", "ia.json", "tailwind.config.js", "index.html", "CLONE_SPEC.md", "PAGES_SPEC.md"]
HAS_SIBLING = os.path.isfile(os.path.join(PROJECT, "src", "App.jsx")) and os.path.isfile(os.path.join(PROJECT, "ia.json"))


def rw(root, rel, fn):
    p = os.path.join(root, rel)
    with open(p, encoding="utf-8") as f:
        d = json.load(f)
    fn(d)
    with open(p, "w", encoding="utf-8") as f:
        json.dump(d, f, indent=2, ensure_ascii=False)


def text(root, rel, fn):
    p = os.path.join(root, rel)
    with open(p, encoding="utf-8") as f:
        s = f.read()
    with open(p, "w", encoding="utf-8") as f:
        f.write(fn(s))


def first_token_mv(d):
    return next(k for k in d["entries"] if k.startswith("mv.tw.color."))


def bad_quote(d):
    e = d["entries"]["mv.tw.color.grey.900"]["citations"][0]
    e["lines"] = str(int(e["lines"]) + 1)  # in range, wrong line (grey.800 sits there)


MUTATIONS = [
    ("phantom allowlist entry", "ALLOWLIST_PARITY", False,
     lambda r: rw(r, "tokens/llm/component-allowlist.json", lambda d: d["primitives"].append("divider"))),
    ("orphan contract with no allowlist entry", "ALLOWLIST_PARITY", False,
     lambda r: shutil.copy(os.path.join(r, "primitives", "badge.json"), os.path.join(r, "primitives", "ticker.json"))),
    ("out-of-range citation", "CITATIONS", False,
     lambda r: rw(r, "extraction/measured-values.json", lambda d: d["entries"][first_token_mv(d)]["citations"][0].update(lines="9999"))),
    ("in-range citation pointing at the wrong line", "CITATIONS", True,
     lambda r: rw(r, "extraction/measured-values.json", bad_quote)),
    ("token value edited away from its source", "VALUE_IN_SOURCE", True,
     lambda r: rw(r, "tokens/00-foundation/color.json", lambda d: d["color"]["grey.900"].update({"$value": "#07080b"}))),
    ("citation to the excluded saved copy of the live site", "EXCLUDED_SOURCE", False,
     lambda r: rw(r, "extraction/measured-values.json", lambda d: d["entries"][first_token_mv(d)]["citations"].append(
         {"path": "Raycast - Your shortcut to everything.html", "lines": "1", "quote": "x"}))),
    ("dangling evidence id", "EVIDENCE", False,
     lambda r: rw(r, "sections/hero.home.json", lambda d: d["evidence"].append("mv.does-not-exist"))),
    ("manifest count hand-bumped", "MANIFEST_COUNTS", False,
     lambda r: rw(r, "registry.manifest.json", lambda d: d["counts"].update(sections=48))),
    ("README count stale", "README_COUNTS", False,
     lambda r: text(r, "README.md", lambda s: s.replace("<!--count:templates-->8", "<!--count:templates-->9"))),
    ("allowlistVersion drift", "ALLOWLIST_VERSION", False,
     lambda r: rw(r, "registry.manifest.json", lambda d: d.update(allowlistVersion="1.0.1"))),
    ("compliance role moved to a different VALID policy", "ASSET_ROLE_PINNED", False,
     lambda r: rw(r, "assets/asset-roles.json", lambda d: d["roles"]["person.avatar-placeholder"].update(generationPolicy="may-generate-new"))),
    ("graph severity drifts from validator", "GRAPH_VALIDATOR_PARITY", False,
     lambda r: rw(r, "compatibility/graph.json", lambda d: next(x for x in d["rules"] if x["id"] == "FAQ_BEFORE_FOOTER").update(severity="warn"))),
    ("graph rule added with no validator code", "GRAPH_VALIDATOR_PARITY", False,
     lambda r: rw(r, "compatibility/graph.json", lambda d: d["rules"].append({"id": "BLOG_FEATURED_IN_GRID", "severity": "warn", "rule": "x", "exceptions": []}))),
    ("schema budget edited without the contract", "CONTENT_SCHEMA_PARITY", False,
     lambda r: rw(r, "schema/pagespec.schema.json", lambda d: d["definitions"]["content.hero.home"]["properties"]["title"].update(maxLength=40))),
    ("motion schema opened", "MOTION_CLOSED", False,
     lambda r: rw(r, "schema/pagespec.schema.json", lambda d: d["definitions"]["motion"].update(additionalProperties=True))),
    ("absolute local path in docs", "ABS_PATH", False,
     lambda r: text(r, "README.md", lambda s: s + "\nsee " + "/" + "Users" + "/someone/project\n")),
    ("entry point escaping the package", "ENTRYPOINTS", False,
     lambda r: rw(r, "registry.manifest.json", lambda d: d["entryPoints"].append("../ia.json"))),
    ("template drifts from ia.json", "IA_PARITY", True,
     lambda r: rw(r, "templates/templates.json", lambda d: d["templates"]["template.store"]["nodes"].pop(2))),
]


def make_copy():
    root = tempfile.mkdtemp(prefix="dr-drift-")
    dst = os.path.join(root, "design-repo")
    shutil.copytree(REPO, dst, ignore=shutil.ignore_patterns("__pycache__"))
    if HAS_SIBLING:
        for f in SIBLING_FILES:
            os.symlink(os.path.join(PROJECT, f), os.path.join(root, f))
    return root, dst


def run(dst):
    p = subprocess.run([sys.executable, os.path.join(dst, "extraction", "verify_all.py")], capture_output=True, text=True)
    return p.returncode, p.stdout + p.stderr


def main():
    ok = True
    root, dst = make_copy()
    code, out = run(dst)
    shutil.rmtree(root)
    print(f"control (unmutated copy): {'PASS' if code == 0 else 'FAIL'}")
    ok &= code == 0
    for name, check, needs_sibling, fn in MUTATIONS:
        if needs_sibling and not HAS_SIBLING:
            print(f"  SKIPPED  [{check}] {name} (needs the sibling source tree)")
            continue
        root, dst = make_copy()
        fn(dst)
        code, out = run(dst)
        shutil.rmtree(root)
        caught = code != 0 and f"[{check}]" in out
        ok &= caught
        print(f"  {'CAUGHT ' if caught else 'MISSED '}  [{check}] {name}")
        if not caught:
            print("     " + out[-400:].replace("\n", "\n     "))
    print("ALL DRIFT CAUGHT" if ok else "DRIFT CHECK FAILURES")
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
