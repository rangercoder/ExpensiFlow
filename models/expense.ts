import mongoose, { Schema, Document } from 'mongoose';

export interface IExpense extends Document {
  amount: number;
  category: string;
  notes: string;
  date: string;
  paymentMode: string;
  createdAt: string;
}

const ExpenseSchema = new Schema<IExpense>(
  {
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    notes: { type: String, default: '' },
    date: { type: String, required: true },
    paymentMode: { type: String, required: true },
    createdAt: { type: String, default: () => new Date().toISOString() },
  },
  {
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (_, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
      },
    },
  }
);

export default mongoose.models.Expense || mongoose.model<IExpense>('Expense', ExpenseSchema);
