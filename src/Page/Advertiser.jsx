import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Topbar from "../Admin/TopBar";
import Sidebar from "../Advertiser/SlideBar";
import Form from "../Advertiser/Form.jsx";
import Items  from "../Advertiser/ActionsAdvertiser.jsx";
import '../css/Admin.css';
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "../theme";
import TrashAdv from "../Advertiser/TrashAdv.jsx";
import Dashboard from "../Advertiser/Dashboard.jsx";



function Advertiser() {
    const [theme, colorMode] = useMode();
    const [isSidebar, setIsSidebar] = useState(true);

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <div className="app">
                    <Sidebar isSidebar={isSidebar}/>
                    <main className="content">
                        <Topbar setIsSidebar={setIsSidebar} />
                        <Routes>
                            <Route path="/" element={<Navigate to="/adv/dashboard" />} />
                            <Route path="/items" element={<Items/>} />
                            <Route path="/form" element={<Form />} />
                            <Route path="/trash" element={<TrashAdv />} />
                            <Route path="/dashboard" element={<Dashboard/>} />
                            <Route path="*" element={<Navigate to="/adv/dashboard" />} />

                        </Routes>
                    </main>
                </div>
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
}

export default Advertiser;
