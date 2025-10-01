const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createSampleData() {
  try {
    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10)
    
    const admin = await prisma.user.upsert({
      where: { email: 'admin@hospital.com' },
      update: {},
      create: {
        name: 'Admin User',
        email: 'admin@hospital.com',
        password: hashedPassword,
        role: 'ADMIN'
      }
    })

    // Create sample patient
    const patient = await prisma.patient.create({
      data: {
        name: 'John Doe',
        phone: '+1234567890',
        email: 'john@example.com',
        address: '123 Main St',
        gender: 'MALE'
      }
    })

    // Create sample bills
    const bills = await Promise.all([
      prisma.bill.create({
        data: {
          amount: 150.00,
          description: 'Consultation Fee',
          status: 'PAID',
          patientId: patient.id,
          createdById: admin.id
        }
      }),
      prisma.bill.create({
        data: {
          amount: 75.50,
          description: 'Lab Tests',
          status: 'PENDING',
          patientId: patient.id,
          createdById: admin.id
        }
      }),
      prisma.bill.create({
        data: {
          amount: 200.00,
          description: 'X-Ray Examination',
          status: 'PAID',
          patientId: patient.id,
          createdById: admin.id
        }
      })
    ])

    console.log('Sample data created:')
    console.log('- Admin user:', admin.email)
    console.log('- Patient:', patient.name)
    console.log('- Bills:', bills.length)
    console.log('- Total Revenue: $' + bills.reduce((sum, bill) => sum + bill.amount, 0))

  } catch (error) {
    console.error('Error creating sample data:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createSampleData()