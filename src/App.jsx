// @ts-check

import React, { useState } from 'react';
import './App.css';
import Html5QrcodePlugin from './Html5QrcodePlugin.jsx';
import axios from 'axios';

const App = (props) => {
  const queryParams = new URLSearchParams(window.location.search);
  const token = queryParams.get("token");
  const url = queryParams.get("url");
  console.log(token, url)
  const [decodedResults, setDecodedResults] = useState();
  const onNewScanResult = (decodedText, decodedResult) => {
    console.log("App [result]", decodedResult);
    if (url && token) {
      axios.post(url,
        decodedResult,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
          }
        }
      ).then((response) => {
        setDecodedResults(response.data);
        console.log(response);
      })
      .catch((error) => {
        setDecodedResults(error.message);
        console.log(error);
      });
    } else {
      setDecodedResults(decodedResult);
    }
  };

  return (
    <div className="App">
      <section className="App-section">
        <Html5QrcodePlugin
          fps={10}
          qrbox={250}
          disableFlip={true}
          qrCodeSuccessCallback={onNewScanResult}
        />
      </section>
      <p>{decodedResults}</p>
    </div>
  );
};

export default App;