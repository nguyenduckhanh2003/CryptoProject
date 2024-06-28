import react,{ useState,useEffect } from "react";
import axios from "axios";
import { Card, List,Button, Alert, Spin } from "antd";
import "../css/CryptoCoinNews.css";
const { Meta } = Card;

const CryptoCoinNews = (props) => {
  const { coinId } = props;
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(4);
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/coin/news-coins-detail?coinId=${coinId}`);
        setNews(response.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const showMore = () => {
    setVisibleCount(prevCount => prevCount + 4);
  };
  if (loading) {
    return <Spin tip="Loading..." />;
  }

  if (error) {
    return <Alert message="Error" description={error.message} type="error" showIcon />;
  }
  const fallbackImageUrl = "https://static.coingecko.com/s/article_thumbnail_placeholder-8094851cd5fca4d391274e81e706ba05ec8b8c98831d4541ff4d12f44e8caca2.png"; // URL ảnh dự phòng
  const handleImageError = (event) => {
    event.target.src = fallbackImageUrl; // Thay thế ảnh bị lỗi bằng ảnh dự phòng
  };
  return (
    <>
       <div className="box-news">
      <List
        grid={{ gutter: 16, column:4 }}
        dataSource={news.slice(0, visibleCount)}
        renderItem={item => (
          <List.Item>
            <a href={item.link} target="_blank">
            <Card  cover={<img src={item.image} className="image-news"/> }  onError={handleImageError} >
              <Meta title={item.title}  description={item.source} />
            </Card>
            </a>
          </List.Item>
        )}
      />
        {visibleCount < news.length && (
        <div className="show-more-button" style={{marginBottom:'60px',textAlign:'center'}}>
          <Button onClick={showMore} type="default" ><b>Read more</b></Button>
        </div>
      )}
    </div>
  
    </>
  )
};

export default CryptoCoinNews;