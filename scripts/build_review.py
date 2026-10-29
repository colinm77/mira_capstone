"""Build a readable review page from an evaluation results CSV.

Usage:
    python scripts/build_review.py final-v1/final-1.csv

Writes <same folder>/<same name>.html : one section per test with the input, expected answer,
Mira's output (Markdown rendered, tables included), both judge scores and reasons,
the LLM verdict, and the human verdict and note if the CSV has them. Open it in a browser.
"""
import csv
import html
import pathlib
import re
import sys


def inline(text):
    """Bold, italics and inline code inside one line."""
    t = html.escape(text)
    t = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", t)
    t = re.sub(r"(?<!\*)\*(?!\*)(.+?)\*(?!\*)", r"<em>\1</em>", t)
    t = re.sub(r"`(.+?)`", r"<code>\1</code>", t)
    return t


def format_expected(text):
    """Expected answers are one long line. Put each sentence, and each numbered phase
    (e.g. '; 2 Current State Analysis (wk 3-4: ...'), on its own line."""
    t = html.escape(text or "")
    # a numbered phase after ':' or ';' starts a new indented line
    t = re.sub(r"[:;]\s+(?=\d+ [A-Z][^()]*\(wk)", ":<br>&nbsp;&nbsp;&nbsp;", t, count=1)
    t = re.sub(r";\s+(?=\d+ [A-Z][^()]*\(wk)", "<br>&nbsp;&nbsp;&nbsp;", t)
    # a new sentence starts a new line (skips 'e.g.' and decimals)
    t = re.sub(r"(?<!e\.g)(?<!i\.e)\.\s+(?=[A-Z(])", ".<br>", t)
    return t


def read_list(lines, i, bullet):
    """Read one list. An indented line under a bullet (e.g. '  **Mitigation**: ...')
    belongs to that bullet and is shown on its own line inside it."""
    items = []
    while i < len(lines):
        line = lines[i]
        if re.match(bullet, line):
            items.append(inline(re.sub(bullet, "", line).strip()))
        elif items and line.startswith((" ", "\t")) and line.strip() != "":
            items[-1] = items[-1] + "<br>" + inline(line.strip())
        else:
            break
        i += 1
    return items, i


def markdown_to_html(md):
    """Small Markdown converter: headings, tables, bullet / numbered lists, rules, paragraphs."""
    lines = (md or "").replace("\r\n", "\n").split("\n")
    out = []
    i = 0
    while i < len(lines):
        line = lines[i].rstrip()
        stripped = line.strip()

        # table: a row with | followed by a separator row like |---|---|
        if stripped.startswith("|") and i + 1 < len(lines) and re.match(r"^\s*\|?\s*:?-{2,}", lines[i + 1]):
            header = [c.strip() for c in stripped.strip("|").split("|")]
            out.append("<table><thead><tr>" + "".join("<th>" + inline(c) + "</th>" for c in header) + "</tr></thead><tbody>")
            i += 2
            while i < len(lines) and lines[i].strip().startswith("|"):
                cells = [c.strip() for c in lines[i].strip().strip("|").split("|")]
                out.append("<tr>" + "".join("<td>" + inline(c) + "</td>" for c in cells) + "</tr>")
                i += 1
            out.append("</tbody></table>")
            continue

        heading = re.match(r"^(#{1,6})\s+(.*)", stripped)
        if heading:
            level = min(len(heading.group(1)) + 2, 6)
            out.append(f"<h{level}>{inline(heading.group(2))}</h{level}>")
        elif re.match(r"^(-{3,}|\*{3,})$", stripped):
            out.append("<hr>")
        elif re.match(r"^[-*]\s+", stripped):
            items, i = read_list(lines, i, r"^\s*[-*]\s+")
            out.append("<ul>" + "".join("<li>" + item + "</li>" for item in items) + "</ul>")
            continue
        elif re.match(r"^\d+[.)]\s+", stripped):
            items, i = read_list(lines, i, r"^\s*\d+[.)]\s+")
            out.append("<ol>" + "".join("<li>" + item + "</li>" for item in items) + "</ol>")
            continue
        elif stripped == "":
            pass
        else:
            out.append("<p>" + inline(stripped) + "</p>")
        i += 1
    return "\n".join(out)


def main():
    src = pathlib.Path(sys.argv[1])
    rows = list(csv.DictReader(src.open(encoding="utf-8-sig")))
    sections = []
    summary = []
    # if the CSV already has the human review, show it; otherwise show where to fill it in
    has_human = any((r.get("human_verdict") or "").strip() for r in rows)
    for r in rows:
        verdict = (r.get("llm_verdict") or "").strip()
        badge = "pass" if verdict.lower() == "pass" else "fail"
        human = (r.get("human_verdict") or "").strip()
        human_badge = "pass" if human.lower() == "pass" else "fail"
        human_cell = f"<td><span class='{human_badge}'><b>{html.escape(human)}</b></span></td>" if has_human else ""
        summary.append(f"<tr><td><a href='#{html.escape(r.get('id',''))}'>{html.escape(r.get('id',''))}</a></td>"
                       f"<td>{html.escape(r.get('path',''))}</td>"
                       f"<td>{html.escape(r.get('groundedness',''))}</td><td>{html.escape(r.get('correctness',''))}</td>"
                       f"<td><span class='{badge}'>{html.escape(verdict)}</span></td>{human_cell}</tr>")
        if has_human:
            note = (r.get("human_note") or "").strip()
            human_heading = f"<span class='{human_badge}'>Human verdict: {html.escape(human)}</span> "
            human_block = (f"<h3>Human review (final)</h3><p class='box'><b>Verdict:</b> {html.escape(human)}"
                           + (f"<br><b>Note:</b> {html.escape(note)}" if note else "") + "</p>")
        else:
            human_heading = ""
            human_block = ("<h3>Human review (fill in the sheet)</h3>"
                           "<p class='hint'>Expected keywords present? · Hallucination detected? · Human verdict (Pass / Fail) · Note</p>")
        sections.append(f"""
<section id="{html.escape(r.get('id',''))}">
  <h2>{html.escape(r.get('id',''))} {human_heading}<span class="{badge}">LLM verdict: {html.escape(verdict)}</span></h2>
  <p class="meta">Agent: {html.escape(r.get('path',''))} · Groundedness: <b>{html.escape(r.get('groundedness',''))}</b> · Correctness: <b>{html.escape(r.get('correctness',''))}</b></p>
  <h3>Input</h3><p class="box">{html.escape(r.get('input',''))}</p>
  <h3>Expected answer</h3><p class="box">{format_expected(r.get('expected_output',''))}</p>
  <h3>Mira's output</h3><div class="box output">{markdown_to_html(r.get('output',''))}</div>
  <h3>Judges</h3>
  <ul>
    <li><b>Groundedness reason:</b> {html.escape(r.get('groundedness_reason',''))}</li>
    <li><b>Unsupported claims:</b> {html.escape(r.get('unsupported_claims',''))}</li>
    <li><b>Correctness reason:</b> {html.escape(r.get('correctness_reason',''))}</li>
  </ul>
  {human_block}
</section>""")

    if has_human:
        intro = ("LLM verdict = Pass if both judge scores ≥ 0.8. "
                 "<b>The human verdict is final</b>: I reviewed every output myself and overruled the judge where it was wrong.")
        human_th = "<th>Human verdict (final)</th>"
    else:
        intro = "LLM verdict = Pass if both judge scores ≥ 0.8. The human verdict is recorded in the results sheet."
        human_th = ""

    page = f"""<!doctype html><html><head><meta charset="utf-8"><title>Mira evaluation review — {html.escape(src.stem)}</title>
<style>
body{{font-family:Segoe UI,Arial,sans-serif;max-width:960px;margin:24px auto;padding:0 16px;color:#222;line-height:1.5}}
h1{{font-size:24px}} h2{{font-size:20px;border-top:2px solid #ddd;padding-top:20px;margin-top:36px}} h3{{font-size:15px;margin:14px 0 4px;color:#555}}
table{{border-collapse:collapse;margin:8px 0;width:100%}} th,td{{border:1px solid #ccc;padding:5px 8px;text-align:left;vertical-align:top;font-size:14px}} th{{background:#f3f3f3}}
.box{{background:#fafafa;border:1px solid #e5e5e5;border-radius:6px;padding:10px 14px}}
.pass{{background:#e3f4e8;color:#1d6b36;padding:2px 8px;border-radius:10px;font-size:13px}}
.fail{{background:#fbe5e5;color:#9b1c1c;padding:2px 8px;border-radius:10px;font-size:13px}}
.output li{{margin:6px 0}} .meta{{color:#555}} .hint{{color:#777;font-style:italic}} code{{background:#eee;padding:1px 4px;border-radius:3px}}
</style></head><body>
<h1>Mira evaluation review — {html.escape(src.stem)}</h1>
<p>{len(rows)} tests. {intro}</p>
<table><thead><tr><th>Test</th><th>Agent</th><th>Groundedness</th><th>Correctness</th><th>LLM verdict</th>{human_th}</tr></thead><tbody>
{''.join(summary)}
</tbody></table>
{''.join(sections)}
</body></html>"""
    out = src.with_suffix(".html")
    out.write_text(page, encoding="utf-8")
    print("Wrote", out)


if __name__ == "__main__":
    main()
