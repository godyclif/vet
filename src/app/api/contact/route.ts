import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import connectDB from '@/lib/db';
import { Contact } from '@/lib/models';
import { sendEmail, getContactEmailTemplate } from '@/lib/email';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  subject: z.string().optional(),
  animalType: z.enum(['dog', 'cat', 'bird', 'reptile', 'exotic', 'other']).optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = contactSchema.parse(body);

    await connectDB();

    const contact = await Contact.create(validatedData);

    const emailHtml = getContactEmailTemplate(validatedData);
    const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;
    
    if (adminEmail) {
      await sendEmail({
        to: adminEmail,
        subject: `New Contact Form Submission from ${validatedData.name}`,
        html: emailHtml,
      });
    }

    return NextResponse.json(
      { success: true, message: 'Contact form submitted successfully', id: contact._id },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error.issues },
        { status: 400 }
      );
    }

    console.error('Contact form error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to submit contact form' },
      { status: 500 }
    );
  }
}
