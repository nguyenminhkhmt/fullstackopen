import axios from "axios";
import React, { useEffect, useState } from "react";
import { apiBaseUrl } from "../constants";
import { Gender, Patient, Entry } from "../types";
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import { fetchDiagnosesAction, useStateValue, State, Action, addEntryAction } from "../state";

import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import WorkIcon from '@mui/icons-material/Work';
import HealthRatingBar from "../components/HealthRatingBar";

import { Button } from "@material-ui/core";
import { EntryFormValues } from "../AddEntryModal/AddEntryForm";
import AddEntryModal from "../AddEntryModal";

const usePatient = (id: string, setEntries: React.Dispatch<React.SetStateAction<Entry[]>>): Patient | null => {
  const [patient, setPatient] = useState<null | Patient>(null);
  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const { data: fetchedPatient } = await axios.get<Patient>(
          `${apiBaseUrl}/patients/${id}`
        );
        setPatient(fetchedPatient);
        setEntries(fetchedPatient.entries ?? []);
      } catch (error) {
        console.log(error);
      }
    };
    void fetchPatient();
  }, [id]);

  return patient;
};

const genderIcon = (gender: Gender) => {
  switch (gender) {
    case Gender.Male:
      return <MaleIcon />;
    default:
      return <FemaleIcon />;
  }
};

const entryIcon = (entry: Entry) => {
  switch (entry.type) {
    case "HealthCheck":
      return <HealthAndSafetyIcon />;
    case "Hospital":
      return <LocalHospitalIcon />;
    case "OccupationalHealthcare":
      return <span><WorkIcon /> {entry.employerName}</span>;
    default: (null);
  }
};

const EntryExtraDataPage = ({ entry }: { entry: Entry }) => {
  switch (entry.type) {
    case "HealthCheck":
      return (
        <HealthRatingBar showText={false} rating={Number(entry.healthCheckRating)} />
      );
    case "Hospital":
      return (
        <span><b>discharge:</b><br />{entry.discharge.date} {entry.discharge.criteria}</span>
      );
    case "OccupationalHealthcare":
      return (
        <p>
          {entry.sickLeave ? <span>sick leave: {entry.sickLeave?.startDate} - {entry.sickLeave?.endDate}</span> : null}
        </p>
      );
    default: return (null);
  }
};

const EntryPage = ({ entry }: { entry: Entry }) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  const [{ diagnoses }] = useStateValue();
  if (!diagnoses) {
    const fetchData = async () => {
      console.log('fetch diagnoses');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      const [, dispatch] = useStateValue() as [State, React.Dispatch<Action>];
      const action = await fetchDiagnosesAction();
      dispatch(action);
    };
    void fetchData();
  }

  const codes = entry.diagnosisCodes ?? [];
  return (
    <div className="entry-page">
      {entry.date} {entryIcon(entry)}<br />
      <i>{entry.description}</i>
      <ul>
        {codes.map(code => <li key={code}>{code} {diagnoses[code] ? diagnoses[code].name : null}</li>)}
      </ul>
      dianose by {entry.specialist} <br />
      <EntryExtraDataPage entry={entry} />
    </div>
  );
};

const PatientDetailPage = ({ patientId }: { patientId: string }) => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const patient = usePatient(patientId, setEntries);
  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  const [, dispatch] = useStateValue();

  if (!patient) {
    return (
      <div>
        invalid patientId
      </div>
    );
  }

  const openModal = (): void => setModalOpen(true);
  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  const submitNewEntry = async (values: EntryFormValues) => {
    try {
      const { data: newEntry } = await axios.post<Entry>(
        `${apiBaseUrl}/patients/${patient.id}/entries`,
        values
      );
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      dispatch(addEntryAction(patient.id, newEntry));
      setEntries(entries.concat(newEntry));
      closeModal();
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        console.error(e?.response?.data || "Unrecognized axios error");
        setError(String(e?.response?.data?.error) || "Unrecognized axios error");
      } else {
        console.error("Unknown error", e);
        setError("Unknown error");
      }
    }
  };

  return (
    <div>
      <h2>{patient.name} {genderIcon(patient.gender)}</h2>
      ssh: {patient.ssn}<br />
      occupation: {patient.occupation}
      <h2>entries</h2>
      {entries.map(entry => <EntryPage key={entry.id} entry={entry} />)}
      <AddEntryModal
        modalOpen={modalOpen}
        onSubmit={submitNewEntry}
        error={error}
        onClose={closeModal}
      />
      <Button variant="contained" color="primary" onClick={() => openModal()}>
        ADD NEW ENTRY
      </Button>
    </div>
  );
};

export default PatientDetailPage;