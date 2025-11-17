📊 InsightBoard — Analytics Dashboard
Mini BI Dashboard built with React, TypeScript, Vite, Zustand, React Query & Recharts

InsightBoard is a production-grade analytics dashboard demonstrating modern front-end architecture and data-driven UI design.
It includes real-time metrics, interactive charts, saved reports, drilldown insights, and customizable filters — all running purely on the client.

This project is ideal for showcasing Mid / Senior Frontend Developer skills for US-based companies and SaaS teams.

🚀 Features
📈 Full Analytics Dashboard

KPI metrics: Visitors, Conversions, Bounce Rate, Avg Session

Line charts with brush/zoom, tooltips, drilldown

Bar charts for page-level insights

Realtime Active Users widget (simulated)

🧩 Advanced Frontend Architecture

Zustand with persist (saved reports)

React Query for async data & refetching

Mock API layer simulating network/data

Component architecture inspired by shadcn/ui

🎛 Filters

Date Range: 7 / 30 / 90 days

Traffic Sources

Device Types

🗂 Saved Reports

Save any filter configuration

Quick restore & delete

Persisted in localStorage via Zustand

🎨 Polished UI

Tailwind CSS v4

Custom reusable components

Light & Dark mode (toggle + persistence)

🛠️ Tech Stack
Category	Tools
Framework	React 18 + TypeScript
Bundler	Vite
State Mgmt	Zustand
Data Layer	React Query
UI	Tailwind v4, custom UI components
Charts	Recharts
Date Utils	date-fns
Dev Tools	React Query Devtools
📦 Installation
git clone https://github.com/your-username/analytics-dashboard.git
cd analytics-dashboard
npm install
npm run dev


Open:

http://localhost:5173

📚 Folder Structure
src/
  components/
    dashboard/
    ui/
  services/
  store/
  lib/
  types.ts
  App.tsx
  main.tsx

🌑 Dark Mode Support

InsightBoard provides full Light/Dark theme switching, stored in localStorage.

Dark Mode includes:

Backgrounds

Typography

Cards

Borders

Charts auto-matching theme

(See implementation below.)

📸 Screenshots (add your own)

(Add 2–3 screenshots or GIFs for portfolio)

📄 License

MIT