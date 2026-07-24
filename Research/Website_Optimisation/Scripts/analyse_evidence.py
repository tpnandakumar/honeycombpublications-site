"""Reproducible analysis for Honeycomb Publications optimisation evidence.

This script reads the evidence observation registry and calculates selected
funnel metrics from validated observations only. It does not estimate missing
values and it does not infer retailer sales from outbound clicks.
"""

from __future__ import annotations

from pathlib import Path
import pandas as pd

ROOT = Path(__file__).resolve().parents[1]
DATA_FILE = ROOT / "Data" / "evidence_observations.csv"
OUTPUT_FILE = ROOT / "Reports" / "derived_metric_summary.csv"


def safe_rate(numerator: float, denominator: float) -> float | None:
    """Return a rate or None when the denominator is zero or missing."""
    if pd.isna(denominator) or denominator == 0:
        return None
    return numerator / denominator


def load_validated() -> pd.DataFrame:
    df = pd.read_csv(DATA_FILE)
    if df.empty:
        return df
    df["metric_value"] = pd.to_numeric(df["metric_value"], errors="coerce")
    return df[df["evidence_status"].isin(["validated", "derived"])].copy()


def metric_total(df: pd.DataFrame, name: str) -> float:
    values = df.loc[df["metric_name"] == name, "metric_value"]
    return float(values.sum()) if not values.empty else 0.0


def build_summary(df: pd.DataFrame) -> pd.DataFrame:
    if df.empty:
        return pd.DataFrame(
            columns=[
                "book_slug",
                "search_impressions",
                "search_clicks",
                "search_ctr",
                "book_page_sessions",
                "order_section_sessions",
                "order_section_reach",
                "retailer_click_sessions",
                "retailer_ctr",
            ]
        )

    rows = []
    for book_slug, group in df.groupby("book_slug", dropna=False):
        impressions = metric_total(group, "search_impressions")
        search_clicks = metric_total(group, "search_clicks")
        book_sessions = metric_total(group, "book_page_sessions")
        order_sessions = metric_total(group, "reach_order_section_sessions")
        retailer_clicks = metric_total(group, "retailer_click_sessions")

        rows.append(
            {
                "book_slug": book_slug,
                "search_impressions": impressions,
                "search_clicks": search_clicks,
                "search_ctr": safe_rate(search_clicks, impressions),
                "book_page_sessions": book_sessions,
                "order_section_sessions": order_sessions,
                "order_section_reach": safe_rate(order_sessions, book_sessions),
                "retailer_click_sessions": retailer_clicks,
                "retailer_ctr": safe_rate(retailer_clicks, book_sessions),
            }
        )

    return pd.DataFrame(rows)


def main() -> None:
    validated = load_validated()
    summary = build_summary(validated)
    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    summary.to_csv(OUTPUT_FILE, index=False)
    print(f"Wrote {len(summary)} rows to {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
