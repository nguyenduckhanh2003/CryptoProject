import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';
import { getCookies } from '../Helps/Cookies';


function AdsComponent() {
    const [data, setAdData] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [viewCount, setViewCount] = useState(0);
    const [randomAd, setRandomAd] = useState(null);
    const [canCloseModal, setCanCloseModal] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [role, setRole] = useState(null);
    const [adsFooter, setAdsFooter] = useState(null);
    const [showFooter, setShowFooter] = useState(true);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/v1/advertisement/advertisement-list-no-auth', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setAdData(data);
                if (data && data.length > 0) {
                    const randomIndex = Math.floor(Math.random() * data.length);
                    setRandomAd(data[randomIndex]);
                    console.log('Random ad:', data[randomIndex]);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        const fetchBestInfo = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/v1/advertisement/view-count', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const newData = await response.json();
                const storedViewCount = sessionStorage.getItem('viewCount');
                const currentViewCount = storedViewCount ? parseInt(storedViewCount) : 0;

                if (currentViewCount < newData.viewCount) {
                    setViewCount(newData.viewCount);
                    setModalIsOpen(true);
                    setCanCloseModal(false);
                    if (randomAd && randomAd.duration) {
                        setTimeout(() => {
                            setCanCloseModal(true);
                        }, randomAd.duration * 1000);
                    }
                }
            } catch (error) {
                console.error('Error fetching best info:', error);
            }
        };

        fetchData();

        const storedViewCount = sessionStorage.getItem('viewCount');
        const currentViewCount = storedViewCount ? parseInt(storedViewCount) : 0;
        setViewCount(currentViewCount);
        const interval = setInterval(fetchBestInfo, 15000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    useEffect(() => {
        if (modalIsOpen && randomAd && randomAd.duration) {
            setCanCloseModal(false);
            setCountdown(randomAd.duration);

            const countdownInterval = setInterval(() => {
                setCountdown(prevCountdown => {
                    if (prevCountdown <= 1) {
                        clearInterval(countdownInterval);
                        setCanCloseModal(true);
                        return ;
                    }
                    return prevCountdown - 1;
                });
            }, 1000);

            return () => {
                clearInterval(countdownInterval);
            };
        }
    }, [modalIsOpen, randomAd]);

    useEffect(() => {
        const roles = getCookies('role');
        setRole(roles);
    }, []);
    useEffect(() => {
        if (data && data.length > 0) {
            setAdsFooter(data[1]);
            console.log('Ads footer:', data[1]);
        }
    }, [data]);


    const handleModalClose = async () => {
        if (!canCloseModal) return;

        setModalIsOpen(false);
        sessionStorage.setItem('viewCount', viewCount.toString());

        try {
            const response = await fetch(`http://localhost:8000/api/v1/advertisement/user-view-ads/${randomAd.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            console.log(`View count increased successfully for ad id ${randomAd.id}.`);
        } catch (error) {
            console.error('Error increasing view count:', error);
        }

        if (data && data.length > 0) {
            const randomIndex = Math.floor(Math.random() * data.length);
            setRandomAd(data[randomIndex]);
            console.log('Random ad:', data[randomIndex]);
        }
    };
    const handleClick = async () => {

        const newTab = window.open(randomAd.linkToOrigin, '_blank');
        newTab.focus();
        try {
            const response = await fetch(`http://localhost:8000/api/v1/advertisement/user-click-ads/${randomAd.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            console.log(`Click count increased successfully for ad id ${randomAd.id}.`);
        } catch (error) {
            console.error('Error increasing click count:', error);
        }
    }

    const handleCloseFooter = () => {
        setShowFooter(false);
    };

    return (
        role !== 'ADMIN' && (
            <>
            {showFooter && adsFooter && (
                    <div style={{
                        position: 'fixed',
                        bottom: 0,
                        width: '40%',
                        backgroundColor: '#fff',
                        borderTop: '1px solid #ddd',
                        padding: '10px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        margin: '0 30%',
                        border: '3px solid #ddd',
                        borderRadius: '10px',
                        
                    }}>
                        <button style={{ position: 'absolute', top: '5px', right: '10px', cursor: 'pointer' }} onClick={handleCloseFooter}>x</button>
                        {adsFooter.fileType === 'VIDEO' ? (
                            <video style={{ maxWidth: '100%', maxHeight: '100px' }} controls autoPlay onClick={handleClick}>
                                <source src={adsFooter.mediaFile} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        ) : (
                            <img style={{ maxWidth: '100%', maxHeight: '100px' }} src={adsFooter.mediaFile} alt={adsFooter.sizename} onClick={handleClick} />
                        )}
                    </div>
            )}
                

                <Modal
                    open={modalIsOpen}
                    onOk={() => setModalIsOpen(false)}
                    onCancel={handleModalClose}
                    width={500}
                    footer={null}
                >
                    <>
                        <div style={{ textAlign: 'center', marginTop: '10px' }}>
                            {canCloseModal ? (
                                <p>You can close the ad now.</p>
                            ) : (
                                <p>You can close the ad in {countdown} seconds.</p>
                            )}
                        </div>
                        {randomAd && (
                            randomAd.fileType === 'VIDEO' ? (
                                <div style={{ textAlign: 'center' }}>
                                    <video style={{ maxWidth: '100%', maxHeight: 'calc(100vh - 200px)' }} autoPlay controls muted onClick={handleClick}>
                                        <source src={randomAd.mediaFile} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                </div>
                            ) : (
                                <div style={{ textAlign: 'center' }}>
                                    <img style={{ maxWidth: '100%', maxHeight: 'calc(100vh - 200px)' }} src={randomAd.mediaFile} alt={randomAd.sizename} onClick={handleClick} />
                                </div>
                            )
                        )}
                    </>
                </Modal>
            </>
        )
    );
}

export default AdsComponent;
