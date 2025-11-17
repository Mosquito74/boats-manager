import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useEffect } from 'react';
import type { Boat } from '../../features/api/Boat.ts';

interface BoatFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Boat, 'id'>) => void;
  loading?: boolean;
  initialData?: Omit<Boat, 'id'>;
  isEditing?: boolean;
}

type BoatFormData = Omit<Boat, 'id'>;

export const BoatFormModal = ({ 
  open, 
  onClose, 
  onSubmit, 
  loading = false, 
  initialData, 
  isEditing = false 
}: BoatFormModalProps) => {
  const { control, handleSubmit, reset } = useForm<BoatFormData>();

  useEffect(() => {
    if (open) {
      reset({
        name: '',
        description: '',
        type: '',
        length: undefined,
        make: '',
        launchYear: undefined,
        ...initialData
      });
    }
  }, [open, initialData, reset]);

  const handleFormSubmit = (data: BoatFormData) => {
    onSubmit(data);
    if (!isEditing) {
      reset();
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEditing ? 'Edit Boat' : 'Add New Boat'}</DialogTitle>
      <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2}>
            <Controller
              name="name"
              control={control}
              rules={{
                required: 'Name is required',
                maxLength: {
                  value: 100,
                  message: 'Name must be less than 100 characters'
                }
              }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Boat Name"
                  fullWidth
                  margin="normal"
                  required
                  error={!!error}
                  helperText={error?.message}
                  inputProps={{
                    maxLength: 100
                  }}
                />
              )}
            />
            
            <Controller
              name="description"
              control={control}
              rules={{
                maxLength: {
                  value: 999,
                  message: 'Description must be less than 1000 characters'
                }
              }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Description"
                  fullWidth
                  margin="normal"
                  multiline
                  rows={3}
                  error={!!error}
                  helperText={error?.message}
                  inputProps={{
                    maxLength: 1000
                  }}
                />
              )}
            />
            
            <Box display="flex" gap={2}>
              <Controller
                name="type"
                control={control}
                rules={{
                  maxLength: {
                    value: 50,
                    message: 'Type must be less than 50 characters'
                  }
                }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    label="Type"
                    fullWidth
                    margin="normal"
                    error={!!error}
                    helperText={error?.message}
                    inputProps={{
                      maxLength: 50
                    }}
                  />
                )}
              />
              
              <Controller
                name="length"
                control={control}
                rules={{
                  min: {
                    value: 0,
                    message: 'Length must be a positive number'
                  }
                }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    label="Length (ft)"
                    type="number"
                    fullWidth
                    margin="normal"
                    error={!!error}
                    helperText={error?.message}
                    value={field.value ?? ''}
                    onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                    inputProps={{
                      min: 0,
                      step: '0.01'
                    }}
                  />
                )}
              />
            </Box>
            
            <Box display="flex" gap={2}>
              <Controller
                name="make"
                control={control}
                rules={{
                  maxLength: {
                    value: 50,
                    message: 'Make must be less than 50 characters'
                  }
                }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    label="Make"
                    fullWidth
                    margin="normal"
                    error={!!error}
                    helperText={error?.message}
                    inputProps={{
                      maxLength: 50
                    }}
                  />
                )}
              />
              
              <Controller
                name="launchYear"
                control={control}
                rules={{
                  min: {
                    value: 1400,
                    message: 'Year must be 1400 or later'
                  },
                  max: {
                    value: new Date().getFullYear() + 1,
                    message: `Year cannot be in the future (max ${new Date().getFullYear() + 1})`
                  }
                }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    label="Year"
                    type="number"
                    fullWidth
                    margin="normal"
                    error={!!error}
                    helperText={error?.message}
                    value={field.value ?? ''}
                    onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                    inputProps={{
                      min: 1400,
                      max: new Date().getFullYear() + 1
                    }}
                  />
                )}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
