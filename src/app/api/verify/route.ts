import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Animal, Treatment, Vaccine, MedReport } from '@/lib/models';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const certificateNumber = searchParams.get('certificate');

    if (!certificateNumber) {
      return NextResponse.json(
        { success: false, message: 'Certificate number is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const animal = await Animal.findOne({ 
      certificateNumber: certificateNumber.toUpperCase() 
    }).lean();

    if (!animal) {
      return NextResponse.json(
        { success: false, message: 'No records found for this certificate number' },
        { status: 404 }
      );
    }

    const treatments = await Treatment.find({ animalId: animal._id })
      .sort({ date: -1 })
      .lean();

    const vaccines = await Vaccine.find({ animalId: animal._id })
      .sort({ dateAdministered: -1 })
      .lean();

    const medReports = await MedReport.find({ animalId: animal._id })
      .sort({ createdAt: -1 })
      .lean();

    const totalTreatmentCost = treatments.reduce((sum, t) => sum + t.cost, 0);
    const totalVaccineCost = vaccines.reduce((sum, v) => sum + v.cost, 0);
    const totalCost = totalTreatmentCost + totalVaccineCost;

    const age = Math.floor(
      (Date.now() - new Date(animal.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000)
    );

    return NextResponse.json({
      success: true,
      data: {
        animal: {
          _id: animal._id,
          certificateNumber: animal.certificateNumber,
          name: animal.name,
          species: animal.species,
          breed: animal.breed,
          dateOfBirth: animal.dateOfBirth,
          age,
          weight: animal.weight,
          ownerName: animal.ownerName,
          ownerEmail: animal.ownerEmail,
          ownerPhone: animal.ownerPhone,
          registrationDate: animal.registrationDate,
          imageUrl: animal.imageUrl,
        },
        treatments: treatments.map((t) => ({
          id: t._id,
          type: t.treatmentType,
          description: t.description,
          date: t.date,
          veterinarian: t.veterinarian,
          cost: t.cost,
          notes: t.notes,
        })),
        vaccines: vaccines.map((v) => ({
          id: v._id,
          name: v.vaccineName,
          dateAdministered: v.dateAdministered,
          nextDueDate: v.nextDueDate,
          veterinarian: v.veterinarian,
          cost: v.cost,
        })),
        medReports: medReports.map((r) => ({
          id: r._id,
          reportType: r.reportType,
          diagnosis: r.diagnosis,
          symptoms: r.symptoms,
          treatment: r.treatment,
          prescriptions: r.prescriptions,
          veterinarian: r.veterinarian,
          followUpDate: r.followUpDate,
          notes: r.notes,
          createdAt: r.createdAt,
        })),
        costs: {
          treatments: totalTreatmentCost,
          vaccines: totalVaccineCost,
          total: totalCost,
        },
      },
    });
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to verify certificate' },
      { status: 500 }
    );
  }
}
