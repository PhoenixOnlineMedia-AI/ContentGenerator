import { useEffect, useState } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container
} from '@mui/material';
import {
  Add as AddIcon,
  Description as DescriptionIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import dashboardService from '../../services/dashboardService';

interface DashboardStats {
  totalContent: number;
  creditsUsed: number;
  recentContent: any[];
}

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalContent: 0,
    creditsUsed: 0,
    recentContent: []
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [dashboardStats, recentContent, creditInfo] = await Promise.all([
          dashboardService.getDashboardStats(),
          dashboardService.getRecentContent(),
          dashboardService.getCreditBalance()
        ]);

        setStats({
          totalContent: dashboardStats.totalContent || 0,
          creditsUsed: creditInfo.creditsUsed || 0,
          recentContent: recentContent || []
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Welcome Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h4" gutterBottom>
              Welcome back, {user?.name}!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              You have {user?.credits} credits remaining
            </Typography>
          </Paper>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/content/new')}
              >
                New Content
              </Button>
              <Button
                variant="outlined"
                startIcon={<TrendingUpIcon />}
                onClick={() => navigate('/analytics')}
              >
                View Analytics
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Statistics */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Statistics
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Card>
                  <CardContent>
                    <Typography color="text.secondary" gutterBottom>
                      Total Content
                    </Typography>
                    <Typography variant="h4">
                      {stats.totalContent}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6}>
                <Card>
                  <CardContent>
                    <Typography color="text.secondary" gutterBottom>
                      Credits Used
                    </Typography>
                    <Typography variant="h4">
                      {stats.creditsUsed}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Recent Content */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Content
            </Typography>
            {stats.recentContent.length > 0 ? (
              stats.recentContent.map((content: any) => (
                <Card key={content._id} sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="h6">{content.title}</Typography>
                    <Typography color="text.secondary">
                      {new Date(content.createdAt).toLocaleDateString()}
                    </Typography>
                    <Button
                      startIcon={<DescriptionIcon />}
                      onClick={() => navigate(`/content/${content._id}`)}
                      sx={{ mt: 1 }}
                    >
                      View Content
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Typography color="text.secondary">
                No content created yet. Start by creating your first piece!
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
