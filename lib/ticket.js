import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';

export async function generateTicketPDF(registration, event) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const checkInUrl = `${baseUrl}/check-in/${registration.ticketCode}`;

  const qrDataUrl = await QRCode.toDataURL(checkInUrl, {
    width: 200, margin: 1, color: { dark: '#000000', light: '#FFFFFF' },
  });

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const w = doc.internal.pageSize.getWidth();

  // Dark background header
  doc.setFillColor(10, 10, 10);
  doc.rect(0, 0, w, 90, 'F');

  // Yellow accent line
  doc.setFillColor(245, 197, 24);
  doc.rect(0, 88, w, 3, 'F');

  // Branding
  doc.setTextColor(245, 197, 24);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('AI NETWORK', w / 2, 25, { align: 'center' });

  // Event title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.text(event.title, w / 2, 42, { align: 'center', maxWidth: w - 40 });

  // Event details
  doc.setFontSize(11);
  doc.setTextColor(180, 180, 180);
  const eventDate = new Date(event.date).toLocaleDateString('pl-PL', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
  doc.text(`${eventDate}  |  ${event.time}  |  ${event.location}, ${event.venue}`, w / 2, 65, { align: 'center' });

  // Attendee section
  doc.setTextColor(50, 50, 50);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('UCZESTNIK', 20, 110);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text(`${registration.firstName} ${registration.lastName}`, 20, 122);

  if (registration.company) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(120, 120, 120);
    doc.text(registration.company, 20, 132);
  }

  // Ticket code
  doc.setTextColor(50, 50, 50);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('KOD BILETU', 20, 155);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(245, 197, 24);
  doc.text(registration.ticketCode, 20, 170);

  // QR Code
  doc.addImage(qrDataUrl, 'PNG', w - 70, 105, 50, 50);
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('Skanuj przy wejsciu', w - 45, 162, { align: 'center' });

  // Footer line
  doc.setDrawColor(230, 230, 230);
  doc.setLineDashPattern([2, 2], 0);
  doc.line(20, 185, w - 20, 185);

  // Footer text
  doc.setFontSize(9);
  doc.setTextColor(150, 150, 150);
  doc.setFont('helvetica', 'normal');
  doc.text('Ten bilet jest potwierdzeniem rejestracji. Okaz QR kod przy wejsciu na wydarzenie.', w / 2, 195, { align: 'center' });
  doc.text('ainetwork.pl', w / 2, 202, { align: 'center' });

  return Buffer.from(doc.output('arraybuffer'));
}
