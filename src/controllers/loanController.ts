import { Request, Response } from 'express';
import Loan, { ILoan } from '../models/loan';

export const submitLoanApplication = async (req: Request, res: Response) => {
  try {
    const {
      name,
      email,
      phone,
      amount,
      duration,
      totalInterest,
      totalRepayment,
      monthlyPayment,
    } = req.body;

    // Create new loan application
    const loan = new Loan({
      name,
      email,
      phone,
      amount,
      duration,
      totalInterest,
      totalRepayment,
      monthlyPayment,
    });

    // Save to database
    await loan.save();

    res.status(201).json({
      success: true,
      message: 'Loan application submitted successfully',
      data: loan,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to submit loan application',
    });
  }
};

export const getLoanHistory = async (req: Request, res: Response) => {
  try {
    console.log('Fetching all loans...'); // Debug log
    const loans = await Loan.find().sort({ createdAt: -1 });
    console.log('Found loans:', loans); // Debug log

    res.status(200).json({
      success: true,
      message: 'Loan history fetched successfully',
      data: loans,
    });
  } catch (error: any) {
    console.error('Error fetching loans:', error); // Debug log
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to fetch loan history',
    });
  }
};