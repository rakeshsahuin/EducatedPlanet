import { NextRequest, NextResponse } from 'next/server';
import { AdminTutorService } from '@educatedplanet/dataservice';

// GET /api/admin/tutors/export - Export tutors data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const filters = {
      query: searchParams.get('search') || undefined,
      status: searchParams.get('status') as any,
      city: searchParams.get('city') || undefined,
      subjects: searchParams.get('subjects')?.split(',') || undefined,
      minRating: searchParams.get('minRating') ? parseFloat(searchParams.get('minRating')!) : undefined,
      maxPrice: searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined,
      isVerified: searchParams.get('verified') === 'true',
      isFeatured: searchParams.get('featured') === 'true',
      dateFrom: searchParams.get('dateFrom') ? new Date(searchParams.get('dateFrom')!) : undefined,
      dateTo: searchParams.get('dateTo') ? new Date(searchParams.get('dateTo')!) : undefined
    };

    const data = await AdminTutorService.exportTutors(filters);

    const format = searchParams.get('format') || 'csv';
    const filename = `tutors_export_${new Date().toISOString().split('T')[0]}.${format}`;

    if (format === 'csv') {
      // Convert data to CSV
      const headers = Object.keys(data[0] || {});
      const csvContent = [
        headers.join(','),
        ...data.map(row =>
          headers.map(header => {
            const value = row[header as keyof typeof row];
            // Escape CSV values
            if (typeof value === 'string' && value.includes(',')) {
              return `"${value}"`;
            }
            return value;
          }).join(',')
        )
      ].join('\n');

      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="${filename}"`
        }
      });
    }

    // For other formats like Excel, you would need a library like xlsx
    return NextResponse.json({
      success: true,
      data,
      message: 'Export completed'
    });
  } catch (error) {
    console.error('Error exporting tutors:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to export tutors'
      },
      { status: 500 }
    );
  }
}