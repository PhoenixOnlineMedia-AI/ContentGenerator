import { AppBar, Toolbar, Typography, IconButton, Avatar } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const { user } = useAuth();

  return (
    <AppBar position="fixed">
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          AI Content Generator
        </Typography>
        <IconButton color="inherit">
          <Avatar>{user?.name?.[0]}</Avatar>
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;