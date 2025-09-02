import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box
} from '@mui/material';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  severity?: 'error' | 'warning' | 'info' | 'success';
  loading?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  severity = 'info',
  loading = false
}) => {
  const getColor = () => {
    switch (severity) {
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'success':
        return 'success';
      default:
        return 'primary';
    }
  };

  return (
    <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
      <Box sx={{ p: 2 }}>
        <DialogTitle variant="h6" component="h2">
          {title}
        </DialogTitle>
        
        <DialogContent>
          <DialogContentText>
            {message}
          </DialogContentText>
        </DialogContent>

        <DialogActions sx={{ pt: 2, gap: 1 }}>
          <Button
            onClick={onCancel}
            disabled={loading}
            variant="outlined"
          >
            {cancelText}
          </Button>
          
          <Button
            onClick={onConfirm}
            disabled={loading}
            color={getColor()}
            variant="contained"
            autoFocus
          >
            {confirmText}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default ConfirmDialog;