import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
} from '@mui/material';
import authService from '../../services/authService';

interface ResendVerificationProps {
  open: boolean;
  onClose: () => void;
}

const ResendVerification = ({ open, onClose }: ResendVerificationProps) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await authService.resendVerification(email);
      setStatus('success');
      setTimeout(onClose, 3000);
    } catch (err) {
      setStatus('error');
      setError('Failed to resend verification email');
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Resend Verification Email</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {status === 'success' && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Verification email sent successfully!
            </Alert>
          )}
          {status === 'error' && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            autoFocus
            margin="dense"
            label="Email Address"
            type="email"
            fullWidth
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button 
            type="submit" 
            variant="contained"
            disabled={status === 'loading'}
          >
            Resend
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ResendVerification;
