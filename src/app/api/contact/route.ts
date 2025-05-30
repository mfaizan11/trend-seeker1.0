import { type NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json();

    // Basic validation
    if (!name || !email || !message) {
      return NextResponse.json({ message: 'Missing required fields.' }, { status: 400 });
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json({ message: 'Invalid email format.' }, { status: 400 });
    }
    
    // --- Resend Email Sending Logic ---
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not set. Email sending disabled.');
      return NextResponse.json({ message: 'Email service not configured on server.' }, { status: 500 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const recipientEmail = "muhammadfaizanakx@gmail.com"; 
    const fromAddress = 'Trend Seeker Contact <muhammadfaizanakx@gmail.com>'; 

    try {
      const { data, error } = await resend.emails.send({
        from: fromAddress,
        to: [recipientEmail],
        subject: `New Contact Form Submission from ${name} via Trend Seeker`,
        reply_to: email, 
        html: `<p><strong>Name:</strong> ${name}</p>
               <p><strong>Email:</strong> ${email}</p>
               <p><strong>Message:</strong></p>
               <p>${message.replace(/\n/g, '<br>')}</p>`,
      });

      if (error) {
        console.error('Error sending email with Resend:', error);
        return NextResponse.json({ message: 'Failed to send email via Resend.' }, { status: 500 });
      }

      console.log('Email sent successfully via Resend:', data);
      return NextResponse.json({ message: 'Message sent successfully!' }, { status: 200 });

    } catch (emailError: any) {
      console.error('Exception sending email with Resend:', emailError);
      return NextResponse.json({ message: `Failed to send email. Error: ${emailError.message}` }, { status: 500 });
    }

  } catch (error: any) {
    console.error('Error processing contact form:', error);
    return NextResponse.json({ message: `An unexpected error occurred: ${error.message}` }, { status: 500 });
  }
}
