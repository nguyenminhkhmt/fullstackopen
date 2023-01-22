import { Field, FieldProps } from "formik";
import {
  Select,
  MenuItem,
} from "@material-ui/core";
import { EntryType, HealthCheckRating } from "../types";
import { InputLabel } from "@material-ui/core";

// structure of a single option
export type EntryOption = {
  value: EntryType;
  label: string;
};

// props for select field component
type SelectFieldProps = {
  name: string;
  label: string;
  options: EntryOption[];
};

const FormikSelect = ({ field, ...props }: FieldProps) => <Select {...field} {...props} />;

export const SelectEntryTypeField = ({ name, label, options }: SelectFieldProps) => (
  <>
    <InputLabel>{label}</InputLabel>
    <Field
      fullWidth
      style={{ marginBottom: "0.5em" }}
      label={label}
      component={FormikSelect}
      name={name}
    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label || option.value}
        </MenuItem>
      ))}
    </Field>
  </>
);

/// HealthCheckRating control
export type HealthCheckRatingOption = {
  value: HealthCheckRating;
  label: string;
};

type SelectHealthCheckRatingFieldProps = {
  name: string;
  label: string;
  options: HealthCheckRatingOption[];
};

export const SelectHealthCheckRatingField = ({ name, label, options }: SelectHealthCheckRatingFieldProps) => (
  <>
    <InputLabel>{label}</InputLabel>
    <Field
      fullWidth
      style={{ marginBottom: "0.5em" }}
      label={label}
      component={FormikSelect}
      name={name}
    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label || option.value}
        </MenuItem>
      ))}
    </Field>
  </>
);