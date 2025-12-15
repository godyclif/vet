import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectDB } from '@/lib/db';
import MedReport from '@/lib/models/MedReport';
import Animal from '@/lib/models/Animal';
import { getCurrentUser } from '@/lib/auth';

const medReportSchema = z.object({
  animalName: z.string().min(1, 'Animal name is required'),
  species: z.enum(['dog', 'cat', 'bird', 'reptile', 'exotic', 'other']),
  breed: z.string().min(1, 'Breed is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  weight: z.number().min(0.1, 'Weight must be greater than 0'),
  ownerName: z.string().min(1, 'Owner name is required'),
  ownerEmail: z.string().email('Invalid owner email'),
  ownerPhone: z.string().min(1, 'Owner phone is required'),
  reportType: z.enum([
    'general_checkup',
    'emergency',
    'surgery',
    'vaccination',
    'dental',
    'laboratory',
    'imaging',
    'followup',
    'other',
  ]),
  diagnosis: z.string().min(1, 'Diagnosis is required'),
  symptoms: z.string().min(1, 'Symptoms are required'),
  treatment: z.string().min(1, 'Treatment is required'),
  prescriptions: z.string().optional(),
  veterinarian: z.string().min(1, 'Veterinarian name is required'),
  price: z.number().min(0, 'Price must be a positive number').optional(),
  followUpDate: z.string().optional(),
  notes: z.string().optional(),
});

function generateCertificateNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const random = Math.random().toString(36).substring(2, 10).toUpperCase();
  return `VET-${year}-${random}`;
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Admin access required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = medReportSchema.parse(body);

    await connectDB();

    const certificateNumber = generateCertificateNumber();

    const animal = await Animal.create({
      certificateNumber,
      name: validatedData.animalName,
      species: validatedData.species,
      breed: validatedData.breed,
      dateOfBirth: new Date(validatedData.dateOfBirth),
      weight: validatedData.weight,
      ownerName: validatedData.ownerName,
      ownerEmail: validatedData.ownerEmail,
      ownerPhone: validatedData.ownerPhone,
    });

    const reportData = {
      animalId: animal._id,
      reportType: validatedData.reportType,
      diagnosis: validatedData.diagnosis,
      symptoms: validatedData.symptoms,
      treatment: validatedData.treatment,
      prescriptions: validatedData.prescriptions || '',
      veterinarian: validatedData.veterinarian,
      price: validatedData.price,
      followUpDate: validatedData.followUpDate ? new Date(validatedData.followUpDate) : undefined,
      notes: validatedData.notes || '',
      createdBy: user._id,
    };

    const report = await MedReport.create(reportData);

    return NextResponse.json(
      {
        success: true,
        message: 'Medical report created successfully',
        certificateNumber,
        report: {
          id: report._id,
          certificateNumber,
          animalName: validatedData.animalName,
          reportType: report.reportType,
          diagnosis: report.diagnosis,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error.issues },
        { status: 400 }
      );
    }

    console.error('Med report creation error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create medical report' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Admin access required' },
        { status: 401 }
      );
    }

    await connectDB();
    const reports = await MedReport.find({})
      .populate('animalId', 'name species certificateNumber')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      reports,
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch reports' },
      { status: 500 }
    );
  }
}
