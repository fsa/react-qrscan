// @ts-check

import React, { useState } from 'react';
import './QrCodeScanner.css';
import Html5QrCodePlugin from './components/Html5QrCodePlugin';
import axios from 'axios';

const QrCodeScanner = (props) => {
  let last_code = null;
  const [decodedResults, setDecodedResults] = useState({ data: 'Сканируйте код' });
  const onNewScanResult = (decodedText, decodedResult) => {
    console.log("App [result]", decodedResult);
    if (last_code == decodedText) {
      return;
    }
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
      setDecodedResults(response.data);
      last_code = decodedText;
    }
    ).catch((error) => {
      setDecodedResults({ data: error.message });
    }
    );
  };

  return (
    <div className="App">
      <section className="App-section">
        <Html5QrCodePlugin
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

export default QrCodeScanner;