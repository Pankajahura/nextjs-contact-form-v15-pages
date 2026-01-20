import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/mongodb';
import Contact from '@/models/Contact';

type ResponseData = {
  success: boolean;
  data?: any;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const { method } = req;

  try {
    await dbConnect();

    switch (method) {
      case 'GET':
        try {
          console.log('Fetching contacts from database...');
          const contacts = await Contact.find({}).sort({ createdAt: -1 });
          console.log('Fetched contacts from database:', contacts.length);

          return res.status(200).json({
            success: true,
            data: contacts,
          });
        } catch (error) {
          console.error('Error fetching contacts:', error);
          return res.status(500).json({
            success: false,
            error: 'Failed to fetch contacts',
          });
        }

      case 'POST':
        try {
          console.log('Creating a new contact...');
          const { name, phone } = req.body;

          if (!name || !phone) {
            console.log('Name or phone missing in request body');
            return res.status(400).json({
              success: false,
              error: 'Name and phone are required',
            });
          }

          const contact = await Contact.create({ name, phone });
          console.log('Created new contact:', contact);

          return res.status(201).json({
            success: true,
            data: contact,
          });
        } catch (error: unknown) {
          console.error('Error creating contact:', error);
          return res.status(400).json({
            success: false,
            error:
              error instanceof Error ? error.message : 'Failed to create contact',
          });
        }

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({
          success: false,
          error: `Method ${method} not allowed`,
        });
    }
  } catch (error) {
    console.error('Database connection error:', error);
    return res.status(500).json({
      success: false,
      error: 'Database connection failed',
    });
  }
}
