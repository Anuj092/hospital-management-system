import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bill = await prisma.bill.findUnique({
      where: { id: params.id },
      include: {
        patient: true,
        createdBy: { select: { name: true } }
      }
    })

    if (!bill) {
      return NextResponse.json({ error: 'Bill not found' }, { status: 404 })
    }

    const pdfContent = `
HOSPITAL MANAGEMENT SYSTEM
========================

BILL INVOICE

Bill ID: ${bill.id}
Date: ${new Date(bill.createdAt).toLocaleDateString()}

Patient Information:
Name: ${bill.patient.name}
Phone: ${bill.patient.phone}
Email: ${bill.patient.email || 'N/A'}

Bill Details:
Description: ${bill.description}
Amount: $${bill.amount.toFixed(2)}
Status: ${bill.status}

Created by: ${bill.createdBy.name}

Thank you for choosing our services!
    `

    return new NextResponse(pdfContent, {
      headers: {
        'Content-Type': 'text/plain',
        'Content-Disposition': `attachment; filename="bill-${bill.id}.txt"`
      }
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 })
  }
}