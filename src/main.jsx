import React from "react";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./Components/Login.jsx";
import Register from "./Components/Register.jsx";
import Navigation from "./Components/Navigation.jsx";
import Crypto from "./Page/Crypto.jsx";
import Trending from "./Page/Trending.jsx";
import Saved from "./Page/Saved.jsx";
import News from "./Page/News.jsx";
import Admin from "./Page/Admin.jsx";
import CryptoCoinDetail from "./Page/CryptoCoinDetail.jsx";
import ChangPasswordUser from "./Components/ChangPasswordUser.jsx";
import EnterNewPassUser from "./Components/EnterNewPassUser.jsx";
import ChangePassForAdevertiser from "./Components/ChangePassForAdevertiser.jsx";
import ProtectedRoute from "./ProtectAuth/ProtectedRoute.jsx";
import { AuthProvider } from "./ProtectAuth/AuthContext.jsx";
import RouteBbyRole from "./ProtectAuth/RouteByRole.jsx";
import PortFolio from "./Components/PortFolio.jsx";
import DetailAdvertiser from "./Advertiser/DetailAdvertiser.jsx";
import Advertiser from "./Page/Advertiser.jsx";
import "./index.css";
import Cryptocurrencies from "./Page/Cryptocurrencies.jsx";
import Highlights from "./Page/Highlights.jsx";
import EditProfile from "./Components/EditProfile.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/crypto" />} />
          <Route
            path="/login"
            element={
              <RouteBbyRole
                element={<Login />}
                block={["ADMIN", "FOLLOWER", "GUEST", "ADVERTISER"]}
              />
            }
          />
          <Route
            path="/register"
            element={
              <RouteBbyRole
                element={<Register />}
                block={["ADMIN", "FOLLOWER", "GUEST", "ADVERTISER"]}
              />
            }
          />
          <Route path="/changePassword" element={<ChangPasswordUser />} />
          <Route path="/enterNewPass" element={<EnterNewPassUser />} />
          <Route
            path="/changepw-qc/:token"
            element={<ChangePassForAdevertiser />}
          />
          <Route
            path="admin/*"
            element={
              <ProtectedRoute element={<Admin />} allowedRoles={["ADMIN"]} />
            }
          />
          <Route
            path="adv/*"
            element={
              <ProtectedRoute
                element={<Advertiser />}
                allowedRoles={["ADVERTISER"]}
              />
            }
          />
          <Route path="adv/detail/:id" element={<DetailAdvertiser />} />
          <Route
            path="/*"
            element={
              <div>
                <Navigation />
                <Routes>
                  <Route path="/crypto" element={<Crypto />}>
                  <Route index element={<Cryptocurrencies />} />
                    <Route path="highlights" element={<Highlights />} />
                  </Route>
                  <Route path="/trending" element={<Trending />} />
                  <Route path="/saved" element={<Saved />} />
                  <Route path="/news" element={<News />} />
                  <Route
                    path="/coin-detail/:coinKey"
                    element={<CryptoCoinDetail />}
                  />
                  <Route
                    path="/portfolio"
                    element={
                      <ProtectedRoute
                        element={<PortFolio />}
                        allowedRoles={["FOLLOWER"]}
                      />
                    }
                  />
                  <Route path="/editProfile"
                  element={<ProtectedRoute element={<EditProfile/>} allowedRoles={["FOLLOWER"]} />}
                  />
                </Routes>
              </div>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  </React.StrictMode>
);
