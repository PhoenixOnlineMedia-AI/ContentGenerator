import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Alert,
  Link,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { FormInput } from '../../components/shared/FormFields';
import authService from '../../services/authService';

const schema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
}).required();

const Register = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState('');
  const [registrationComplete, setRegistrationComplete] = useState(false);
  
  const { control, handleSubmit, formState: { isSubmitting } } = useForm({
    resolver: yupResolver(schema)
  });

  const steps = ['Account Details', 'Email Verification'];

  const onSubmit = async (data: any) => {
    try {
      setError('');
      await authService.register({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      setRegistrationComplete(true);
      setActiveStep(1);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            Create Account
          </Typography>

          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {registrationComplete ? (
            <Box>
              <Alert severity="success" sx={{ mb: 2 }}>
                Registration successful! Please check your email to verify your account.
              </Alert>
              <Button
                fullWidth
                variant="contained"
                onClick={() => navigate('/login')}
                sx={{ mt: 2 }}
              >
                Go to Login
              </Button>
            </Box>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              <FormInput
                name="name"
                control={control}
                label="Full Name"
              />
              <FormInput
                name="email"
                control={control}
                label="Email"
                type="email"
              />
              <FormInput
                name="password"
                control={control}
                label="Password"
                type="password"
              />
              <FormInput
                name="confirmPassword"
                control={control}
                label="Confirm Password"
                type="password"
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isSubmitting}
                sx={{ mt: 3, mb: 2 }}
              >
                {isSubmitting ? 'Creating Account...' : 'Create Account'}
              </Button>

              <Box sx={{ textAlign: 'center' }}>
                <Link href="/login" variant="body2">
                  Already have an account? Sign In
                </Link>
              </Box>
            </form>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;
