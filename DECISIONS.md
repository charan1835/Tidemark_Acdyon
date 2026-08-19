# Decisions for Tidemark Homepage

## 1. Why this ingestion strategy over the obvious alternative you rejected?
I built a custom interactive SVG line-chart component inside React/Next.js rather than pulling in a heavy third-party charting library like Recharts or Chart.js. 
- **The Obvious Alternative:** Integrating a charting library would have saved initial rendering math.
- **Why Rejected:** Heavy charting libraries add considerable bundle bloat, are notoriously hard to custom-style (especially when aligning with custom tailwind variables like sea-mist/deep navy), and make layering custom "inflection annotations" (like hand-drawn SVG ring animations and contextual custom overlays) difficult without hacking the library's internal DOM structure. Building custom SVG coordinate mapping in React allows for seamless transitions using Framer Motion and total design freedom.

## 2. One trade-off you made under the time limit, and what you’d do with a real week.
**Trade-off:** The "connect source" action dynamically changes dataset visual states, but is still powered by static mock datasets.
**With a real week:** I would write a lightweight mock-database backend (or integrate SQLite WASM locally) to query real user-supplied CSV files on the fly and auto-detect anomalies using basic standard deviation triggers. This would allow users to drag and drop their real Stripe CSVs on the landing page and immediately see the auto-annotation engine run locally in their browser.

## 3. Where did you use AI tools, and what did you personally verify or change afterward?
I used AI to calculate the bezier curve controls (control points `cpX1`, `cpY1`, etc.) for generating a smooth curved path between discrete chart points.
**What I verified/changed:**
- Verified that coordinates did not overflow the SVG view box bounds under changing data values.
- Adjusted the opacity and scaling of the interactive nodes to ensure they feel premium, adding dynamic glowing outline pulses to selected annotation points.
- Refined the editorial copy to highlight "permanent annotations" and "no fake data" to adhere to the core rule of not using fabricated testimonials or inflated user counts.
