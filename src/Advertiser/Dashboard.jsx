import React, { useState, useEffect } from 'react';
import { Layout, Row, Col, Card, Select } from 'antd';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import moment from 'moment';

const { Header, Content } = Layout;
const { Option } = Select;

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#0d0675', '#30b613','#a4107a'];

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [bestInfo, setBestInfo] = useState(null);
  const [filter, setFilter] = useState('all');
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/v1/advertisement/all-advertisement-stats', {
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

        data.sort((a, b) => new Date(a.asr_createdAt) - new Date(b.asr_createdAt));

        const formattedData = data.map(item => ({
          ...item,
          asr_createdAt: moment(item.asr_createdAt).format('DD/MM/YY')
        }));

        if (filter === 'today') {
          const today = moment().utc().format('DD/MM/YY');
          setData(formattedData.filter(item => item.asr_createdAt === today));
          console.log(formattedData);
          console.log(today);
        } else {
          setData(formattedData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const fetchBestInfo = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/v1/advertisement/all-ads-statistic-highlights', {
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
        setBestInfo(data.best);
      } catch (error) {
        console.error('Error fetching best info:', error);
      }
    };

    fetchData();
    fetchBestInfo();
  }, [filter]);

  const handleFilterChange = (value) => {
    setFilter(value);
  };

  const pieChartData = Object.values(
    data.reduce((accumulator, currentValue) => {
      const { ad_title, totalUsers, total_earning } = currentValue;
      if (!accumulator[ad_title]) {
        accumulator[ad_title] = {
          ad_title,
          totalUsers: 0,
          total_earning: 0,
        };
      }
      accumulator[ad_title].totalUsers += totalUsers;
      accumulator[ad_title].total_earning += total_earning;
      return accumulator;
    }, {})
  );

  const prepareLineChartData = () => {
    const groupedData = data.reduce((accumulator, currentValue) => {
      const { ad_title, totalViews, totalClicks, asr_createdAt } = currentValue;
      if (!accumulator[asr_createdAt]) {
        accumulator[asr_createdAt] = { asr_createdAt };
      }
      if (!accumulator[asr_createdAt][ad_title]) {
        accumulator[asr_createdAt][ad_title] = { totalViews: 0, totalClicks: 0 };
      }
      accumulator[asr_createdAt][ad_title].totalViews += totalViews;
      accumulator[asr_createdAt][ad_title].totalClicks += totalClicks;
      return accumulator;
    }, {});

    const lineChartData = Object.keys(groupedData).map((key) => ({
      ...groupedData[key],
    }));

    return lineChartData;
  };

  const lineChartData = prepareLineChartData();
  const adTitles = Array.from(new Set(data.map((item) => item.ad_title)));

  return (
    <Layout>
      <Header style={{ backgroundColor: '#001529', padding: '0 20px' }}>
        <h2 style={{ color: 'white', margin: '16px 0', textAlign: 'center', fontWeight: 'bold', fontSize: '2.5em' }}>Advertisement Statistics</h2>
      </Header>
      
      <Content style={{ padding: '50px' }}>
        <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
          <Col span={8}>
            <Select defaultValue="all" onChange={handleFilterChange} style={{ width: 200 }}>
              <Option value="all">All</Option>
              <Option value="today">Today</Option>
            </Select>
          </Col>
        </Row>
        
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Card title="Best of Clicks">
                <p style={{ fontSize: '2em', fontWeight: 'bold' }}>{bestInfo?.totalClicks} Clicks</p>
            </Card>
          </Col>
          <Col span={8}>
            <Card title="Best of Views">
              
                <p style={{ fontSize: '2em', fontWeight: 'bold' }}>{bestInfo?.totalViews} Views</p>
            </Card>
          </Col>
          <Col span={8}>
            <Card title="Best of Earning">
                <p style={{ fontSize: '2em', fontWeight: 'bold' }}>{bestInfo?.totalEarning} $</p>
            </Card>
          </Col>
        </Row>
        
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Card title="Views per Advertisement">
              {data.length === 0 ? (
                <p style={{textAlign: 'center', fontSize: '1.5em', fontWeight: 'bold' }}>There is no data</p>
              ) : (
                <LineChart width={500} height={300} data={lineChartData}>
                  <XAxis dataKey="asr_createdAt" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {adTitles.map((title, index) => (
                    <Line key={`${title}-views`} type="monotone" dataKey={`${title}.totalViews`} stroke={COLORS[index % COLORS.length]} name={`${title} Views`} />
                  ))}
                </LineChart>
              )}
            </Card>
          </Col>
          <Col span={12}>
            <Card title="Clicks per Advertisement">
              {data.length === 0 ? (
                <p style={{ textAlign: 'center', fontSize: '1.5em', fontWeight: 'bold' }}>There is no data</p>
              ) : (
                <BarChart width={500} height={300} data={lineChartData}>
                  <XAxis dataKey="asr_createdAt" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {adTitles.map((title, index) => (
                    <Bar key={`${title}-clicks`} dataKey={`${title}.totalClicks`} fill={COLORS[index % COLORS.length]} name={`${title} Clicks`} />
                  ))}
                </BarChart>
              )}
            </Card>
          </Col>
        </Row>
        
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Card title="Users per Advertisement">
              {data.length === 0 ? (
                <p style={{ textAlign: 'center', fontSize: '1.5em', fontWeight: 'bold' }}>There is no data</p>
              ) : (
                <PieChart width={500} height={300}>
                  <Pie
                    data={pieChartData}
                    cx={200}
                    cy={150}
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="totalUsers"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index% COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                )}
              </Card>
            </Col>
            <Col span={12}>
              <Card title="Earnings per Advertisement">
                {data.length === 0 ? (
                  <p style={{ textAlign: 'center', fontSize: '1.5em', fontWeight: 'bold' }}>There is no data</p>
                ) : (
                  <PieChart width={500} height={300}>
                    <Pie
                      data={pieChartData}
                      cx={200}
                      cy={150}
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="total_earning"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                )}
              </Card>
            </Col>
          </Row>
        </Content>
      </Layout>
    );
  };
  
  export default Dashboard;
  