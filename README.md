# ExamDuty - Smart Exam Duty Scheduling System

A comprehensive, production-ready exam duty scheduling system built with React, TypeScript, Tailwind CSS, and Supabase. This system enables fair, fast, and transparent allocation of exam duties for academic institutions.

## Features

### Core Features

- **Smart Scheduling**: AI-powered algorithm for fair duty allocation
- **Role-Based Access Control**: Separate dashboards for Admin and Faculty
- **Real-Time Updates**: Live notifications and status tracking
- **CSV Import**: Bulk upload of faculty, exams, and classroom data
- **Analytics Dashboard**: Interactive charts and statistics
- **Dark Mode**: Full theme customization support
- **Responsive Design**: Works seamlessly on all devices
- **SEO Optimized**: Built-in SEO best practices

### Admin Features

- **Dashboard**: Overview with statistics and analytics
- **Data Upload**: CSV import for faculty, exams, and classrooms
- **Schedule Generator**: Automated duty allocation
- **Faculty Management**: Comprehensive faculty database
- **Exam Management**: Track and organize exams
- **Reports**: Export schedules as PDF and Excel
- **Request Management**: Review faculty change requests
- **Settings**: Theme and system configuration

### Faculty Features

- **Personal Dashboard**: Overview of assigned duties
- **Schedule View**: Calendar view of upcoming duties
- **Download Schedule**: PDF export of duty assignments
- **Change Requests**: Submit requests with reason tracking
- **Notifications**: Real-time updates on duty changes
- **Profile Management**: Update personal information

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + ShadCN/UI
- **Animations**: Framer Motion
- **Routing**: React Router v6
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Charts**: Recharts
- **CSV Parsing**: PapaParse
- **PDF Generation**: jsPDF
- **Date Handling**: date-fns

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account (already configured)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Environment variables are already configured in `.env`

3. Database schema is already applied via migrations

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The production build will be in the `dist` directory.

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── ui/             # ShadCN UI components
│   ├── DashboardLayout.tsx
│   ├── ProtectedRoute.tsx
│   ├── SEO.tsx
│   └── Sidebar.tsx
├── contexts/           # React contexts
│   └── AuthContext.tsx
├── lib/               # Utilities and configs
│   ├── supabase.ts
│   └── utils.ts
├── pages/             # Page components
│   ├── admin/         # Admin pages
│   │   ├── AdminDashboard.tsx
│   │   └── DataUpload.tsx
│   ├── faculty/       # Faculty pages
│   │   └── FacultyDashboard.tsx
│   ├── LandingPage.tsx
│   ├── LoginPage.tsx
│   ├── SignupPage.tsx
│   └── Settings.tsx
├── App.tsx            # Main app component
└── main.tsx           # Entry point
```

## Database Schema

The system uses the following main tables:

- **profiles**: User profiles with role information
- **faculty**: Faculty-specific data
- **exams**: Exam information
- **classrooms**: Venue details
- **duty_schedules**: Duty assignments
- **change_requests**: Faculty change requests
- **notifications**: System notifications
- **system_settings**: Global configuration

All tables have Row Level Security (RLS) enabled with appropriate policies.

## Authentication

The system uses Supabase Auth with email/password authentication:

- Admin users have full system access
- Faculty users have limited access to their own data
- Role-based routing and component protection
- Secure session management

## Features Breakdown

### Landing Page
- Hero section with animated gradients
- Feature cards with hover effects
- Statistics showcase
- User testimonials
- Responsive navigation

### Authentication Pages
- Glass-morphism design
- Password visibility toggle
- Form validation
- Error handling
- Loading states

### Admin Dashboard
- Real-time statistics cards
- Interactive charts (Bar, Pie)
- Department distribution
- Workload trends
- Recent activity feed

### Data Upload
- CSV file parsing and validation
- Data preview before import
- Progress tracking
- Error handling
- Supports faculty, exams, and classrooms

### Faculty Dashboard
- Personalized greeting
- Duty statistics
- Upcoming duties list
- Quick actions
- Status badges

### Settings
- Profile management
- Theme customization (Light/Dark/System)
- Primary color selection
- Notification preferences
- Security settings

## Styling Guidelines

The application follows these design principles:

- **Color Palette**: Blue, teal, and neutral tones (NO purple/indigo)
- **Border Radius**: 2xl (1.5rem) for modern look
- **Shadows**: Subtle elevation with hover effects
- **Animations**: Smooth transitions and micro-interactions
- **Typography**: Clear hierarchy with Inter font family
- **Spacing**: 8px grid system
- **Contrast**: WCAG AA compliant color ratios

## CSV Upload Format

### Faculty CSV
```csv
employee_id,department,specialization,max_duties
EMP001,Computer Science,AI/ML,10
EMP002,Mathematics,Statistics,8
```

### Exam CSV
```csv
exam_name,exam_date,start_time,end_time,subject,department,course,semester
Final Exam,2025-01-15,09:00,12:00,Data Structures,Computer Science,B.Tech,3
```

### Classroom CSV
```csv
room_number,building,capacity,facilities
101,Main Building,60,Projector,AC
202,Science Block,40,Whiteboard
```

## Security

- Row Level Security (RLS) on all tables
- Role-based access control
- Secure authentication with Supabase
- Input validation and sanitization
- XSS and CSRF protection
- Secure session management

## Performance

- Code splitting with React Router
- Lazy loading for heavy components
- Optimized images and assets
- Efficient database queries
- Minimal bundle size
- Fast page transitions

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Contributing

This is a production-ready application. For modifications:

1. Follow the existing code structure
2. Maintain TypeScript types
3. Keep components modular
4. Test thoroughly before deployment
5. Update documentation

## License

Proprietary - All rights reserved

## Support

For issues or questions, contact the development team.

---

Built with ❤️ for efficient exam duty management
