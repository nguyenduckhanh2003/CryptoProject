import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/News.css";
import { Card, List, Button, Alert, Spin,Typography, Pagination } from "antd";
import moment from 'moment';
function News() {
  const { Title } = Typography;
  const { Meta } = Card;
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const [visibleCount, setVisibleCount] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12); // Số bài viết mỗi trang

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get('http://localhost:8000/news-coin/all-news-coins');
        setNews(response.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchNews();
  }, []);
  // const showMore = () => {
  //   setVisibleCount(prevCount => prevCount + 3);
  // };
  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  // if (loading) {
  //   return <Spin style={{marginTop:'90px'}} tip="Loading..." />;
  // }

  if (error) {
    return <Alert style={{marginTop:'90px'}} message="Error" description={error.message} type="error" showIcon />;
  }
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentNews = news.slice(startIndex, endIndex);

  const fallbackImageUrl = "https://static.coingecko.com/s/article_thumbnail_placeholder-8094851cd5fca4d391274e81e706ba05ec8b8c98831d4541ff4d12f44e8caca2.png"; // URL ảnh dự phòng
  const handleImageError = (event) => {
    event.target.src = fallbackImageUrl; // Thay thế ảnh bị lỗi bằng ảnh dự phòng
  };
  return (
    <>
      <div style={{ marginTop: "100px" }}></div>
      <gecko-coin-price-marquee-widget locale="en" outlined="true" coin-ids="" initial-currency="usd"></gecko-coin-price-marquee-widget>
      <div style={{ marginTop: "20px" }}></div>
      <div className="container-wrapper">
        <Title level={2} style={{ fontWeight: "700" ,textAlign:'left',marginBottom:'0'}}>
          Latest Crypto News
        </Title>
        <div style={{display:"flex",alignItems:'center',gap:'10px'}}>
          <span>Aggregated by </span>
          <a href="https://cryptopanic.com" style={{display:"flex",alignItems:'center',gap:'5px'}}>
            CryptoPanic
            <img
              height="20"
              width="20"
              class=""
              src="https://static.coingecko.com/s/cryptopanic-logo-on-white-15d53cfd93b5dbb238bb58adfbd2b3ddd69ff41da1a3634aaa8de429be984463.png"
            />
          </a>
        </div>

        <div className="box-news">
        <List
          grid={{ gutter: 16, column: 3 }}
          dataSource={currentNews}
          renderItem={item => (
            <a href={item.link} target="_blank">
              <List.Item key={item.id}>
              <Card cover={<img src={item.image} className="image-news" alt="news" onError={handleImageError}/>}>
                <Meta title={item.title} description={item.source}  />
                <p style={{marginTop:'20px'}}>{moment(item.createdAt).format('DD-MM-YYYY HH:mm:ss')}</p>
              </Card>
            </List.Item>
            </a>
          )}
        />
      </div>
      <div className="pagination" style={{textAlign:'center'}}>
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={news.length}
          onChange={handlePageChange}
          showSizeChanger
        />
      </div>
      </div>
    </>
  );
}

export default News;
