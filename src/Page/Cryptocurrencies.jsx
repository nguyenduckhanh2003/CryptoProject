import React, { useEffect, useRef, useState } from "react";
import { Button, Input, Segmented, Space, Table } from "antd";
import qs from "qs";
import { getListCoin } from "../services/coinService";
import { Link } from "react-router-dom";
import io from "socket.io-client";
import AdsComponent from "../Advertiser/AdsComponent";

const Cryptocurrencies = () => {
  const [coinData, setCoinData] = useState([]);
  const [coinList, setCoinList] = useState([]);
  const SOCKET_SERVER_URL = "http://localhost:9696";

  const handleReload = () => {
    fetchApi();
  };
  const columns = [
    {
      title: "",
      width: 50,
      ellipsis: true,
    },
    {
      title: "#",
      sorter: (a, b) => {
        return a.rankCoin.rank - b.rankCoin.rank;
      },
      dataIndex: "rankCoin",
      key: "rank",
      width: 80,
      ellipsis: true,
      render: (text, record) => <b>{record.rankCoin.rank}</b>,
    },
    {
      title: "Coin",
      dataIndex: "coinName",
      sorter: (a, b) => a.coinName.localeCompare(b.coinName),
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
      width: "19%",
    },
    {
      title: "Price",
      dataIndex: coinData
        ? "currentPrice"
        : ["coinDetails", "coinStat", "price"],
      ellipsis: true,
      sorter: (a, b) => parseFloat(a.currentPrice) - parseFloat(b.currentPrice),
      render: (text, record) => {
        const number = parseFloat(text);
        const formattedNumber = number.toFixed(8);
        const formattedText =
          "$" +
          new Intl.NumberFormat("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 9,
          }).format(formattedNumber);

        // Xác định màu sắc
        const color = getPriceColor(record.priceStatus);
        return <b style={{ color: color }}>{formattedText}</b>;
      },
    },
    {
      title: "1h",
      dataIndex: ["coinDetails", "coinStat", "percentageChange1h"],
      ellipsis: true,
      sorter: (a, b) =>
        parseFloat(a.coinDetails.coinStat.percentageChange1h) -
        parseFloat(b.coinDetails.coinStat.percentageChange1h),
      render: (text) => `${parseFloat(text).toFixed(2)}%`,
      width: 100,
    },
    {
      title: "24h",
      dataIndex: ["coinDetails", "coinStat", "percentageChange24h"],
      ellipsis: true,
      sorter: (a, b) =>
        parseFloat(a.coinDetails.coinStat.percentageChange24h) -
        parseFloat(b.coinDetails.coinStat.percentageChange24h),
      render: (text) => `${parseFloat(text).toFixed(2)}%`,
      width: 100,
    },
    {
      title: "7d",
      dataIndex: ["coinDetails", "coinStat", "percentageChange7d"],
      ellipsis: true,
      sorter: (a, b) =>
        parseFloat(a.coinDetails.coinStat.percentageChange7d) -
        parseFloat(b.coinDetails.coinStat.percentageChange7d),
      render: (text) => `${parseFloat(text).toFixed(2)}%`,
      width: 100,
    },
    {
      title: "24h Volume",
      dataIndex: ["coinDetails", "coinStat", "_24hTradingVolume"],
      ellipsis: true,
      sorter: (a, b) =>
        parseFloat(a.coinDetails.coinStat._24hTradingVolume) -
        parseFloat(b.coinDetails.coinStat._24hTradingVolume),
      render: (text) => {
        const number = parseFloat(text);
        return <b>{"$" + new Intl.NumberFormat("en-US").format(number)}</b>;
      },
    },
    {
      title: "Market Cap",
      dataIndex: ["coinDetails", "coinStat", "marketCap"],
      sorter: (a, b) =>
        parseFloat(a.coinDetails.coinStat.marketCap) -
        parseFloat(b.coinDetails.coinStat.marketCap),
      ellipsis: true,
      render: (text) => {
        const number = parseFloat(text);
        return <b>{"$" + new Intl.NumberFormat("en-US").format(number)}</b>;
      },
    },
  ];
  const fetchApi = async () => {
    const result = await getListCoin();
    setCoinList(result);
    setCoinData(
      result.map((coin) => {
        return {
          id: coin.id,
          currentPrice: coin.coinDetails.coinStat.price,
          priceStatus: "NOCHANGE",
        };
      })
    );
    console.log(coinData);
  };

  useEffect(() => {
    fetchApi();
  }, []);
  useEffect(() => {
    // Kết nối tới server Socket.IO
    const socket = io(SOCKET_SERVER_URL, { transports: ["websocket"] });

    // Lắng nghe sự kiện 'coinUpdate' từ server
    socket.on("listen-to-update-price", (data) => {
      console.log("Coin data received:", data);
      setCoinData(data.data);
    });

    // Đóng kết nối khi component bị unmount
  }, []);

  const getPriceColor = (priceStatus) => {
    switch (priceStatus) {
      case "INCREASE":
        return "green";
      case "DECREASE":
        return "red";
      default:
        return "black";
    }
  };
  const mergedData = coinList.map((coin) => {
    const updatedCoin = coinData.find((item) => item.id === coin.id);
    return updatedCoin ? { ...coin, ...updatedCoin } : coin;
  });
  return (<>
    <Table
        dataSource={mergedData}
        columns={columns}
        rowKey={"id"}
        showHeader={true}
        sticky
        pagination={
          {
            defaultPageSize: 10,
            showSizeChanger: true,
        }
      }
      />
  </>)
};

export default Cryptocurrencies;