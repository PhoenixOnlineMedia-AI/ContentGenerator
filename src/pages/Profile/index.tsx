import { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Tab,
  Tabs,
  Alert,
} from '@mui/material';
import ProfileDetails from './ProfileDetails';
import SecuritySettings from './SecuritySettings';
import APIKeys from './APIKeys';
import Preferences from './Preferences';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const Profile = () => {
  const [value, setValue] = useState(0);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleUpdateSuccess = () => {
    setUpdateSuccess(true);
    setTimeout(() => setUpdateSuccess(false), 3000);
  };

  const handleError = (message: string) => {
    setError(message);
    setTimeout(() => setError(''), 3000);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange}>
            <Tab label="Profile Details" />
            <Tab label="Security" />
            <Tab label="API Keys" />
            <Tab label="Preferences" />
          </Tabs>
        </Box>

        {updateSuccess && (
          <Alert severity="success" sx={{ m: 2 }}>
            Profile updated successfully!
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ m: 2 }}>
            {error}
          </Alert>
        )}

        <TabPanel value={value} index={0}>
          <ProfileDetails onSuccess={handleUpdateSuccess} onError={handleError} />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <SecuritySettings onSuccess={handleUpdateSuccess} onError={handleError} />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <APIKeys onSuccess={handleUpdateSuccess} onError={handleError} />
        </TabPanel>
        <TabPanel value={value} index={3}>
          <Preferences onSuccess={handleUpdateSuccess} onError={handleError} />
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default Profile;
