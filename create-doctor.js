const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createDoctor() {
  try {
    const hashedPassword = await bcrypt.hash('password123', 10)
    
    const doctor = await prisma.user.create({
      data: {
        name: 'Dr. John Smith',
        email: 'doctor@hospital.com',
        password: hashedPassword,
        role: 'DOCTOR'
      }
    })
    
    console.log('Doctor created:', doctor)
  } catch (error) {
    console.error('Error creating doctor:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createDoctor()