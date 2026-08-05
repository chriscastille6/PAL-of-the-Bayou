# Field map — Interpretive Year-1 → check-in tool

Use this map when helping students locate figures. Exact report titles vary by Interpretive edition; map the **concept**, not a single menu name.

| Tool input | Typical sim / worksheet source | Tag in UI |
|------------|--------------------------------|-----------|
| Starting headcount | Year-1 opening workforce / Q1 start | sim-reported |
| Ending headcount | End of Q4 workforce | sim-reported |
| Separations (Year-1 total) | Sum of quarterly separations, or rate × avg workforce | sim-reported |
| Absence days lost | Sum of absence days/hours ÷ hours per day | sim-reported |
| Workable days / year | Often 250 (or 245 with vacation adjustment) | assumed |
| Hours per workday | Usually 8 | assumed |
| Payroll + benefits $ | Compensation / benefits reports or wages × (1 + benefits %) | sim / worksheet |
| Contingent costs $ | Temporary / contingent labor spend | sim-reported |
| Contingent FTEs | Contingent headcount or FTE equivalent | sim-reported |
| Total revenue $ | Financial / income statement for Year-1 | sim / financials |
| Total expenses $ | Financial / income statement for Year-1 | sim / financials |
| Avg annual pay | Payroll ÷ avg workforce (or level-weighted average) | assumed / derived |
| Benefits load % | Benefits as % of wages (e.g., 30–40%) | assumed |
| Separation admin hours, HR wage, separation pay weeks | Cascio-style simplified defaults | assumed |
| Hire / replacement $ per separation | Sim hire cost parameter or classroom default (~$4,500) | sim-aligned assumed |
| Training $ per hire | Sim training cost parameter or classroom default (~$3,000) | sim-aligned assumed |
| Performance / ramp % of annual pay | Teachable productivity-loss assumption (e.g., 25%) | assumed |
| Manage hours / absent day, supervisor wage | Simplified “managing absence” bucket | assumed |
| Substitute wage factor | % of loaded hourly paid to substitutes | assumed |
| Reduced qty/quality % | % of absentee wage cost for quality/quantity loss | assumed |

## Bridge → ROI calculator query params

| Check-in output / input | Query key | ROI calculator field |
|-------------------------|-----------|----------------------|
| Revenue | `revenue` | `totalRevenue` |
| Expenses | `expenses` | `totalExpenses` |
| Payroll + benefits | `payroll` | `payrollBenefits` |
| Contingent costs | `contingent` | `contingentCosts` |
| Avg workforce (rounded) | `employees` | `totalEmployees` |
| Contingent FTEs | `contingentFte` | `contingentFtes` |
| Total absenteeism $ | `absence` | `absenceCosts` |
| Total turnover $ | `turnover` | `turnoverCosts` |
| Auto-run | `autocalc=1` | triggers Calculate |

Example:

`/platform/tools/roi-calculator/?revenue=72000000&expenses=60000000&payroll=28000000&contingent=900000&employees=690&contingentFte=40&absence=...&turnover=...&autocalc=1`
