import { Patient, PublicPatient, NonIDPatient, NonIDEntry, Entry } from '../types';
import patientsData from '../../data/patients';
import { v4 as uuidv4 } from 'uuid';

const patients: Array<Patient> = patientsData;

const getEntries = (): Patient[] => {
  return patients;
};

const getNonSensitiveEntries = (): PublicPatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation, entries }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
    entries
  }));
};

const findById = (id: string): Patient | undefined => {
  const entry = patients.find(p => p.id === id);
  return entry;
};

const addPatient = (params: NonIDPatient): Patient => {
  const newEntry = {
    id: uuidv4(),
    ...params
  };

  patients.push(newEntry);
  return newEntry;
};

const addEntry = (id: string, params: NonIDEntry): Entry => {
  const newEntry = {
    id: uuidv4(),
    ...params
  };
  patients.map(patient => {
    if (patient.id === id) {
      patient.entries?.push(newEntry);
      return patient;
    } else {
      return patient;
    }
  });

  return newEntry;
};

export default {
  getEntries,
  getNonSensitiveEntries,
  findById,
  addPatient,
  addEntry
};