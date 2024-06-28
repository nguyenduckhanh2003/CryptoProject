import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getCoinDetail } from "../services/coinService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXTwitter, faGithub } from "@fortawesome/free-brands-svg-icons";
import { FaXTwitter, FaGithub } from "react-icons/fa6";
import { CopyOutlined } from "@ant-design/icons";

import {
  Avatar,
  Col,
  Divider,
  Modal,
  Row,
  Tag,
  Typography,
  Button,
  Form,
  Input,
  Tabs
} from "antd";
import "../css/CryptoCoinDetail.css";
import { AiFillCaretDown } from "react-icons/ai";
import { FaRegStar } from "react-icons/fa";
import io from "socket.io-client";
import GraphCoinDetail from "./GraphCoinDetail";
import CryptoCoinNews from "./CryptoCoinNews";
const { TabPane } = Tabs;
const CryptoCoinDetail = () => {
  const { coinKey } = useParams();
  const [coinDetail, setCoinDetail] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { Title } = Typography;
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const navigate = useNavigate();
  useEffect(() => {
    const fetchCoinDetail = async () => {
      const result = await getCoinDetail(coinKey);
      if (result.code === 200) {
        // console.log(result);
        setCoinDetail(result.data);
      } else {
        navigate("/");
      }
    };

    fetchCoinDetail();
  }, [coinKey]);
  const handleLogin = values => {
    setLoading(true);
    console.log('Login values:', values);
    // Gửi dữ liệu đăng nhập đến server
    setTimeout(() => {
      setLoading(false);
      onClose();
    }, 2000);
  };

  const handleSignup = values => {
    setLoading(true);
    console.log('Signup values:', values);
    // Gửi dữ liệu đăng ký đến server
    setTimeout(() => {
      setLoading(false);
      onClose();
    }, 2000);
  };
  if (!coinDetail) {
    return <div>Loading...</div>;
  }
  const { coinName, coinDetails, image, coin_id, rankCoin,id } = coinDetail;
  const { rank } = rankCoin;
  const { coinStat } = coinDetails;
  const {
    price,
    fullyDilutedValuation,
    circulatingSupply,
    percentageChange1h,
    percentageChange24h,
    percentageChange7d,
    _24hTradingVolume,
    totalValueLocked,
    marketCap,
    totalSupply,
    maxSupply,
  } = coinStat;
  const { coinAbout } = coinDetails;
  const { contract, websiteUrl, community, sourceCodeUrl } = coinAbout;
  const { Text,Paragraph, } = Typography;
  let fommatedTextPrice = (string) => {
    const number = parseFloat(string);
    const formattedNumber = number.toFixed(8);
    return (
      "$" +
      new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 9,
      }).format(formattedNumber)
    );
  };
  const handleCopy = () => {
    navigator.clipboard
      .writeText(coin_id)
      .then(() => {
        message.success("Copied to clipboard: " + coin_id);
      })
      .catch((err) => {
        message.error("Failed to copy text: " + err);
      });
  };

  let fommatedText = (string) => {
    const number = parseFloat(string);
    const formattedNumber = number.toFixed(8);
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 9,
    }).format(formattedNumber);
  };
  return (
    <>
      <div style={{ marginTop: "100px" }}>
        <Divider orientation="left">Detail Coin</Divider>
        <Row id="chart">
          <Col flex={0.75} className="box-left">
            {" "}
            <div className="box-coin-name" id="box-left-coin">
              <Avatar src={<img src={image} alt="avatar" />} />
              <div className="coin-text">
                <Text className="name_coin" strong>
                  {coinName}
                </Text>
                <Text type="secondary"> {coinKey} Price</Text>
                <Tag className="price-tag" color="default">
                  #{rank}
                </Tag>
              </div>
            </div>
            <div className="coin-price">
              <Text className="price">{fommatedTextPrice(price)}</Text>
              <div className="percentageChange24h">
                <span className="icon">
                  <AiFillCaretDown />
                </span>
                <span style={{ fontSize: "20px", fontWeight: "600" }}>
                  {" "}
                  {parseFloat(percentageChange24h).toFixed(2)}%
                </span>
              </div>
            </div>
            <Button
              onClick={showModal}
              style={{ marginTop: "10px", marginBottom: "10px" }}
            >
              <FaRegStar /> <b>Add to Portfolio</b>
            </Button>
            <Modal
              title=""
              open={isModalOpen}
              onOk={handleOk}
              onCancel={handleCancel}
            >
               <Tabs defaultActiveKey="1">
        <TabPane tab="Login" key="1">
          <Form
            name="login"
            initialValues={{ remember: true }}
            onFinish={handleLogin}
          >
            <Form.Item
              name="email"
              rules={[{ required: true, message: 'Please input your email!' }]}
            >
              <Input placeholder="Email" />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password placeholder="Password" />
            </Form.Item>

            <Form.Item>
              <Button type="default" htmlType="submit" loading={loading}>
                Login
              </Button>
            </Form.Item>
          </Form>
        </TabPane>
        <TabPane tab="Signup" key="2">
          <Form
            name="signup"
            initialValues={{ remember: true }}
            onFinish={handleSignup}
          >
            <Form.Item
              name="email"
              rules={[{ required: true, message: 'Please input your email!' }]}
            >
              <Input placeholder="Email" />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password placeholder="Password" />
            </Form.Item>

            <Form.Item
              name="confirm"
              dependencies={['password']}
              hasFeedback
              rules={[
                { required: true, message: 'Please confirm your password!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('The two passwords do not match!'));
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Confirm Password" />
            </Form.Item>

            <Form.Item>
              <Button type="default" htmlType="submit" loading={loading}>
                Signup
              </Button>
            </Form.Item>
          </Form>
        </TabPane>
      </Tabs>
            </Modal>
            <div className="box-desc">
              <div className="desc">
                <Text className="desc-name">Market Cap</Text>
                <Text className="desc-number">
                  {fommatedTextPrice(marketCap)}
                </Text>
              </div>
              <div className="desc">
                <Text className="desc-name">Fully Diluted Valuation</Text>
                <Text className="desc-number">
                  {fommatedTextPrice(fullyDilutedValuation)}
                </Text>
              </div>
              <div className="desc">
                <Text className="desc-name">24 Hour Trading Vol</Text>
                <Text className="desc-number">
                  {fommatedTextPrice(_24hTradingVolume)}
                </Text>
              </div>
              {totalValueLocked > 0 && (
                <div className="desc">
                  <Text className="desc-name">Total Value Locked</Text>
                  <Text className="desc-number">
                    {fommatedTextPrice(totalValueLocked)}
                  </Text>
                </div>
              )}
              <div className="desc">
                <Text className="desc-name">Circulating Supply</Text>
                <Text className="desc-number">
                  {fommatedText(circulatingSupply)}
                </Text>
              </div>
              <div className="desc">
                <Text className="desc-name">Total Supply</Text>
                <Text className="desc-number">{fommatedText(totalSupply)}</Text>
              </div>
              <div className="desc">
                <Text className="desc-name">Max Supply</Text>
                <Text className="desc-number">
                  {" "}
                  {maxSupply != 0 ? `${fommatedText(maxSupply)}` : "∞"}
                </Text>
              </div>

              <div className="box-info">
                <h2 style={{ textAlign: "left", marginTop: "10px" }}>Info</h2>
                <div className="desc">
                  <Text className="desc-name">Website</Text>
                  <Text className="">
                    <Link to={`https:` + websiteUrl} target="_blank">
                      <Tag className="desc-info" color="default">
                        {websiteUrl}
                      </Tag>
                    </Link>
                  </Text>
                </div>
                <div className="desc">
                  <Text className="desc-name">Community</Text>
                  <Text className="">
                    <Link to={community} target="_blank">
                      <Tag className="desc-info-icon" color="default">
                        <FaXTwitter /> <span>Twitter</span>
                      </Tag>
                    </Link>
                  </Text>
                </div>
                <div className="desc">
                  <Text className="desc-name">Source Code</Text>
                  <Text className="">
                    <Link to={sourceCodeUrl} target="_blank">
                      <Tag className="desc-info-icon" color="default">
                        <FaGithub /> <span>Github</span>
                      </Tag>
                    </Link>
                  </Text>
                </div>
                <div className="desc">
                  <Text className="desc-name">API ID</Text>
                  <Text className="">
                    <Tag className="desc-info-icon" color="default">
                      <Paragraph copyable style={{marginBottom:'0'}}>{coin_id}</Paragraph>
                    </Tag>
                  </Text>
                </div>
              </div>
            </div>
          </Col>
          <Col flex={4}>
            <GraphCoinDetail coinKey={coinKey} />
          </Col>
        </Row>
        <Row style={{ margin: "10px 10px" }} id="news">
          <p style={{ marginTop: "20px", width: "20px" }}></p>
          <Divider orientation="left">
            <Title style={{ margin: 0, fontWeight: "700" }} level={3}>
              {coinName} Latest News
            </Title>
          </Divider>
          <CryptoCoinNews coinId={id}/>
        </Row>
      </div>
    </>
  );
};

export default CryptoCoinDetail;
