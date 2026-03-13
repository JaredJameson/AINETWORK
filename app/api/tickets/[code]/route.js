import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateTicketPDF } from '@/lib/ticket';

export async function GET(req, { params }) {
  const { code } = await params;

  const registration = await prisma.registration.findUnique({
    where: { ticketCode: code },
    include: { event: true },
  });

  if (!registration) {
    return NextResponse.json({ error: 'Bilet nie znaleziony' }, { status: 404 });
  }

  const pdfBuffer = await generateTicketPDF(registration, registration.event);

  return new NextResponse(pdfBuffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="bilet-${code}.pdf"`,
    },
  });
}
