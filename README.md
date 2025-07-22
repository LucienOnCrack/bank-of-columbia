# 🏦 Bank of Columbia

A secure fullstack banking platform for Roblox users built with Next.js, Supabase, and ShadCN UI.

## 🚀 Features

- **🔐 Roblox OAuth Authentication** - Secure login with Roblox accounts only
- **👥 Role-Based Access Control** - User, Employee, and Admin roles with different permissions
- **💰 Balance Management** - Track and manage user account balances
- **🏠 Property Management** - Assign and track real estate properties
- **📊 Transaction History** - Complete audit trail of all financial activities
- **🎨 Modern UI** - Beautiful, responsive interface built with ShadCN UI
- **🔒 Row-Level Security** - Database-level security with Supabase RLS

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **UI Components**: ShadCN UI
- **Backend**: Next.js API Routes
- **Database**: Supabase PostgreSQL
- **Authentication**: Supabase Auth with Roblox OAuth
- **Icons**: Lucide React
- **Deployment**: Vercel

## 🏗️ Project Structure

```
src/
├── app/
│   ├── dashboard/          # User dashboard
│   ├── employee/           # Employee panel
│   ├── admin/              # Admin panel
│   ├── auth/error/         # Auth error page
│   └── api/auth/callback/  # OAuth callback
├── components/
│   ├── ui/                 # ShadCN UI components
│   ├── AuthProvider.tsx    # Authentication context
│   ├── Navbar.tsx          # Navigation component
│   └── ProtectedRoute.tsx  # Route protection
├── lib/
│   ├── supabase.ts         # Database operations
│   ├── auth.ts             # Authentication utilities
│   └── utils.ts            # Utility functions
├── types/
│   └── user.ts             # TypeScript definitions
└── supabase/
    └── migrations/         # Database schema
```

## 🔧 Setup Instructions

### 1. Clone and Install

```bash
git clone <repository-url>
cd bank-of-columbia
npm install
```

### 2. Environment Configuration

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Roblox OAuth Configuration
ROBLOX_CLIENT_ID=your-client-id
ROBLOX_CLIENT_SECRET=your-client-secret

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret

# Application Configuration
NODE_ENV=development
```

### 3. Supabase Setup

```bash
# Initialize Supabase (if not already done)
npx supabase init

# Login to Supabase
npx supabase login

# Link to your project
npx supabase link --project-ref your-project-id

# Run database migrations
npx supabase db push
```

### 4. Roblox OAuth Setup

1. Go to the [Roblox Developer Hub](https://create.roblox.com/)
2. Create a new OAuth application
3. Set the redirect URI to: `http://localhost:3000/api/auth/callback` (development)
4. For production: `https://your-domain.com/api/auth/callback`
5. Copy the Client ID and Client Secret to your `.env.local`

### 5. Database Schema

The application includes a complete database schema with:

- **Users table** - Extended user profiles with Roblox integration
- **Properties table** - Real estate property management
- **Transactions table** - Financial transaction history
- **Row-Level Security** - Secure data access policies
- **Indexes** - Optimized database performance

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 👥 User Roles

### 🟢 User (Default)
- View personal dashboard
- Check account balance
- View owned properties
- View transaction history

### 🔵 Employee
- All user permissions
- Create new properties
- Assign properties to users
- View all properties and users
- Create transactions

### 🔴 Admin
- All employee permissions
- Manage user roles
- Adjust user balances
- View system statistics
- Full system administration

## 🔒 Security Features

- **Row-Level Security (RLS)** - Database-level access control
- **Role-Based Permissions** - Hierarchical access control
- **Secure Authentication** - Roblox OAuth integration
- **Input Validation** - TypeScript and database constraints
- **Audit Trail** - Complete transaction logging

## 🚀 Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Environment Variables for Production

Update your environment variables for production:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-production-service-key
ROBLOX_CLIENT_ID=your-production-client-id
ROBLOX_CLIENT_SECRET=your-production-client-secret
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-production-secret
NODE_ENV=production
```

## 📊 Database Management

### Using Supabase CLI

```bash
# Check database status
npx supabase status

# Reset database (development only)
npx supabase db reset

# Generate TypeScript types
npx supabase gen types typescript --local > src/types/supabase.ts
```

### Manual User Role Updates

To manually update user roles (useful for creating initial admin):

```sql
-- Make a user admin
UPDATE public.users 
SET role = 'admin' 
WHERE roblox_id = 'YOUR_ROBLOX_ID';

-- Make a user employee
UPDATE public.users 
SET role = 'employee' 
WHERE roblox_id = 'YOUR_ROBLOX_ID';
```

## 🔍 Development Commands

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Type checking
npm run type-check
```

## 🐛 Troubleshooting

### Common Issues

1. **Authentication Error**: Check Roblox OAuth configuration and redirect URIs
2. **Database Connection**: Verify Supabase credentials and project URL
3. **Permission Denied**: Check RLS policies and user roles
4. **Build Errors**: Run `npm run lint` and fix TypeScript errors

### Environment Variables

Make sure all required environment variables are set:
- Supabase URL and keys
- Roblox OAuth credentials  
- NextAuth configuration

### Database Issues

```bash
# Check Supabase status
npx supabase status

# View logs
npx supabase logs

# Reset local database
npx supabase db reset
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🤝 Support

For support and questions:
- Create an issue on GitHub
- Check the troubleshooting section
- Review Supabase and Next.js documentation

---

Built with ❤️ for the Roblox community
