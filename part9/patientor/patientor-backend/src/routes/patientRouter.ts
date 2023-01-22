import express from 'express';
const router = express.Router();
import patientService from '../services/patientService';
import { toNewPatient, toNewEntry } from '../utils';
import { EntryFields, Fields } from '../types';

router.get('/', (_req, res) => {
  const data = patientService.getNonSensitiveEntries();
  res.send(data);
});

router.get('/:id', (req, res) => {
  const patient = patientService.findById(req.params.id);
  if (patient) {
    res.send(patient);
  } else {
    res.sendStatus(404);
  }
});

router.post('/:id/entries', (req, res) => {
  try {
    console.log(req.params.id);
    console.log(req.body);
    const newEntry = toNewEntry(req.body as EntryFields);
    console.log(newEntry);
    const addedEntry = patientService.addEntry(req.params.id, newEntry);
    console.log(addedEntry);
    res.json(addedEntry);
  } catch (error) {
    let errorMessage = 'Something went wrong.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    res.status(400).send(errorMessage);
  }
});

router.post('/', (req, res) => {
  try {
    const newPatient = toNewPatient(req.body as Fields);
    const addedPatient = patientService.addPatient(newPatient);
    res.json(addedPatient);
  } catch (error) {
    let errorMessage = 'Something went wrong.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    res.status(400).send(errorMessage);
  }
});

export default router;