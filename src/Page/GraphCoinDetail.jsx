import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import Exporting from "highcharts/modules/exporting";
import ExportData from "highcharts/modules/export-data";
import { Anchor, Modal, Segmented, Spin, Table } from "antd";
import axios from "axios";
import { LuExternalLink } from "react-icons/lu";
const columns = [

  {
    title: 'Date',
    dataIndex: 'time',
    render: (text) => {
      return <p className="history-text">{text.split("T")[0]}</p>;
    },
  },
  {
    title: 'Price',
    dataIndex: 'price',
    render: (text, record) => {
      const number = parseFloat(text);
      const formattedNumber = number.toFixed(8);
      const formattedText = "$" + new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 9
      }).format(formattedNumber);
      return <p className="history-text">{formattedText}</p>;
  },
},
  {
    title: 'Volume',
    dataIndex: 'volume',
    render: (text, record) => {
      const number = parseFloat(text);
      const formattedNumber = number.toFixed(0);
      const formattedText = "$" + new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 9
      }).format(formattedNumber);
      return <p className="history-text">{formattedText}</p>;
  },
},
  {
    title: 'Market Cap',
    dataIndex: 'marketCap',
    render: (text, record) => {
      const number = parseFloat(text);
      const formattedNumber = number.toFixed(0);
      const formattedText = "$" + new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 9
      }).format(formattedNumber);
      return <p className="history-text">{formattedText}</p>;
  },
}
];
const GraphCoinDetail = (props) => {
  const { coinKey } = props;
  // console.log(coinKey);
  Exporting(Highcharts);
  ExportData(Highcharts);
  const [data, setData] = useState([]);
  const [dataTable, setDataTable] = useState([]);
  const [timeRange, setTimeRange] = useState("7");
  const [options, setOptions] = useState({});
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  // console.log(data);
  const changeDate = (timeRange) => {
    switch (timeRange) {
      case "7d":
        setTimeRange("7");
        return;
      case "1m":
        setTimeRange("30");
        return;
      case "3m":
        setTimeRange("90");
        return;
      case "1y":
        setTimeRange("365");
        return;
    }
  };
  useEffect(() => {
    asyncFetchData();
  }, [timeRange,coinKey]);

  const asyncFetchData = async () => {
    await axios
      .get(
        `http://localhost:8000/coin/coin-data-detail?coinKey=${coinKey}&day=${timeRange}`
      )
      .then((res) => {
        if (res.status === 200) {
          setData(res.data);
          setDataTable(res.data);
        }
      });
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Chuyển đổi dữ liệu sang định dạng mà Highcharts có thể sử dụng
        const data1 = data.map((item) => ({
          ...item,
          time: new Date(item.time).toLocaleDateString("en-GB"), // Định dạng ngày tháng năm
        }));
        // console.log(data1);
        const formattedData = data.map((item) => [
          new Date(item.time).getTime(),
          item.price,
        ]);
        // console.log(formattedData);
        setOptions({
          chart: {
            zooming: {
              type: "x",
            },
          },
          title: {
            text: "",
            align: "left",
          },
          exporting: {
            enabled: true,
            buttons: {
              contextButton: {
                menuItems: [
                  "viewFullscreen",
                  "printChart",
                  "separator",
                  "downloadPNG",
                  "downloadJPEG",
                  "downloadPDF",
                  "downloadSVG",
                  "downloadCSV",
                  "downloadXLS",
                  {
                    text: "View data",
                    onclick: () => showModal(),
                  },
                ],
                align: "left",
                verticalAlign: "top",
                y: -10,
                x: -15,
              },
            },
          },
          xAxis: {
            type: "datetime",
            tickInterval: 24 * 3600 * 1000, // Mỗi ngày
            startOnTick: false,
          },
          yAxis: {
            title: {
              text: "",
            },
            opposite: true,
          },
          legend: {
            enabled: false,
          },
          tooltip: {
            shared: true,
            useHTML: true,
            formatter: function () {
              var point = this.points[0]; // Giả sử bạn chỉ có một series, hoặc bạn muốn hiển thị volume cho series đầu tiên
              var s =
                "<b>" +
                Highcharts.dateFormat("%A, %b %e, %Y", point.x) +
                "</b>";
              s +=
                "<br/>" +
                "Price: <b>" +
                point.y.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                }) +
                "</b>";

              // Tìm đối tượng dữ liệu tương ứng dựa trên thời gian của điểm dữ liệu
              var correspondingData = data.find(
                (d) => new Date(d.time).getTime() === point.x
              );
              if (correspondingData) {
                s +=
                  "<br/>Vol: <b>" +
                  correspondingData.volume.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  }) +
                  "</b>";
              }

              return s;
            },
          },
          responsive: {
            rules: [
              {
                condition: {
                  maxWidth: 500,
                },
                chartOptions: {
                  legend: {
                    layout: "horizontal",
                    align: "center",
                    verticalAlign: "bottom",
                  },
                },
              },
            ],
          },
          plotOptions: {
            area: {
              fillColor: {
                linearGradient: {
                  x1: 0,
                  y1: 0,
                  x2: 0,
                  y2: 1,
                },
                stops: [
                  [0, Highcharts.getOptions().colors[0]],
                  [
                    1,
                    Highcharts.color(Highcharts.getOptions().colors[0])
                      .setOpacity(0)
                      .get("rgba"),
                  ],
                ],
              },
              marker: {
                radius: 2,
              },
              lineWidth: 1,
              states: {
                hover: {
                  lineWidth: 1,
                },
              },
              threshold: null,
            },
          },
          series: [
            {
              type: "area",
              name: "Giá",
              data: formattedData.reverse(),
              point: {
                events: {
                  mouseOver: function () {
                    var chart = this.series.chart;
                    // Cập nhật vị trí của plotLine khi di chuột qua điểm dữ liệu
                    chart.xAxis[0].removePlotLine("hover-line"); // Xóa plotLine cũ
                    chart.xAxis[0].addPlotLine({
                      // Thêm plotLine mới tại vị trí hiện tại của con trỏ
                      id: "hover-line",
                      color: "#dddd",
                      width: 2,
                      value: this.x, // Vị trí x của điểm dữ liệu hiện tại
                    });
                  },
                },
              },
            },
          ],
          tooltip: {
            shared: true,
            useHTML: true,
            formatter: function () {
              var point = this.points[0]; // Giả sử bạn chỉ có một series, hoặc bạn muốn hiển thị volume cho series đầu tiên
              var s =
                "<b>" +
                Highcharts.dateFormat("%A, %b %e, %Y", point.x) +
                "</b>";
              s +=
                "<br/>" +
                "Price: <b>" +
                point.y.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                }) +
                "</b>";

              // Tìm đối tượng dữ liệu tương ứng dựa trên thời gian của điểm dữ liệu
              var correspondingData = data.find(
                (d) => new Date(d.time).getTime() === point.x
              );
              if (correspondingData) {
                s +=
                  "<br/>Vol: <b>" +
                  correspondingData.volume.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  }) +
                  "</b>";
              }

              return s;
            },
          },
        });
      } catch (error) {
        setError(error.message);
        console.error("Fetch error:", error);
      }
    };

    fetchData();
  }, [data]);

  if (error) {
    return <div>Error: {error}</div>;
  }
  const sortedData = dataTable.sort((a, b) => new Date(b.time) - new Date(a.time));

  return (
    <div style={{ padding: "20px" }}>
      <Anchor
        direction="horizontal"
        replace
        defaultActiveKey="#"
        items={[
          {
            key: "chart",
            href: "#chart",
            title: "Overview",
          },
          {
            key: "news",
            href: "#news",
            title: "News",
          },
        ]}
      />
      <br />
      <Segmented
        options={["7d", "1m", "3m", "1y"]}
        defaultValue="7d"
        onChange={(value) => {
          changeDate(value);
        }}
      />
      {data.length > 0 ? ( // Kiểm tra dữ liệu trước khi render biểu đồ
        <div id="container">
          <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
      ) : (
        <Spin tip="Loading" size="large" style={{ marginTop: "50px" }}>
          {error}
        </Spin>
      )}
      <Modal
        title="Historial Data"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
         width="{fitContent}"
      >
         <Table  columns={columns} rowKey={"id"} dataSource={sortedData} />
      </Modal>
    </div>
  );
};

export default GraphCoinDetail;
