# Evidence Collection Protocol

## Purpose

This protocol defines how evidence from the Honeycomb Publications optimisation system will be collected, verified, analysed and retained.

The study is prospective and longitudinal. All outcomes must come from real observations. No illustrative, estimated or invented figures may be reported as measured results.

## Evidence hierarchy

### Level 1: Primary measured evidence

- Search Console impressions, clicks, click-through rate and average position
- Analytics sessions, users, page views, engaged sessions and event counts
- Outbound clicks to Amazon, Foyles and other verified retailers
- Screen-rights email clicks or form submissions
- Page-version deployment dates and Git commit references
- Retailer sales or KDP reports supplied by the owner

### Level 2: Derived reproducible evidence

Calculated from Level 1 data:

- visibility growth
- impression-to-visit conversion
- catalogue-to-book conversion
- reach-order-section rate
- retailer click-through rate
- screen-rights enquiry rate
- abandonment by funnel stage
- absolute change
- relative percentage change
- confidence intervals or other uncertainty measures
- PIMF delta states

### Level 3: Qualitative evidence

- owner observations
- user feedback
- producer or reader correspondence
- technical incident notes
- explanations for unusual traffic or campaign events

Qualitative evidence may explain results but must not replace measured outcomes.

## Required identifiers

Every evidence row must include where applicable:

- observation_id
- observation_date
- experiment_id
- candidate_id
- book_slug
- page_version
- stage
- layer
- source_system
- metric_name
- metric_value
- metric_unit
- sample_size
- traffic_source
- device_category
- country
- evidence_status
- source_file_or_report
- git_commit
- notes

## Evidence status

Use one of:

- raw
- validated
- derived
- provisional
- excluded
- corrected

## Validation rules

1. Raw exports must be preserved unchanged.
2. Cleaning and transformations must occur in separate derived files.
3. Every derived metric must have a documented formula.
4. Missing values must remain missing and must not be replaced silently.
5. Internal or test traffic should be excluded only by a documented rule.
6. Bot traffic and obvious technical noise should be flagged, not deleted without record.
7. Retailer clicks are purchase-intent signals, not confirmed purchases.
8. Sales must only be reported from retailer or distributor evidence.
9. Every page intervention must link to a Git commit or page-version record.
10. Corrections must preserve the original entry and add a corrected record.

## Collection schedule

### Daily

- automated or manual analytics export
- Search Console export when available
- event-count integrity check
- deployment and technical incident log

### Weekly

- cumulative funnel summary
- book-level visibility and visitor summary
- retailer-click summary
- churn summary
- experiment status review
- PIMF state update

### Monthly

- validated longitudinal analysis
- cross-book comparison
- country and channel analysis
- transferability review
- decision on retain, retest, modify or rollback

## Core formulas

- Search CTR = search clicks / search impressions
- Visit conversion = qualified sessions / measured impressions
- Catalogue-to-book conversion = unique book-page sessions / unique catalogue sessions
- Order-section reach = sessions reaching order section / unique book-page sessions
- Retailer CTR = sessions with retailer click / unique book-page sessions
- Purchase-intent churn = 1 - retailer CTR among sessions reaching the order section
- Screen-rights conversion = screen-rights enquiries / qualified rights-page sessions
- Relative change = (intervention value - baseline value) / baseline value

When the baseline is zero, relative percentage change is undefined. Report the absolute increase and state that percentage change cannot be calculated from a zero denominator.

## Statistical reporting

Every comparative result must report:

- baseline period
- intervention period
- sample size
- numerator and denominator
- absolute change
- relative change where defined
- uncertainty
- possible confounders
- data-quality status

## Evidence retention structure

```text
Research/Website_Optimisation/
├── Evidence_Collection_Protocol.md
├── Data/
│   ├── Raw/
│   ├── Validated/
│   └── Derived/
├── Experiments/
├── Reports/
└── Scripts/
```

## Scientific integrity

The system must distinguish clearly between:

- observed result
- derived result
- hypothesis
- inference
- recommendation

No recommendation may be presented as an observed outcome. No short-term fluctuation may be presented as persistent improvement until longitudinal validation supports it.