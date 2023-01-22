import { Grid, Button } from "@material-ui/core";
import { Field, Formik, Form } from "formik";
import { useState } from "react";

import { DiagnosisSelection, TextField } from "../AddPatientModal/FormField";
import { useStateValue } from "../state";
import { Entry, EntryType, HealthCheckRating } from "../types";
import { EntryOption, HealthCheckRatingOption, SelectEntryTypeField, SelectHealthCheckRatingField } from "./FormField";

export type EntryFormValues = Omit<Entry, "id">;

interface Props {
  onSubmit: (values: EntryFormValues) => void;
  onCancel: () => void;
}

const entryOptions: EntryOption[] = [
  { value: EntryType.HealthCheck, label: "Health check" },
  { value: EntryType.Hospital, label: "Hospital" },
  { value: EntryType.OccupationalHealthcare, label: "Occupational healthcare" },
];

const healthCheckRatingOptions: HealthCheckRatingOption[] = [
  { value: HealthCheckRating.Healthy, label: "Healthy" },
  { value: HealthCheckRating.LowRisk, label: "Low risk" },
  { value: HealthCheckRating.HighRisk, label: "High risk" },
  { value: HealthCheckRating.CriticalRisk, label: "Critical risk" }
];

export const AddEntryForm = ({ onSubmit, onCancel }: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  const [{ diagnoses }] = useStateValue();
  const [selectedType, setSelectedType] = useState<EntryType>(EntryType.HealthCheck);
  return (
    <Formik
      initialValues={{
        type: EntryType.HealthCheck,
        description: '',
        date: '',
        specialist: '',
        diagnosisCodes: [],
        healthCheckRating: HealthCheckRating.Healthy,
        discharge: {
          date: '',
          criteria: ''
        },
        employerName: '',
        sickLeave: {
          startDate: '',
          endDate: ''
        }
      }}
      onSubmit={onSubmit}
      validate={(values) => {
        // console.log('validate: ', values);
        const requiredError = "Field is required";
        const errors: { [field: string]: string } = {};
        if (!values.type) {
          errors.type = requiredError;
        } else {
          setSelectedType(values.type);
        }
        if (!values.description) {
          errors.description = requiredError;
        }
        if (!values.date) {
          errors.date = requiredError;
        }
        if (!values.diagnosisCodes) {
          errors.diagnosisCodes = requiredError;
        }
        return errors;
      }}
    >
      {({ isValid, dirty, setFieldValue, setFieldTouched }) => {
        return (
          <Form className="form ui">
            <SelectEntryTypeField label="Entry type" name="type" options={entryOptions} />
            <Field
              label="Date Of Entry"
              placeholder="YYYY-MM-DD"
              name="date"
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              component={TextField}
            />
            <DiagnosisSelection
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
              // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
              diagnoses={Object.values(diagnoses)}
            />
            <Field
              label="Specialist"
              placeholder="Specialist"
              name="specialist"
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              component={TextField}
            />
            <Field
              label="Description"
              placeholder="Description"
              name="description"
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              component={TextField}
            />
            {selectedType === EntryType.HealthCheck ? (
              <SelectHealthCheckRatingField label="Health check rating" name="healthCheckRating" options={healthCheckRatingOptions} />
            ) : null}
            {selectedType === EntryType.Hospital ? (
              <>
                <b>Hospital</b>
                <Field
                  label="Discharge date"
                  placeholder="YYYY-MM-DD"
                  name="discharge.date"
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                  component={TextField}
                />
                <Field
                  label="Criteria"
                  placeholder="Criteria"
                  name="discharge.criteria"
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                  component={TextField}
                />
              </>
            ) : null}
            {selectedType === EntryType.OccupationalHealthcare ? (
              <>
                <b>Occupational</b>
                <Field
                  label="Employer Name"
                  placeholder="Company name"
                  name="employerName"
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                  component={TextField}
                />
                <b>Sick leave:</b>
                <Field
                  label="Start date"
                  placeholder="YYYY-MM-DD"
                  name="sickLeave.startDate"
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                  component={TextField}
                />
                <Field
                  label="End date"
                  placeholder="YYYY-MM-DD"
                  name="sickLeave.endDate"
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                  component={TextField}
                />
              </>
            ) : null}
            <Grid>
              <Grid item>
                <Button
                  color="secondary"
                  variant="contained"
                  style={{ float: "left" }}
                  type="button"
                  onClick={onCancel}
                >
                  Cancel
                </Button>
              </Grid>
              <Grid item>
                <Button
                  style={{
                    float: "right",
                  }}
                  type="submit"
                  variant="contained"
                  disabled={!dirty || !isValid}
                >
                  Add
                </Button>
              </Grid>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
};

export default AddEntryForm;
