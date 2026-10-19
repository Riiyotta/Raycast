#!/usr/bin/env python3
"""Semantic validator for Launchpad PageSpecs.

Checks everything JSON Schema cannot express. Run:
    python3 schema/semantic_validate.py [path/to/pagespec.json ...]
With no argument it validates schema/example.pagespec.json.

The repo root is derived from this file's location, never hardcoded.
Rule ids and severities must match compatibility/graph.json (verify_all.py enforces it).
"""
import json, os, sys
sys.dont_write_bytecode = True  # keep the package free of __pycache__

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(HERE)

# id -> severity. Must equal compatibility/graph.json rules.
RULES = {
    "SCHEMA": "error",
    "UNKNOWN_TEMPLATE": "error",
    "NAV_FIRST": "error",
    "FOOTER_LAST": "error",
    "ONE_HERO_AFTER_NAV": "error",
    "TEMPLATE_SEQUENCE": "error",
    "REQUIRED_SLOT_MISSING": "error",
    "VARIANT_PIN": "error",
    "MOTION_VARIANT": "error",
    "MAX_PER_PAGE": "error",
    "NO_ADJACENT_SAME_SECTION": "error",
    "NO_ADJACENT_SAME_CATEGORY": "warn",
    "FAQ_BEFORE_FOOTER": "error",
    "COMPARE_AFTER_PLANS": "error",
    "TOOLBAR_BEFORE_GRID": "error",
    "HOME_ROUTE_ONLY": "error",
    "WINDOWS_FOOTER_ART": "error",
    "AUTOPLAY_BUDGET": "warn",
    "MAX_WORDS": "error",
    "LIST_TOTAL_CHARS": "error",
    "FORBIDDEN_SOURCE_BRAND": "error",
    "ASSET_ROLE_SLOT": "error",
    "UNIQUE_NODE_IDS": "error",
}
# Meta rules that are validator plumbing rather than composition rules (not in graph.json).
META_RULES = {"SCHEMA", "UNKNOWN_TEMPLATE"}


def _load(rel):
    with open(os.path.join(REPO, rel), encoding="utf-8") as f:
        return json.load(f)


def load_repo():
    sections = {}
    sdir = os.path.join(REPO, "sections")
    for fn in sorted(os.listdir(sdir)):
        if fn.endswith(".json"):
            c = _load(os.path.join("sections", fn))
            sections[c["id"]] = c
    return {
        "schema": _load("schema/pagespec.schema.json"),
        "templates": _load("templates/templates.json")["templates"],
        "graph": {r["id"]: r for r in _load("compatibility/graph.json")["rules"]},
        "sections": sections,
    }


def _fields(contract, variant):
    c = contract["content"]
    if "shared" in c:
        return c["shared"]
    return c["byVariant"].get(variant, {})


def _match(nodes, slots):
    """In-order match of nodes onto template slots. Optional slots may be skipped,
    required ones may not. Returns list of slot indexes (one per node) or None."""
    n, m = len(nodes), len(slots)
    # best[i][j]: can nodes[i:] match slots[j:]
    from functools import lru_cache

    @lru_cache(maxsize=None)
    def go(i, j):
        if i == n:
            return all(not s["required"] for s in slots[j:])
        if j == m:
            return False
        s = slots[j]
        if nodes[i]["type"] == s["section"] and go(i + 1, j + 1):
            return True
        if not s["required"] and go(i, j + 1):
            return True
        return False

    if not go(0, 0):
        return None
    out, i, j = [], 0, 0
    while i < n:
        s = slots[j]
        if nodes[i]["type"] == s["section"] and go(i + 1, j + 1):
            out.append(j); i += 1; j += 1
        else:
            j += 1
    return out


def _strings(x):
    if isinstance(x, str):
        yield x
    elif isinstance(x, dict):
        for k, v in x.items():
            yield from _strings(v)
    elif isinstance(x, list):
        for v in x:
            yield from _strings(v)


def _check_fields(fields, content, where, issues):
    for k, f in fields.items():
        if k not in content:
            continue
        v = content[k]
        if f["kind"] == "text" and isinstance(v, str):
            if "maxWords" in f and len(v.split()) > f["maxWords"]:
                issues.append(("MAX_WORDS", f"{where}.{k}: {len(v.split())} words > maxWords {f['maxWords']}"))
        elif f["kind"] == "media" and isinstance(v, dict):
            if v.get("assetRole") not in f["assetRoles"]:
                issues.append(("ASSET_ROLE_SLOT", f"{where}.{k}: assetRole {v.get('assetRole')!r} not allowed here {f['assetRoles']}"))
        elif f["kind"] == "list" and isinstance(v, list):
            if "maxTotalChars" in f:
                total = sum(len(s) for it in v for s in _strings(it.get("text", "")))
                if total > f["maxTotalChars"]:
                    issues.append(("LIST_TOTAL_CHARS", f"{where}.{k}: {total} chars > maxTotalChars {f['maxTotalChars']}"))
            for i, it in enumerate(v):
                if isinstance(it, dict):
                    _check_fields(f["item"], it, f"{where}.{k}[{i}]", issues)


def validate(spec, repo=None):
    """Return (errors, warnings) as lists of 'RULE: message' strings."""
    repo = repo or load_repo()
    issues = []
    try:
        import jsonschema
        v = jsonschema.Draft7Validator(repo["schema"])
        for e in sorted(v.iter_errors(spec), key=lambda e: list(e.path)):
            issues.append(("SCHEMA", f"/{'/'.join(map(str, e.path))}: {e.message[:200]}"))
    except ImportError:
        issues.append(("SCHEMA", "jsonschema is not installed; cannot run the structural layer"))
    if any(r == "SCHEMA" for r, _ in issues):
        return _split(issues)

    tid = spec["template"]
    tpl = repo["templates"].get(tid)
    if tpl is None:
        issues.append(("UNKNOWN_TEMPLATE", tid))
        return _split(issues)
    nodes = spec["nodes"]
    S = repo["sections"]
    G = repo["graph"]
    types = [n["type"] for n in nodes]
    cats = [S[t]["category"] for t in types]

    ids = [n["id"] for n in nodes]
    if len(set(ids)) != len(ids):
        issues.append(("UNIQUE_NODE_IDS", "duplicate node ids"))
    if types.count("nav.navbar") != 1 or types[0] != "nav.navbar":
        issues.append(("NAV_FIRST", "nav.navbar must appear once, first"))
    if types.count("footer.footer") != 1 or types[-1] != "footer.footer":
        issues.append(("FOOTER_LAST", "footer.footer must appear once, last"))
    heroes = [i for i, c in enumerate(cats) if c == "HERO"]
    if heroes != [1]:
        issues.append(("ONE_HERO_AFTER_NAV", f"HERO nodes at {heroes}, expected exactly [1]"))

    # Cross-reference the declared template's own node list (not nodes[] in isolation).
    slots = tpl["nodes"]
    m = _match(nodes, slots)
    if m is None:
        # Distinguish a missing required slot from an out-of-template / out-of-order node.
        req = [s["section"] for s in slots if s["required"]]
        missing = [r for r in req if types.count(r) < req.count(r)]
        if missing:
            issues.append(("REQUIRED_SLOT_MISSING", f"{tid} requires {sorted(set(missing))}"))
        issues.append(("TEMPLATE_SEQUENCE", f"node sequence does not match {tid} slots {[s['section'] for s in slots]}"))
    else:
        for n, j in zip(nodes, m):
            if n["variant"] != slots[j]["variant"]:
                issues.append(("VARIANT_PIN", f"{n['id']}: {n['type']} variant {n['variant']!r} != template slot {slots[j]['variant']!r}"))

    for n in nodes:
        c = S[n["type"]]
        if n["variant"] not in c["variants"]:
            continue  # schema already rejects
        allowed = [{k: a[k] for k in ("pattern", "trigger", "reducedMotionFallback")} for a in c["motion"]["allowed"]
                   if "variants" not in a or n["variant"] in a["variants"]]
        if n["motion"] not in allowed:
            issues.append(("MOTION_VARIANT", f"{n['id']}: motion {n['motion']} not allowed for {n['type']}/{n['variant']}"))
        _check_fields(_fields(c, n["variant"]), n["content"], n["id"], issues)

    limits = G["MAX_PER_PAGE"]["limits"]
    for t in set(types):
        if types.count(t) > limits.get(t, 1):
            issues.append(("MAX_PER_PAGE", f"{t} appears {types.count(t)}x > {limits.get(t, 1)}"))
    ex_sec = set(G["NO_ADJACENT_SAME_SECTION"]["exceptions"])
    ex_cat = set(G["NO_ADJACENT_SAME_CATEGORY"]["exceptions"])
    for a, b in zip(types, types[1:]):
        if a == b and a not in ex_sec:
            issues.append(("NO_ADJACENT_SAME_SECTION", f"{a} twice in a row"))
        elif a != b and S[a]["category"] == S[b]["category"] and f"{a}>{b}" not in ex_cat:
            issues.append(("NO_ADJACENT_SAME_CATEGORY", f"{a} then {b} (both {S[a]['category']})"))
    if "faq.accordion" in types and types.index("faq.accordion") != len(types) - 2:
        issues.append(("FAQ_BEFORE_FOOTER", "faq.accordion must sit immediately before the footer"))
    if "pricing.compare-table" in types:
        i = types.index("pricing.compare-table")
        if i == 0 or types[i - 1] != "pricing.plans":
            issues.append(("COMPARE_AFTER_PLANS", "pricing.compare-table must follow pricing.plans"))
    if "catalog.store-toolbar" in types:
        i = types.index("catalog.store-toolbar")
        if i + 1 >= len(types) or types[i + 1] != "catalog.store-grid":
            issues.append(("TOOLBAR_BEFORE_GRID", "catalog.store-toolbar must precede catalog.store-grid"))
    if tpl.get("routeLocked") and spec["route"] != tpl["routes"][0]:
        issues.append(("HOME_ROUTE_ONLY", f"{tid} is route-locked to {tpl['routes'][0]}"))
    for n in nodes:
        if n["type"] == "footer.footer" and n["variant"] == "windows" and tid != "template.windows":
            issues.append(("WINDOWS_FOOTER_ART", "footer variant 'windows' outside template.windows"))
    auto = sum(1 for n in nodes if n["motion"]["pattern"] in G["AUTOPLAY_BUDGET"]["autoplayPatterns"])
    if auto > G["AUTOPLAY_BUDGET"]["limit"]:
        issues.append(("AUTOPLAY_BUDGET", f"{auto} autoplaying nodes > {G['AUTOPLAY_BUDGET']['limit']}"))
    terms = G["FORBIDDEN_SOURCE_BRAND"]["terms"]
    for s in _strings(spec):
        if any(t in s.lower() for t in terms):
            issues.append(("FORBIDDEN_SOURCE_BRAND", f"string mentions the source company: {s[:60]!r}"))
    return _split(issues)


def _split(issues):
    errs = [f"{r}: {m}" for r, m in issues if RULES.get(r, "error") == "error"]
    warns = [f"{r}: {m}" for r, m in issues if RULES.get(r) == "warn"]
    return errs, warns


def main(argv):
    paths = argv[1:] or [os.path.join(HERE, "example.pagespec.json")]
    repo = load_repo()
    bad = 0
    for p in paths:
        with open(p, encoding="utf-8") as f:
            spec = json.load(f)
        errs, warns = validate(spec, repo)
        print(f"{os.path.basename(p)}: {len(errs)} errors, {len(warns)} warnings")
        for e in errs:
            print("  ERROR", e)
        for w in warns:
            print("  WARN ", w)
        bad += bool(errs)
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
