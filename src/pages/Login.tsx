import { FC, useState, MouseEvent } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import { LoadingButton } from '@mui/lab';
import {
  Alert,
  Card,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';

import logo from '../assets/images/logo.png';

import useLogin, { ILoginCredentials } from '../hooks/useLogin';

const schema = yup
  .object({
    email: yup
      .string()
      .email('*Invalid email address.')
      .required('*Email is required.'),
    password: yup.string().required('*Password is required.'),
  })
  .required();

const Login: FC = () => {
  const { error, login, isPending } = useLogin();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const history = useHistory();
  const location = useLocation();
  // TODO: fix type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { from } = (location.state as any) || { from: { pathname: '/' } };
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ILoginCredentials>({
    defaultValues: {
      email: '',
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

  const handleLogin: SubmitHandler<ILoginCredentials> = async data => {
    const user = await login(data);

    if (!user) return;

    history.replace(from);
  };

  return (
    <Card className="shadow" sx={{ p: 2, maxWidth: 400, mx: 'auto' }}>
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

      <form onSubmit={handleSubmit(handleLogin)}>
        <Box mb={2}>
          <FormControl error={!!errors.email} fullWidth variant="outlined">
            <Box sx={{ mb: 1 }}>
              <label htmlFor="email">
                <Typography variant="body1">Email</Typography>
              </label>
            </Box>

            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <OutlinedInput
                  disabled={isPending}
                  size="small"
                  sx={{
                    backgroundColor: 'grey.100',
                  }}
                  {...field}
                />
              )}
            />

            {errors.email?.message && (
              <FormHelperText>{errors.email.message}</FormHelperText>
            )}
          </FormControl>
        </Box>

        {/* TODO: fix render visible icon */}
        <Box mb={2}>
          <FormControl error={!!errors.password} fullWidth variant="outlined">
            <Box sx={{ mb: 1 }}>
              <label htmlFor="password">
                <Typography variant="body1">Password</Typography>
              </label>
            </Box>

            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <OutlinedInput
                  disabled={isPending}
                  size="small"
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

        <LoadingButton
          className="shadow"
          disabled={isPending}
          fullWidth
          loading={isPending}
          loadingPosition="start"
          size="large"
          startIcon={<VpnKeyIcon />}
          type="submit"
          variant="contained"
        >
          Login
        </LoadingButton>
      </form>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Card>
  );
};

export default Login;
