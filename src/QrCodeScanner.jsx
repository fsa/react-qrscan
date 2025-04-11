// @ts-check

import React, { useState } from 'react';
import './QrCodeScanner.css';
import Html5QrCodePlugin from './components/Html5QrCodePlugin';
import axios from 'axios';

const QrCodeScanner = (props) => {
  const [decodedResults, setDecodedResults] = useState('Сканируйте код');
  const [editable, setEditable] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [codeId, setCodeId] = useState(null);
  const [editedDescription, setEditedDescription] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const onNewScanResult = (decodedText, decodedResult) => {
    setErrorMessage('Отправка кода на сервер...')
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
      setErrorMessage('');
      setCodeId(response.data.id);
      setDecodedResults(response.data.data);
      setEditable(response.data.editable);
      setEditedDescription(response.data.description || '');
      setEditMode(false);
    }
    ).catch((error) => {
      setErrorMessage(error.message);
      setEditable(false);
      setEditMode(false);
    }
    );
  };

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleDescriptionChange = (e) => {
    setEditedDescription(e.target.value);
  };

  const handleSaveDescription = () => {
    //setErrorMessage('Сохраняем описание кода...');
    setErrorMessage(JSON.stringify({
      id: codeId,
      description: editedDescription
    }));
    axios.post('/scan/update-description',
      {
        id: codeId,
        description: editedDescription
      },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    ).then((response) => {
      setErrorMessage('');
      setEditMode(false);
    }).catch((error) => {
      //setErrorMessage(error.message);
    });
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditedDescription(decodedResults || '');
  };

  return (
    <div className="App">
      <div>{errorMessage}</div>
      <section className="App-section">
        <Html5QrCodePlugin
          fps={10}
          qrbox={250}
          disableFlip={true}
          qrCodeSuccessCallback={onNewScanResult}
        />
      </section>
      {editMode ? (
        <div className="edit-form">
          <p>{decodedResults}</p>
          <textarea
            value={editedDescription}
            onChange={handleDescriptionChange}
            rows={4}
            cols={50}
          />
          <div className="edit-buttons">
            <button onClick={handleSaveDescription}>Сохранить</button>
            <button onClick={handleCancelEdit}>Отмена</button>
          </div>
        </div>
      ) : (
        <div className="result-display">
          <p>{decodedResults}</p>
          <p>{editedDescription}</p>
          {editable && (
            <button onClick={handleEditClick}>Редактировать описание</button>
          )}
        </div>
      )}
    </div>
  );
};

export default QrCodeScanner;