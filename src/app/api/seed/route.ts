import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Animal, Treatment, Vaccine, User } from '@/lib/models';
import bcrypt from 'bcryptjs';

const sampleAnimals = [
  {
    certificateNumber: 'VET-2024-001234',
    name: 'Max',
    species: 'dog',
    breed: 'Golden Retriever',
    dateOfBirth: new Date('2020-03-15'),
    weight: 32.5,
    ownerName: 'Maria van der Berg',
    ownerEmail: 'maria@example.com',
    ownerPhone: '+31 6 12345678',
    registrationDate: new Date('2020-05-01'),
  },
  {
    certificateNumber: 'VET-2024-002345',
    name: 'Spike',
    species: 'reptile',
    breed: 'Bearded Dragon',
    dateOfBirth: new Date('2022-07-20'),
    weight: 0.45,
    ownerName: 'Jan de Vries',
    ownerEmail: 'jan@example.com',
    ownerPhone: '+31 6 23456789',
    registrationDate: new Date('2022-08-15'),
  },
  {
    certificateNumber: 'VET-2024-003456',
    name: 'Luna',
    species: 'cat',
    breed: 'Maine Coon',
    dateOfBirth: new Date('2019-11-10'),
    weight: 5.8,
    ownerName: 'Peter Jansen',
    ownerEmail: 'peter@example.com',
    ownerPhone: '+31 6 34567890',
    registrationDate: new Date('2020-01-15'),
  },
  {
    certificateNumber: 'VET-2024-004567',
    name: 'Coco',
    species: 'bird',
    breed: 'African Grey Parrot',
    dateOfBirth: new Date('2018-05-25'),
    weight: 0.42,
    ownerName: 'Sophie Laurent',
    ownerEmail: 'sophie@example.com',
    ownerPhone: '+31 6 45678901',
    registrationDate: new Date('2018-07-01'),
  },
];

const treatmentTypes = ['consultation', 'surgery', 'dental', 'emergency', 'checkup'];
const vaccineNames = ['Rabies', 'Distemper', 'Parvovirus', 'Bordetella', 'Leptospirosis'];
const vets = ['Dr. Anna Smit', 'Dr. Thomas Klein', 'Dr. Emma de Groot'];

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const createAdmin = searchParams.get('admin') === 'true';
    const adminEmail = searchParams.get('email') || 'admin@universalis.com';
    const adminPassword = searchParams.get('password') || 'admin12345';

    if (createAdmin) {
      const existingAdmin = await User.findOne({ email: adminEmail.toLowerCase() });
      
      if (existingAdmin) {
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        return NextResponse.json({
          success: true,
          message: 'User upgraded to admin',
          email: adminEmail,
        });
      }

      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(adminPassword, salt);

      await User.create({
        name: 'Admin User',
        email: adminEmail.toLowerCase(),
        password: hashedPassword,
        role: 'admin',
      });

      return NextResponse.json({
        success: true,
        message: 'Admin user created',
        email: adminEmail,
        note: 'Password was provided in query params. Please change it after login.',
      });
    }

    await Animal.deleteMany({});
    await Treatment.deleteMany({});
    await Vaccine.deleteMany({});

    const createdAnimals = await Animal.insertMany(sampleAnimals);

    for (const animal of createdAnimals) {
      const numTreatments = Math.floor(Math.random() * 4) + 1;
      for (let i = 0; i < numTreatments; i++) {
        await Treatment.create({
          animalId: animal._id,
          treatmentType: treatmentTypes[Math.floor(Math.random() * treatmentTypes.length)],
          description: `Regular ${treatmentTypes[i % treatmentTypes.length]} visit`,
          date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
          veterinarian: vets[Math.floor(Math.random() * vets.length)],
          cost: Math.floor(Math.random() * 150) + 30,
          notes: 'Animal in good condition',
        });
      }

      const numVaccines = Math.floor(Math.random() * 3) + 1;
      for (let i = 0; i < numVaccines; i++) {
        const dateAdministered = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000);
        await Vaccine.create({
          animalId: animal._id,
          vaccineName: vaccineNames[i % vaccineNames.length],
          dateAdministered,
          nextDueDate: new Date(dateAdministered.getTime() + 365 * 24 * 60 * 60 * 1000),
          veterinarian: vets[Math.floor(Math.random() * vets.length)],
          cost: Math.floor(Math.random() * 50) + 25,
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Sample data seeded successfully',
      animals: createdAnimals.length,
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to seed data' },
      { status: 500 }
    );
  }
}
