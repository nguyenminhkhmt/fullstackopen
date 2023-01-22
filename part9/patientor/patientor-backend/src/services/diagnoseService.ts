import diagnosesData from '../../data/diagnoses.json';
import { Diagnosis } from '../types';

const diagnoses: Array<Diagnosis> = diagnosesData as Array<Diagnosis>;

const getEntries = (): Array<Diagnosis> => {
  return diagnoses;
};

const addDiagnose = () => {
  return [];
};

export default {
  getEntries,
  addDiagnose
};