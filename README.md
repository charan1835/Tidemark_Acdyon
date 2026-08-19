# Tidemark 🌊 — Stop Squinting at Your Metrics

Tidemark is an elegant, developer-focused business intelligence (BI) metrics tool built for small startups, SaaS businesses, and indie teams. It answers the most critical question behind business charts: **"Why did this metric change?"**

## The Core Problem
Most dashboards (like Stripe, Google Analytics, or SQL query dashboards) show lines going up and down, but they completely hide the business context. 
* *What happened in June to make our Active Users spike 40%?* Was it a Product Hunt launch? A change in pricing? An influencer mention? Or a server outage?
* Teams waste hours digging through Slack histories, calendar events, or Git logs to reconstruct the timeline of their business.

## The Solution: Tidemark
Tidemark solves this by automatically detecting inflection points (sudden changes in growth rates or metrics) and allowing teams to pin **permanent annotations** directly on chart dates.
1. **Connect Sources Directly:** Connect Stripe API keys, run custom SQL queries on PostgreSQL, or upload CSV files in under 3 minutes.
2. **Context That Lives Forever:** Pin annotations (e.g. "Released V2 Pricing", "HN Front Page") to specific points on your charts.
3. **Multi-Platform Support:** Available as a desktop client for **Windows x64**, **macOS**, and as a lightweight **CLI Tool**.
4. **No Bloat:** Built with read-only database connections, zero write access, and no client-side tracking scripts.

## Interactive Features & UX Design ("Wow" Factor)
* **Pulsing, Shimmering CTAs**: The call-to-action buttons (like "Connect Stripe" and "Start Free") feature dynamic, smooth breathing scale loops and gradient shimmers that sweep horizontally to draw user focus instantly.
* **Live Connection Latency Ticker**: A live stats board displaying connection latency and active pipelines synced today (`[ connection latency: 12.4ms // 4,821 pipelines synced today ]`) fluctuates in real-time, giving the page an active, live-traffic environment feel.
* **Acoustic Telemetry Feedback**: Using zero-dependency Web Audio API synthesis, clicking interactive UI items triggers subtle, high-fidelity mechanical click, chime, or sonar ping feedback.
* **Interactive Auth Gateway Modal**: Clicking any major CTA triggers a sleek modal containing tabs for SignUp/Login, simulated credential verification, SSO buttons, and an instant **Demo Account Bypass** link for ease of access.
* **Deep Sea Sonar Calibration Mode**: Entering the Konami Code (`Up, Up, Down, Down, Left, Right, Left, Right, B, A`) triggers a retro-green radar overlay complete with CRT scanlines, a grid matrix, and synthesized acoustic sonar sweeps.

---

## Technical Architecture & Design Decisions
For a deep dive into the engineering trade-offs made under the constraints (such as building custom SVG charting pipelines instead of bundling heavy charting libraries), refer to [DECISIONS.md](./DECISIONS.md) and [discussion.md](./discussion.md).

## Local Development
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000) to view the application.
