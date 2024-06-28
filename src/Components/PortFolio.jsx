import React, { useState } from 'react';
import { Button, Container } from 'react-bootstrap';
import { Box, Modal, TextField } from "@mui/material";
import { BiPlusCircle, BiCog, BiShare } from 'react-icons/bi';
import { BsX, BsSearch } from 'react-icons/bs';
import { Table } from "antd";
import '../css/PortFolio.css';

function PortFolio() {
    const [showAddCoin, setShowAddCoin] = useState(false);
    const handleAddCoin = () => {
        setShowAddCoin(true);
    }
    const handleCloseAddCoin = () => {
        setShowAddCoin(false);
    }
    const handleSearch = () => {

    }
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
            ellipsis: true,
            width: "10%",
            sorter: (a, b) => a.coinName.localeCompare(b.coinName),
            render: (text, record) => (
                <Link to={`/coin-detail/${record.coinKey}`}>
                    <div className="box_name">
                        <img src={record.image} alt={text} style={{ width: "20px", marginRight: "8px" }} />
                        {text}
                        <span className="coinKey">{record.coinKey}</span>
                    </div>
                </Link>
            ),
        },
        {
            title: "Price",
            ellipsis: true,
            sorter: (a, b) => parseFloat(a.currentPrice) - parseFloat(b.currentPrice),
            render: (text, record) => {
                const number = parseFloat(text);
                const formattedNumber = number.toFixed(8);
                const formattedText = "$" + new Intl.NumberFormat("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 9
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
                parseFloat(a.coinDetails.coinStat.percentageChange7d) - parseFloat(b.coinDetails.coinStat.percentageChange7d),
            render: (text) => `${parseFloat(text).toFixed(2)}%`,

        },
        {
            title: "24h",
            dataIndex: ["coinDetails", "coinStat", "percentageChange24h"],
            ellipsis: true,
            sorter: (a, b) =>
                parseFloat(a.coinDetails.coinStat.percentageChange7d) - parseFloat(b.coinDetails.coinStat.percentageChange7d),
            render: (text) => `${parseFloat(text).toFixed(2)}%`,
        },
        {
            title: "7d",
            dataIndex: ["coinDetails", "coinStat", "percentageChange7d"],
            ellipsis: true,
            sorter: (a, b) =>
                parseFloat(a.coinDetails.coinStat.percentageChange7d) - parseFloat(b.coinDetails.coinStat.percentageChange7d),
            render: (text) => `${parseFloat(text).toFixed(2)}%`,

        },
        {
            title: "Market Cap",
            width: "20%",
            dataIndex: ["coinDetails", "coinStat", "marketCap"],
            sorter: (a, b) => parseFloat(a.coinDetails.coinStat.marketCap) - parseFloat(b.coinDetails.coinStat.marketCap),
            ellipsis: true,
            render: (text) => {
                const number = parseFloat(text);
                return <b>{"$" + new Intl.NumberFormat("en-US").format(number)}</b>;
            },
        },
        {
            title: "Holding",
            ellipsis: true,
        },
        {
            title: "PNL",
            ellipsis: true,
        },
        {
            title: "Action",
            ellipsis: true,
            render: () => <BsX className="delete-icon" />,
        },
    ];

    return (
        <div className="portfolio-container">
            <Container>
                <div className="portfolio-header">
                    <p style={{ fontSize: '2.25rem', fontWeight: 'bold' }}>My Portfolio</p>
                    <div className="button-group">
                        <Button className="portfolio-button d-flex align-items-center" variant="primary" onClick={() => handleAddCoin()}>
                            <BiPlusCircle className="mr-2" />
                            <span>Add Coin</span>
                        </Button>
                        <Button className="portfolio-button d-flex align-items-center" variant="primary" href="/">
                            <BiCog className="mr-2" />
                            <span>Customise</span>
                        </Button>
                        <Button className="portfolio-button d-flex align-items-center" variant="primary" href="/">
                            <BiShare className="mr-2" />
                            <span>Share</span>
                        </Button>
                    </div>
                </div>
                <div className="portfolio-row-1">
                    <div className="portfolio-col">
                        <p>$0.00</p>
                        <p>Current Balance</p>
                    </div>
                    <div className="portfolio-col">
                        <p>$0.00</p>
                        <p>24h Portfolio Change</p>
                    </div>
                    <div className="portfolio-col">
                        <p>111</p>
                        <p>Total Profit/Loss</p>
                    </div>
                    <div className="portfolio-col">
                        <p>Bitcoin</p>
                        <p>Top Gainer (24h)</p>
                    </div>
                </div>
                <div className="portfolio-row-2">
                    <div className="portfolio-col row2"><p>Holding</p></div>
                    <div className="portfolio-col row2"><p>Performance</p></div>
                </div>
            </Container>
            <>
                <div style={{ marginTop: "20px" }}></div>
                <Table columns={columns} rowKey={"id"} showHeader={true} sticky />
            </>
            <Modal open={showAddCoin} onClose={handleCloseAddCoin}>
                <Box
                    p={4}
                    bgcolor="background.paper"
                    borderRadius="8px"
                    boxShadow={24}
                    maxWidth="sm"
                    mx="auto"
                    my="20vh"
                >
                    <BsX className="close-icon" onClick={handleCloseAddCoin} />
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Add Coin</p>
                    <TextField
                        fullWidth
                        placeholder='Search Coins'
                        size='small'
                        className='search-input'
                        margin='normal'
                        InputProps={{
                            endAdornment: (
                                <BsSearch style={{ cursor: 'pointer' }} onClick={handleSearch} />
                            )
                        }}
                    >

                    </TextField>
                </Box>
            </Modal>
        </div>
    );
}

export default PortFolio;
