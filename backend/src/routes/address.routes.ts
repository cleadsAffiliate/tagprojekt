import { Router } from 'express';
import { searchAddresses, getAddressDetails } from '../controllers/address.controller';

const router = Router();

// Search addresses with autocomplete
router.get('/search', searchAddresses);

// Get specific address details by ID
router.get('/:id', getAddressDetails);

export default router;
