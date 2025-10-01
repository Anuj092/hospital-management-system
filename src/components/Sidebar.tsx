'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { User } from '@/types'
import { 
  Users, 
  UserPlus, 
  FileText, 
  TestTube, 
  Settings, 
  BarChart3,
  Stethoscope,
  Receipt
} from 'lucide-react'

interface SidebarProps {
  user: User
}

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()

  const getMenuItems = () => {
    const baseItems = [
      { href: '/dashboard', label: 'Dashboard', icon: BarChart3 }
    ]

    switch (user.role) {
      case 'ADMIN':
        return [
          ...baseItems,
          { href: '/dashboard/users', label: 'Manage Users', icon: Users },
          { href: '/dashboard/patients', label: 'All Patients', icon: UserPlus },
          { href: '/dashboard/reports', label: 'Reports', icon: FileText },
          { href: '/dashboard/settings', label: 'Settings', icon: Settings }
        ]
      
      case 'DOCTOR':
        return [
          ...baseItems,
          { href: '/dashboard/patients', label: 'My Patients', icon: Users },
          { href: '/dashboard/treatments', label: 'Treatments', icon: Stethoscope },
          { href: '/dashboard/lab-reports', label: 'Lab Reports', icon: TestTube }
        ]
      
      case 'RECEPTIONIST':
        return [
          ...baseItems,
          { href: '/dashboard/patients', label: 'Patients', icon: Users },
          { href: '/dashboard/patients/new', label: 'New Patient', icon: UserPlus },
          { href: '/dashboard/billing', label: 'Billing', icon: Receipt }
        ]
      
      case 'LAB_STAFF':
        return [
          ...baseItems,
          { href: '/dashboard/lab-reports', label: 'Lab Reports', icon: TestTube },
          { href: '/dashboard/lab-reports/upload', label: 'Upload Report', icon: FileText }
        ]
      
      default:
        return baseItems
    }
  }

  const menuItems = getMenuItems()

  return (
    <div className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}