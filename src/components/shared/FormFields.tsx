import { TextField } from '@mui/material';
import { Controller } from 'react-hook-form';

interface FormInputProps {
  name: string;
  control: any;
  label: string;
  type?: string;
}

export const FormInput = ({ name, control, label, type = 'text' }: FormInputProps) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue=""
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          type={type}
          label={label}
          error={!!error}
          helperText={error?.message}
          fullWidth
          margin="normal"
        />
      )}
    />
  );
};