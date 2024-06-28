import React, { useEffect, useState } from "react";
import { Spin, Table, Typography } from "antd";
import { Row, Col } from "antd";
import axios from "axios";
import "../css/highlights.css";
import { MdOutlinePriceChange } from "react-icons/md";
import { SiCoinmarketcap } from "react-icons/si";
import { getListCoin } from "../services/coinService";
import { Link, useNavigate } from "react-router-dom";
const Highlights = () => {
  const navigate = useNavigate();
  const { Title } = Typography;
  const [coinListPrice, setCoinListPrice] = useState([]);
  const [coinListMarketCap, setCoinListMarketCap] = useState([]);
  const [coinListVolume, setCoinListVolume] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchApi = async () => {
    const result = await getListCoin();
    const sortedPrice = result
      .sort(
        (a, b) => b.coinDetails.coinStat.price - a.coinDetails.coinStat.price
      )
      .slice(0, 8);
    setCoinListPrice(sortedPrice);
    const sortedMarketCap = result
      .sort(
        (a, b) =>
          b.coinDetails.coinStat.marketCap - a.coinDetails.coinStat.marketCap
      )
      .slice(0, 8);
    setCoinListMarketCap(sortedMarketCap);
    const sortedVolume = result
      .sort(
        (a, b) =>
          b.coinDetails.coinStat._24hTradingVolume -
          a.coinDetails.coinStat._24hTradingVolume
      )
      .slice(0, 8);
    setCoinListVolume(sortedVolume);
    setLoading(false);
  };
  const locale = {
    emptyText: loading ? <Spin /> : <Text>No Data</Text>,
  };
  useEffect(() => {
    fetchApi();
  }, []);
  const columnsPriceSorted = [
    {
      title: "Coin",
      dataIndex: "coinName",
      render: (text, record) => (
        <Link to={`/coin-detail/${record.coinKey}`}>
          <div className="box_name">
            <img
              src={record.image}
              alt={text}
              style={{ width: "20px", marginRight: "8px" }}
            />
            {text}
            <span className="coinKey">{record.coinKey}</span>
          </div>
        </Link>
      ),
      ellipsis: true,
      width: "70%",
    },
    {
      title: "Price",
      dataIndex: ["coinDetails", "coinStat", "price"],
      ellipsis: true,
      render: (text, record) => {
        const number = parseFloat(text);
        const formattedNumber = number.toFixed(8);
        const formattedText =
          "$" +
          new Intl.NumberFormat("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 9,
          }).format(formattedNumber);
        return <b>{formattedText}</b>;
      },
    },
  ];
  const columnsMarketCapSorted = [
    {
      title: "Coin",
      dataIndex: "coinName",
      render: (text, record) => (
        <Link to={`/coin-detail/${record.coinKey}`}>
          <div className="box_name">
            <img
              src={record.image}
              alt={text}
              style={{ width: "20px", marginRight: "8px" }}
            />
            {text}
            <span className="coinKey">{record.coinKey}</span>
          </div>
        </Link>
      ),
      ellipsis: true,
      width: "55%",
    },
    {
      title: "Market Cap",
      dataIndex: ["coinDetails", "coinStat", "marketCap"],
      ellipsis: true,
      render: (text, record) => {
        const number = parseFloat(text);
        const formattedNumber = number.toFixed(8);
        const formattedText =
          "$" +
          new Intl.NumberFormat("en-US", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 9,
          }).format(formattedNumber);
        return <b>{formattedText}</b>;
      },
    },
  ];
  const columnsVolumeSorted = [
    {
      title: "Coin",
      dataIndex: "coinName",
      render: (text, record) => (
        <Link to={`/coin-detail/${record.coinKey}`}>
          <div className="box_name">
            <img
              src={record.image}
              alt={text}
              style={{ width: "20px", marginRight: "8px" }}
            />
            {text}
            <span className="coinKey">{record.coinKey}</span>
          </div>
        </Link>
      ),
      ellipsis: true,
      width: "55%",
    },
    {
      title: "Volume",
      dataIndex: ["coinDetails", "coinStat", "_24hTradingVolume"],
      ellipsis: true,
      render: (text, record) => {
        const number = parseFloat(text);
        const formattedNumber = number.toFixed(8);
        const formattedText =
          "$" +
          new Intl.NumberFormat("en-US", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 9,
          }).format(formattedNumber);
        return <b>{formattedText}</b>;
      },
    },
  ];
  return (
    <div>
      <div className="title-desc">
        <Title level={2} className="title">
          Crypto Highlights
        </Title>
        <p className="desc">
          Which cryptocurrencies are people more interested in? Track and
          discover the most interesting cryptocurrencies based on market and
          CoinGecko activity.
        </p>
      </div>
      <gecko-coin-price-static-headline-widget
        locale="en"
        outlined="true"
        coin-ids=""
        initial-currency="usd"
      ></gecko-coin-price-static-headline-widget>
      <div>
        <Row gutter={[16, 16]} style={{ margin: "20px 0" }}>
          <Col span={8}>
            <div className="highlight-box">
              <div className="title-box">
                <MdOutlinePriceChange color="orange" size="20px" />
                <h3> Highest Price</h3>
              </div>
              {/* <p>Nội dung, mô tả về Highlight 1...</p> */}
              <Table
                dataSource={coinListPrice}
                columns={columnsPriceSorted}
                rowKey={"id"}
                showHeader={true}
                pagination={false}
                locale={locale}
                onRow={(record, rowIndex) => {
                  return {
                    onClick: (event) => {
                      navigate(`/coin-detail/${record.coinKey}`);
                    },
                  };
                }}
              />
            </div>
          </Col>
          <Col span={8}>
            <div className="highlight-box">
              <div className="title-box">
                <SiCoinmarketcap color="pink" size="20px" />
                <h3>Highest Market Cap</h3>
              </div>
              <Table
                dataSource={coinListMarketCap}
                columns={columnsMarketCapSorted}
                rowKey={"id"}
                showHeader={true}
                pagination={false}
                locale={locale}
                onRow={(record, rowIndex) => {
                  return {
                    onClick: (event) => {
                      navigate(`/coin-detail/${record.coinKey}`);
                    },
                  };
                }}
              />
            </div>
          </Col>
          <Col span={8}>
            <div className="highlight-box">
              <div className="title-box">
                <h3> 🥤 Highest Volume</h3>
              </div>
              <Table
                dataSource={coinListVolume}
                columns={columnsVolumeSorted}
                rowKey={"id"}
                showHeader={true}
                pagination={false}
                locale={locale}
                onRow={(record, rowIndex) => {
                  return {
                    onClick: (event) => {
                      navigate(`/coin-detail/${record.coinKey}`);
                    },
                  };
                }}
              />
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};
export default Highlights;
