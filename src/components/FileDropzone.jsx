import React, { useState, useCallback } from 'react';
import { useImportWorker } from '../hooks/useImportWorker';

const FileDropzone = () => {
  const [platform, setPlatform] = useState('chatgpt'); // Default platform
  const { isProcessing, progressMessage, error, startImport } = useImportWorker();
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      startImport(file, platform);
    }
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      startImport(file, platform);
    }
  }, [platform, startImport]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    // This is necessary to allow a drop
  }, []);

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  // Basic styling for the dropzone
  const dropzoneStyle = {
    border: `3px dashed ${isDragging ? 'royalblue' : '#ccc'}`,
    padding: '40px 20px',
    textAlign: 'center',
    transition: 'border .24s ease-in-out',
    borderRadius: '10px',
    cursor: 'pointer',
    marginTop: '20px',
  };

  const radioContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    marginBottom: '20px',
  };

  if (isProcessing) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h2>Processing File...</h2>
        <p>{progressMessage}</p>
        {/* Could add a spinner here */}
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
        <h2>Import Error</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px' }}>
      <h2>Import Your Chat Archive</h2>
      <p>Select the platform your export is from and drop the file below.</p>

      <div style={radioContainerStyle}>
        <label>
          <input type="radio" value="chatgpt" checked={platform === 'chatgpt'} onChange={(e) => setPlatform(e.target.value)} />
          ChatGPT (.zip)
        </label>
        <label>
          <input type="radio" value="whatsapp" checked={platform === 'whatsapp'} onChange={(e) => setPlatform(e.target.value)} />
          WhatsApp (.zip or .txt)
        </label>
        <label>
          <input type="radio" value="ucajson" checked={platform === 'ucajson'} onChange={(e) => setPlatform(e.target.value)} />
          UCA JSON (.json)
        </label>
      </div>

      <div
        style={dropzoneStyle}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onClick={() => document.getElementById('file-upload-input').click()}
      >
        <input
          type="file"
          id="file-upload-input"
          onChange={handleFileChange}
          style={{ display: 'none' }}
          accept=".zip,.txt,.json"
        />
        <p><strong>Drag and drop your file here</strong></p>
        <p>or click to select a file</p>
        <p style={{fontSize: '0.8em', color: '#666', marginTop: '10px'}}>
          All processing is done in your browser. Your data never leaves your computer.
        </p>
      </div>
    </div>
  );
};

export default FileDropzone;
