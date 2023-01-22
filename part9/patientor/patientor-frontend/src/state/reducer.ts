import { State } from "./state";
import { Diagnosis, Entry, Patient } from "../types";
import axios from "axios";
import { apiBaseUrl } from "../constants";

export type Action =
  {
    type: "SET_DIAGNOSIS_LIST";
    payload: Diagnosis[];
  }
  | {
    type: "SET_PATIENT_LIST";
    payload: Patient[];
  }
  | {
    type: "ADD_PATIENT";
    payload: Patient;
  }
  |
  {
    type: "ADD_ENTRY";
    id: string;
    payload: Entry;
  };

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_DIAGNOSIS_LIST":
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return {
        ...state,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        diagnoses: {
          ...action.payload.reduce(
            (memo, diagnosis) => ({ ...memo, [diagnosis.code]: diagnosis }),
            {}
          ),
          ...state.diagnoses
        }
      };
    case "SET_PATIENT_LIST":
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return {
        ...state,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        patients: {
          ...action.payload.reduce(
            (memo, patient) => ({ ...memo, [patient.id]: patient }),
            {}
          ),
          ...state.patients
        }
      };
    case "ADD_PATIENT":
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return {
        ...state,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        patients: {
          ...state.patients,
          [action.payload.id]: action.payload
        }
      };
    case "ADD_ENTRY":
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const patient = state.patients[action.id];
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      patient.entries = patient.entries ? patient.entries.concat(action.payload) : [action.payload];
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return {
        ...state,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        patients: {
          ...state.patients,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          [action.id]: patient
        }
      };
    default:
      return state;
  }
};

export const fetchPatientListAction = async () => {
  void axios.get<void>(`${apiBaseUrl}/ping`);

  const { data: patientListFromApi } = await axios.get<Patient[]>(
    `${apiBaseUrl}/patients`
  );
  return { type: "SET_PATIENT_LIST", payload: patientListFromApi } as Action;
};

export const fetchDiagnosesAction = async () => {
  const { data: diagnosesFromApi } = await axios.get<Diagnosis[]>(
    `${apiBaseUrl}/diagnoses`
  );
  return { type: "SET_DIAGNOSIS_LIST", payload: diagnosesFromApi } as Action;
};

export const addPatientAction = (patient: Patient) => {
  return { type: "ADD_PATIENT", payload: patient } as Action;
};

export const addEntryAction = (id: string, entry: Entry) => {
  return { type: "ADD_ENTRY", payload: entry, id } as Action;
};