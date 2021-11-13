import { FC, useState, MouseEvent } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {
  Button,
  Card,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';

import logo from '../assets/images/logo.png';

interface ILoginFormInputs {
  username: string;
  password: string;
}

const schema = yup
  .object({
    username: yup.string().required('*Username is required.'),
    password: yup.string().required('*Password is required.'),
  })
  .required();

const Login: FC = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ILoginFormInputs>({
    defaultValues: {
      username: '',
      password: '',
    },
    resolver: yupResolver(schema),
  });

  const handleClickShowPassword = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const onSubmit: SubmitHandler<ILoginFormInputs> = data => console.log(data);

  return (
    <Card className="shadow" sx={{ px: 2, py: 4, maxWidth: 400, mx: 'auto' }}>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'center',
          mb: 2,
        }}
      >
        <img alt="Company Logo" src={logo} width="40" height="40" />
      </Box>

      <Typography mb={2} textAlign="center" variant="h5">
        Leave Hub
      </Typography>

      <Typography mb={4} textAlign="center" variant="subtitle2">
        Bangkok Engineering
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Box mb={2}>
          <Controller
            name="username"
            control={control}
            render={({ field }) => (
              <TextField
                error={!!errors.username}
                fullWidth
                helperText={errors.username?.message}
                label="Username"
                sx={{
                  '& .MuiInputBase-root': {
                    backgroundColor: 'grey.100',
                  },
                }}
                {...field}
              />
            )}
          />
        </Box>

        {/* TODO: fix render visible icon */}
        <Box mb={2}>
          <FormControl error={!!errors.password} fullWidth variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">
              Password
            </InputLabel>

            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <OutlinedInput
                  sx={{
                    backgroundColor: 'grey.100',
                  }}
                  type={isPasswordVisible ? 'text' : 'password'}
                  {...field}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {isPasswordVisible ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              )}
            />

            {errors.password?.message && (
              <FormHelperText>{errors.password.message}</FormHelperText>
            )}
          </FormControl>
        </Box>

        <Button
          className="shadow"
          fullWidth
          variant="contained"
          size="large"
          type="submit"
        >
          Submit
        </Button>
      </form>
    </Card>
  );
};

export default Login;
