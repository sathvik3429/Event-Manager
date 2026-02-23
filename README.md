# Campus Event Management Web App

A production-ready full-stack campus event management system built with React, Tailwind CSS, and Supabase.

## 🚀 Features

### Authentication
- Email/Password Sign Up & Sign In
- Google OAuth Login
- Session persistence
- Protected routes
- Loading states and error handling

### Event Management
- Create, view, and join events
- Real-time updates using Supabase subscriptions
- Event search and filtering
- Participant limit management
- Delete own events
- Dark mode support

### UI/UX
- Modern SaaS-style design
- Responsive mobile-friendly layout
- Smooth animations and transitions
- Toast notifications
- Gradient buttons and soft shadows
- Dark mode toggle

## 🛠️ Tech Stack

**Frontend:**
- React 18 with Vite
- React Router v6
- Tailwind CSS
- Lucide React Icons
- React Hot Toast

**Backend:**
- Supabase (PostgreSQL + Auth + RLS)
- Real-time subscriptions
- Row Level Security

## 📋 Prerequisites

- Node.js 18+
- Supabase account
- Vercel account (for deployment)

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd campus-event-management
npm install
```

### 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Run the SQL schema from `supabase-schema.sql` in your Supabase SQL Editor
3. Enable Google OAuth in Authentication > Providers:
   - Enable Google provider
   - Add your Google OAuth credentials
   - Set redirect URL: `https://your-app-domain.com`

### 3. Environment Variables

Create `.env` file in root directory:

```env
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

Get these values from your Supabase project settings.

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📦 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Add environment variables in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy!

### Supabase Configuration

After deployment, update your Supabase settings:

1. **Site URL**: In Supabase Dashboard > Authentication > Settings, set:
   - Site URL: `https://your-vercel-app.vercel.app`
   - Redirect URLs: Add `https://your-vercel-app.vercel.app/**`

2. **Google OAuth Setup**:
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create new OAuth 2.0 credentials
   - Authorized redirect URI: `https://your-project-id.supabase.co/auth/v1/callback`
   - Copy Client ID and Secret to Supabase Authentication > Providers > Google

## 🗄️ Database Schema

The app uses the following tables:

- **profiles**: User profiles with roles (student/admin)
- **events**: Event information with creator tracking
- **registrations**: Event registrations with unique constraints

### Row Level Security Policies

- Users can only view/edit their own profile
- Anyone can view events
- Authenticated users can create events
- Users can only delete their own events
- Users can register once per event
- Users can only cancel their own registrations

## 🎨 Customization

### Colors and Theme

The app uses Tailwind CSS with a custom color scheme. Modify `tailwind.config.js` to customize:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // your custom colors
      }
    }
  }
}
```

### Adding New Features

1. **New Page**: Add to `src/pages/` and update routes in `App.jsx`
2. **New Component**: Add to `src/components/`
3. **Database Changes**: Update `supabase-schema.sql` and run in Supabase

## 🔧 Development Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🐛 Troubleshooting

### Common Issues

1. **Google OAuth Not Working**
   - Check redirect URLs in Supabase settings
   - Verify Google OAuth credentials
   - Ensure environment variables are set

2. **Real-time Updates Not Working**
   - Check RLS policies for tables
   - Verify Supabase realtime is enabled
   - Check browser console for errors

3. **Build Errors**
   - Ensure all environment variables are prefixed with `VITE_`
   - Check for missing dependencies

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📞 Support

For support, please open an issue in the GitHub repository or contact the development team.
