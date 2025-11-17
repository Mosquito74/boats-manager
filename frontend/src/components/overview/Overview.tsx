import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Tooltip,
    Typography,
    useTheme
} from '@mui/material';
import {Delete as DeleteIcon, Edit as EditIcon} from '@mui/icons-material';
import {useMemo, useState} from 'react';
import { toast } from 'react-hot-toast';
import { useCreateBoatMutation, useDeleteBoatMutation, useGetBoatByIdQuery, useGetBoatsQuery, useUpdateBoatMutation } from '../../features/api/boatApi';
import type {Boat} from '../../features/api/Boat';
import {BoatDetailsModal} from '../boat/BoatDetailsModal.tsx';
import {BoatFormModal} from '../boat/BoatFormModal.tsx';

const Overview = () => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [boatToEdit, setBoatToEdit] = useState<Boat | null>(null);
    const [createBoat, { isLoading: isCreating }] = useCreateBoatMutation();
    const [updateBoat, { isLoading: isUpdating }] = useUpdateBoatMutation();
    const { 
        data: boatDetails, 
        isLoading: isLoadingBoatDetails,
    } = useGetBoatByIdQuery(
        boatToEdit?.id?.toString() ?? 'skip',
        { 
            skip: !boatToEdit?.id,
            refetchOnMountOrArgChange: true
        }
    );

    const theme = useTheme();
    const { data: boats = [], isLoading, isError, error } = useGetBoatsQuery();
    const [selectedBoatId, setSelectedBoatId] = useState<number | null>(null);
    const [boatToDelete, setBoatToDelete] = useState<{id: number, name: string} | null>(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [deleteBoat, { isLoading: isDeleting }] = useDeleteBoatMutation();

    const handleDeleteClick = (boat: Boat) => {
        setBoatToDelete({ id: boat.id, name: boat.name });
    };

    const handleConfirmDelete = async () => {
        if (!boatToDelete) return;
        
        const deletePromise = deleteBoat(boatToDelete.id).unwrap();
        
        await toast.promise(deletePromise, {
            loading: `Deleting ${boatToDelete.name}...`,
            success: () => {
                setBoatToDelete(null);
                return `Boat ${boatToDelete.name} deleted successfully`;
            },
            error: (err) => {
                console.error('Failed to delete boat:', err);
                return `Failed to delete boat: ${err?.data?.message || 'Unknown error'}`;
            },
        });
    };

    const handleCancelDelete = () => {
        setBoatToDelete(null);
    };

    const handleBoatClick = (boatId: number) => {
        setSelectedBoatId(boatId);
    };

    const handleCloseModal = () => {
        setSelectedBoatId(null);
    };

    const handleChangePage = (_: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleCreateBoat = async (boatData: Omit<Boat, 'id'>) => {
        const createPromise = createBoat(boatData).unwrap();
        
        await toast.promise(createPromise, {
            loading: 'Creating boat...',
            success: () => {
                setIsAddModalOpen(false);
                return 'Boat created successfully';
            },
            error: (err) => {
                console.error('Failed to create boat:', err);
                return `Failed to create boat: ${err?.data?.message || 'Unknown error'}`;
            },
        });
    };

    const handleEditClick = (boat: Boat) => {
        setBoatToEdit(boat);
        setIsEditModalOpen(true);
    };

    const handleUpdateBoat = async (boatData: Omit<Boat, 'id'>) => {
        if (!boatToEdit) return;
        
        const updatePromise = updateBoat({ id: boatToEdit.id, boat: boatData }).unwrap();
        
        await toast.promise(updatePromise, {
            loading: 'Updating boat...',
            success: () => {
                setIsEditModalOpen(false);
                setBoatToEdit(null);
                return 'Boat updated successfully';
            },
            error: (err) => {
                console.error('Failed to update boat:', err);
                return `Failed to update boat: ${err?.data?.message || 'Unknown error'}`;
            },
        });
    };

    const paginatedBoats = useMemo(() => {
        return boats.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    }, [boats, page, rowsPerPage]);

    if (isLoading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
            >
                <CircularProgress role="progressbar" />
            </Box>
        );
    }

    if (isError) {
        return (
            <Box p={3}>
                <Alert severity="error">
                    Error loading boats: {error?.toString()}
                </Alert>
            </Box>
        );
    }

    return (
        <Box sx={{
            width: '100%',
            backgroundColor: 'background.default',
            p: 3,
            minHeight: 'calc(100vh - 64px)',
            display: 'flex',
            flexDirection: 'column',
            gap: 3
        }}>
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%'
            }}>
                <Typography
                    variant="h3"
                    component="h1"
                    sx={{
                        color: 'primary.main',
                        fontWeight: 700,
                        letterSpacing: '0.5px',
                        textAlign: 'center',
                        m: 0,
                        lineHeight: 1.2
                    }}
                >
                    Boats Overview
                </Typography>
            </Box>

            <Box sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                width: '100%'
            }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setIsAddModalOpen(true)}
                    disabled={isCreating}
                >
                    + Add Boat
                </Button>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                <Paper
                    elevation={3}
                    sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        maxWidth: '1200px',
                        width: '100%',
                        overflow: 'hidden',
                        borderRadius: 2,
                        '&:hover': {
                            boxShadow: 4,
                            transition: 'box-shadow 0.3s ease-in-out'
                        }
                    }}
                >
                    <TableContainer
                        sx={{
                            flex: 1,
                            '&::-webkit-scrollbar': {
                                height: '8px',
                                width: '8px'
                            },
                            '&::-webkit-scrollbar-thumb': {
                                backgroundColor: 'rgba(0,0,0,0.2)',
                                borderRadius: '4px'
                            }
                        }}
                    >
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ width: '10%', fontWeight: 'bold' }} align="right">ID</TableCell>
                                    <TableCell sx={{ width: '60%', fontWeight: 'bold' }}>Boat Name</TableCell>
                                    <TableCell sx={{ width: '30%', fontWeight: 'bold' }} align="center">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paginatedBoats.length > 0 ? (
                                    paginatedBoats.map((boat) => (
                                        <TableRow
                                            hover
                                            key={boat.id}
                                            onClick={() => handleBoatClick(boat.id)}
                                            sx={{
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease-in-out',
                                                '&:nth-of-type(odd)': {
                                                    backgroundColor: theme.palette.background.default,
                                                },
                                                '&:last-child td, &:last-child th': {
                                                    border: 0
                                                },
                                                '&:hover': {
                                                    backgroundColor: theme.palette.action.selected,
                                                    transform: 'translateY(-1px)',
                                                    boxShadow: 1
                                                }
                                            }}
                                        >
                                            <TableCell component="th" scope="row" align="right">
                                                {boat.id}
                                            </TableCell>
                                            <TableCell>{boat.name}</TableCell>
                                            <TableCell align="center">
                                                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                                                    <Tooltip title="Edit">
                                                        <IconButton
                                                            size="small"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleEditClick(boat);
                                                            }}
                                                            color="primary"
                                                        >
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Delete">
                                                        <IconButton
                                                            size="small"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDeleteClick(boat);
                                                            }}
                                                            color="error"
                                                        >
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                                            <Typography variant="body1" color="text.secondary">
                                                No boats found. Add your first boat to get started.
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={boats.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        sx={{
                            borderTop: '1px solid',
                            borderColor: 'divider',
                            '& .MuiTablePagination-toolbar': {
                                minHeight: '56px',
                            },
                            '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                                margin: 0,
                            },
                        }}
                    />
                </Paper>
            </Box>

            {/* Add Boat Modal */}
            <BoatFormModal
                open={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSubmit={handleCreateBoat}
                loading={isCreating}
            />

            {isEditModalOpen && boatToEdit?.id && (
              <BoatFormModal
                  key={`edit-${boatToEdit.id}-${Date.now()}`}
                  open={isEditModalOpen}
                  onClose={() => {
                      setIsEditModalOpen(false);
                      setBoatToEdit(null);
                  }}
                  onSubmit={handleUpdateBoat}
                  initialData={boatDetails}
                  isEditing={true}
                  loading={isUpdating || isLoadingBoatDetails}
              />
            )}

            <BoatDetailsModal
                open={!!selectedBoatId}
                boatId={selectedBoatId}
                onClose={handleCloseModal}
            />

            <Dialog
                open={!!boatToDelete}
                onClose={handleCancelDelete}
                aria-labelledby="delete-dialog-title"
                aria-describedby="delete-dialog-description"
            >
                <DialogTitle id="delete-dialog-title">Delete Boat</DialogTitle>
                <DialogContent>
                    <DialogContentText id="delete-dialog-description">
                        Are you sure you want to delete boat "{boatToDelete?.name}"? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelDelete} color="primary">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirmDelete}
                        color="error"
                        variant="contained"
                        disabled={isDeleting}
                        startIcon={isDeleting ? <CircularProgress size={20} /> : null}
                    >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Overview;