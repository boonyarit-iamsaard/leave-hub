import { FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

// mui
import { Checkbox, FormControlLabel } from '@mui/material';

// interfaces
interface InputCheckboxProps {
  label: string;
  name: string;
}

const InputCheckbox: FC<InputCheckboxProps> = ({ label, name }) => {
  const { control } = useFormContext();
  return (
    <FormControlLabel
      sx={{ mb: 2, width: '100%', marginRight: '11px' }}
      control={
        <Controller
          control={control}
          name={name}
          render={({ field }) => (
            <Checkbox
              checked={field.value}
              onChange={(event, checked) => field.onChange(checked)}
            />
          )}
        />
      }
      label={label}
    />
  );
};

export default InputCheckbox;
