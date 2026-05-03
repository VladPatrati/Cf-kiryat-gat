# CrossFit Assessment Project Instructions

## Scoring Logic
The assessment uses 5 domains. Each question has 4 levels (scores 0-3).
Total scores are calculated as a percentage of the maximum possible points in each category.

## Gender Standards
Strength standards (Powerlifting/Olympic) are automatically adjusted based on the initial gender selection.
- Male weights are the first value (e.g., 160kg)
- Female weights are the second value (e.g., 100kg)

## Design System
- **Primary Color**: #E11D48 (Red)
- **Secondary Color**: #1F2937 (Charcoal/Dark Gray)
- **Theme**: High-intensity, athletic, and professional.

## PDF Export
Handled via `jspdf` and `html2canvas`. If the chart labels appear incorrectly in the PDF, consider increasing the `scale` in the `html2canvas` options in `/src/lib/pdfUtils.ts`.
