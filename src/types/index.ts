export interface User {
  id: string
  email: string
  name: string
  role: 'ADMIN' | 'DOCTOR' | 'RECEPTIONIST' | 'LAB_STAFF'
  createdAt: Date
  updatedAt: Date
}

export interface Patient {
  id: string
  name: string
  email?: string
  phone: string
  address?: string
  dateOfBirth?: Date
  gender?: 'MALE' | 'FEMALE' | 'OTHER'
  doctorId?: string
  doctor?: User
  createdAt: Date
  updatedAt: Date
}

export interface Treatment {
  id: string
  diagnosis: string
  prescription?: string
  notes?: string
  patientId: string
  patient?: Patient
  createdAt: Date
  updatedAt: Date
}

export interface LabReport {
  id: string
  title: string
  description?: string
  fileUrl: string
  fileName: string
  patientId: string
  patient?: Patient
  uploadedById: string
  uploadedBy?: User
  createdAt: Date
  updatedAt: Date
}

export interface Bill {
  id: string
  amount: number
  description: string
  status: 'PENDING' | 'PAID' | 'CANCELLED'
  paidAt?: Date
  patientId: string
  patient?: Patient
  createdById: string
  createdBy?: User
  createdAt: Date
  updatedAt: Date
}

export interface DashboardStats {
  totalPatients: number
  totalDoctors: number
  pendingBills: number
  totalRevenue: number
}