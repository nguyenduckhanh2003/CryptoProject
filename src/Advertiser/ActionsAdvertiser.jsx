import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    IconButton,
    Modal,
    TextField,
    Button,
    MenuItem,
    Menu,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ReplayIcon from '@mui/icons-material/Replay';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Header from '../Admin/Header';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';


const Items = () => {
    const [itemData, setItemData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingUser, setEditingUser] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [openRepostModal, setOpenRepostModal] = useState(false);
    const [repostingUser, setRepostingUser] = useState(null);
    const [anchorEl, setAnchorEl] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    'http://localhost:8000/api/v1/advertisement/advertisement-list/true',
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        credentials: 'include',
                    }
                );

                if (!response.ok) {
                    throw new Error(`Error: ${response.status} ${response.statusText}`);
                }

                const data = await response.json();
                setItemData(data);
                setLoading(false);
console.log(data)
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleEdit = (id) => {
        const userToEdit = itemData.find((user) => user.id === id);

        // Convert startDate and endDate to string in 'YYYY-MM-DD' format
        const formattedUser = {
            ...userToEdit,
            startDate: userToEdit.startDate.substring(0, 10), // assuming startDate is in ISO format
            endDate: userToEdit.endDate.substring(0, 10), // assuming endDate is in ISO format
        };

        setEditingUser(formattedUser);
        setOpenModal(true);
    };

    const handleRepost = (id) => {
        const userToRepost = itemData.find((user) => user.id === id);
        setRepostingUser(userToRepost);
        setOpenRepostModal(true);
    };

    const handleViewDetails = (id) => {
        navigate(`/adv/detail/${id}`);
    };

    const handleCloseModal = () => {
        setEditingUser(null);
        setRepostingUser(null);
        setOpenModal(false);
        setOpenRepostModal(false);
    };

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            setEditingUser((prevState) => ({
                ...prevState,
                [name]: files[0],
            }));
        } else {
            setEditingUser((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        }
    };

    const handleSave = async () => {
        try {
            console.log(editingUser)
            const { cryptoAdvertisementStatistic, cryptoUser, ...editData } = editingUser;
            const response = await fetch(
                `http://localhost:8000/api/v1/advertisement/advertisement/${editingUser.id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify(editData),
                }
            );
            const data = await response;
            console.log(data)
            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }

            // Update itemData state with edited user
            setItemData(
                itemData.map((itemAdv) =>
                    itemAdv.id === editingUser.id ? editingUser : itemAdv
                )
            );



            // Close modal and reset state
            handleCloseModal();
        } catch (error) {
            setError(error.message);
            console.error("Error saving user:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(
                `http://localhost:8000/api/v1/advertisement/temporarily-delete-ads/${id}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({ id }),
                }
            );

            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }

            const updatedItemData = itemData.filter((user) => user.id !== id);
            setItemData(updatedItemData);
        } catch (error) {
            setError(error.message);
            console.error('Error deleting user:', error);
        }
    };

    const repostValidationSchema = yup.object().shape({
        startDate: yup.date().required('Start Date is required'),
        endDate: yup
            .date()
            .min(yup.ref('startDate'), "End Date can't be before Start Date")
            .required('End Date is required'),
        priority: yup.string().required('Priority is required'),
    });

    const handleRepostSave = async ({ id, startDate, endDate, priority }) => {
        try {
            console.log(itemData)
            const ads = itemData.find((ads) => ads.id == id);
            console.log(ads);

            const { cryptoAdvertisementStatistic, cryptoUser,id, ...createdData } = ads;
            const response = await fetch(
                `http://localhost:8000/api/v1/advertisement/create-advertisement/${id}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({...createdData, startDate, endDate, priority }),
                }
            );

            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }

            // Close modal and reset state
            handleCloseModal();

            // // Fetch updated data
            // fetchData();
        } catch (error) {
            setError(error.message);
            console.error("Error reposting ad:", error);
        }
    };

    const handleMenuClick = (event, id) => {
        setAnchorEl((prevAnchorEl) => ({
            ...prevAnchorEl,
            [id]: event.currentTarget,
        }));
    };

    const handleMenuClose = (id) => {
        setAnchorEl((prevAnchorEl) => ({
            ...prevAnchorEl,
            [id]: null,
        }));
    };
    const processedData = itemData.map(item => ({
        ...item,
        cryptoUserDisplayName: item.cryptoUser ? item.cryptoUser.displayName : 'N/A'
    }));
    const columns = [
        { field: 'id', headerName: 'ID', flex: 1 },
        { field: 'siteName', headerName: 'Name', flex: 1 },
        { field: 'title', headerName: 'Title', flex: 1 },
        { field: 'linkToOrigin', headerName: 'Link', flex: 1 },
        { field: 'startDate', headerName: 'Start Date', flex: 1 },
        { field: 'endDate', headerName: 'End Date', flex: 1 },
        { field: 'mediaFile', headerName: 'File', flex: 1, renderCell: (params) => {
                const mediaFile = params.row.mediaFile;
                const isVideo =
                    mediaFile.endsWith('.mp4') ||
                    mediaFile.endsWith('.webm') ||
                    mediaFile.endsWith('.ogg');
                return isVideo ? (
                    <video width="100" controls>
                        <source src={mediaFile} type="video/mp4" />
                        <source src={mediaFile} type="video/webm" />
                        <source src={mediaFile} type="video/ogg" />
                        Your browser does not support the video tag.
                    </video>
                ) : (
                    <img
                        src={mediaFile}
                        alt="media"
                        style={{ width: '100px', height: 'auto' }}
                    />
                );
            } },
        { field: 'fileType', headerName: 'File Type', flex: 1 },
        { field: 'priority', headerName: 'Priority', flex: 1 },
        { field: 'costPerClick', headerName: 'Per Click', flex: 1 },
        { field: 'costPerView', headerName: 'View', flex: 1 },
        { field: 'duration', headerName: 'Duration', flex: 1 },
        {
            field: 'cryptoUserDisplayName', // Assuming 'userName' is a property inside 'cryptoUser'
            headerName: 'User Name',
            flex: 1
        },
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 1,
            renderCell: ({ row }) => (
                <Box display="flex" justifyContent="center" alignItems="center">
                    <IconButton aria-label="more" onClick={(event) => handleMenuClick(event, row.id)}>
                        <MoreVertIcon />
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl[row.id]}
                        open={Boolean(anchorEl[row.id])}
                        onClose={() => handleMenuClose(row.id)}
                    >
                        <MenuItem onClick={() => { handleEdit(row.id); handleMenuClose(row.id); }}>
                            <EditOutlinedIcon /> Edit
                        </MenuItem>
                        <MenuItem onClick={() => { handleDelete(row.id); handleMenuClose(row.id); }}>
                            <DeleteOutlineOutlinedIcon /> Delete
                        </MenuItem>
                        {new Date(row.endDate) <= new Date() && (
                            <MenuItem onClick={() => { handleRepost(row.id); handleMenuClose(row.id); }}>
                                <ReplayIcon /> Repost
                            </MenuItem>
                        )}
                        <MenuItem onClick={() => { handleViewDetails(row.id); handleMenuClose(row.id); }}>
                            <VisibilityIcon /> View Details
                        </MenuItem>
                    </Menu>
                </Box>
            ),
        },
    ];

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    if (error) {
        return <Typography>Error: {error}</Typography>;
    }

    return (
        <Box m={4}>
            <Header title="ADVERTISER MANAGE" subtitle="List of Items" />
            <Box mt={4} height="75vh" width="100%">
                <DataGrid rows={processedData} columns={columns} pageSize={10} />
            </Box>

            <Modal open={openModal} onClose={handleCloseModal}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 500,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px',
                    }}
                >
                    <Typography variant="h6">Edit Ad</Typography>
                    {editingUser && (
                        <>
                            <TextField
                                label="Name"
                                name="siteName"
                                value={editingUser.siteName}
                                onChange={handleInputChange}
                                fullWidth
                            />
                            <TextField
                                label="Title"
                                name="title"
                                value={editingUser.title}
                                onChange={handleInputChange}
                                fullWidth
                            />
                            <TextField
                                label="Link"
                                name="linkToOrigin"
                                value={editingUser.linkToOrigin}
                                onChange={handleInputChange}
                                fullWidth
                            />
                            <TextField
                                label="Priority"
                                name="priority"
                                value={editingUser.priority}
                                onChange={handleInputChange}
                                fullWidth
                            />
                            <TextField
                                label="Start Date"
                                name="startDate"
                                type="date"
                                value={editingUser.startDate}
                                onChange={handleInputChange}
                                fullWidth
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                            <TextField
                                label="End Date"
                                name="endDate"
                                type="date"
                                value={editingUser.endDate}
                                onChange={handleInputChange}
                                fullWidth
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                            <TextField
                                label="Duration"
                                name="duration"
                                value={editingUser.duration}
                                onChange={handleInputChange}
                                fullWidth
                            />
                            {/*<TextField*/}
                            {/*    label="Upload File"*/}
                            {/*    name="file"*/}
                            {/*    type="file"*/}
                            {/*    onChange={handleInputChange}*/}
                            {/*    InputLabelProps={{*/}
                            {/*        shrink: true,*/}
                            {/*    }}*/}
                            {/*    fullWidth*/}
                            {/*/>*/}

                            <Button onClick={handleSave} color="primary"
                                    variant="contained"
                                    fullWidth >Save</Button>
                        </>
                    )}
                </Box>
            </Modal>

            <Modal open={openRepostModal} onClose={handleCloseModal}>
                <Formik
                    initialValues={{
                        startDate: '',
                        endDate: '',
                        priority: '',
                    }}
                    validationSchema={repostValidationSchema}
                    onSubmit={(values) => {
                        handleRepostSave({ id: repostingUser.id, ...values });
                    }}
                >
                    {({ values, errors, handleChange, handleSubmit }) => (
                        <Box
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: 500,
                                bgcolor: 'background.paper',
                                boxShadow: 24,
                                p: 4,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '16px',
                            }}
                        >
                            <Typography variant="h6">Repost Ad</Typography>
                            <TextField
                                label="ID"
                                name="id"
disabled={true}
                                value={values.id}
                                onChange={handleChange}
                                error={Boolean(errors.id)}
                                helperText={errors.id}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                            <TextField
                                label="Start Date"
                                name="startDate"
                                type="date"
                                value={values.startDate}
                                onChange={handleChange}
                                error={Boolean(errors.startDate)}
                                helperText={errors.startDate}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                            <TextField
                                label="End Date"
                                name="endDate"
                                type="date"
                                value={values.endDate}
                                onChange={handleChange}
                                error={Boolean(errors.endDate)}
                                helperText={errors.endDate}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                            <TextField
                                label="Priority"
                                name="priority"
                                value={values.priority}
                                onChange={handleChange}
                                error={Boolean(errors.priority)}
                                helperText={errors.priority}
                                fullWidth
                            />

                            <Button onClick={handleSubmit}>Repost</Button>
                        </Box>
                    )}
                </Formik>
            </Modal>
        </Box>
    );
};

export default Items;
