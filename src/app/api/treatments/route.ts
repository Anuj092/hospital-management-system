import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { patientId, diagnosis, prescription, notes } = body

    const treatment = await prisma.treatment.create({
      data: {
        patientId,
        diagnosis,
        prescription,
        notes
      }
    })

    return NextResponse.json(treatment)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create treatment' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const patientId = searchParams.get('patientId')

    const where = patientId ? { patientId } : {}

    const treatments = await prisma.treatment.findMany({
      where,
      include: {
        patient: { select: { name: true } }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(treatments)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch treatments' }, { status: 500 })
  }
}