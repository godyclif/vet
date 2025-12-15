import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAnimal extends Document {
  certificateNumber: string;
  name: string;
  species: string;
  breed: string;
  dateOfBirth: Date;
  weight: number;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  registrationDate: Date;
  imageUrl?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AnimalSchema = new Schema<IAnimal>(
  {
    certificateNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    species: {
      type: String,
      required: true,
      enum: ['dog', 'cat', 'bird', 'reptile', 'exotic', 'other'],
    },
    breed: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    ownerName: {
      type: String,
      required: true,
    },
    ownerEmail: {
      type: String,
      required: true,
    },
    ownerPhone: {
      type: String,
      required: true,
    },
    registrationDate: {
      type: Date,
      default: Date.now,
    },
    imageUrl: {
      type: String,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Animal: Model<IAnimal> =
  mongoose.models.Animal || mongoose.model<IAnimal>('Animal', AnimalSchema);

export default Animal;
