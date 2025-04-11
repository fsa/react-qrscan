// @ts-check

import React, { useState } from 'react';
import './QrCodeScanner.css';
import Html5QrCodePlugin from './components/Html5QrCodePlugin';
import axios from 'axios';

const QrCodeScanner = (props) => {
  const [decodedResults, setDecodedResults] = useState('Сканируйте код');
  const [editable, setEditable] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedDescription, setEditedDescription] = useState('');

  const onNewScanResult = (decodedText, decodedResult) => {
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
      setDecodedResults(response.data.data);
      setEditable(response.data.editable);
      setEditedDescription(response.data.description || '');
      setEditMode(false);
    }
    ).catch((error) => {
      setDecodedResults(error.message);
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
    axios.post('/scan/update-description',
      {
        id: null,
        new_description: editedDescription
      },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    ).then((response) => {
      setDecodedResults(response.data);
      setEditMode(false);
    }).catch((error) => {
      setDecodedResults(error.message);
    });
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditedDescription(decodedResults || '');
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
      {editMode ? (
        <div className="edit-form">
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
          <p>{decodedResults} {editedDescription}</p>
          {editable && (
            <button onClick={handleEditClick}>Редактировать описание</button>
          )}
        </div>
      )}
    </div>
  );
};

export default QrCodeScanner;