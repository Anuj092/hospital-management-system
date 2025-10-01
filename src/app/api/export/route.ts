import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { format, dateRange, stats } = body
    
    const exportData = {
      format,
      exportedAt: new Date().toISOString(),
      dateRange,
      stats,
      message: `Data exported as ${format} successfully`
    }

    return NextResponse.json(exportData)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to export data' },
      { status: 500 }
    )
  }
}