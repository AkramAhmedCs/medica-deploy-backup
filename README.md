# 🏥 Medica - Premium Medical Appointment System

[![React](https://img.shields.io/badge/React-19-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7-purple.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-cyan.svg)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green.svg)](https://expressjs.com/)

A **production-ready**, **award-winning** medical appointment management system built with modern web technologies. Features a comprehensive admin panel, doctor schedule management, patient appointment booking, and premium UI/UX with dark mode support.

## ✨ Features

### 🎯 Core Functionality

#### For Patients
- 📅 **Browse & Book Appointments** - View available doctors and their schedules
- 🗓️ **Manage Bookings** - Cancel or reschedule appointments
- 📋 **Medical History** - Access past records filtered by doctor
- 👤 **Profile Management** - Update personal information

#### For Doctors
- 📊 **Dashboard Analytics** - View statistics with beautiful charts
- 🗓️ **Schedule Management** - Block/unblock time slots
- 👥 **Patient Management** - Search and filter patients
- 📝 **Medical Records** - Add and update patient prescriptions
- 📈 **Weekly Overview** - Chart showing appointment trends

#### For Administrators
- 📊 **System Analytics** - Comprehensive charts and statistics
- 👥 **Full User Management** - CRUD operations for all user types
- 🗓️ **Bulk Schedule Generation** - Create monthly schedules for all doctors
- 📈 **Data Visualization** - User distribution and appointment status charts

### 🎨 Premium UI/UX Features

- 🌙 **Dark Mode** - Toggle between light and dark themes
- 🎯 **Toast Notifications** - Elegant success/error messages
- 📊 **Interactive Charts** - Beautiful data visualization with Recharts
- 🔍 **Search & Filter** - Find anything quickly
- 📱 **Fully Responsive** - Perfect on all devices
- ⚡ **Smooth Animations** - Professional transitions and hover effects
- ♿ **Accessible** - WCAG compliant with keyboard navigation

### 🚀 Technical Features

- 🔐 **JWT Authentication** - Secure role-based access
- 🎨 **Modern UI** - TailwindCSS with custom design system
- 📊 **Data Visualization** - Recharts for analytics
- 🌐 **RESTful API** - Clean backend integration
- 💾 **Prisma ORM** - Type-safe database access
- 🔄 **Real-time Updates** - Optimistic UI updates

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern UI library
- **Vite 7** - Lightning-fast build tool
- **TailwindCSS 3** - Utility-first CSS framework
- **React Router DOM 7** - Client-side routing
- **Recharts** - Composable charting library
- **react-hot-toast** - Beautiful notifications
- **jsPDF** - PDF generation
- **date-fns** - Date utilities
- **Axios** - HTTP client

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **Prisma** - Modern ORM
- **MySQL** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- MySQL database

### Clone Repository
```bash
git clone https://github.com/yourusername/medica.git
cd medica
```

### Backend Setup
```bash
cd backend
npm install

# Configure environment variables
# Configure environment variables
cp .env.example .env
# Edit .env with your database credentials and API keys

# Run migrations
npx prisma migrate dev

# Start backend server
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install

# Start development server
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## 🎯 Usage

### For Development
1. Start the backend: `cd backend && npm run dev`
2. Start the frontend: `cd frontend && npm run dev`
3. Open http://localhost:5173

### Default Accounts
You'll need to create accounts through the signup page or directly in the database.

**Roles:**
- `PATIENT` - Can book appointments and view medical history
- `DOCTOR` - Can manage schedule and patient records
- `ADMIN` - Full system access

## 📸 Screenshots

### Dashboard with Charts
Beautiful analytics with data visualization

### Dark Mode
Seamless theme switching

### Appointment Management
Intuitive booking interface

### Mobile Responsive
Perfect on all devices

## 🚀 Deployment

### Frontend (Netlify/Vercel)
```bash
cd frontend
npm run build
# Deploy the 'dist' folder
```

### Backend (Heroku/Railway)
```bash
cd backend
# Follow platform-specific deployment guide
```

## 🎨 Color Scheme

| Color | Hex | Usage |
|-------|-----|-------|
| Primary | #36C4D4 | Main brand color |
| Secondary | #393E46 | Text and accents |
| Background | #DCE3E6 | Page backgrounds |
| CTA | #00C8B3 | Call-to-action buttons |

## 📁 Project Structure

```
Medica/
├── frontend/
│   ├── src/
│   │   ├── api/           # API integration
│   │   ├── components/    # React components
│   │   ├── context/       # React contexts
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   ├── public/            # Static assets
│   └── package.json
│
└── backend/
    ├── src/
    │   ├── controllers/   # Route handlers
    │   ├── routes/        # API routes
    │   ├── middleware/    # Auth & validation
    │   └── index.js       # Server entry
    ├── prisma/
    │   └── schema.prisma  # Database schema
    └── package.json
```

## 🔑 Key Components

### Patient Components
- `PatientProfile.jsx` - Dashboard with doctor list and booking
- `PatientHistory.jsx` - Medical records view

### Doctor Components
- `DoctorProfile.jsx` - Schedule management with charts
 - `DoctorHistory.jsx` - Patient record management
- `JoinConsultation.jsx` - Video consultation (placeholder)

### Admin Components
- `AdminProfile.jsx` - Analytics dashboard with charts
- `ShowAllDoctors.jsx` - Doctor CRUD
- `ShowAllPatients.jsx` - Patient CRUD
- `ShowAllAdmins.jsx` - Admin CRUD

### Shared Components
- `Navbar.jsx` - Responsive navigation with dark mode toggle
- `DashboardLayout.jsx` - Consistent dashboard wrapper
- `LoadingSpinner.jsx` - Loading states

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👥 Authors

- **Akram Ahmed** - Developer
- **Abdelrahman Ashraf** - Developer
- **Youssef Mamdouh** - Developer

## 🙏 Acknowledgments

- TailwindCSS for the amazing utility-first CSS framework
- Recharts for beautiful chart library
- React team for the incredible UI library
- Seraj Eldeen for the backend foundation

## 📞 Support

For support, email [support@medica.com] or open an issue on GitHub.

---

Made with ❤️ by the Medica Team
