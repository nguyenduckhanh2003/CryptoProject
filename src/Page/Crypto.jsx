import { FaRankingStar } from "react-icons/fa6";
import { MdFormatListNumbered } from "react-icons/md";
import { Segmented} from "antd";
import "../css/Crypto.css";
import { Outlet } from "react-router-dom";
import { useNavigate,useLocation } from 'react-router-dom';
import AdsComponent from "../Advertiser/AdsComponent";
const Crypto = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const handleChange = (value) => {
    navigate(`/crypto/${value}`);
  };
  const selectedValue = location.pathname.includes('/crypto/highlights') ? 'highlights' : '';
  return (
    <>
      <div style={{ marginTop: "90px" }}></div>
      <div style={{marginLeft:'20px'}}>
      <gecko-coin-price-marquee-widget locale="en" outlined="true" coin-ids="" initial-currency="usd"></gecko-coin-price-marquee-widget>
        <Segmented   onChange={handleChange}
        value={selectedValue}
          options={[
            {
              label: "Cryptocurrencies",
              value: "",
              icon: <FaRankingStar />,
            },
            {
              label: "Highlights",
              value: "highlights",
              icon: <MdFormatListNumbered />,
            },
          ]}
        />
         <Outlet />
         <AdsComponent />
      </div>
      
    </>
  );
};

export default Crypto;
