import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  request: NextRequest,
  { params }: { params: { type: string } }
) {
  try {
    const { type } = params
    const body = await request.json()
    
    const reportData = {
      type,
      generatedAt: new Date().toISOString(),
      dateRange: body.dateRange,
      message: `${type} report generated successfully`
    }

    return NextResponse.json(reportData)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    )
  }
}