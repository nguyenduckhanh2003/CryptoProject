import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  useTheme,
  IconButton,
  Modal,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../theme";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import RestoreFromTrashOutlinedIcon from "@mui/icons-material/RestoreFromTrashOutlined";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import Header from "../Admin/Header";
import CampaignIcon from "@mui/icons-material/Campaign";

const Team = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [teamData, setTeamData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/api/v1/users/list-of-users",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        const data = await response.json();
        console.log(data);
        console.log("Fetched data:", data);

        let userDataArray = [];

        if (data.value && Array.isArray(data.value)) {
          userDataArray = data.value.map((user) => ({
            ...user,
            isDeleted: false, // Thêm trạng thái isDeleted
          }));
        } else {
          throw new Error(
            "Data is not an array and does not contain a users array"
          );
        }

        const transformedData = userDataArray.map((user) => ({
          ...user,
        }));
        setTeamData(transformedData);
      } catch (error) {
        setError(error.message);
        console.error("Error fetching team data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleEdit = (id) => {
    const userToEdit = teamData.find((user) => user.id === id);
    setEditingUser(userToEdit);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setEditingUser(null);
    setOpenModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/users/change-profile/${editingUser.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(editingUser),
        }
      );
      setTeamData(
        teamData.map((user) =>
          user.id === editingUser.id ? editingUser : user
        )
      );
      handleCloseModal();
      setEditingUser(null);
    } catch (error) {
      setError(error.message);
      console.error("Error saving user:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      //api delete user
      const response = await fetch(
        `http://localhost:8000/api/v1/users/deactivate-user/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ id }),
        }
      );
      const updatedTeamData = teamData.filter((user) => user.id !== id);
      setTeamData(updatedTeamData);
    } catch (error) {
      setError(error.message);
      console.error("Error delete user:", error);
    }

    /*Add api delete*/
  };

  const columns = [
    {
      field: "id",
      headerName: "ID",
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
      renderCell: ({ row }) => (
        <Box
          width="60%"
          m="0 auto"
          p="5px"
          display="flex"
          justifyContent="center"
          alignItems="center"
          backgroundColor={
            row.role === "ADMIN"
              ? colors.greenAccent[600]
              : row.role === "MANAGER"
                ? colors.greenAccent[700]
                : colors.greenAccent[700]
          }
          borderRadius="4px"
        >
          {row.role === "ADMIN" && <AdminPanelSettingsOutlinedIcon />}
          {row.role === "ADVERTISER" && <CampaignIcon />}
          {row.role === "FOLLOWER" && <LockOpenOutlinedIcon />}
          <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
            {row.role}
          </Typography>
        </Box>
      ),
    },
    {
      field: "isActive",
      headerName: "Status",
      flex: 1,
      renderCell: ({ row }) => (
        <Typography>{row.isActive ? "Active" : "DeActive"}</Typography>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: ({ row }) => (
        <Box display="flex" justifyContent="center" alignItems="center">
          <IconButton color="primary" onClick={() => handleEdit(row.id)}>
            <EditOutlinedIcon />
          </IconButton>
          {row.role !== "ADMIN" && (
            <IconButton color="secondary" onClick={() => handleDelete(row.id)}>
              <DeleteOutlineOutlinedIcon display="flex" />
            </IconButton>
          )}
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
        <DataGrid
          rows={teamData.filter((user) => user.isActive)}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
        />
      </Box>
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2">
            Edit User
          </Typography>
          <TextField
            label="Name"
            name="displayName"
            value={editingUser?.displayName || ""}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Gender"
            name="gender"
            value={editingUser?.gender || ""}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            select
          >
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </TextField>
          <TextField
            label="Email"
            name="email"
            value={editingUser?.email || ""}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Role"
            name="role"
            value={editingUser?.role || ""}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            select
          >
            <MenuItem value="ADMIN">Admin</MenuItem>
            <MenuItem value="ADVERTISER">Advertiser</MenuItem>
            <MenuItem value="FOLLOWER">Follower</MenuItem>
          </TextField>
          <Button
            onClick={handleSave}
            color="primary"
            variant="contained"
            fullWidth
          >
            Save
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default Team;
