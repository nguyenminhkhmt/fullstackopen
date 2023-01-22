export enum Gender {
  male = 'male',
  female = 'female',
  other = 'other'
}

export interface BaseEntry {
  id: string;
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes: Array<Diagnosis['code']>;
}

export enum EntryType {
  HealthCheck = "HealthCheck",
  OccupationalHealthcare = "OccupationalHealthcare",
  Hospital = "Hospital"
}

export enum HealthCheckRating {
  "Healthy" = 0,
  "LowRisk" = 1,
  "HighRisk" = 2,
  "CriticalRisk" = 3
}

export interface LeaveDate {
  startDate: string,
  endDate: string
}

export type LeaveDateFields = { startDate: unknown, endDate: unknown};

export interface Discharge {
  date: string,
  criteria: string
}
export type DischargeFields = { date: unknown, criteria: unknown};

export interface HealthCheckEntry extends BaseEntry {
  type: EntryType.HealthCheck;
  healthCheckRating: HealthCheckRating;
}

export type NoIdHealthCheckEntry = Omit<HealthCheckEntry, 'id'>;

export interface OccupationalHealthcareEntry extends BaseEntry {
  type: EntryType.OccupationalHealthcare,
  employerName: string,
  sickLeave?: LeaveDate
}

export type NoIdOccupationalHealthcareEntry = Omit<OccupationalHealthcareEntry, 'id'>;

export interface HospitalEntry extends BaseEntry {
  type: EntryType.Hospital,
  discharge?: Discharge
}

export type NoIdHospitalEntry = Omit<HospitalEntry, 'id'>;

export type Entry =
  | HospitalEntry
  | OccupationalHealthcareEntry
  | HealthCheckEntry;

  export type NonIDEntry = 
  | NoIdHospitalEntry
  | NoIdOccupationalHealthcareEntry
  | NoIdHealthCheckEntry;

// Define special omit for unions
type UnionOmit<T, K extends string | number | symbol> = T extends unknown ? Omit<T, K> : never;
export type EntryWithoutId = UnionOmit<Entry, 'id'>;

export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  ssn: string;
  gender: Gender;
  occupation: string;
  entries?: Entry[];
}

export type PublicPatient = Omit<Patient, 'ssn'>;

export type NonIDPatient = Omit<Patient, 'id'>;

export interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
}

export type Fields = { name: unknown, dateOfBirth: unknown, ssn: unknown, gender: unknown, occupation: unknown };

export interface EntryFields { description: unknown, date: unknown, specialist: unknown, diagnosisCodes: unknown }
export interface EntryFields { type: unknown, healthCheckRating: unknown }
export interface EntryFields { type: unknown, employerName: unknown, sickLeave: unknown }
export interface EntryFields { type: unknown, discharge: unknown }