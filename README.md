# Authentication Setup: Major Web

A sleek, professional, and minimalist **Black & White** authentication system. Built with **Bootstrap 5** and powered by **Supabase** for secure user management and profile data storage.

## Project Architecture
- **Frontend**: HTML5, CSS3 (Vanilla), JavaScript (ES6+).
- **Styling**: Bootstrap 5 + custom minimalist theme.
- **Backend-as-a-Service**: [Supabase](https://supabase.com/) (Auth & Postgres).

## Key Features
- **Minimalist Aesthetic**: High-contrast black and white design with clean typography.
- **Secure Login**: Session-based authentication with auto-redirection for protected routes.
- **Two-Step Registration**:
  1. **Account Creation**: Email and secure password setup.
  2. **Detailed Profiling**: Collects First Name, Last Name, Nickname, Callsign, Telephone, and Birthdate.
- **Proactive Security**: Real-time password requirement checklist (Uppercase, Number, Special Character, Min-8 Length).
- **Protected Dashboard**: A secure `index.html` that displays authenticated user profile information.

## Quick Setup

### 1. Database Configuration
Execute the [supabase_setup.sql](./supabase_setup.sql) script in your Supabase SQL Editor. This will:
- Create the `profiles` table.
- Link it to the Supabase Auth system.
- Enable **Row Level Security (RLS)** policies so users can only access their own data.

> [!IMPORTANT]
> **Disable Email Confirmation for Instant Registration:**
> By default, Supabase requires users to confirm their email before they can write data to the `profiles` table. For clinical/development purposes:
> 1. Go to your **Supabase Dashboard**.
> 2. Navigate to **Authentication** -> **Settings**.
> 3. Under **User Management**, toggle **"Confirm email"** to **OFF**.
> 4. Click **Save** at the bottom.

### 2. Connect Your App
Open [auth.js](./auth.js) and update your Supabase project credentials:
```javascript
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
```

### 3. Deploy
Simply host the files or open `login.html` locally to begin the authentication flow.

## License
This project is for tactical and educational purposes. Feel free to modify and integrate into your existing web structures.

