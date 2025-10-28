# 🛍️ GadgetHub - Modern E-commerce Platform

A full-stack e-commerce platform built with React, Express, and Supabase, featuring 3D animations, modern UI, and complete order management.

## ✨ Features

- 🎨 **Modern UI/UX** - Beautiful design with 3D animations and Framer Motion
- 🔐 **Authentication** - Complete login/signup with Supabase Auth
- 🛒 **Shopping Cart** - Full cart functionality with real-time updates
- 📱 **Responsive Design** - Mobile-first approach
- 🎯 **Product Management** - Admin panel for products and orders
- 💬 **WhatsApp Integration** - Direct customer support
- 🎭 **3D Effects** - Interactive hover effects and animations
- 📊 **Order Management** - Complete order tracking and sales analytics

## 🚀 Live Demo

Visit the live website: [https://yourusername.github.io/NextStripeStore](https://yourusername.github.io/NextStripeStore)

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **@react-three/fiber** - 3D graphics
- **TanStack Query** - Data fetching and caching
- **Wouter** - Lightweight routing

### Backend
- **Express.js** - Node.js web framework
- **Supabase** - Backend-as-a-Service
- **PostgreSQL** - Database
- **Drizzle ORM** - Type-safe database queries

## 🚀 Deployment

### GitHub Pages Deployment

1. **Fork this repository** to your GitHub account

2. **Set up environment variables** in GitHub Secrets:
   - Go to your repository → Settings → Secrets and variables → Actions
   - Add these secrets:
     - `VITE_SUPABASE_URL`: Your Supabase project URL
     - `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key

3. **Enable GitHub Pages**:
   - Go to Settings → Pages
   - Source: Deploy from a branch
   - Branch: `gh-pages` (will be created automatically)

4. **Push to main branch**:
   ```bash
   git push origin main
   ```

5. **The deployment will start automatically** via GitHub Actions

### Manual Deployment

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Build the client**:
   ```bash
   npm run build:client
   ```

3. **Deploy the `dist` folder** to your hosting provider

## 🔧 Development

### Prerequisites
- Node.js 20+
- npm or yarn
- Supabase account

### Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/NextStripeStore.git
   cd NextStripeStore
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   SESSION_SECRET=your_session_secret
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser** and visit `http://localhost:5000`

## 📁 Project Structure

```
NextStripeStore/
├── client/                 # Frontend React app
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React contexts
│   │   ├── lib/          # Utilities and configs
│   │   └── hooks/        # Custom hooks
├── server/                # Backend Express app
│   ├── routes.ts         # API routes
│   ├── db.ts            # Database connection
│   └── simpleStorage.ts # Data access layer
├── shared/               # Shared types and schemas
└── .github/workflows/    # GitHub Actions
```

## 🎯 Key Features Explained

### 3D Animations
- Interactive hover effects on product cards
- 3D category blocks with depth
- Cursor craft animation on homepage
- Smooth transitions and micro-interactions

### Authentication
- Supabase Auth integration
- Protected routes
- Role-based access control
- Session management

### Shopping Experience
- Real-time cart updates
- Product filtering and search
- Order management
- Sales analytics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Supabase](https://supabase.com) for the backend infrastructure
- [Unsplash](https://unsplash.com) for the beautiful product images
- [Lucide](https://lucide.dev) for the icons
- [Framer Motion](https://www.framer.com/motion/) for animations

---

**Made with ❤️ by [Your Name]**
