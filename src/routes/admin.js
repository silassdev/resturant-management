import express from 'express';
import { login } from '../controllers/adminController.js';
import { adminOnly } from '../middlewares/auth.js';

const router = express.Router();

router.post('/login', login);



export default router;
