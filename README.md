# Gaza Damage Assessment System

A comprehensive web application for citizens to register property damage assessments and for government officials to manage and review applications.

## Features

### Citizen Features
- **National ID Authentication**: Login using 9-digit national ID
- **Multi-step Registration Form**:
  - Personal information collection
  - Family information
  - Damage assessment details
  - Document upload (drag & drop)
  - Interactive map location selection
- **Application Review**: Review all entered information before submission
- **PDF Receipt Generation**: Download official receipt with tracking number
- **Status Tracking**: Track application status using tracking number
- **Auto-generated Password**: Secure password generation for account access

### Admin Features
- **Admin Dashboard**: Overview statistics and metrics
- **Search & Filters**: Advanced filtering by status, damage level, property type, date range
- **Table View**: Sortable table with all applications
- **Map View**: Visual representation of applications on interactive map
- **Application Details**: View full application details in modal
- **Approve/Reject**: Review and make decisions on applications

### Technical Features
- **Multi-language Support**: English and Arabic with RTL support
- **Responsive Design**: Mobile-first, works on all devices
- **Modern UI**: Built with Tailwind CSS
- **Type Safety**: Full TypeScript support
- **Form Validation**: Comprehensive client-side validation

## Technology Stack

- **React 18+** with TypeScript
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Routing
- **React Hook Form** - Form management
- **Leaflet/React-Leaflet** - Maps
- **jsPDF** - PDF generation
- **Zustand** - State management
- **Lucide React** - Icons

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Gaza-Damage-Assessment-System
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── admin/          # Admin-specific components
│   ├── Header.tsx
│   ├── Layout.tsx
│   └── LanguageToggle.tsx
├── contexts/           # React contexts
│   └── LanguageContext.tsx
├── pages/               # Page components
│   ├── HomePage.tsx
│   ├── NationalIdPage.tsx
│   ├── PersonalInfoPage.tsx
│   ├── FamilyInfoPage.tsx
│   ├── DamageAssessmentPage.tsx
│   ├── DocumentsPage.tsx
│   ├── MapPage.tsx
│   ├── ReviewPage.tsx
│   ├── SuccessPage.tsx
│   ├── TrackStatusPage.tsx
│   ├── AdminLoginPage.tsx
│   └── AdminDashboard.tsx
├── routes/             # Route configuration
│   └── AppRoutes.tsx
├── store/              # State management
│   └── applicationStore.ts
├── utils/              # Utility functions
│   ├── translations.ts
│   ├── helpers.ts
│   └── pdfGenerator.ts
├── App.tsx
├── main.tsx
└── index.css
```

## Usage

### For Citizens

1. Navigate to the home page
2. Click "Register New Application"
3. Enter your 9-digit National ID
4. Fill out the multi-step form:
   - Personal information
   - Family information
   - Damage assessment
   - Upload documents
   - Select location on map
5. Review your application
6. Submit and receive tracking number
7. Download PDF receipt
8. Track status using tracking number

### For Administrators

1. Navigate to Admin Login
2. Enter credentials
3. View dashboard with statistics
4. Search and filter applications
5. Switch between table and map view
6. Click on applications to view details
7. Approve or reject applications

## Design System

### Colors
- **Primary**: `#1e3a5f` (Dark Blue)
- **Secondary**: `#6b8e23` (Olive Green)
- **Status Colors**:
  - Blue: Submitted
  - Yellow: Under Review
  - Green: Approved/Verified
  - Red: Rejected

### Typography
- **English**: Inter, SF Pro, Segoe UI
- **Arabic**: Noto Sans Arabic

## API Integration

The frontend is designed to work with a RESTful API. Update the API endpoints in the service files when connecting to a backend.

Expected API endpoints:
- `POST /auth/citizen/verify` - Verify National ID
- `POST /auth/citizen/register` - Submit application
- `GET /applications/:trackingNumber` - Get application status
- `POST /auth/admin/login` - Admin authentication
- `GET /applications` - Get all applications (admin)
- `PATCH /applications/:id/status` - Update application status

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Future Enhancements

- [ ] Backend API integration
- [ ] Real-time status updates
- [ ] SMS notification integration
- [ ] Email notifications
- [ ] Advanced analytics and reporting
- [ ] Export functionality (CSV, Excel)
- [ ] Document preview in admin panel
- [ ] Bulk operations
- [ ] User authentication with JWT
- [ ] Role-based access control

## License

This project is developed for the Ministry of Public Works and Housing, Gaza.

## Contact

For support or questions, please contact the development team.

