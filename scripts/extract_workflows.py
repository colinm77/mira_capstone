"""Pull the prompts, Code nodes, models and tool wiring out of n8n workflow exports.

Usage:
    python scripts/extract_workflows.py final-v1

Reads  <folder>/n8n_export/*.json
Writes <folder>/prompts/<node name>.txt     (system prompts of agents and LLM chains)
       <folder>/n8n_code/<workflow>__<node>.js  (Code nodes)
       <folder>/models_and_tools.md         (model, Sampling Temperature and tools per agent)
"""
import json
import pathlib
import re
import sys


def safe_name(text):
    """Turn a node or workflow name into a file name, e.g. 'Return risks' -> 'return_risks'."""
    return re.sub(r"[^a-z0-9]+", "_", text.lower()).strip("_")


def get_prompt(node):
    """System prompt of an AI Agent or Basic LLM Chain node, or None."""
    params = node.get("parameters", {})
    if "agent" in node["type"]:
        return params.get("options", {}).get("systemMessage")
    if "chainLlm" in node["type"]:
        messages = params.get("messages", {}).get("messageValues", [])
        if messages:
            return messages[0].get("message")
        return params.get("text")
    return None


def main():
    folder = pathlib.Path(sys.argv[1])
    prompt_dir = folder / "prompts"
    code_dir = folder / "n8n_code"
    prompt_dir.mkdir(exist_ok=True)
    code_dir.mkdir(exist_ok=True)
    report = ["# Models, Sampling Temperature and tools (from the n8n exports)", ""]

    for export in sorted((folder / "n8n_export").glob("*.json")):
        workflow = json.loads(export.read_text(encoding="utf-8"))
        wf_name = safe_name(export.stem)
        nodes = {n["name"]: n for n in workflow["nodes"]}

        # which model and which tools are attached to each agent / chain
        model_of = {}
        tools_of = {}
        for source, outputs in workflow["connections"].items():
            for kind, lists in outputs.items():
                for targets in lists:
                    for target in targets or []:
                        if kind == "ai_languageModel":
                            model_of[target["node"]] = source
                        if kind == "ai_tool":
                            tools_of.setdefault(target["node"], []).append(source)

        report.append("## " + export.stem)
        report.append("")
        report.append("| Node | Model | Sampling Temperature | Tools |")
        report.append("|---|---|---|---|")

        for node in workflow["nodes"]:
            prompt = get_prompt(node)
            if prompt:
                file = prompt_dir / (safe_name(node["name"]) + ".txt")
                if file.exists():
                    file = prompt_dir / (wf_name + "__" + safe_name(node["name"]) + ".txt")
                file.write_text(prompt.lstrip("=").strip() + "\n", encoding="utf-8")

                model_node = nodes.get(model_of.get(node["name"], ""), {})
                model_params = model_node.get("parameters", {})
                model = model_params.get("model", "")
                if isinstance(model, dict):
                    model = model.get("value", "")
                temperature = model_params.get("options", {}).get("temperature", "default")
                tools = ", ".join(sorted(tools_of.get(node["name"], []))) or "—"
                report.append(f"| {node['name']} | {model} | {temperature} | {tools} |")

            if node["type"] == "n8n-nodes-base.code":
                code = node["parameters"].get("jsCode", "")
                (code_dir / (wf_name + "__" + safe_name(node["name"]) + ".js")).write_text(code, encoding="utf-8")
        report.append("")

    (folder / "models_and_tools.md").write_text("\n".join(report), encoding="utf-8")
    print("Wrote", prompt_dir, code_dir, folder / "models_and_tools.md")


if __name__ == "__main__":
    main()
