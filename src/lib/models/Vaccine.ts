import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IVaccine extends Document {
  animalId: Types.ObjectId;
  vaccineName: string;
  dateAdministered: Date;
  nextDueDate: Date;
  veterinarian: string;
  batchNumber?: string;
  cost: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const VaccineSchema = new Schema<IVaccine>(
  {
    animalId: {
      type: Schema.Types.ObjectId,
      ref: 'Animal',
      required: true,
      index: true,
    },
    vaccineName: {
      type: String,
      required: true,
    },
    dateAdministered: {
      type: Date,
      required: true,
      default: Date.now,
    },
    nextDueDate: {
      type: Date,
      required: true,
    },
    veterinarian: {
      type: String,
      required: true,
    },
    batchNumber: {
      type: String,
    },
    cost: {
      type: Number,
      required: true,
      default: 0,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Vaccine: Model<IVaccine> =
  mongoose.models.Vaccine || mongoose.model<IVaccine>('Vaccine', VaccineSchema);

export default Vaccine;
