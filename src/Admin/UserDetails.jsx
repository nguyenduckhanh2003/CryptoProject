import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, TextField, Button } from "@mui/material";
import { mockDataTeam } from "../mockData";
function UserDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);

    useEffect(() => {

        const user = mockDataTeam.find((user) => user.id === parseInt(id, 10));
        setUserData(user);
    }, [id]);

    const handleSave = () => {

        console.log("Saving user data:", userData);
        navigate("/team");
    };

    if (!userData) {
        return <div>Loading...</div>;
    }

    return (
        <Box m="20px">
            <TextField label="Name" value={userData.name} onChange={(e) => setUserData({ ...userData, name: e.target.value })} />
            <TextField label="Age" value={userData.age} onChange={(e) => setUserData({ ...userData, age: e.target.value })} />
            <TextField label="Phone Number" value={userData.phone} onChange={(e) => setUserData({ ...userData, phone: e.target.value })} />
            <TextField label="Email" value={userData.email} onChange={(e) => setUserData({ ...userData, email: e.target.value })} />

            <Button variant="contained" onClick={handleSave}>
                Save
            </Button>
        </Box>
    );
}

export default UserDetail;