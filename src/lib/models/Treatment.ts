import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface ITreatment extends Document {
  animalId: Types.ObjectId;
  treatmentType: string;
  description: string;
  date: Date;
  veterinarian: string;
  cost: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TreatmentSchema = new Schema<ITreatment>(
  {
    animalId: {
      type: Schema.Types.ObjectId,
      ref: 'Animal',
      required: true,
      index: true,
    },
    treatmentType: {
      type: String,
      required: true,
      enum: [
        'consultation',
        'surgery',
        'dental',
        'emergency',
        'checkup',
        'grooming',
        'other',
      ],
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    veterinarian: {
      type: String,
      required: true,
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

const Treatment: Model<ITreatment> =
  mongoose.models.Treatment ||
  mongoose.model<ITreatment>('Treatment', TreatmentSchema);

export default Treatment;
