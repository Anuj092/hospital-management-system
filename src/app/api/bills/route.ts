import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request)
    if (!user || !['ADMIN', 'RECEPTIONIST'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    const { patientId, amount, description } = data

    if (!patientId || !amount || !description) {
      return NextResponse.json(
        { error: 'Patient, amount, and description are required' },
        { status: 400 }
      )
    }

    const bill = await prisma.bill.create({
      data: {
        patientId,
        amount: parseFloat(amount),
        description,
        createdById: user.id,
      },
      include: {
        patient: {
          select: { name: true, phone: true }
        },
        createdBy: {
          select: { name: true }
        }
      }
    })

    return NextResponse.json({ bill })
  } catch (error) {
    console.error('Create bill error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')

    const where: any = {}
    if (status) {
      where.status = status
    }

    const [bills, total] = await Promise.all([
      prisma.bill.findMany({
        where,
        include: {
          patient: {
            select: { name: true, phone: true }
          },
          createdBy: {
            select: { name: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.bill.count({ where })
    ])

    return NextResponse.json({
      bills,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Get bills error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}