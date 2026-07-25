"""Dynamic Laminar Leading Pathway controller.

This controller operates on validated registry evidence. It calculates a comparative
Efficiency Quotient, identifies a provisional Max-EQ candidate, assigns efficiency
laminas and produces recommendations. It does not deploy changes or infer missing
values. Human approval remains mandatory.
"""

from __future__ import annotations

import json
from pathlib import Path

import pandas as pd

ROOT = Path(__file__).resolve().parent
CONFIG_PATH = ROOT / "dllp_config.json"
REGISTRY_PATH = ROOT / "dllp_candidate_registry.csv"
OUTPUT_PATH = ROOT / "dllp_decision_report.csv"
STATE_PATH = ROOT / "dllp_runtime_state.json"

OUTCOME_FIELDS = [
    "outcome_quality",
    "validation_strength",
    "generalisation_score",
    "persistence_score",
    "trust_score",
]

COST_FIELDS = [
    "evaluation_count",
    "runtime_seconds",
    "memory_mb",
    "energy_proxy",
    "data_movement_mb",
    "switching_overhead",
    "coordination_overhead",
    "uncertainty_cost",
    "transfer_risk",
    "instability_cost",
    "implementation_burden",
]


def weighted_sum(df: pd.DataFrame, weights: dict[str, float]) -> pd.Series:
    result = pd.Series(0.0, index=df.index, dtype="Float64")
    complete = pd.Series(True, index=df.index)
    for field, weight in weights.items():
        values = pd.to_numeric(df.get(field), errors="coerce")
        complete &= values.notna()
        result = result + values.fillna(0) * float(weight)
    return result.where(complete)


def assign_lamina(eq: pd.Series, max_eq: float, inner: float, middle: float) -> pd.Series:
    relative = eq / max_eq
    lamina = pd.Series("outer", index=eq.index, dtype="object")
    lamina.loc[relative >= middle] = "middle"
    lamina.loc[relative >= inner] = "inner"
    lamina.loc[eq == max_eq] = "central"
    lamina.loc[eq.isna()] = "unclassified"
    return lamina


def main() -> None:
    config = json.loads(CONFIG_PATH.read_text(encoding="utf-8"))
    df = pd.read_csv(REGISTRY_PATH)

    if df.empty:
        state = {
            "system": config["system"],
            "status": "active_monitoring",
            "live_analytics_connected": config["live_analytics_connected"],
            "records_processed": 0,
            "max_eq_candidate": None,
            "message": "Controller active. Awaiting validated candidate observations."
        }
        STATE_PATH.write_text(json.dumps(state, indent=2), encoding="utf-8")
        df.to_csv(OUTPUT_PATH, index=False)
        print(state["message"])
        return

    for field in OUTCOME_FIELDS + COST_FIELDS + ["laminarity_score", "turbulence_score"]:
        if field in df.columns:
            df[field] = pd.to_numeric(df[field], errors="coerce")

    outcome = weighted_sum(df, config["outcome_weights"])
    cost = weighted_sum(df, config["cost_weights"])
    eq = (outcome / cost).where(cost.gt(0))

    df["validated_outcome_strength"] = outcome
    df["calculated_total_system_cost"] = cost
    df["calculated_efficiency_quotient"] = eq

    eligible = eq.notna()
    eligible &= pd.to_numeric(df.get("evaluation_count"), errors="coerce").ge(
        config["minimum_sample_size"]
    )
    eligible &= ~df.get("pimf_state", "").astype(str).isin(
        config["promotion_blocking_pimf_states"]
    )
    eligible &= df.get("linked_metric_deterioration", "").astype(str).str.lower().isin(
        ["no", "false", "0", "none", ""]
    )

    eligible_eq = eq.where(eligible)
    max_eq = eligible_eq.max(skipna=True)

    if pd.isna(max_eq):
        df["calculated_lamina"] = "unclassified"
        df["controller_recommendation"] = "collect_more_evidence"
        max_candidate = None
    else:
        thresholds = config["lamina_thresholds"]
        df["calculated_lamina"] = assign_lamina(
            eligible_eq,
            float(max_eq),
            float(thresholds["inner_relative_to_max_eq"]),
            float(thresholds["middle_relative_to_max_eq"]),
        )
        df["controller_recommendation"] = "retain_for_observation"
        df.loc[df["calculated_lamina"] == "central", "controller_recommendation"] = (
            "provisional_max_eq_awaiting_human_approval"
        )
        df.loc[df["calculated_lamina"] == "inner", "controller_recommendation"] = (
            "validated_reserve_pathway"
        )
        df.loc[df["calculated_lamina"] == "middle", "controller_recommendation"] = (
            "specialist_or_conditional_pathway"
        )
        df.loc[df["calculated_lamina"] == "outer", "controller_recommendation"] = (
            "explore_or_quarantine"
        )
        max_candidate = df.loc[eligible_eq.idxmax(), "candidate_id"]

    df.to_csv(OUTPUT_PATH, index=False)

    state = {
        "system": config["system"],
        "status": config["status"],
        "live_analytics_connected": config["live_analytics_connected"],
        "records_processed": int(len(df)),
        "eligible_records": int(eligible.sum()),
        "max_eq_candidate": None if max_candidate is None else str(max_candidate),
        "max_efficiency_quotient": None if pd.isna(max_eq) else float(max_eq),
        "production_rerouting_enabled": False,
        "human_approval_required": config["human_approval_required"],
    }
    STATE_PATH.write_text(json.dumps(state, indent=2), encoding="utf-8")
    print(json.dumps(state, indent=2))


if __name__ == "__main__":
    main()
