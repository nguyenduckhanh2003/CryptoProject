import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../css/Navbar.css";
import logo from "../Img/logo.png";
import { useNavigate } from "react-router-dom";
import { getCookies, deleteCookie } from "../Helps/Cookies";
import { Avatar, Empty, List } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { AudioOutlined } from "@ant-design/icons";
import { Input, Space, Typography } from "antd";
import Axios from "axios";
import axios from "axios";
const { Search } = Input;
const { Text } = Typography;
function Navigation() {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [displayName, setDisplayName] = useState(null);
  const [showHidden, setShowHidden] = useState(false);
  const [searchValue, setSearchValue] = useState(""); // State để lưu trữ giá trị tìm kiếm
  const timeoutRef = useRef(null); // Ref để lưu trữ bộ đếm thời gian
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const inputRef = useRef(null); // Tạo ref cho input
  useEffect(() => {
    const userRole = getCookies("role");
    const displayName = getCookies("displayName");
    setDisplayName(displayName);
    setRole(userRole);
    console.log(userRole);
    console.log(displayName);
  }, []);

  const handleLogout = () => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/api/v1/auth/logout",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
      } catch (error) {
        setError(error.message);
      }
    };
    fetchData();
    console.log(getCookies("jwt"));
    deleteCookie("jwt");
    deleteCookie("displayName");
    deleteCookie("role");
    setDisplayName(null);
    setRole(null);
    window.location.reload();
    navigate("/login");
  };

  const showHiddenChange = () => {
    setShowHidden(!showHidden);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    handleSearchFocus(true);
    // Nếu đã có bộ đếm thời gian trước đó, hủy bỏ nó
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Thiết lập bộ đếm thời gian mới
    timeoutRef.current = setTimeout(() => {
      // Gọi API tìm kiếm với giá trị tìm kiếm
      if (value) {
        fetchSearchResults(value);
      } else {
        setSearchResults([]);
      }
    }, 300); // 300ms
  };
  const fetchSearchResults = async (query) => {
    try {
      const res = await axios.get(
        `http://localhost:8000/coin/search-name-coin?keyword=${query}`
      );
      const data = await res.data;
      setSearchResults(data || []);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };
  const handleSearchFocus = () => {
    setIsSearchFocused(true);
  };

  const handleSearch = (value, _e, info) => {
    console.log(info?.source);
    if (info?.source === "clear") {
      setSearchResults([]);
      setIsSearchFocused(false);
    }
  };
  // const handleSearchBlur = () => {
  //   setIsSearchFocused(false);
  // };
  const handleKeyDown = (e) => {
    if (e.key == "Escape") {
      setSearchResults([]);
      setIsSearchFocused(false);
      setSearchValue("");
      if (inputRef.current) inputRef.current.blur();  
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="navbar-logo">
          <span>
            <a href="/crypto">
              <img src={logo} alt="" />
            </a>
          </span>
        </div>
        <div className="navbar-links">
          <NavLink to="/crypto" className="link">
            Crypto
          </NavLink>
          <NavLink to="/trending" className="link">
            Trending
          </NavLink>
          <NavLink to="/saved" className="link">
            Saved
          </NavLink>
          <NavLink to="/news" className="link">
            News
          </NavLink>
        </div>
      </div>
      <div className="navbar-right">
        <Space direction="vertical">
          <Search
            placeholder="Search..."
            allowClear
            value={searchValue}
            ref={inputRef}
            onFocus={handleSearchFocus}
            // onBlur={handleSearchBlur}
            onChange={handleSearchChange}
            onSearch={handleSearch}
            onKeyDown={handleKeyDown}
            style={{ width: isSearchFocused ? 300 : 200 }}
          />
          {(searchValue && searchResults.length > 0 && (
            <div className="box-search">
              <List
                className="search-results-list"
                size="small"
                bordered
                dataSource={searchResults}
                renderItem={(item) => (
                  <List.Item
                    onClick={() => navigate(`/coin-detail/${item.coinKey}`)}
                  >
                    <div className="inner-item">
                      <div className="inner-image">
                        <img src={item.image} alt={item.coinName} />
                      </div>
                      <div><Text strong>{item.coinName}</Text> 
                      <Text style={{margin:'0px 5px'}}>{item.coinKey}</Text></div>
                      <div className="search-rank"><Text code>{item.rankCoin.rank}</Text></div>
                    </div>
                  </List.Item>
                )}
              />
              <div className="esc-close">
                <Text keyboard>ESC</Text> Close
              </div>
            </div>
          )) ||
            (searchValue && searchResults.length === 0 && (
              <div className="box-search">
                <Empty className="search-results-list" />
              </div>
            ))}
        </Space>
        <div className="navbar-auth">
          {role === "FOLLOWER" || role === "ADMIN" || role === "ADVERTISER" ? (
            <div className="auth-dropdown">
              <button className=" auth-button-name" onClick={showHiddenChange}>
                <Avatar size="large" icon={<UserOutlined />} />
              </button>
              {showHidden && (
                <div className="dropdown-menu">
                  <button
                    className="dropdown-item"
                    onClick={() => navigate("/editProfile")}
                  >
                    <i className="bi bi-person"></i>View Profile
                  </button>
                  <button className="dropdown-item" onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right"></i> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button
                className="auth-button"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
              <button
                className="auth-button"
                onClick={() => navigate("/register")}
              >
                Register
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
