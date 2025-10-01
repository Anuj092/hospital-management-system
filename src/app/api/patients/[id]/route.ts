import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const patient = await prisma.patient.findUnique({
      where: { id: params.id },
      include: {
        doctor: { select: { id: true, name: true } },
        treatments: { orderBy: { createdAt: 'desc' } },
        labReports: { orderBy: { createdAt: 'desc' } },
        bills: { orderBy: { createdAt: 'desc' } }
      }
    })

    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 })
    }

    return NextResponse.json(patient)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch patient' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthUser(request)
    if (!user || !['ADMIN', 'RECEPTIONIST'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { doctorId } = body

    // Verify doctor exists and has DOCTOR role
    if (doctorId) {
      const doctor = await prisma.user.findFirst({
        where: { id: doctorId, role: 'DOCTOR' }
      })
      
      if (!doctor) {
        return NextResponse.json({ error: 'Invalid doctor selected' }, { status: 400 })
      }
    }

    const patient = await prisma.patient.update({
      where: { id: params.id },
      data: { doctorId: doctorId || null },
      include: {
        doctor: { select: { id: true, name: true } }
      }
    })

    return NextResponse.json(patient)
  } catch (error) {
    console.error('Update patient error:', error)
    return NextResponse.json({ error: 'Failed to update patient' }, { status: 500 })
  }
}