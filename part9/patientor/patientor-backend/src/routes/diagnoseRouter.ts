import express from 'express';
const router = express.Router();
import diagnoseService from '../services/diagnoseService';

router.get('/', (_req, res) => {
  const data = diagnoseService.getEntries();
  res.send(data);
});

router.post('/', (_req, res) => {
  res.send('Saving a diagnoses!');
});

export default router;