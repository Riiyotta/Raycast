"""Synthesize a valid control PageSpec for any template, straight from the template's
own node list and each section contract. Used by adversarial_test.py and verify_all.py,
so a new or split template is covered with zero new control code.

mode="full": every slot filled. mode="minimal": required slots only.
"""
import json, os

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(os.path.dirname(HERE))
WORDS = "calm quick tidy light small clear plain handy steady neat brisk simple".split()


def _load(rel):
    with open(os.path.join(REPO, rel), encoding="utf-8") as f:
        return json.load(f)


def _text(f, seed):
    max_c = f["maxChars"]
    max_w = f.get("maxWords", 999)
    out, i = [], seed
    while True:
        w = WORDS[i % len(WORDS)]
        cand = " ".join(out + [w])
        if len(cand) > max_c or len(out) + 1 > max_w or len(out) >= 6:
            break
        out.append(w); i += 1
    return " ".join(out) if out else WORDS[seed % len(WORDS)][:max_c]


def _value(f, seed, icons):
    k = f["kind"]
    if k == "text": return _text(f, seed)
    if k == "boolean": return seed % 2 == 0
    if k == "integer": return f["minimum"]
    if k == "placeholder-price": return "$" + str(seed % 90 + 1)
    if k == "icon": return icons[seed % len(icons)]
    if k == "media": return {"assetRole": f["assetRoles"][0]}
    if k == "list":
        n = max(f["minItems"], 1) if f["maxItems"] > 0 else 0
        return [_obj(f["item"], seed + i, icons) for i in range(n)]
    raise ValueError(k)


def _obj(fields, seed, icons):
    return {k: _value(f, seed + i, icons) for i, (k, f) in enumerate(fields.items())}


def build(template_id, mode="full"):
    tpl = _load("templates/templates.json")["templates"][template_id]
    icons = _load("assets/asset-roles.json")["iconNames"]
    nodes = []
    for i, slot in enumerate(tpl["nodes"]):
        if mode == "minimal" and not slot["required"]:
            continue
        c = _load(f"sections/{slot['section']}.json")
        cont = c["content"]
        fields = cont["shared"] if "shared" in cont else cont["byVariant"][slot["variant"]]
        motion = next(m for m in c["motion"]["allowed"] if "variants" not in m or slot["variant"] in m["variants"])
        nodes.append({"id": f"n{i}", "type": slot["section"], "variant": slot["variant"], "content": _obj(fields, i, icons),
                      "motion": {k: motion[k] for k in ("pattern", "trigger", "reducedMotionFallback")}})
    return {"pageSpecVersion": "1.0.0", "template": template_id, "route": tpl["routes"][0], "title": "Control page",
            "attestations": {"originalCopy": True, "placeholderVisualsOnly": True, "placeholderPricing": True}, "nodes": nodes}
