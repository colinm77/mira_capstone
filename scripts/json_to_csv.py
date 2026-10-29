"""Convert data/ground_truth.json into data/mira_eval_dataset.csv.

The JSON is the source of truth (easy to read and edit). The CSV is generated
for import into an n8n Google Sheet / Data Table or a Langfuse dataset.

Usage: python scripts/json_to_csv.py
"""
import csv
import json
import pathlib

root = pathlib.Path(__file__).resolve().parent.parent
gt = json.loads((root / "data" / "ground_truth.json").read_text(encoding="utf-8"))
out = root / "data" / "mira_eval_dataset.csv"

with out.open("w", newline="", encoding="utf-8") as f:
    w = csv.writer(f, quoting=csv.QUOTE_ALL)
    w.writerow(["id", "input", "expected_output", "metadata"])
    for t in gt["tests"]:
        meta = {"test_id": t["id"], **t["metadata"]}
        w.writerow([t["id"], t["input"], t["expected_output"], json.dumps(meta, ensure_ascii=False)])

print(f"Wrote {len(gt['tests'])} rows to {out}")
