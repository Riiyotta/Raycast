#!/usr/bin/env python3
"""One-shot verification for this design-repo.

    python3 extraction/verify_all.py            # exit 0 = all checks pass
    python3 extraction/verify_all.py --quiet

The repo root is derived from this file's location. Citations in
extraction/measured-values.json resolve against the PARENT folder of the repo
(the clone project). If that sibling tree is absent (a standalone copy), file
reads are skipped with a WARN and ranges are checked against the recorded
fileLineCounts instead, so the run stays self-contained.

Drift-proofing: extraction/prove_drift.py copies the repo to a temp dir,
injects one defect per check and confirms this script fails on each.
"""
import glob, json, os, re, sys
sys.dont_write_bytecode = True  # keep the package free of __pycache__

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(HERE)
PROJECT = os.path.dirname(REPO)
QUIET = "--quiet" in sys.argv

FAIL, WARN = [], []
def fail(check, msg): FAIL.append(f"[{check}] {msg}")
def warn(check, msg): WARN.append(f"[{check}] {msg}")
def load(rel):
    with open(os.path.join(REPO, rel), encoding="utf-8") as f:
        return json.load(f)

def walk(x, path=""):
    if isinstance(x, dict):
        for k, v in x.items():
            yield from walk(v, f"{path}.{k}" if path else k)
    elif isinstance(x, list):
        for i, v in enumerate(x):
            yield from walk(v, f"{path}[{i}]")
    else:
        yield path, x

def evidence_ids(x):
    if isinstance(x, dict):
        for k, v in x.items():
            if k == "evidence" and isinstance(v, list):
                for e in v:
                    if isinstance(e, str): yield e
            else:
                yield from evidence_ids(v)
    elif isinstance(x, list):
        for v in x:
            yield from evidence_ids(v)

# ---------------------------------------------------------------- 1 files / json
def check_files(man):
    for p in man["entryPoints"]:
        if p.startswith("/") or ".." in p.split("/"):
            fail("ENTRYPOINTS", f"entry point outside the repo: {p}")
        elif not os.path.isfile(os.path.join(REPO, p)):
            fail("ENTRYPOINTS", f"missing entry point: {p}")
    real = sorted(os.path.relpath(p, REPO) for p in glob.glob(os.path.join(REPO, "**/*"), recursive=True)
                  if os.path.isfile(p) and "__pycache__" not in p and not p.endswith("registry.manifest.json") and not os.path.basename(p).startswith("."))
    extra = set(real) - set(man["entryPoints"])
    if extra:
        fail("ENTRYPOINTS", f"files not listed in entryPoints: {sorted(extra)}")
    for p in real:
        if p.endswith(".json"):
            try: load(p)
            except Exception as e: fail("JSON", f"{p}: {e}")

def check_paths():
    # pieces joined at runtime so this file never contains the literal paths it hunts for
    pat = re.compile("|".join(["/" + "Users" + "/", "/" + "private" + "/tmp", "/" + "home/[a-z]", r"[A-Z]:\\\\"]))
    for p in glob.glob(os.path.join(REPO, "**/*"), recursive=True):
        if os.path.isfile(p) and "__pycache__" not in p:
            txt = open(p, encoding="utf-8", errors="ignore").read()
            for line in txt.split("\n"):
                if pat.search(line):
                    fail("ABS_PATH", f"absolute local path in {os.path.relpath(p, REPO)}: {line.strip()[:80]}")

# ---------------------------------------------------------------- 2 schema + example
def check_schema():
    try:
        import jsonschema
    except ImportError:
        fail("SCHEMA", "jsonschema not installed"); return
    s = load("schema/pagespec.schema.json")
    jsonschema.Draft7Validator.check_schema(s)
    errs = list(jsonschema.Draft7Validator(s).iter_errors(load("schema/example.pagespec.json")))
    for e in errs:
        fail("SCHEMA", f"example: /{'/'.join(map(str, e.path))}: {e.message[:120]}")
    sys.path.insert(0, os.path.join(REPO, "schema"))
    import semantic_validate as sv
    e2, w2 = sv.validate(load("schema/example.pagespec.json"))
    for e in e2: fail("SEMANTIC", "example: " + e)
    for w in w2: warn("SEMANTIC", "example: " + w)
    return sv

# ---------------------------------------------------------------- 3 allowlist parity
def check_allowlist(man, sections):
    al = load("tokens/llm/component-allowlist.json")
    if al["version"] != man["allowlistVersion"]:
        fail("ALLOWLIST_VERSION", f"manifest allowlistVersion {man['allowlistVersion']} != allowlist {al['version']}")
    for layer in ("primitives", "components"):
        files = sorted(os.path.splitext(os.path.basename(p))[0] for p in glob.glob(os.path.join(REPO, layer, "*.json")))
        for x in set(al[layer]) - set(files): fail("ALLOWLIST_PARITY", f"{layer}: phantom allowlist entry {x} (no contract file)")
        for x in set(files) - set(al[layer]): fail("ALLOWLIST_PARITY", f"{layer}: contract {x} has no allowlist entry")
        for x in files:
            if load(f"{layer}/{x}.json")["id"] != x: fail("ALLOWLIST_PARITY", f"{layer}/{x}.json id mismatch")
    for x in set(al["sections"]) - set(sections): fail("ALLOWLIST_PARITY", f"sections: phantom allowlist entry {x}")
    for x in set(sections) - set(al["sections"]): fail("ALLOWLIST_PARITY", f"sections: contract {x} has no allowlist entry")
    schema = load("schema/pagespec.schema.json")
    d = schema["definitions"]
    if sorted(d["node"]["properties"]) != al["nodeProperties"]: fail("ALLOWLIST_PARITY", "nodeProperties differ from schema node")
    if sorted(d["motion"]["properties"]) != al["motionProperties"]: fail("ALLOWLIST_PARITY", "motionProperties differ from schema motion")
    if d["motion"].get("additionalProperties") is not False: fail("MOTION_CLOSED", "motion schema must be additionalProperties:false")
    if sorted(d["node"]["properties"]["type"]["enum"]) != sorted(sections): fail("ALLOWLIST_PARITY", "schema node type enum != sections/")
    for sid, entry in al["sections"].items():
        if sid not in sections: continue
        c = sections[sid]
        if entry["variants"] != c["variants"]: fail("ALLOWLIST_PARITY", f"{sid}: variants differ")
        for var, fields in entry["contentFields"].items():
            dn = f"content.{sid}" if var == "*" else f"content.{sid}.{var}"
            if dn not in d: fail("ALLOWLIST_PARITY", f"{sid}: schema has no {dn}"); continue
            if sorted(d[dn]["properties"]) != fields: fail("ALLOWLIST_PARITY", f"{sid}/{var}: allowlist fields != schema properties")
    roles = load("assets/asset-roles.json")
    if sorted(roles["roles"]) != al["assetRoles"]: fail("ASSET_ROLES", "allowlist assetRoles != assets/asset-roles.json")

# ---------------------------------------------------------------- 4 content schema regenerated from contracts
def field_schema(f):
    k = f["kind"]
    if k == "text": return {"type": "string", "minLength": 1, "maxLength": f["maxChars"]}
    if k == "boolean": return {"type": "boolean"}
    if k == "integer": return {"type": "integer", "minimum": f["minimum"], "maximum": f["maximum"]}
    if k == "placeholder-price": return {"type": "string", "pattern": f["pattern"]}
    if k == "icon": return {"$ref": "#/definitions/icon"}
    if k == "media":
        return {"type": "object", "additionalProperties": False, "required": ["assetRole"],
                "properties": {"assetRole": {"enum": f["assetRoles"]}, "alt": {"type": "string", "maxLength": 125},
                               "hue": {"type": "integer", "minimum": 0, "maximum": 359}, "decorative": {"type": "boolean"}}}
    if k == "list": return {"type": "array", "minItems": f["minItems"], "maxItems": f["maxItems"], "items": obj_schema(f["item"])}
    raise ValueError(k)
def obj_schema(fields):
    return {"type": "object", "additionalProperties": False, "required": sorted(k for k, v in fields.items() if v["required"]),
            "properties": {k: field_schema(v) for k, v in fields.items()}}

def check_contracts(sections):
    d = load("schema/pagespec.schema.json")["definitions"]
    roles = load("assets/asset-roles.json")["roles"]
    for sid, c in sections.items():
        groups = {"*": c["content"]["shared"]} if "shared" in c["content"] else c["content"]["byVariant"]
        for var, fields in groups.items():
            dn = f"content.{sid}" if var == "*" else f"content.{sid}.{var}"
            if d.get(dn) != obj_schema(fields):
                fail("CONTENT_SCHEMA_PARITY", f"{dn}: schema definition differs from sections/{sid}.json")
            def rec(fl, where):
                for k, f in fl.items():
                    if f["kind"] == "text":
                        for key in ("maxChars", "basis", "budgetRule", "evidence"):
                            if key not in f: fail("COPY_BUDGET", f"{sid}{where}.{k}: text field lacks {key}")
                    if f["kind"] == "media":
                        for r in f["assetRoles"]:
                            if r not in roles: fail("ASSET_ROLES", f"{sid}{where}.{k}: unknown assetRole {r}")
                    if f["kind"] == "list": rec(f["item"], f"{where}.{k}[]")
            rec(fields, f"/{var}")
        for m in c["motion"]["allowed"]:
            if "reducedMotionFallback" not in m: fail("MOTION", f"{sid}: motion without reducedMotionFallback")

# ---------------------------------------------------------------- 5 evidence + citations
def check_evidence(mvd):
    entries = mvd["entries"]
    used = set()
    for p in glob.glob(os.path.join(REPO, "**/*.json"), recursive=True):
        rel = os.path.relpath(p, REPO)
        if rel == "extraction/measured-values.json": continue
        for e in evidence_ids(json.load(open(p))):
            used.add(e)
            if e not in entries: fail("EVIDENCE", f"{rel}: evidence id {e} not in measured-values.json")
    orphan = set(entries) - used
    if orphan: warn("EVIDENCE", f"{len(orphan)} measured-values entries not referenced by any contract (kept as ledger)")
    return entries

def norm(s): return re.sub(r"\s+", " ", s).strip().lower()

def check_citations(mvd, tokens):
    counts = mvd["fileLineCounts"]
    sibling = os.path.isfile(os.path.join(PROJECT, "src", "App.jsx")) and os.path.isfile(os.path.join(PROJECT, "ia.json"))
    if not sibling:
        warn("CITATIONS", "no sibling source tree next to design-repo/; checking ranges against fileLineCounts only (quotes not re-read)")
    excluded = [x.rstrip("/") for x in mvd["excludedSources"]]
    cache = {}
    n = 0
    for id_, e in mvd["entries"].items():
        for c in e["citations"]:
            n += 1
            path, rng = c["path"], c["lines"]
            if any(x in path for x in excluded):
                fail("EXCLUDED_SOURCE", f"{id_} cites an excluded source: {path}"); continue
            if not re.fullmatch(r"\d+(-\d+)?", rng):
                fail("CITATIONS", f"{id_}: bad range {rng}"); continue
            a, b = (int(x) for x in (rng.split("-") + [rng])[:2])
            if a < 1 or b < a:
                fail("CITATIONS", f"{id_}: inverted/zero range {path}:{rng}"); continue
            if path not in counts:
                fail("CITATIONS", f"{id_}: {path} missing from fileLineCounts"); continue
            if b > counts[path]:
                fail("CITATIONS", f"{id_}: {path}:{rng} exceeds recorded length {counts[path]}"); continue
            if not sibling: continue
            fp = os.path.join(PROJECT, path)
            if not os.path.isfile(fp):
                fail("CITATIONS", f"{id_}: cited file missing {path}"); continue
            if path not in cache:
                cache[path] = open(fp, encoding="utf-8").read().split("\n")
                real = len(cache[path]) - (1 if cache[path][-1] == "" else 0)
                if real != counts[path]: warn("CITATIONS", f"{path} is now {real} lines, snapshot says {counts[path]} (re-run the builder)")
            ls = cache[path]
            if b > len(ls):
                fail("CITATIONS", f"{id_}: {path}:{rng} past end of file ({len(ls)})"); continue
            text = "\n".join(ls[a - 1:b])
            if norm(c["quote"]) not in norm(text):
                fail("CITATIONS", f"{id_}: quote not found at {path}:{rng}: {c['quote'][:60]!r}")
    # token value must appear in at least one cited range
    if sibling:
        for tid, t in tokens.items():
            if not t.get("valueInSource"): continue
            vals = t["$value"]
            vals = [vals[k] for k in t["valueInSource"]] if isinstance(t["valueInSource"], list) else [vals]
            texts = []
            for e in t.get("evidence", []):
                for c in mvd["entries"][e]["citations"]:
                    a, b = (int(x) for x in (c["lines"].split("-") + [c["lines"]])[:2])
                    if not os.path.isfile(os.path.join(PROJECT, c["path"])): continue
                    if c["path"] not in cache:
                        cache[c["path"]] = open(os.path.join(PROJECT, c["path"]), encoding="utf-8").read().split("\n")
                    texts.append(norm("\n".join(cache[c["path"]][a - 1:b])))
            for v in vals:
                cands = {norm(str(v)), norm(re.sub(r"(px|ms|s)$", "", str(v)))}
                if not any(any(cd in tx for cd in cands) for tx in texts):
                    fail("VALUE_IN_SOURCE", f"token {tid}: value {v!r} not found in its cited lines")
    return n, sibling

# ---------------------------------------------------------------- 6 tokens / aliases / theme / policy
def flat_foundation():
    out = {}
    for p in sorted(glob.glob(os.path.join(REPO, "tokens/00-foundation/*.json"))):
        for cat, grp in json.load(open(p)).items():
            for k, v in grp.items():
                out[f"{cat}.{k}"] = v
    return out

def check_tokens(F):
    def res(alias):
        k = alias.strip("{}")
        if k not in F: return None
        return F[k]["$value"]
    for rel in ("tokens/10-semantic/semantic.json", "tokens/30-layout/layout.json"):
        for k, v in load(rel).items():
            if v.get("$type") == "alias" and res(v["$value"]) is None: fail("ALIAS", f"{rel}: {k} -> {v['$value']} does not resolve")
    for g, props in load("tokens/20-component/component.json").items():
        for p, v in props.items():
            if p != "evidence" and res(v["$value"]) is None: fail("ALIAS", f"component {g}.{p} -> {v['$value']} does not resolve")
    for tid, t in F.items():
        if t.get("$type") == "typography" and res(t["$value"]["fontFamily"]) is None: fail("ALIAS", f"{tid} fontFamily alias")
    sem = load("tokens/10-semantic/semantic.json")
    th = load("tokens/themes/dark.json")
    for k, v in sem.items():
        if th["resolves"].get(k) != res(v["$value"]): fail("THEME", f"dark theme {k} != resolved semantic value")
    cat = load("tokens/llm/token-catalog.json")
    for c, ids in cat["categories"].items():
        for i in ids:
            if i not in F: fail("TOKEN_CATALOG", f"catalog id {i} not a foundation token")
    pol = load("tokens/llm/token-policy.json")
    for c in pol["rawValueRestrictions"]:
        if c not in cat["categories"]: fail("TOKEN_POLICY", f"policy category {c!r} is not a real catalog key")
    if set(cat["semantic"]) != set(sem): fail("TOKEN_CATALOG", "catalog semantic list != semantic.json")

# ---------------------------------------------------------------- 7 templates / routes / graph
def check_templates(sections, sv):
    tdoc = load("templates/templates.json")
    T = tdoc["templates"]
    routes = load("templates/routes.json")["routes"]
    seen = {}
    for r in routes:
        if r["route"] in seen: fail("ROUTES", f"route {r['route']} assigned twice")
        seen[r["route"]] = r["template"]
        if r["template"] not in T: fail("ROUTES", f"route {r['route']} -> unknown template")
        elif r["route"] not in T[r["template"]]["routes"]: fail("ROUTES", f"{r['route']} not in {r['template']}.routes")
    for tid, t in T.items():
        for rr in t["routes"]:
            if seen.get(rr) != tid: fail("ROUTES", f"{tid} route {rr} not mapped 1:1 in routes.json")
        for n in t["nodes"]:
            if n["section"] not in sections: fail("TEMPLATES", f"{tid}: unknown section {n['section']}")
            elif n["variant"] not in sections[n["section"]]["variants"]: fail("TEMPLATES", f"{tid}: bad variant {n['section']}/{n['variant']}")
    # cross-check against the sibling IA and router when present
    ia_p, app_p = os.path.join(PROJECT, "ia.json"), os.path.join(PROJECT, "src", "App.jsx")
    if os.path.isfile(ia_p) and os.path.isfile(app_p):
        ia = json.load(open(ia_p))
        for it in ia["templates"]:
            t = T.get(it["id"])
            if not t: fail("IA_PARITY", f"ia.json template {it['id']} missing"); continue
            if [n["section"] for n in t["nodes"]] != it["sections"]: fail("IA_PARITY", f"{it['id']} node list != ia.json")
            if t["routes"] != it["routes"]: fail("IA_PARITY", f"{it['id']} routes != ia.json")
        if set(ia["sections"]) != set(sections): fail("IA_PARITY", "sections/ != ia.json sections")
        for sid, s in ia["sections"].items():
            if sid in sections and sections[sid]["category"] != s["category"]: fail("IA_PARITY", f"{sid} category differs from ia.json")
        app = open(app_p).read()
        app_routes = set(re.findall(r"'(/[a-z\-/]+)':", app)) | {"/"}
        if app_routes != set(seen): fail("ROUTER_PARITY", f"App.jsx routes {sorted(app_routes)} != routes.json {sorted(seen)}")
    else:
        warn("IA_PARITY", "no sibling ia.json/src/App.jsx; skipped IA and router parity")
    return T

def check_graph(T, sections, sv):
    g = {r["id"]: r for r in load("compatibility/graph.json")["rules"]}
    composition = {k: v for k, v in sv.RULES.items() if k not in sv.META_RULES}
    if set(g) != set(composition):
        fail("GRAPH_VALIDATOR_PARITY", f"graph ids {sorted(set(g) ^ set(composition))} differ from semantic_validate.RULES")
    for k in set(g) & set(composition):
        if g[k]["severity"] != composition[k]: fail("GRAPH_VALIDATOR_PARITY", f"{k}: graph severity {g[k]['severity']} != validator {composition[k]}")
    # recompute derived limits from the real templates
    maxper, same = {}, set()
    for t in T.values():
        ns = [n["section"] for n in t["nodes"]]
        for s in set(ns): maxper[s] = max(maxper.get(s, 0), ns.count(s))
        for a, b in zip(ns, ns[1:]):
            if a == b: same.add(a)
    if g["MAX_PER_PAGE"]["limits"] != maxper: fail("GRAPH_DERIVED", "MAX_PER_PAGE limits differ from real templates")
    if sorted(same) != sorted(g["NO_ADJACENT_SAME_SECTION"]["exceptions"]): fail("GRAPH_DERIVED", "NO_ADJACENT_SAME_SECTION exceptions differ from real templates")
    # every real template, fully instantiated, passes with zero errors (rules never reject real structure)
    sys.path.insert(0, os.path.join(REPO, "schema", "tests"))
    import synth
    for tid in T:
        for mode in ("full", "minimal"):
            spec = synth.build(tid, mode)
            errs, warns = sv.validate(spec)
            for e in errs: fail("TEMPLATE_CONTROL", f"{tid}/{mode}: {e}")

# ---------------------------------------------------------------- 8 asset roles
PINNED = {"brand.wordmark": "must-reuse-exact", "person.avatar-placeholder": "must-not-fabricate-real",
          "brand.customer-logo-slot": "must-not-use-real-mark", "brand.store-badge-placeholder": "must-not-use-real-mark",
          "visual.qr-placeholder": "must-be-nonfunctional"}
def check_assets():
    a = load("assets/asset-roles.json")
    pol = set(a["generationPolicies"])
    for rid, r in a["roles"].items():
        if r["generationPolicy"] not in pol: fail("ASSET_ROLES", f"{rid}: policy {r['generationPolicy']} not in closed set")
    for rid, want in PINNED.items():
        got = a["roles"].get(rid, {}).get("generationPolicy")
        if got != want: fail("ASSET_ROLE_PINNED", f"compliance-critical role {rid} must be pinned to {want}, found {got}")
        if not a["roles"].get(rid, {}).get("complianceCritical"): fail("ASSET_ROLE_PINNED", f"{rid} must be flagged complianceCritical")
    if not a.get("sourceIsRealCompany") or "logo" not in a["licensingNotice"]:
        fail("ASSET_ROLES", "licensing notice for a real-company source is missing")
    schema_roles = set()
    for path, v in walk(load("schema/pagespec.schema.json")):
        if path.endswith("assetRole.enum") or re.search(r"assetRole\.enum\[\d+\]$", path): schema_roles.add(v)
    if not schema_roles <= set(a["roles"]): fail("ASSET_ROLES", f"schema uses roles not in registry: {schema_roles - set(a['roles'])}")
    ex = {v for p, v in walk(load("schema/example.pagespec.json")) if p.endswith(".assetRole")}
    if not ex: fail("ASSET_ROLES", "example has no assetRole usage")
    if a["iconNames"] != load("schema/pagespec.schema.json")["definitions"]["icon"]["enum"]: fail("ASSET_ROLES", "icon enum != asset-roles iconNames")

# ---------------------------------------------------------------- 9 manifest counts
def check_counts(man, sections, T):
    F = flat_foundation()
    real = {"foundationTokens": len(F), "semanticTokens": len(load("tokens/10-semantic/semantic.json")),
            "componentTokenGroups": len(load("tokens/20-component/component.json")), "layoutTokens": len(load("tokens/30-layout/layout.json")),
            "primitives": len(glob.glob(os.path.join(REPO, "primitives/*.json"))), "components": len(glob.glob(os.path.join(REPO, "components/*.json"))),
            "sections": len(sections), "templates": len(T), "routes": len(load("templates/routes.json")["routes"]),
            "assetRoles": len(load("assets/asset-roles.json")["roles"]), "graphRules": len(load("compatibility/graph.json")["rules"]),
            "measuredValues": len(load("extraction/measured-values.json")["entries"])}
    for k, v in real.items():
        if man["counts"].get(k) != v: fail("MANIFEST_COUNTS", f"counts.{k} = {man['counts'].get(k)} but disk has {v}")
    for k in set(man["counts"]) - set(real): fail("MANIFEST_COUNTS", f"counts.{k} is not recomputable")
    if man.get("status") != "design-review-pending" or man.get("productionApproved") is not False:
        fail("MANIFEST", "status must be design-review-pending and productionApproved false")
    if "versionFieldNote" not in man: fail("MANIFEST", "versionFieldNote missing")
    readme = open(os.path.join(REPO, "README.md"), encoding="utf-8").read()
    for k in ("sections", "templates", "routes", "primitives", "components", "foundationTokens"):
        m = re.search(rf"<!--count:{k}-->(\d+)", readme)
        if not m: fail("README_COUNTS", f"README lacks <!--count:{k}--> marker")
        elif int(m.group(1)) != real[k]: fail("README_COUNTS", f"README says {k}={m.group(1)}, disk has {real[k]}")
    return real

def main():
    man = load("registry.manifest.json")
    sections = {load(os.path.relpath(p, REPO))["id"]: load(os.path.relpath(p, REPO)) for p in sorted(glob.glob(os.path.join(REPO, "sections/*.json")))}
    for sid in sections:
        if not os.path.isfile(os.path.join(REPO, "sections", sid + ".json")): fail("SECTIONS", f"{sid} file name mismatch")
    check_files(man); check_paths()
    sv = check_schema()
    check_allowlist(man, sections); check_contracts(sections)
    mvd = load("extraction/measured-values.json")
    check_evidence(mvd)
    F = flat_foundation()
    ncit, sibling = check_citations(mvd, F)
    check_tokens(F)
    T = check_templates(sections, sv)
    check_graph(T, sections, sv)
    check_assets()
    real = check_counts(man, sections, T)
    print(f"verify_all: {len(FAIL)} failures, {len(WARN)} warnings | {ncit} citations ({'re-read against sibling source' if sibling else 'range-checked offline'}) | counts {json.dumps(real)}")
    for w in WARN: print("  WARN", w)
    for f in FAIL[:60]: print("  FAIL", f)
    if len(FAIL) > 60: print(f"  ... {len(FAIL) - 60} more")
    return 1 if FAIL else 0

if __name__ == "__main__":
    sys.exit(main())
