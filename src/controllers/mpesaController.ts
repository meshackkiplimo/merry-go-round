import { Request, Response } from 'express';
import axios from 'axios';
import { Contribution } from '../models/contribution'; 

const MPESA_CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY;
const MPESA_CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET;
const MPESA_SHORTCODE = process.env.MPESA_SHORTCODE; 
const MPESA_PASSKEY = process.env.MPESA_PASSKEY;
const MPESA_CALLBACK_URL = process.env.MPESA_CALLBACK_URL; 


const getMpesaToken = async () => {
  const auth = Buffer.from(`${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`).toString('base64');
  const response = await axios.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
    headers: {
      'Authorization': `Basic ${auth}`,
    },
  });
  return response.data.access_token;
};


export const initiateStkPush = async (req: Request, res: Response) => {
  try {
    const { phone, amount } = req.body;
    const token = await getMpesaToken();

    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
    const password = Buffer.from(`${MPESA_SHORTCODE}${MPESA_PASSKEY}${timestamp}`).toString('base64');

    const response = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      {
        BusinessShortCode: MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: amount,
        PartyA: phone, 
        PartyB: MPESA_SHORTCODE,
        PhoneNumber: phone,
        CallBackURL: MPESA_CALLBACK_URL,
        AccountReference: `Merry-${req.user?.id}`,
        TransactionDesc: 'Merry-Go-Round Contribution',
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('STK Push Response:', response.data);
    res.json(response.data); 
  } catch (error: any) {
    console.error('STK Push Error:', error.response?.data || error.message);
    res.status(500).json({ message: 'Failed to initiate payment', error: error.response?.data || error.message });
  }
};

// Confirm payment (polling or callback handler)
export const confirmPayment = async (req: Request, res: Response) => {
  try {
    const { checkoutRequestID } = req.body;
    const token = await getMpesaToken();

    const response = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query',
      {
        BusinessShortCode: MPESA_SHORTCODE,
        Password: Buffer.from(`${MPESA_SHORTCODE}${MPESA_PASSKEY}${new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14)}`).toString('base64'),
        Timestamp: new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14),
        CheckoutRequestID: checkoutRequestID,
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const result = response.data;
    console.log('Payment Confirmation Response:', result);

    if (result.ResultCode === '0') {
      // Payment successful
      res.json({ success: true, message: 'Payment confirmed' });
    } else {
      res.json({ success: false, message: result.ResultDesc });
    }
  } catch (error: any) {
    console.error('Confirm Payment Error:', error.response?.data || error.message);
    res.status(500).json({ message: 'Failed to confirm payment', error: error.response?.data || error.message });
  }
};

// Log contribution (called after payment confirmation)
export const logContribution = async (req: Request, res: Response) => {
  try {
    const { userId, amount, cycleNumber } = req.body;
    const contribution = new Contribution({
      userId,
      amount,
      cycleNumber,
      date: new Date(),
    });
    await contribution.save();
    console.log('Contribution Logged:', contribution);
    res.json({ message: 'Contribution logged successfully' });
  } catch (error: any) {
    console.error('Log Contribution Error:', error.message);
    res.status(500).json({ message: 'Failed to log contribution', error: error.message });
  }
};