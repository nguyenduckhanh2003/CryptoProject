import React, { useState, useEffect } from "react";
import { Box, Typography, useTheme, IconButton, Modal, TextField, Button, MenuItem } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../theme";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import RestoreFromTrashOutlinedIcon from "@mui/icons-material/RestoreFromTrashOutlined";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import Header from "../Admin/Header";
import CampaignIcon from '@mui/icons-material/Campaign';

const Trash = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [trashData, setTrashData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingUser, setEditingUser] = useState(null);
    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:8000/api/v1/users/list-of-users", {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });

                const data = await response.json();
                console.log(data);
                console.log("Fetched data:", data);

                let userDataArray = [];

                if (data.value && Array.isArray(data.value)) {
                    userDataArray = data.value.map(user => ({
                        ...user,
                        isDeleted: false, // Thêm trạng thái isDeleted
                    }));
                } else {
                    throw new Error("Data is not an array and does not contain a users array");
                }

                const transformedData = userDataArray.map(user => ({
                    ...user,
                }));
                setTrashData(transformedData);
            } catch (error) {
                setError(error.message);
                console.error("Error fetching team data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);



    const handleCloseModal = () => {
        setEditingUser(null);
        setOpenModal(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditingUser(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };





    const handleRestore = async (id) => {

        try {
            //api delete user
            const response = await fetch(`http://localhost:8000/api/v1/users/activate-user/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ id }),
            });
            const updatedTrashData = trashData.filter(user => user.id !== id);
            setTrashData(updatedTrashData);


        } catch (error) {
            setError(error.message);
            console.error("Error delete user:", error);
        }

    };

    const handlePermanentDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:8000/api/v1/users/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            setTrashData(trashData.filter((user) => user.id !== id));
        } catch (error) {
            setError(error.message);
            console.error("Error deleting user:", error);
        }
    };


    const trashColumns = [
        {
            field: "id",
            headerName: "ID"
        },
        {
            field: "displayName",
            headerName: "Name",
            flex: 1,
            cellClassName: "name-column--cell",
        },
        {
            field: "gender",
            headerName: "Gender",
            flex: 1,
        },
        {
            field: "email",
            headerName: "Email",
            flex: 1,
        },
        {
            field: "role",
            headerName: "Role",
            flex: 1,
        },
        {
            field: "isActive",
            headerName: "Status",
            flex: 1,
            renderCell: ({ row }) => (
                <Typography>
                    {row.isActive ? "Active" : "DeActive"}
                </Typography>
            ),
        },
        {
            field: "actions",
            headerName: "Actions",
            flex: 1,
            renderCell: ({ row }) => (
                <Box display="flex" justifyContent="center" alignItems="center">
                    <IconButton color="primary" onClick={() => handleRestore(row.id)}>
                        <RestoreFromTrashOutlinedIcon />
                    </IconButton>
                    <IconButton color="secondary" onClick={() => handlePermanentDelete(row.id)}>
                        <DeleteForeverOutlinedIcon />
                    </IconButton>
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
        <Box m="20px">
            <Header title="USERS" subtitle="Managing the Users" />
            <Box
                m="40px 0 0 0"
                height="75vh"
                sx={{
                    "& .MuiDataGrid-root": {
                        border: "none",
                    },
                    "& .MuiDataGrid-cell": {
                        borderBottom: "none",
                    },
                    "& .name-column--cell": {
                        color: colors.greenAccent[300],
                    },
                    "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: colors.blueAccent[700],
                        borderBottom: "none",
                    },
                    "& .MuiDataGrid-virtualScroller": {
                        backgroundColor: colors.primary[400],
                    },
                    "& .MuiDataGrid-footerContainer": {
                        borderTop: "none",
                        backgroundColor: colors.blueAccent[700],
                    },
                    "& .MuiCheckbox-root": {
                        color: `${colors.greenAccent[200]} !important`,
                    },
                }}
            >

                <Typography variant="h4" sx={{ mt: 2 }}>
                    Trash
                </Typography>
                <DataGrid
                    rows={trashData.filter((user) => !user.isActive)}
                    columns={trashColumns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                />
            </Box>

        </Box>
    )
};

export default Trash;
