import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@hospital.com' },
    update: {},
    create: {
      email: 'admin@hospital.com',
      name: 'System Administrator',
      password: adminPassword,
      role: 'ADMIN',
    },
  })

  // Create doctor
  const doctorPassword = await bcrypt.hash('doctor123', 12)
  const doctor = await prisma.user.upsert({
    where: { email: 'doctor@hospital.com' },
    update: {},
    create: {
      email: 'doctor@hospital.com',
      name: 'Dr. John Smith',
      password: doctorPassword,
      role: 'DOCTOR',
    },
  })

  // Create receptionist
  const receptionistPassword = await bcrypt.hash('reception123', 12)
  const receptionist = await prisma.user.upsert({
    where: { email: 'reception@hospital.com' },
    update: {},
    create: {
      email: 'reception@hospital.com',
      name: 'Jane Doe',
      password: receptionistPassword,
      role: 'RECEPTIONIST',
    },
  })

  // Create lab staff
  const labPassword = await bcrypt.hash('lab123', 12)
  const labStaff = await prisma.user.upsert({
    where: { email: 'lab@hospital.com' },
    update: {},
    create: {
      email: 'lab@hospital.com',
      name: 'Lab Technician',
      password: labPassword,
      role: 'LAB_STAFF',
    },
  })

  // Create sample patients
  const patient1 = await prisma.patient.create({
    data: {
      name: 'Alice Johnson',
      email: 'alice@example.com',
      phone: '+1234567890',
      address: '123 Main St, City, State',
      dateOfBirth: new Date('1990-05-15'),
      gender: 'FEMALE',
      doctorId: doctor.id,
    },
  })

  const patient2 = await prisma.patient.create({
    data: {
      name: 'Bob Wilson',
      phone: '+1987654321',
      address: '456 Oak Ave, City, State',
      dateOfBirth: new Date('1985-08-22'),
      gender: 'MALE',
      doctorId: doctor.id,
    },
  })

  // Create sample treatment
  await prisma.treatment.create({
    data: {
      diagnosis: 'Common Cold',
      prescription: 'Rest and fluids, paracetamol as needed',
      notes: 'Patient should return if symptoms worsen',
      patientId: patient1.id,
    },
  })

  // Create sample bill
  await prisma.bill.create({
    data: {
      amount: 150.00,
      description: 'Consultation and basic examination',
      status: 'PENDING',
      patientId: patient1.id,
      createdById: receptionist.id,
    },
  })

  console.log('Database seeded successfully!')
  console.log('Login credentials:')
  console.log('Admin: admin@hospital.com / admin123')
  console.log('Doctor: doctor@hospital.com / doctor123')
  console.log('Receptionist: reception@hospital.com / reception123')
  console.log('Lab Staff: lab@hospital.com / lab123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })