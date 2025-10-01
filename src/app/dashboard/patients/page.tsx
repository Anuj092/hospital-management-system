import { cookies } from 'next/headers'
import { getAuthUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { UserPlus, Search } from 'lucide-react'
import PatientsClient from './PatientsClient'

async function getPatients(userId: string, role: string, page = 1, search = '') {
  const limit = 10
  const skip = (page - 1) * limit
  
  const where: any = {}
  
  if (role === 'DOCTOR') {
    where.doctorId = userId
  }
  
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { phone: { contains: search } },
      { email: { contains: search } }
    ]
  }

  const [patients, total] = await Promise.all([
    prisma.patient.findMany({
      where,
      include: {
        doctor: { select: { name: true } },
        _count: {
          select: {
            treatments: true,
            labReports: true,
            bills: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    }),
    prisma.patient.count({ where })
  ])

  return { patients, total, totalPages: Math.ceil(total / limit) }
}

export default async function PatientsPage({
  searchParams
}: {
  searchParams: { page?: string; search?: string }
}) {
  const cookieStore = cookies()
  const mockRequest = {
    cookies: {
      get: (name: string) => cookieStore.get(name)
    }
  } as any

  const user = await getAuthUser(mockRequest)
  if (!user) return <div>Access denied</div>

  const page = parseInt(searchParams.page || '1')
  const search = searchParams.search || ''
  
  const { patients, total, totalPages } = await getPatients(user.id, user.role, page, search)

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {user.role === 'DOCTOR' ? 'My Patients' : 'All Patients'}
        </h1>
        {(user.role === 'RECEPTIONIST' || user.role === 'ADMIN') && (
          <Link
            href="/dashboard/patients/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2"
          >
            <UserPlus className="h-4 w-4" />
            <span>New Patient</span>
          </Link>
        )}
      </div>

      <PatientsClient 
        initialPatients={patients}
        initialPage={page}
        initialSearch={search}
        totalPages={totalPages}
        userRole={user.role}
      />
    </div>
  )
}