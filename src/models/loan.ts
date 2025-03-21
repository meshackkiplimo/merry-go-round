import mongoose, { Document, Schema } from 'mongoose';

export interface ILoan extends Document {
  name: string;
  email: string;
  phone: string;
  amount: number;
  duration: number;
  totalInterest: number;
  totalRepayment: number;
  monthlyPayment: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

const loanSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
  },
  amount: {
    type: Number,
    required: [true, 'Loan amount is required'],
    min: [1000, 'Minimum loan amount is 1000'],
  },
  duration: {
    type: Number,
    required: [true, 'Loan duration is required'],
    min: [1, 'Minimum duration is 1 month'],
  },
  totalInterest: {
    type: Number,
    required: [true, 'Total interest is required'],
  },
  totalRepayment: {
    type: Number,
    required: [true, 'Total repayment is required'],
  },
  monthlyPayment: {
    type: Number,
    required: [true, 'Monthly payment is required'],
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  }
}, {
  timestamps: true,
});

export default mongoose.model<ILoan>('Loan', loanSchema);