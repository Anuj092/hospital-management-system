import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { getAuthUser } from '@/lib/auth'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = cookies()
  const token = cookieStore.get('token')?.value

  if (!token) {
    redirect('/login')
  }

  // Create a mock request object for getAuthUser
  const mockRequest = {
    cookies: {
      get: (name: string) => cookieStore.get(name)
    }
  } as any

  const user = await getAuthUser(mockRequest)

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />
      <div className="flex">
        <Sidebar user={user} />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}