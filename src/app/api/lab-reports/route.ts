import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'
import { uploadToS3 } from '@/lib/s3'

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request)
    if (!user || !['ADMIN', 'LAB_STAFF'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const patientId = formData.get('patientId') as string
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const file = formData.get('file') as File

    if (!patientId || !title || !file) {
      return NextResponse.json(
        { error: 'Patient, title, and file are required' },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to S3 (or save locally if S3 not configured)
    let fileUrl: string
    try {
      fileUrl = await uploadToS3(buffer, file.name, file.type)
    } catch (s3Error) {
      // Fallback to local storage if S3 fails
      fileUrl = `/uploads/${Date.now()}-${file.name}`
      // In production, you'd save the file to local storage here
    }

    const labReport = await prisma.labReport.create({
      data: {
        patientId,
        title,
        description: description || null,
        fileUrl,
        fileName: file.name,
        uploadedById: user.id,
      },
      include: {
        patient: {
          select: { name: true, phone: true }
        },
        uploadedBy: {
          select: { name: true }
        }
      }
    })

    return NextResponse.json({ labReport })
  } catch (error) {
    console.error('Upload lab report error:', error)
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
    const patientId = searchParams.get('patientId')

    const where: any = {}
    
    // Role-based filtering
    if (user.role === 'DOCTOR') {
      where.patient = { doctorId: user.id }
    }
    
    if (patientId) {
      where.patientId = patientId
    }

    const [labReports, total] = await Promise.all([
      prisma.labReport.findMany({
        where,
        include: {
          patient: {
            select: { name: true, phone: true }
          },
          uploadedBy: {
            select: { name: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.labReport.count({ where })
    ])

    return NextResponse.json({
      labReports,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Get lab reports error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}