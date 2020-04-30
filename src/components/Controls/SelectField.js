import React from 'react';
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from '@material-ui/core';

export const SelectField = ({
  label,
  error,
  value,
  helperText,
  children,
  options,
  ...rest
}) => {

  return (
    <FormControl>
      {label && <InputLabel error={error}>{label}</InputLabel>}
      <Select
        value={value}
        {...rest}
        error={error}
      >
        {options.map((option) => {
          return <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
        })}
      </Select>
      <FormHelperText error={error}>{helperText}</FormHelperText>
    </FormControl>
  );
}
