import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Bar } from 'react-chartjs-2';
import '../css/DetailAdvertiser.css';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DetailAdvertiser = () => {
    const { id } = useParams();
    const [advertisement, setAdvertisement] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [historyData, setHistoryData] = useState([]);
    const [showHistory, setShowHistory] = useState(false);
    const [showCharts, setShowCharts] = useState(false);

    useEffect(() => {
        const fetchAdvertisement = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8000/api/v1/advertisement/advertisement-by-id/${id}`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        credentials: 'include',
                    }
                );

                if (!response.ok) {
                    throw new Error(`Error: ${response.status} ${response.statusText}`);
                }

                const data = await response.json();
                setAdvertisement(data);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchAdvertisement();
    }, [id]);

    const fetchHistoryData = async () => {
        try {
            const response = await fetch(
                `http://localhost:8000/api/v1/advertisement/all-ads-statistic-highlights/${id}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                }
            );

            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            // Sort the data by date
            data.sort((a, b) => new Date(a.asr_createdAt) - new Date(b.asr_createdAt));

            setHistoryData(data);
            setShowHistory(true);
            setShowCharts(false); // Tắt biểu đồ khi hiển thị lịch sử
        } catch (error) {
            setError(error.message);
        }
    };

    const handleToggleCharts = async () => {
        if (!showCharts) {
            // Only fetch history data if it hasn't been loaded yet
            if (!showHistory) {
                await fetchHistoryData();
            }
            setShowCharts(true);
            setShowHistory(false); // Tắt lịch sử khi hiển thị biểu đồ
        } else {
            setShowCharts(false);
        }
    };

    // Data for views chart
    const viewsChartData = {
        labels: historyData.map(item => new Date(item.asr_createdAt).toLocaleDateString()),
        datasets: [{
            label: 'Total Views',
            data: historyData.map(item => item.totalViews),
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    };

    // Data for clicks chart
    const clicksChartData = {
        labels: historyData.map(item => new Date(item.asr_createdAt).toLocaleDateString()),
        datasets: [{
            label: 'Total Clicks',
            data: historyData.map(item => item.totalClicks),
            backgroundColor: 'rgba(255, 159, 64, 0.2)',
            borderColor: 'rgba(255, 159, 64, 1)',
            borderWidth: 1
        }]
    };

    // Data for earnings chart
    const earningChartData = {
        labels: historyData.map(item => new Date(item.asr_createdAt).toLocaleDateString()),
        datasets: [{
            label: 'Total Earning ($)',
            data: historyData.map(item => item.total_earning),
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1
        }]
    };

    const chartOptions = {
        plugins: {
            tooltip: {
                callbacks: {
                    label: function(tooltipItem) {
                        let label = tooltipItem.dataset.label || '';

                        if (label) {
                            label += ': ';
                        }

                        label += tooltipItem.formattedValue;


                        if (tooltipItem.datasetIndex === 2) {
                            label = label.replace(' 💲', '');
                        }

                        return label;
                    }
                }
            }
        },
        scales: {
            y: {
                ticks: {
                    callback: function(value, index, values) {
                        if (index === 0 && showCharts) {
                            return value !== 0 ? ('$' + value.toFixed(2)) : value;
                        }
                        return value;
                    }
                }
            }
        },
        layout: {
            padding: {
                left: 20,
                right: 20,
                top: 0,
                bottom: 0
            }
        },
        responsive: true,
        maintainAspectRatio: false
    };



    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <Box m="20px">
            <div className="header">
                <Link to="adv/Items">
                    <IconButton>
                        <ArrowBackIcon/>
                    </IconButton>
                </Link>
                <h2>Advertisement Details</h2>
                <div className="details-text">{`Details for Advertisement ID: ${id}`}</div>
            </div>
            <Box className="container">
                <Box className="detail-container">
                    <TableContainer component={Paper}>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>{advertisement.id}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Site Name</TableCell>
                                    <TableCell>{advertisement.siteName}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Title</TableCell>
                                    <TableCell>{advertisement.title}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Link</TableCell>
                                    <TableCell>
                                        <a href={advertisement.linkToOrigin} target="_blank" rel="noopener noreferrer">
                                            {advertisement.linkToOrigin}
                                        </a>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Start Date</TableCell>
                                    <TableCell>{advertisement.startDate}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>End Date</TableCell>
                                    <TableCell>{advertisement.endDate}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Priority</TableCell>
                                    <TableCell>{advertisement.priority}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Cost Per Click</TableCell>
                                    <TableCell>{advertisement.costPerClick}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Cost Per View</TableCell>
                                    <TableCell>{advertisement.costPerView}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Duration</TableCell>
                                    <TableCell>{advertisement.duration}</TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell>Managed By:</TableCell>
                                    <TableCell>{advertisement.cryptoUser.displayName}</TableCell>
                                </TableRow>

                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
                <Box className="media-history-container">
                    <Box className="media-container">
                        {advertisement.mediaFile && (
                            advertisement.mediaFile.endsWith('.mp4') ||
                            advertisement.mediaFile.endsWith('.webm') ||
                            advertisement.mediaFile.endsWith('.ogg') ? (
                                <video className="media-video" controls>
                                    <source src={advertisement.mediaFile} type="video/mp4"/>
                                    <source src={advertisement.mediaFile} type="video/webm"/>
                                    <source src={advertisement.mediaFile} type="video/ogg"/>
                                    Your browser does not support the video tag.
                                </video>
                            ) : (
                                <img className="media-image" src={advertisement.mediaFile} alt="media"/>
                            )
                        )}
                    </Box>
                    {!showCharts && showHistory && (
                        <Box className="history-table">
                            <Typography variant="h6" className="history-title">Advertisement History</Typography>
                            <TableContainer component={Paper}>
                                <Table className="history-table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Date</TableCell>
                                            <TableCell>Ad ID</TableCell>
                                            <TableCell>Title</TableCell>

                                            <TableCell>Total Views</TableCell>
                                            <TableCell>Total Clicks</TableCell>
                                            <TableCell>Total Users</TableCell>
                                            <TableCell>Total Earning</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {historyData.map((item) => (
                                            <TableRow key={item.asr_createdAt}>
                                                <TableCell>{new Date(item.asr_createdAt).toLocaleDateString()}</TableCell>
                                                <TableCell>{item.ad_id}</TableCell>
                                                <TableCell>{item.ad_title}</TableCell>

                                                <TableCell>{item.totalViews}</TableCell>
                                                <TableCell>{item.totalClicks}</TableCell>
                                                <TableCell>{item.totalUsers}</TableCell>
                                                <TableCell>{item.total_earning}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    )}
                    <Box className="button-container">
                        <Button variant="contained" color="primary" onClick={fetchHistoryData}>History</Button>
                        <Button variant="contained" color="secondary" onClick={handleToggleCharts}>
                            {showCharts ? 'Hide Charts' : 'Show Charts'}
                        </Button>
                    </Box>
                    {showCharts && (
                        <Box className="charts-container">
                            <div className="chart">
                                <Typography variant="h6" className="chart-title">Views</Typography>
                                <Bar data={viewsChartData} options={{ ...chartOptions, maintainAspectRatio: true }} />
                            </div>
                            <div className="chart">
                                <Typography variant="h6" className="chart-title">Clicks</Typography>
                                <Bar data={clicksChartData} options={{ ...chartOptions, maintainAspectRatio: true }} />
                            </div>
                            <div className="chart">
                                <Typography variant="h6" className="chart-title">Earnings</Typography>
                                <Bar data={earningChartData} options={{
                                    ...chartOptions,
                                    scales: {
                                        ...chartOptions.scales,
                                        y: {
                                            ...chartOptions.scales.y,
                                            ticks: {
                                                ...chartOptions.scales.y.ticks,
                                                callback: function(value, index, values) {
                                                    if (showCharts) {
                                                        return '$' + value.toFixed(2); // Định dạng hiển thị đơn vị đô la ($)
                                                    }
                                                    return value;
                                                }
                                            }
                                        }
                                    },
                                    maintainAspectRatio: true
                                }} />
                            </div>
                        </Box>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default DetailAdvertiser;
