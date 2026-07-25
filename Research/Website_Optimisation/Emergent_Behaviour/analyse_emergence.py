"""Analyse registered emergent behaviours without inventing evidence.

The script reads emergent_behaviour_registry.csv, calculates simple efficiency
and outcome changes where numeric evidence exists, and writes a review queue.
Missing values remain missing. It does not infer causality or promote behaviours.
"""

from __future__ import annotations

from pathlib import Path
import pandas as pd

ROOT = Path(__file__).resolve().parent
INPUT = ROOT / "emergent_behaviour_registry.csv"
OUTPUT = ROOT / "emergent_behaviour_review_queue.csv"

NUMERIC_COLUMNS = [
    "baseline_value",
    "observed_value",
    "delta_d",
    "delta2_d",
    "delta3_d",
    "compute_cost_before",
    "compute_cost_after",
    "outcome_quality_before",
    "outcome_quality_after",
]


def safe_relative_change(after: pd.Series, before: pd.Series) -> pd.Series:
    """Return relative change only where the baseline is non-zero."""
    result = pd.Series(pd.NA, index=after.index, dtype="Float64")
    valid = before.notna() & after.notna() & before.ne(0)
    result.loc[valid] = (after.loc[valid] - before.loc[valid]) / before.loc[valid]
    return result


def main() -> None:
    if not INPUT.exists():
        raise FileNotFoundError(f"Missing registry: {INPUT}")

    df = pd.read_csv(INPUT)
    for column in NUMERIC_COLUMNS:
        if column in df.columns:
            df[column] = pd.to_numeric(df[column], errors="coerce")

    df["absolute_metric_change"] = df["observed_value"] - df["baseline_value"]
    df["relative_metric_change"] = safe_relative_change(
        df["observed_value"], df["baseline_value"]
    )
    df["absolute_compute_change"] = (
        df["compute_cost_after"] - df["compute_cost_before"]
    )
    df["relative_compute_change"] = safe_relative_change(
        df["compute_cost_after"], df["compute_cost_before"]
    )
    df["absolute_quality_change"] = (
        df["outcome_quality_after"] - df["outcome_quality_before"]
    )

    reproduced = df.get("reproduced", pd.Series(index=df.index, dtype="object"))
    approval = df.get("human_approval", pd.Series(index=df.index, dtype="object"))
    decision = df.get("decision", pd.Series(index=df.index, dtype="object"))

    df["requires_review"] = (
        reproduced.astype(str).str.lower().ne("yes")
        | approval.astype(str).str.lower().ne("approved")
        | decision.astype(str).str.strip().eq("")
    )

    df.to_csv(OUTPUT, index=False)
    print(f"Wrote {len(df)} records to {OUTPUT}")


if __name__ == "__main__":
    main()
