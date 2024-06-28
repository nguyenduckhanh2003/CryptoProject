import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const url = "http://localhost:3000/api/users";
  const [data, setData] = useState([]);

  const fetchInfo = () => {
    return fetch(url, {
      method: "GET",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
    })
      .then((response) => {
        console.log(response);
        return response.json();
      })
      .then((d) => {
        console.log(d);
        setData(d);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  useEffect(() => {
    fetchInfo();
  }, []);
  return (
    <>
      <div className="App">
        <h1 style={{ color: "green" }}>using JavaScript inbuilt FETCH API</h1>
        <center>
          {data.map((dataObj, index) => {
            return (
              <div
                style={{
                  width: "15em",
                  backgroundColor: "#35D841",
                  padding: 2,
                  borderRadius: 10,
                  marginBlock: 10,
                }}
              >
                <p style={{ fontSize: 20, color: "white" }}>{dataObj.name}</p>
              </div>
            );
          })}
        </center>
      </div>
    </>
  );
}

export default App;
