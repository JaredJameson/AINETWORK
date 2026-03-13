import nodemailer from 'nodemailer';

let transporter = null;

if (process.env.SMTP_HOST) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export async function sendRegistrationConfirmation(registration, event) {
  if (!transporter) {
    console.log('Email skipped — SMTP not configured');
    return;
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const eventDate = new Date(event.date).toLocaleDateString('pl-PL', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  await transporter.sendMail({
    from: process.env.SMTP_USER || 'kontakt@ainetwork.pl',
    to: registration.email,
    subject: `Potwierdzenie rejestracji — ${event.title}`,
    text: [
      `Cześć ${registration.firstName}!`,
      '',
      `Potwierdzamy rejestrację na wydarzenie: ${event.title}`,
      `Data: ${eventDate}, ${event.time}`,
      `Miejsce: ${event.location}, ${event.venue}`,
      '',
      `Twój kod biletu: ${registration.ticketCode}`,
      `Pobierz bilet PDF: ${baseUrl}/api/tickets/${registration.ticketCode}`,
      '',
      'Do zobaczenia!',
      'Zespół AI NETWORK',
    ].join('\n'),
  });
}
