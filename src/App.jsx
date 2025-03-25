// @ts-check

import React, { useState } from 'react';
import './App.css';
import Html5QrcodePlugin from './Html5QrcodePlugin.jsx';
import axios from 'axios';

const App = (props) => {
  const queryParams = new URLSearchParams(window.location.search);
  const token = queryParams.get("token");
  const url = queryParams.get("url");
  const [decodedResults, setDecodedResults] = useState('');
  const onNewScanResult = (decodedText, decodedResult) => {
    console.log("App [result]", decodedResult);
    if (url) {
      const headers = token ?
        { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token } :
        { 'Content-Type': 'application/json' };
      axios.post(url,
        {
          "text": decodedText,
          "format": decodedResult.result.format.format,
          "format_name": decodedResult.result.format.formatName,
        },
        {
          headers: headers
        }
      ).then((response) => {
        setDecodedResults(response.statusText);
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