# SubSentry – Smart Subscription Manager

<div align="center">

**Stop losing money to forgotten subscriptions.**

Track every subscription, analyze your spending patterns, and never miss a renewal with SubSentry — your personal subscription command center.

[🚀 Get Started](#installation) • [📚 Features](#features) • [🏗️ Architecture](#tech-stack) • [🔧 Setup](#configuration)

</div>

---

## 🎯 About SubSentry

SubSentry is a modern subscription management application designed to help you take control of your recurring payments. Whether you have Netflix, Spotify, Adobe, or dozens of SaaS tools, SubSentry gives you complete visibility into your subscription ecosystem—and empowers you to make smarter financial decisions.

**Built for the modern user who cares about their financial freedom.**

---

## ✨ Features

### 📊 Complete Dashboard
- **At-a-glance overview** of monthly and yearly spending
- **Active subscription count** with renewal status
- **Expense breakdown** by category with interactive pie charts
- **Monthly cost analysis** with bar charts powered by Recharts

### 🔔 Smart Renewal Alerts
- **14-day advance notifications** for upcoming subscription renewals
- **Urgent alerts** for subscriptions renewing within 3 days
- **Real-time status badges** showing days remaining (Today, 3d, 7d, etc.)
- **Mark all read** feature for notification management

### 📈 Spending Analytics
- **Category-wise breakdown** of subscription costs
- **Monthly vs. yearly** spending comparisons
- **Duplicate & wasteful subscription detection**
- **Intelligent insights** on your most expensive subscriptions
- **Per-subscription cost analysis**

### 💾 Full Subscription Management
- **Add/edit/delete subscriptions** with a clean modal interface
- **Track billing cycles** (monthly or yearly)
- **Store renewal dates** and never forget again
- **Add notes** to subscriptions (coupon codes, family sharing, etc.)
- **Categorize subscriptions** (Entertainment, Fitness, Productivity, Education, Shopping, Other)

### 🎨 Beautiful Dark Theme UI
- **GenZ-inspired dark design** with glassmorphism cards
- **Always-on glow effects** with color-coded indicators
- **Smooth hover interactions** with scale and glow animations
- **Responsive mobile-first layout**
- **Fully dark theme** across all pages

### 🔐 Secure Authentication
- **Email-based signup & login**
- **Password hashing** with bcryptjs
- **JWT-based session management** with HTTP-only cookies
- **Protected API routes** and authenticated database access

### ⏰ Automated Reminders
- **Daily cron job** checks for upcoming renewals
- **Automatic notifications** (ready for email integration)
- **Never miss a payment** date

---

## 🏗️ Tech Stack

### Frontend
- **Framework**: [Next.js 16.1.6](https://nextjs.org) (React 19.2.3)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com)
- **UI Components**: [Radix UI](https://radix-ui.com) (Dialog, Select, Dropdown)
- **Charts**: [Recharts 3.8](https://recharts.org)
- **Icons**: [Lucide React](https://lucide.dev)
- **Forms**: [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev)
- **State Management**: React Context API

### Backend
- **Runtime**: Node.js
- **API**: Next.js API Routes
- **Database**: [MongoDB Atlas](https://www.mongodb.com)
- **ODM**: [Mongoose 9.3.0](https://mongoosejs.com)
- **Authentication**: JWT + HTTP-only cookies
- **Password Hashing**: [bcryptjs](https://github.com/dcodeIO/bcryptjs)
- **Task Scheduling**: [node-cron](https://github.com/kelektiv/node-cron)

### Dev Tools
- **Language**: TypeScript
- **Linting**: ESLint
- **Build Tool**: Turbopack (Next.js)
- **Testing**: Jest (ready to configure)

---

## 📋 Prerequisites

- **Node.js** v18+ (or use [nvm](https://github.com/nvm-sh/nvm))
- **npm** v9+
- **MongoDB Atlas** account (free tier available at [mongodb.com](https://www.mongodb.com))
- **Git**

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/SubSentry.git
cd SubSentry
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the project root:

```bash
# Database
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/<database-name>?appName=Cluster0

# Authentication
JWT_SECRET=your-super-secret-jwt-key-min-32-chars-recommended

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**⚠️ Security**: Never commit `.env.local` to version control. Add it to `.gitignore`.

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The app auto-reloads as you make changes.

### 5. Build for Production

```bash
npm run build
npm start
```

---

## 🔧 Configuration

### MongoDB Connection

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user with secure password
4. Whitelist your IP address (or use `0.0.0.0/0` for development)
5. Copy the connection string and add to `.env.local`

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/subsentry` |
| `JWT_SECRET` | Secret key for JWT signing | 64-character random string |
| `NEXT_PUBLIC_APP_URL` | Public app URL | `http://localhost:3000` or your domain |

---

## 📖 Usage

### Getting Started

1. **Sign Up**: Create a new account with email and password
2. **Add Subscriptions**: Click "Add Subscription" to manually add your recurring services
3. **Track Spending**: View analytics and spending breakdowns
4. **Get Alerts**: Receive notifications for upcoming renewals
5. **Optimize**: Identify and cancel unused subscriptions

### Adding a Subscription

1. Click **"Add Subscription"** button
2. Fill in:
   - **Service Name** (e.g., Netflix, Spotify)
   - **Price** (amount in ₹)
   - **Billing Cycle** (Monthly or Yearly)
   - **Renewal Date** (when your subscription renews)
   - **Category** (Entertainment, Fitness, Productivity, etc.)
   - **Notes** (optional: add coupon codes or family member names)
3. Click **"Save Subscription"**

### Dashboard Overview

- **Stats Cards**: Monthly spend, yearly spend, active subscriptions, upcoming renewals
- **Recent Subscriptions**: Quick view of your latest 5 subscriptions
- **Spending Charts**: Visual breakdown by category and monthly costs
- **Upcoming Renewals**: Color-coded alerts for renewals in the next 14 days
- **Quick Insights**: Auto-generated insights about your spending patterns

### Analytics Page

- **Summary Cards**: Total monthly/yearly spending and average cost per subscription
- **Spending Insights**: AI-powered recommendations and patterns
- **Interactive Charts**: Drill down into category and monthly spending

---

## 🗂️ Project Structure

```
SubSentry/
├── src/
│   ├── app/
│   │   ├── api/                    # API routes
│   │   │   ├── auth/              # Authentication endpoints
│   │   │   ├── cron/              # Scheduled tasks
│   │   │   ├── notifications/     # Notification endpoints
│   │   │   └── subscriptions/     # Subscription CRUD
│   │   ├── dashboard/             # Dashboard page
│   │   ├── login/                 # Login page
│   │   ├── register/              # Registration page
│   │   ├── analytics/             # Analytics page
│   │   ├── subscriptions/         # Subscriptions page
│   │   ├── globals.css            # Global styles & theme
│   │   ├── layout.tsx             # Root layout
│   │   └── page.tsx               # Landing page
│   ├── components/
│   │   ├── auth-provider.tsx      # Auth context & hooks
│   │   ├── navbar.tsx             # Navigation bar
│   │   ├── dashboard/             # Dashboard components
│   │   ├── subscription/          # Subscription components
│   │   ├── charts/                # Chart components
│   │   └── ui/                    # Base UI components
│   ├── lib/
│   │   ├── auth.ts                # Auth utilities
│   │   ├── database.ts            # DB connection
│   │   └── utils.ts               # Helper functions
│   ├── models/                    # Mongoose schemas
│   │   ├── User.ts
│   │   ├── Subscription.ts
│   │   └── Notification.ts
│   └── cron/
│       └── renewalChecker.ts      # Daily renewal check job
├── public/                        # Static assets
├── .env.local                     # Environment variables (not in git)
├── next.config.ts                 # Next.js configuration
├── tailwind.config.ts             # Tailwind configuration
├── tsconfig.json                  # TypeScript configuration
└── package.json                   # Dependencies
```

---

## 🔌 API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Create new account |
| `POST` | `/api/auth/login` | Sign in with email & password |
| `POST` | `/api/auth/logout` | Sign out & clear session |
| `GET` | `/api/auth/me` | Get authenticated user profile |

### Subscriptions

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/subscriptions` | Fetch all user subscriptions |
| `POST` | `/api/subscriptions` | Create new subscription |
| `PUT` | `/api/subscriptions/[id]` | Update subscription |
| `DELETE` | `/api/subscriptions/[id]` | Delete subscription |

### Notifications

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/notifications` | Fetch all notifications |
| `PUT` | `/api/notifications` | Mark all as read |

### Cron Jobs

| Endpoint | Schedule | Description |
|----------|----------|-------------|
| `/api/cron/check-renewals` | Daily @ 8:00 AM | Check for upcoming renewals & create notifications |

---

## 🎨 Design System

### Dark Theme Colors
- **Background**: `#050a18` (Deep navy)
- **Surface**: `rgba(15, 23, 55, 0.6)` (Glassmorphism)
- **Primary**: `#6366f1` (Indigo)
- **Text**: `#e2e8f0` (Slate-200)
- **Borders**: `rgba(99, 102, 241, 0.15)` (Soft indigo)

### Component Variants
- **glass-card**: Glassmorphic container with glow effect
- **neon-btn**: Gradient button with shadow glow on hover
- **outline-btn**: Transparent button with border
- **Color-coded glows**: Indigo, emerald, violet, amber, cyan

---

## 🚀 Deployment

### Deploy on Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

1. Connect your GitHub repository
2. Add environment variables in Vercel dashboard
3. Auto-deploys on `git push`

### Deploy on Other Platforms

Works with any Node.js hosting (Railway, Render, Heroku, AWS, etc.)

---

## 🐛 Troubleshooting

### MongoDB Connection Error

**Error**: `Failed to connect to MongoDB`

**Solution**:
- Verify connection string in `.env.local`
- Check IP whitelist in MongoDB Atlas
- Ensure database user has correct permissions
- Test connection with MongoDB Compass

### Auth Issues

**Error**: `Invalid JWT token`

**Solution**:
- Clear browser cookies
- Restart dev server
- Verify `JWT_SECRET` is set and consistent

### Build Errors

```bash
# Clear cache and reinstall
rm -rf .next node_modules
npm install
npm run dev
```

---

## 📝 Currency

All amounts are displayed in **Indian Rupees (₹)**.

---

## 🤝 Contributing

Contributions are welcome! Follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 📧 Support & Feedback

Have questions or feedback? Reach out:
- 📌 **GitHub Issues**: Open an issue on the repository
- 💬 **Email**: contact@subsentry.dev

---

## 🙏 Acknowledgments

- Inspired by modern SaaS design principles
- Built with ❤️ using Next.js, React, and Tailwind CSS
- Data visualization powered by Recharts
- UI components from Radix UI

---

<div align="center">

**Made with 💜 for financial freedom**

⭐ If you find this useful, please consider starring the repository!

</div>
