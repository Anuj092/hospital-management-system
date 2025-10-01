import { cookies } from 'next/headers'
import { getAuthUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Users, UserPlus, Receipt, DollarSign } from 'lucide-react'

async function getDashboardStats(userId: string, role: string) {
  if (role === 'ADMIN') {
    const [totalPatients, totalDoctors, pendingBills, paidBills] = await Promise.all([
      prisma.patient.count(),
      prisma.user.count({ where: { role: 'DOCTOR' } }),
      prisma.bill.count({ where: { status: 'PENDING' } }),
      prisma.bill.aggregate({
        where: { status: 'PAID' },
        _sum: { amount: true }
      })
    ])

    return {
      totalPatients,
      totalDoctors,
      pendingBills,
      totalRevenue: paidBills._sum.amount || 0
    }
  }

  if (role === 'DOCTOR') {
    const [myPatients, totalTreatments, labReports] = await Promise.all([
      prisma.patient.count({ where: { doctorId: userId } }),
      prisma.treatment.count({
        where: { patient: { doctorId: userId } }
      }),
      prisma.labReport.count({
        where: { patient: { doctorId: userId } }
      })
    ])

    return {
      myPatients,
      totalTreatments,
      labReports,
      totalRevenue: 0
    }
  }

  return {
    totalPatients: 0,
    totalDoctors: 0,
    pendingBills: 0,
    totalRevenue: 0
  }
}

export default async function DashboardPage() {
  const cookieStore = cookies()
  const mockRequest = {
    cookies: {
      get: (name: string) => cookieStore.get(name)
    }
  } as any

  const user = await getAuthUser(mockRequest)
  if (!user) return null

  const stats = await getDashboardStats(user.id, user.role)

  const getStatsCards = () => {
    if (user.role === 'ADMIN') {
      return [
        {
          title: 'Total Patients',
          value: stats.totalPatients,
          icon: Users,
          color: 'bg-blue-500'
        },
        {
          title: 'Total Doctors',
          value: stats.totalDoctors,
          icon: UserPlus,
          color: 'bg-green-500'
        },
        {
          title: 'Pending Bills',
          value: stats.pendingBills,
          icon: Receipt,
          color: 'bg-yellow-500'
        },
        {
          title: 'Total Revenue',
          value: `$${stats.totalRevenue.toFixed(2)}`,
          icon: DollarSign,
          color: 'bg-purple-500'
        }
      ]
    }

    if (user.role === 'DOCTOR') {
      return [
        {
          title: 'My Patients',
          value: stats.myPatients,
          icon: Users,
          color: 'bg-blue-500'
        },
        {
          title: 'Treatments',
          value: stats.totalTreatments,
          icon: UserPlus,
          color: 'bg-green-500'
        },
        {
          title: 'Lab Reports',
          value: stats.labReports,
          icon: Receipt,
          color: 'bg-yellow-500'
        }
      ]
    }

    return []
  }

  const statsCards = getStatsCards()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user.name}!
        </h1>
        <p className="text-gray-600">
          Here's what's happening in your hospital today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((card, index) => {
          const Icon = card.icon
          return (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className={`${card.color} rounded-md p-3`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    {card.title}
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {card.value}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Recent Activity
          </h3>
          <p className="text-gray-500">No recent activity to display.</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="space-y-2">
            {user.role === 'RECEPTIONIST' && (
              <>
                <a
                  href="/dashboard/patients/new"
                  className="block w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md"
                >
                  Register New Patient
                </a>
                <a
                  href="/dashboard/billing"
                  className="block w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md"
                >
                  Create Bill
                </a>
              </>
            )}
            {user.role === 'LAB_STAFF' && (
              <a
                href="/dashboard/lab-reports/upload"
                className="block w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md"
              >
                Upload Lab Report
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}