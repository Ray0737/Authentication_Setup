# Major Web: Engineering Hub

A high-performance, industrial-grade tactical dashboard designed for **PSM Engineering Students**. Built with a minimalist **Black & White** aesthetic, focusing on functional efficiency, real-time communication, and academic synchronization.

![Header Image](https://raw.githubusercontent.com/Ray0737/Authentication_Setup/main/pic/header_preview.png) *(Note: Placeholder for actual preview)*

## 🛠️ Technological Stack
- **Frontend**: HTML5, CSS3 (Custom Industrial Theme), JavaScript (ES6+).
- **Styling**: Bootstrap 5 + Vanilla CSS Micro-animations.
- **Backend-as-a-Service**: [Supabase](https://supabase.com/) (Real-time DB, Auth, Storage).
- **Libraries**: FullCalendar 6 for tactical scheduling.

## 📡 Core Modules

### 1. **Intelligence Hub (Work_Grid)**
The recruitment command unit. Allows users to post and track recruitment announcements for projects and competitions. 
- Real-time data feed.
- Categorized mission posts.
- Direct integration with unit composition.

### 2. **Communication Hub (Freq_Sync)**
The encrypted real-time chat module for project coordination.
- **Project Groups**: Create and manage specialized mission units.
- **Data Transmission**: Support for text and secure file/image uploads.
- **Reply System**: Threaded communication for tactical clarity.
- **Unit Management**: Dismiss or leave units with immediate state synchronization.

### 3. **Tactical Calendar (Ops_Schedule)**
Visual mission planning and deadline tracking.
- **Dual Perspectives**: Toggle between Grid (FullCalendar) and streamlined Drop-down List views.
- **Security Scopes**: Categorize entries as Personal (Private) or Global (Unit) visibility.
- **High-Priority Tasks**: Integrated task management with visual urgency indicators.

### 4. **Academy Module (Library_Access)**
A centralized directory for academic resources.
- Grade-specific (M.4 - M.6) Mathematics and Physics portals.
- Specialized SAT prep (RW & Math) integration.

### 5. **Profile Dossier (Operative_ID)**
Advanced user management system.
- **Multi-Section Profiling**: Identification (Callsigns), Personal Dossier, and Academic Affiliation.
- **Real-time Sync**: Instant profile updates across all modules without page reloads.

## 🚀 Deployment & Configuration

### 1. Database Initialization
Execute the following SQL scripts in your Supabase SQL Editor in the specified order:
1. [supabase_setup.sql](./supabase_setup.sql) (Core schema)
2. [supabase_update.sql](./supabase_update.sql) (Security policies)
3. [new_features_setup.sql](./new_features_setup.sql) (Hub & Calendar)
4. [chat_migration.sql](./chat_migration.sql) (Communication protocols)

### 2. Environment Setup
Link your instance by updating the credentials in `authen/auth.js`:
```javascript
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
```

### 3. Authentication Policy
Ensure **Email Confirmation** is toggled **OFF** in your Supabase Authentication settings for instant operative registration during development.

## 👤 Developer Accreditation
**Mr. Raphee Rattanamanoonporn (Ray)**
*E-AI Major (Gen 07) @ Satit PSM*

---
*© 2026 Engineering_Roadmap. Encrypted Connection Established.*
