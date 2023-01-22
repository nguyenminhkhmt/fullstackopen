import { Gender, NonIDPatient, Fields, EntryFields, NonIDEntry, EntryType, HealthCheckRating, Discharge, DischargeFields, LeaveDateFields, LeaveDate } from './types';

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const parseString = (name: unknown): string => {
  if (!name || !isString(name)) {
    throw new Error('Incorrect or missing string: ' + name);
  }

  return name;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const parseDate = (date: unknown): string => {
  if (!date || !isString(date) || !isDate(date)) {
    throw new Error('Incorrect or missing date: ' + date);
  }
  return date;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isGender = (str: any): str is Gender => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return Object.values(Gender).includes(str);
};

const parseGender = (gender: unknown): Gender => {
  if (!gender || !isString(gender) || !isGender(gender)) {
    throw new Error('Incorrect or missing gender: ' + gender);
  }
  return gender;
};

export const toNewPatient = ({ name, dateOfBirth, ssn, gender, occupation }: Fields): NonIDPatient => {
  const newPatient: NonIDPatient = {
    name: parseString(name),
    dateOfBirth: parseDate(dateOfBirth),
    ssn: parseString(ssn),
    gender: parseGender(gender),
    occupation: parseString(occupation),
    entries: []
  };

  return newPatient;
};

const parseStringArray = (values: unknown): string[] => {
  if (values && Array.isArray(values)) {
    const checked = values.every(it => it instanceof String || typeof it === 'string');
    if (checked) {
      return values as string[];
    }
  }
  throw new Error('Incorrect or missing array: ' + values);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isEntryType = (type: any): type is EntryType => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return Object.values(EntryType).includes(type);
};

const parseEntryType = (type: unknown): EntryType => {
  if (!type || !isString(type) || !isEntryType(type)) {
    throw new Error('Incorrect or missing type: ' + type);
  }
  return type;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isHealthCheckRating = (value: any): value is HealthCheckRating => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument  
  return Object.values(HealthCheckRating).includes(value);
};

const parseHealthCheckRating = (value: unknown): HealthCheckRating => {
  if (isNaN(value as number) || !isHealthCheckRating(value)) {
    throw new Error('Incorrect or missing healthCheckRating: ' + value);
  }
  return value;
};

const parseDischarge = (params: DischargeFields): Discharge => {
  const discharge: Discharge = {
    date: parseDate(params.date),
    criteria: parseString(params.criteria)
  };
  return discharge;
};

const parseLeaveDate = (params: LeaveDateFields): LeaveDate => {
  const sickLeave: LeaveDate = {
    startDate: parseDate(params.startDate),
    endDate: parseDate(params.endDate)
  };
  return sickLeave;
};

export const toNewEntry = (entryFields: EntryFields): NonIDEntry => {
  const basicEntry = {
    type: parseEntryType(entryFields.type),
    description: parseString(entryFields.description),
    date: parseDate(entryFields.date),
    specialist: parseString(entryFields.specialist),
    diagnosisCodes: entryFields.diagnosisCodes ? parseStringArray(entryFields.diagnosisCodes) : [],
  };

  switch (basicEntry.type) {
    case EntryType.HealthCheck:
      return {
        ...basicEntry,
        type: EntryType.HealthCheck,
        healthCheckRating: parseHealthCheckRating(entryFields.healthCheckRating)
      };
    case EntryType.Hospital:
      return {
        ...basicEntry,
        type: EntryType.Hospital,
        discharge: parseDischarge(entryFields.discharge as DischargeFields)
      };
    case EntryType.OccupationalHealthcare:
      return {
        ...basicEntry,
        type: EntryType.OccupationalHealthcare,
        employerName: parseString(entryFields.employerName),
        sickLeave: parseLeaveDate(entryFields.sickLeave as LeaveDateFields)
      };
    default:
      throw new Error('Wrong entry type');
  }
};