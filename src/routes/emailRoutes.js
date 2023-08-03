import express from 'express';
import {createEmail, deleteEmail, listEmails, readEmail, updateEmail} from '../controllers/emailController.js';
import createScheduleValidation from '../middlewares/validations/createValidator.js';
import updateScheduleValidation from '../middlewares/validations/updateValidator.js';

const router = express.Router();

router.post('/emails', createScheduleValidation, createEmail);

router.get('/emails/:id', readEmail);

router.get('/emails', listEmails);

router.put('/emails/:id', updateScheduleValidation, updateEmail);

router.delete('/emails/:id', deleteEmail);

export default router;
