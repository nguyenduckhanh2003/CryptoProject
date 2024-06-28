import React, { useState, useEffect } from "react";
import { Box, Typography, useTheme, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../theme";
import RestoreFromTrashOutlinedIcon from "@mui/icons-material/RestoreFromTrashOutlined";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import Header from "../Admin/Header";

const TrashAdv = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [trashData, setTrashData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrashData = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/api/v1/advertisement/advertisement-list/trash",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setTrashData(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTrashData();
  }, []);

  const handleRestore = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/advertisement/recover-ads/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      setTrashData((prevData) => prevData.filter((item) => item.id !== id));
    } catch (error) {
      setError(error.message);
      console.error("Error restoring advertisement:", error);
    }
  };

  const handlePermanentDelete = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/advertisement/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      setTrashData((prevData) => prevData.filter((item) => item.id !== id));
    } catch (error) {
      setError(error.message);
      console.error("Error permanently deleting advertisement:", error);
    }
  };
    const processedData = trashData.map(item => ({
        ...item,
        cryptoUserDisplayName: item.cryptoUser ? item.cryptoUser.displayName : 'N/A'
    }));
  const trashColumns = [
    { field: "id", headerName: "ID" },
    {
      field: "siteName",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    { field: "title", headerName: "Title", flex: 1 },
    { field: "linkToOrigin", headerName: "Link", flex: 1 },
    { field: "startDate", headerName: "Start Date", flex: 1 },
    { field: "endDate", headerName: "End Date", flex: 1 },
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
    { field: "fileType", headerName: "File Type", flex: 1 },
    { field: "priority", headerName: "Priority", flex: 1 },
    // {
    //   field: "isInGarbage",
    //   headerName: "Garbage",
    //   flex: 1,
    //   renderCell: ({ row }) => (
    //     <Typography>{row.isInGarbage ? "True" : "False"}</Typography>
    //   ),
    // },
    { field: "costPerClick", headerName: "Per Click", flex: 1 },
    { field: "costPerView", headerName: "View", flex: 1 },
    { field: "duration", headerName: "Duration", flex: 1 },
    { field: "cryptoUserDisplayName", headerName: "User Name", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: ({ row }) => (
        <Box display="flex" justifyContent="center" alignItems="center">
          <IconButton color="primary" onClick={() => handleRestore(row.id)}>
            <RestoreFromTrashOutlinedIcon />
          </IconButton>
          <IconButton
            color="secondary"
            onClick={() => handlePermanentDelete(row.id)}
          >
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
      <Header title="TRASH" subtitle="Managing Trashed Advertisements" />
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
            rows={processedData}
          // rows={trashData.filter((item) => item.isInGarbage)}
          columns={trashColumns}
          pageSize={5}
          rowsPerPageOptions={[5]}
        />
      </Box>
    </Box>
  );
};

export default TrashAdv;
