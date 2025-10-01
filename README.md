# Hospital Management System

A comprehensive hospital management system built with Next.js, featuring multi-user roles, patient management, billing, lab reports, and secure authentication.

## Features

### Multi-User System
- **Admin**: Manage all users, generate reports, overall system management
- **Doctor**: View assigned patients, update treatments, access lab reports
- **Receptionist**: Patient registration, billing, assign patients to doctors
- **Lab Staff**: Upload and manage lab reports

### Core Functionality
- Patient registration and management
- Treatment records and history
- Lab report uploads with cloud storage (AWS S3)
- Billing system with PDF generation
- Role-based access control
- Responsive dashboard for each user type
- Search, filtering, and pagination
- Secure JWT authentication

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: MySQL with Prisma ORM
- **Authentication**: JWT with HTTP-only cookies
- **File Storage**: AWS S3 (with local fallback)
- **PDF Generation**: jsPDF
- **UI Components**: Lucide React icons, React Hook Form
- **Notifications**: React Hot Toast

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- MySQL database
- AWS S3 bucket (optional, has local fallback)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hospital-management-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   DATABASE_URL="mysql://username:password@localhost:3306/hospital_db"
   JWT_SECRET="your-super-secret-jwt-key"
   NEXTAUTH_SECRET="your-nextauth-secret"
   NEXTAUTH_URL="http://localhost:3000"
   
   # AWS S3 Configuration (optional)
   AWS_ACCESS_KEY_ID="your-aws-access-key"
   AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
   AWS_REGION="us-east-1"
   AWS_S3_BUCKET="hospital-lab-reports"
   ```

4. **Database Setup**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push database schema
   npm run db:push
   ```

5. **Create Admin User**
   You'll need to manually create an admin user in your database or add a seed script.

6. **Start Development Server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`

## Database Schema

The system uses the following main entities:
- **Users**: System users with different roles
- **Patients**: Patient information and medical records
- **Treatments**: Medical treatments and prescriptions
- **LabReports**: Lab test results with file attachments
- **Bills**: Billing and payment tracking

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Patients
- `GET /api/patients` - List patients (role-based filtering)
- `POST /api/patients` - Create new patient

### Users
- `GET /api/users` - List users
- `POST /api/users` - Create new user (Admin only)

### Bills
- `GET /api/bills` - List bills
- `POST /api/bills` - Create new bill

### Lab Reports
- `GET /api/lab-reports` - List lab reports
- `POST /api/lab-reports` - Upload lab report

## User Roles & Permissions

### Admin
- Full system access
- User management
- System reports and analytics
- All patient and billing data

### Doctor
- View assigned patients only
- Update treatment records
- Access lab reports for their patients
- Patient history and medical records

### Receptionist
- Patient registration and management
- Billing and invoice creation
- Assign patients to doctors
- View and search patient records

### Lab Staff
- Upload lab reports
- Manage lab records
- View patient information for reports

## Security Features

- JWT-based authentication with HTTP-only cookies
- Role-based access control (RBAC)
- Password hashing with bcrypt
- Input validation and sanitization
- Secure file upload handling
- Environment variable protection

## Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Railway/Render
1. Connect GitHub repository
2. Configure environment variables
3. Set build command: `npm run build`
4. Set start command: `npm start`

### Manual Deployment
1. Build the application: `npm run build`
2. Start production server: `npm start`

## Development Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:push` - Push database schema
- `npm run db:generate` - Generate Prisma client
- `npm run db:studio` - Open Prisma Studio

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please create an issue in the GitHub repository.