import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Topbar from "../Admin/TopBar";
import Sidebar from "../Admin/SlideBar";
import Team from "../Admin/ActionsUser";
import Form from "../Admin/Form";

import '../css/Admin.css';
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "../theme";
import Trash from "../Admin/Trash.jsx";

function Admin() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar isSidebar={isSidebar} />
          <main className="content">
            <Topbar setIsSidebar={setIsSidebar} />
            <Routes>
              <Route path="/" element={<Navigate to="/admin/team" />} /> 
              <Route path="/team" element={<Team />} />
              <Route path="/form" element={<Form />} />
              <Route path="/trash" element={<Trash />} />
              <Route path="*" element={<Navigate to="/admin/team" />} />

            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default Admin;
