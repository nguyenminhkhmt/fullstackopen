import React from "react";
import { Route, Link, Routes, useMatch, Navigate } from "react-router-dom";
import { Button, Divider, Container } from "@material-ui/core";
import { fetchPatientListAction, useStateValue, State, Action, fetchDiagnosesAction } from "./state";

import PatientListPage from "./PatientListPage";
import { Typography } from "@material-ui/core";
import PatientDetailPage from "./PatientDetails";
import './App.css';

const App = () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const [, dispatch] = useStateValue() as [State, React.Dispatch<Action>];
  React.useEffect(() => {
    const fetchData = async () => {
      const action1 = await fetchPatientListAction();
      dispatch(action1);
      const action2 = await fetchDiagnosesAction();
      dispatch(action2);
    };
    void fetchData();
  }, [dispatch]);

  const patientIdMatch = useMatch('patients/:id');
  const patientId = patientIdMatch ? patientIdMatch.params.id : null;

  return (
    <div className="App">
      <Container>
        <Typography variant="h3" style={{ marginBottom: "0.5em" }}>
          Patientor
        </Typography>
        <Button component={Link} to="/" variant="contained" color="primary">
          Home
        </Button>
        <Divider hidden />
        <Routes>
          <Route path="/" element={<PatientListPage />} />
          <Route path="/patients" element={<PatientListPage />} />
          <Route path="/patients/:id" element={patientId ? <PatientDetailPage patientId={patientId} /> : <Navigate to='/patients' />} />
        </Routes>
      </Container>
    </div>
  );
};

export default App;
