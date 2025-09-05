import { useState, useEffect, useRef } from 'react';

export const useImportWorker = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressMessage, setProgressMessage] = useState('');
  const [error, setError] = useState(null);
  const workerRef = useRef(null);

  useEffect(() => {
    // Vite-specific worker instantiation
    const worker = new Worker(new URL('../workers/importWorker.js', import.meta.url), {
      type: 'module'
    });
    workerRef.current = worker;

    worker.onmessage = (e) => {
      const { type, message } = e.data;
      if (type === 'progress') {
        setProgressMessage(message);
      } else if (type === 'error') {
        setError(message);
        setIsProcessing(false);
      } else if (type === 'done') {
        setProgressMessage(message);
        setIsProcessing(false);
      }
    };

    worker.onerror = (err) => {
      setError(`Worker error: ${err.message}`);
      setIsProcessing(false);
    };

    // Terminate worker on component unmount
    return () => {
      worker.terminate();
    };
  }, []);

  const startImport = (file, platform) => {
    if (workerRef.current && !isProcessing) {
      setIsProcessing(true);
      setError(null);
      setProgressMessage('Sending file to worker...');
      workerRef.current.postMessage({ type: 'IMPORT_FILE', file, platform });
    }
  };

  return { isProcessing, progressMessage, error, startImport };
};
