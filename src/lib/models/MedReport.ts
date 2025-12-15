import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IMedReport extends Document {
  animalId: Types.ObjectId;
  reportType: string;
  diagnosis: string;
  symptoms: string;
  treatment: string;
  prescriptions?: string;
  veterinarian: string;
  followUpDate?: Date;
  notes?: string;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const MedReportSchema = new Schema<IMedReport>(
  {
    animalId: {
      type: Schema.Types.ObjectId,
      ref: 'Animal',
      required: true,
      index: true,
    },
    reportType: {
      type: String,
      required: true,
      enum: [
        'general_checkup',
        'emergency',
        'surgery',
        'vaccination',
        'dental',
        'laboratory',
        'imaging',
        'followup',
        'other',
      ],
    },
    diagnosis: {
      type: String,
      required: true,
    },
    symptoms: {
      type: String,
      required: true,
    },
    treatment: {
      type: String,
      required: true,
    },
    prescriptions: {
      type: String,
    },
    veterinarian: {
      type: String,
      required: true,
    },
    followUpDate: {
      type: Date,
    },
    notes: {
      type: String,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const MedReport: Model<IMedReport> =
  mongoose.models.MedReport || mongoose.model<IMedReport>('MedReport', MedReportSchema);

export default MedReport;
