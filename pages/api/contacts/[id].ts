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
  const {
    query: { id },
    method,
  } = req;

  try {
    await dbConnect();

    switch (method) {
      case 'GET':
        try {
          const contact = await Contact.findById(id);

          if (!contact) {
            return res.status(404).json({
              success: false,
              error: 'Contact not found',
            });
          }

          return res.status(200).json({
            success: true,
            data: contact,
          });
        } catch (error) {
          console.error('Error fetching contact:', error);
          return res.status(500).json({
            success: false,
            error: 'Failed to fetch contact',
          });
        }

      case 'PUT':
        try {
          const { name, phone } = req.body;

          if (!name || !phone) {
            return res.status(400).json({
              success: false,
              error: 'Name and phone are required',
            });
          }

          const contact = await Contact.findByIdAndUpdate(
            id,
            { name, phone },
            {
              new: true,
              runValidators: true,
            }
          );

          if (!contact) {
            return res.status(404).json({
              success: false,
              error: 'Contact not found',
            });
          }

          return res.status(200).json({
            success: true,
            data: contact,
          });
        } catch (error: unknown) {
          console.error('Error updating contact:', error);
          return res.status(400).json({
            success: false,
            error:
              error instanceof Error ? error.message : 'Failed to update contact',
          });
        }

      case 'DELETE':
        try {
          const contact = await Contact.findByIdAndDelete(id);

          if (!contact) {
            return res.status(404).json({
              success: false,
              error: 'Contact not found',
            });
          }

          return res.status(200).json({
            success: true,
            data: {},
          });
        } catch (error) {
          console.error('Error deleting contact:', error);
          return res.status(500).json({
            success: false,
            error: 'Failed to delete contact',
          });
        }

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
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
