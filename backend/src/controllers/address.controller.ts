import { Request, Response } from 'express';
import dataforsyningenService from '../services/dataforsyningen.service';

export const searchAddresses = async (req: Request, res: Response): Promise<void> => {
  try {
    const { q, limit } = req.query;

    if (!q || typeof q !== 'string') {
      res.status(400).json({ error: 'Query parameter "q" is required' });
      return;
    }

    const limitNum = limit ? parseInt(limit as string, 10) : 10;

    const results = await dataforsyningenService.autocomplete(q, limitNum);

    res.json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error('Error in searchAddresses:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search addresses',
    });
  }
};

export const getAddressDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ error: 'Address ID is required' });
      return;
    }

    const address = await dataforsyningenService.getAddressById(id);

    res.json({
      success: true,
      data: address,
    });
  } catch (error) {
    console.error('Error in getAddressDetails:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch address details',
    });
  }
};
