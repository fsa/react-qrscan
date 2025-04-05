// @ts-check

import React, { useState } from 'react';
import './App.css';
import Html5QrcodePlugin from './Html5QrcodePlugin.jsx';
import axios from 'axios';

const App = (props) => {
  let last_code = null;
  const [decodedResults, setDecodedResults] = useState({ data: 'Сканируйте код' });
  const onNewScanResult = (decodedText, decodedResult) => {
    console.log("App [result]", decodedResult);
    if (last_code == decodedResult) {
      return;
    }
    last_code = decodedResult;
    axios.post('/scan',
      {
        "text": decodedText,
        "format": decodedResult.result.format.format,
        "format_name": decodedResult.result.format.formatName,
      },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    ).then((response) => {
      setDecodedResults({ data: response.data.data });
      console.log(response);
    }
    ).catch((error) => {
      setDecodedResults({ data: error.message });
      console.log(error);
    }
    );
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
      <p>{decodedResults['data']}</p>
    </div>
  );
};

export default App;