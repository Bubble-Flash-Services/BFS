import express from 'express';
import { handleCallbackRequest } from '../controllers/callbackController.js';

const router = express.Router();

// Public endpoint to submit callback request
router.post('/', handleCallbackRequest);

export default router;
