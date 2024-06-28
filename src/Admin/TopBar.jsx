import { Box, IconButton, useTheme } from "@mui/material";
import { useState, useContext, useEffect } from "react";
import { ColorModeContext, tokens } from "../theme";
import 'bootstrap-icons/font/bootstrap-icons.css';
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { getCookies, deleteCookie } from "../Helps/Cookies";
import { useNavigate } from "react-router-dom";

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const Navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [logout, setLogout] = useState(false);

  useEffect(() => {
    const roles = getCookies('role');
    setRole(roles);
  }, [])

  const handleLogout = () => {
    deleteCookie('role');
    setRole(null);
    window.location.reload();
    Navigate('/crypto');
  }

  const showHiddenChange = () => {
    setLogout(!logout);
  };

  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      <Box
        display="flex"
        backgroundColor={colors.primary[400]}
        borderRadius="3px"
      >
        <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
        <IconButton type="button" sx={{ p: 1 }}>
          <SearchIcon />
        </IconButton>
      </Box>

      {/* ICONS */}
      <Box display="flex" alignItems="center">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <LightModeOutlinedIcon />
          ) : (
            <DarkModeOutlinedIcon />
          )}
        </IconButton>
        <Box position="relative">
          <IconButton onClick={showHiddenChange}>
            <SettingsOutlinedIcon />
          </IconButton>
          {logout && (
            <Box
              position="absolute"
              top="100%"
              right={0}
              mt={1}
              bgcolor={colors.primary[400]}
              boxShadow={3}
              borderRadius="3px"
              zIndex={1}
            >
              <Box
                className="dropdown-item"
                onClick={handleLogout}
                display="flex"
                alignItems="center"
                p={1}
                sx={{ cursor: 'pointer' }}
              >
                <i className="bi bi-box-arrow-right" style={{ marginRight: 8 }}></i>
                Logout
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Topbar;
