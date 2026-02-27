# Personal Care App - Admin Dashboard

A powerful, interactive administrative dashboard for managing the Personal Care application.

## 🚀 Tech Stack

- **Build Tool**: [Vite](https://vitejs.dev/)
- **Framework**: [React 19](https://react.dev/)
- **Charts**: [Recharts](https://recharts.org/) & [ApexCharts](https://apexcharts.com/)
- **Table**: [TanStack Table v8](https://tanstack.com/table)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Components**: [Radix UI](https://www.radix-ui.com/) (Primitives)
- **Animations**: [GSAP](https://greensock.com/gsap/)

## 🛠️ Features

- **Admin Statistics**: Real-time overview of Total Users, Revenue (Payments), and Products.
- **User Management**: 
    - Full list of registered users with pagination.
    - Moderate account status (Activate/Suspend).
    - Soft delete users directly from the UI.
- **Product & Category Control**: (In Progress) Management of catalog items and groupings.
- **Interactive Data Viz**: Beautifully rendered charts for growth trends and platform activity.
- **Dark Mode Support**: Seamless theme switching for better accessibility.

## 🏁 Getting Started

### Installation

1. Install dependencies:
   ```bash
   bun install
   ```

2. Setup environment variables:
   Create a `.env` file:
   ```env
   VITE_API_URL=http://localhost:3030/api
   ```

### Development

Start the Vite development server:
```bash
bun run dev
```

### Production

Build for production:
```bash
bun run build
```

The build output will be in the `dist/` folder.

## 🏗️ Highlights

- **Actionable Tables**: Moderation actions integrated directly into the user table columns.
- **Performance**: Built with Vite for lightning-fast HMR and optimized builds.
- **Clean Code**: Type-safe development with TypeScript and specialized hook-based API calls.
