// @ts-check

import React, { useState } from 'react';
import './App.css';
import Html5QrcodePlugin from './Html5QrcodePlugin.jsx';

const App = (props) => {
  const [decodedResults, setDecodedResults] = useState([]);
  const onNewScanResult = (decodedText, decodedResult) => {
    console.log("App [result]", decodedResult);
    setDecodedResults(decodedText);
  };

  return (
    <div className="App">
      <section className="App-section">
        <Html5QrcodePlugin
          fps={10}
          qrbox={250}
          disableFlip={false}
          qrCodeSuccessCallback={onNewScanResult}
        />
        <p>{decodedResults}</p>
      </section>
    </div>
  );
};

export default App;