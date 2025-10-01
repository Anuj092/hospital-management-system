const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function addTreatmentsAndLabs() {
  try {
    // Get existing patient and users
    const patient = await prisma.patient.findFirst()
    const doctor = await prisma.user.findFirst({ where: { role: 'DOCTOR' } })
    const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } })

    if (!patient || !doctor || !admin) {
      console.log('Missing required data. Please run create-sample-data.js first')
      return
    }

    // Create treatments
    const treatments = await Promise.all([
      prisma.treatment.create({
        data: {
          diagnosis: 'Common Cold',
          prescription: 'Rest, fluids, paracetamol 500mg twice daily',
          notes: 'Patient showing mild symptoms. Follow up in 3 days.',
          patientId: patient.id
        }
      }),
      prisma.treatment.create({
        data: {
          diagnosis: 'Hypertension',
          prescription: 'Amlodipine 5mg once daily, low sodium diet',
          notes: 'Blood pressure 150/90. Monitor weekly.',
          patientId: patient.id
        }
      })
    ])

    // Create lab reports
    const labReports = await Promise.all([
      prisma.labReport.create({
        data: {
          title: 'Blood Test - Complete Blood Count',
          description: 'Routine blood work showing normal values',
          fileUrl: '/uploads/blood-test-001.pdf',
          fileName: 'blood-test-001.pdf',
          patientId: patient.id,
          uploadedById: admin.id
        }
      }),
      prisma.labReport.create({
        data: {
          title: 'X-Ray Chest',
          description: 'Chest X-ray showing clear lungs',
          fileUrl: '/uploads/xray-chest-001.pdf',
          fileName: 'xray-chest-001.pdf',
          patientId: patient.id,
          uploadedById: admin.id
        }
      })
    ])

    console.log('Added sample data:')
    console.log('- Treatments:', treatments.length)
    console.log('- Lab Reports:', labReports.length)
    console.log('Patient tabs should now show data!')

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

addTreatmentsAndLabs()