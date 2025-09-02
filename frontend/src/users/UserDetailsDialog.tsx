import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { useGetUserQuery } from '../../__generated__/graphql';

interface UserDetailsProps {
  userId: string;
  open: boolean;
  onClose: () => void;
}

const UserDetailsDealog: React.FC<UserDetailsProps> = ({
  userId,
  open,
  onClose
}) => {
  const { data, loading, error } = useGetUserQuery({
    variables: { id: userId || '' },
    skip: !userId,
  });


  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { width: 400 }
      }}
    >
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          USER DETAILS
        </Typography>
        <Divider sx={{ mb: 2 }} />

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error.message}
          </Alert>
        )}

        {data && (
          <List>
            <ListItem>
              <ListItemText
                primary="Name"
                secondary={data.user.name}
              />
            </ListItem>
            
            <ListItem>
              <ListItemText
                primary="Email"
                secondary={data.user.email}
              />
            </ListItem>
          </List>
        )}
      </Box>
    </Drawer>
  );
};

export default UserDetailsDealog;