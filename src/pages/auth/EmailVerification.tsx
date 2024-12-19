import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import authService from '../../services/authService';

const EmailVerification = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        await authService.verifyEmail(token!);
        setTimeout(() => {
          navigate('/login', { 
            state: { message: 'Email verified successfully! You can now login.' }
          });
        }, 3000);
      } catch (err) {
        setError('Failed to verify email. The link may be expired or invalid.');
      } finally {
        setVerifying(false);
      }
    };

    if (token) {
      verifyEmail();
    }
  }, [token, navigate]);

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            Email Verification
          </Typography>

          {verifying ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          ) : (
            <Alert severity="success" sx={{ mt: 2 }}>
              Email verified successfully! Redirecting to login...
            </Alert>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default EmailVerification;