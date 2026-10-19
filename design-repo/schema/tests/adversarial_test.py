#!/usr/bin/env python3
"""Adversarial suite: every mutation must be REJECTED (with the expected rule),
every control must PASS with zero errors.

    python3 schema/tests/adversarial_test.py
"""
import copy, json, os, sys
sys.dont_write_bytecode = True  # keep the package free of __pycache__

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(os.path.dirname(HERE))
sys.path.insert(0, os.path.join(REPO, "schema"))
sys.path.insert(0, HERE)
import semantic_validate as sv
import synth

REPO_DATA = sv.load_repo()
with open(os.path.join(REPO, "schema", "example.pagespec.json"), encoding="utf-8") as f:
    EXAMPLE = json.load(f)


def ex():
    return copy.deepcopy(EXAMPLE)


def node(spec, t):
    return next(n for n in spec["nodes"] if n["type"] == t)


def m(fn, base=None):
    s = copy.deepcopy(base) if base is not None else ex()
    fn(s)
    return s


def _ins(spec, i, n):
    spec["nodes"].insert(i, n)


PRICING = synth.build("template.pricing", "full")
STORE = synth.build("template.store", "full")
TEAMS = synth.build("template.teams", "full")
WINDOWS = synth.build("template.windows", "full")

MUTATIONS = [
    # ---- schema layer
    ("wrong template enum", "SCHEMA", m(lambda s: s.update(template="template.landing"))),
    ("missing required top-level field", "SCHEMA", m(lambda s: s.pop("attestations"))),
    ("attestation set false", "SCHEMA", m(lambda s: s["attestations"].update(originalCopy=False))),
    ("invented section type alias", "SCHEMA", m(lambda s: node(s, "hero.home").update(type="hero.homepage"))),
    ("invalid variant for section", "SCHEMA", m(lambda s: node(s, "footer.footer").update(variant="minimal"))),
    ("missing reducedMotionFallback", "SCHEMA", m(lambda s: node(s, "hero.home")["motion"].pop("reducedMotionFallback"))),
    ("invented motion field smuggled in", "SCHEMA", m(lambda s: node(s, "hero.home")["motion"].update(inventedAnimation="spin"))),
    ("motion pattern not allowed for section", "SCHEMA", m(lambda s: node(s, "hero.home").update(motion={"pattern": "marquee", "trigger": "always", "reducedMotionFallback": "first-state-static"}))),
    ("unknown content field", "SCHEMA", m(lambda s: node(s, "hero.home")["content"].update(tagline="extra"))),
    ("missing required content field", "SCHEMA", m(lambda s: node(s, "hero.home")["content"].pop("title"))),
    ("maxChars overflow (hero title > 28c)", "SCHEMA", m(lambda s: node(s, "hero.home")["content"].update(title="A title that is far too long now"))),
    ("list over maxItems (nav links 10)", "SCHEMA", m(lambda s: node(s, "nav.navbar")["content"]["links"].append({"label": "Extra"}))),
    ("invented assetRole", "SCHEMA", m(lambda s: node(s, "hero.home")["content"].update(background={"assetRole": "photo.hero"}))),
    ("bare src string instead of media object", "SCHEMA", m(lambda s: node(s, "hero.home")["content"].update(background="hero.png"))),
    ("assetRole valid but not allowed in this slot", "SCHEMA", m(lambda s: node(s, "nav.navbar")["content"].update(wordmark={"assetRole": "visual.app-tile"}))),
    ("unknown icon name", "SCHEMA", m(lambda s: node(s, "showcase.time-keyboard")["content"]["featureKeys"][0].update(icon="rocket"))),
    ("real-looking price instead of placeholder", "SCHEMA", m(lambda s: s["nodes"][2]["content"]["tiers"][0].update(price="$8.00/mo"), PRICING)),
    # ---- structural layer
    ("duplicate one-per-page section", "MAX_PER_PAGE", m(lambda s: _ins(s, 3, copy.deepcopy(node(s, "showcase.time-keyboard")) | {"id": "dup"}))),
    ("second hero", "ONE_HERO_AFTER_NAV", m(lambda s: _ins(s, 2, copy.deepcopy(node(s, "hero.home")) | {"id": "hero2"}))),
    ("removed mandatory section (required slot)", "REQUIRED_SLOT_MISSING", m(lambda s: s["nodes"].remove(node(s, "showcase.shortcuts-frame")))),
    ("reordered fixed-position section (footer not last)", "FOOTER_LAST", m(lambda s: s["nodes"].insert(5, s["nodes"].pop()))),
    ("nav not first", "NAV_FIRST", m(lambda s: s["nodes"].insert(2, s["nodes"].pop(0)))),
    ("template/node-sequence mismatch (store section on home)", "TEMPLATE_SEQUENCE", m(lambda s: _ins(s, 4, copy.deepcopy(STORE["nodes"][4])))),
    ("declared template contradicts nodes (home nodes, store template)", "TEMPLATE_SEQUENCE", m(lambda s: s.update(template="template.store", route="/store"))),
    ("out-of-order sections vs template", "TEMPLATE_SEQUENCE", m(lambda s: s["nodes"].insert(3, s["nodes"].pop(4)))),
    ("variant pin broken (pricing plans wide on /pricing)", "VARIANT_PIN", m(lambda s: s["nodes"][2].update(variant="wide"), PRICING)),
    ("windows footer art outside windows", "WINDOWS_FOOTER_ART", m(lambda s: node(s, "footer.footer").update(variant="windows"))),
    ("home template on another route", "HOME_ROUTE_ONLY", m(lambda s: s.update(route="/start"))),
    ("motion allowed for section but not this variant", "MOTION_VARIANT",
     m(lambda s: s["nodes"][1].update(motion={"pattern": "orbit", "trigger": "always", "reducedMotionFallback": "first-state-static"}), STORE)),
    ("faq not directly before footer", "FAQ_BEFORE_FOOTER", m(lambda s: s["nodes"].insert(len(s["nodes"]) - 1, s["nodes"].pop(-2)) or s["nodes"].insert(3, s["nodes"].pop(-2)), PRICING)),
    ("store toolbar not before grid", "TOOLBAR_BEFORE_GRID", m(lambda s: s["nodes"].pop(4), STORE)),
    ("compare table without plans before it", "COMPARE_AFTER_PLANS", m(lambda s: s["nodes"].pop(2), PRICING)),
    ("same section twice in a row (not a real exception)", "NO_ADJACENT_SAME_SECTION",
     m(lambda s: _ins(s, 4, copy.deepcopy(s["nodes"][3]) | {"id": "lead2"}), WINDOWS)),
    ("duplicate node ids", "UNIQUE_NODE_IDS", m(lambda s: s["nodes"][2].update(id=s["nodes"][1]["id"]))),
    # ---- runtime / content layer
    ("maxWords overflow on a real field (hero title 5 words)", "MAX_WORDS", m(lambda s: node(s, "hero.home")["content"].update(title="One key opens it all"))),
    ("list total chars overflow (feature wall)", "LIST_TOTAL_CHARS",
     m(lambda s: [it.update(text="Twenty five chars of text") for it in node(s, "feature.feature-wall")["content"]["items"]])),
    ("source brand name in copy", "FORBIDDEN_SOURCE_BRAND", m(lambda s: node(s, "hero.home")["content"].update(announcement="Raycast-style bar"))),
]

WARN_MUTATIONS = [
    ("new same-category adjacency (warn only)", "NO_ADJACENT_SAME_CATEGORY",
     m(lambda s: s["nodes"].remove(node(s, "proof.testimonials")))),
]


def main():
    ok = True
    print("MUTATIONS (each must be rejected)")
    for name, rule, spec in MUTATIONS:
        errs, _ = sv.validate(spec, REPO_DATA)
        hit = any(e.startswith(rule + ":") for e in errs)
        ok &= hit
        print(f"  {'REJECTED' if hit else 'MISSED  '}  [{rule}] {name}" + ("" if hit else f"  -> got {errs[:3]}"))
    print("WARN-SEVERITY (must warn, must not error)")
    for name, rule, spec in WARN_MUTATIONS:
        errs, warns = sv.validate(spec, REPO_DATA)
        hit = any(w.startswith(rule + ":") for w in warns) and not errs
        ok &= hit
        print(f"  {'WARNED  ' if hit else 'MISSED  '}  [{rule}] {name}" + ("" if hit else f"  -> errs {errs[:3]} warns {warns[:3]}"))
    print("CONTROLS (each must pass with 0 errors)")
    controls = [("example.pagespec.json", ex())]
    for tid in REPO_DATA["templates"]:
        controls.append((f"{tid} full", synth.build(tid, "full")))
        controls.append((f"{tid} minimal", synth.build(tid, "minimal")))
    for name, spec in controls:
        errs, warns = sv.validate(spec, REPO_DATA)
        ok &= not errs
        print(f"  {'PASS' if not errs else 'FAIL'}  {name}  ({len(errs)} errors, {len(warns)} warnings)" + ("" if not errs else f" {errs[:3]}"))
    n_m = len(MUTATIONS) + len(WARN_MUTATIONS)
    print(f"\n{'ALL GOOD' if ok else 'FAILURES'}: {n_m} mutations, {len(controls)} controls")
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
