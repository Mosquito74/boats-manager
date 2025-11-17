import {Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Typography} from '@mui/material';

import boatImage from '../../../src/assets/boat.png';
import {useGetBoatByIdQuery} from '../../features/api/boatApi.ts';

interface BoatDetailsModalProps {
    open: boolean;
    boatId: number | null;
    onClose: () => void;
}

export const BoatDetailsModal = ({open, boatId, onClose}: BoatDetailsModalProps) => {
    const { data: boat, isLoading, isError } = useGetBoatByIdQuery(boatId?.toString() || '', {
        skip: !boatId,
    });

    if (!boatId) return null;
    if (isLoading) return <CircularProgress />;
    if (isError || !boat) return <div>Error loading boat details</div>;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <Box flexGrow={1}>
                    {boat.name}
                </Box>
                <Box
                    component="img"
                    src={boatImage}
                    alt="Boat"
                    sx={{
                        width: 64,
                        height: 64,
                        objectFit: 'contain'
                    }}
                />
            </DialogTitle>
            <DialogContent>
                <Box display="flex" flexDirection="column" gap={3}>
                    <Box>
                        <Typography variant="body1" color="text.secondary">
                            {boat.description}
                        </Typography>
                    </Box>

                    <Divider sx={{my: 2}}/>

                    <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(150px, 1fr))" gap={2}>
                        {boat.type && (
                            <Box>
                                <Typography variant="caption" color="text.secondary">Type</Typography>
                                <Typography>{boat.type}</Typography>
                            </Box>
                        )}
                        {boat.make && (
                            <Box>
                                <Typography variant="caption" color="text.secondary">Make</Typography>
                                <Typography>{boat.make}</Typography>
                            </Box>
                        )}
                        {boat.launchYear && (
                            <Box>
                                <Typography variant="caption" color="text.secondary">Year</Typography>
                                <Typography>{boat.launchYear}</Typography>
                            </Box>
                        )}
                        {boat.length && (
                            <Box>
                                <Typography variant="caption" color="text.secondary">Length (ft)</Typography>
                                <Typography>{boat.length}</Typography>
                            </Box>
                        )}
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};
