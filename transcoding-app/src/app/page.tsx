"use client"; // This enables client-side features in the component

import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

const Home: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [formats, setFormats] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [transcodeProgress, setTranscodeProgress] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<string>('');

  const onDrop = (acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
  });

  const handleFormatChange = (format: string, checked: boolean) => {
    setFormats((prev) =>
      checked ? [...prev, format] : prev.filter((f) => f !== format)
    );
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      alert('Please upload a folder containing videos.');
      return;
    }
    if (formats.length === 0) {
      alert('Please select at least one output format.');
      return;
    }

    const formData = new FormData();
    files.forEach((file) => {
      formData.append('videos', file);
    });

    // Add formats as a JSON string to FormData
    formData.append('formats', JSON.stringify(formats));

    try {
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            progressEvent.total ? (progressEvent.loaded * 100) / progressEvent.total : 0
          );
          setUploadProgress(percentCompleted);
        },
      });
      setStatusMessage(response.data.message);

      // Poll for transcoding progress
      const intervalId = setInterval(async () => {
        const progressRes = await axios.get('http://localhost:5000/progress');
        setTranscodeProgress(progressRes.data.progress);
        if (progressRes.data.progress === 100) {
          clearInterval(intervalId);
          setStatusMessage('Transcoding completed!');
        }
      }, 1000);
    } catch (error) {
      console.error(error);
      alert('An error occurred during the upload.');
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <h1 style={styles.header}>Video Transcoder</h1>

        <div {...getRootProps()} style={styles.dropzone}>
          <input {...getInputProps()} directory="true" webkitdirectory="true" mozdirectory="true" />
          <p style={styles.dropzoneText}>Drag and drop a folder here, or click to select files</p>
        </div>

        <div style={styles.section}>
          <h3 style={styles.subHeader}>Selected Files:</h3>
          <ul style={styles.fileList}>
            {files.map((file) => (
              <li key={file.name} style={styles.fileItem}>{file.name}</li>
            ))}
          </ul>
        </div>

        <div style={styles.section}>
          <h3 style={styles.subHeader}>Select Output Formats:</h3>
          <div style={styles.formatOptions}>
            {['1080p', '720p', '480p', '360p'].map((format) => (
              <label key={format} style={styles.checkboxLabel}>
                <Checkbox onCheckedChange={(checked) => handleFormatChange(format, checked)} /> {format}
              </label>
            ))}
          </div>
        </div>

        <Button variant="outline" onClick={handleUpload} style={styles.uploadButton}>Transcode</Button>

        <div style={styles.progressContainer}>
          <h3 style={styles.progressText}>Upload Progress: {uploadProgress}%</h3>
          <h3 style={styles.progressText}>Transcoding Progress: {transcodeProgress}%</h3>
          <h3 style={styles.statusMessage}>{statusMessage}</h3>
        </div>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#121212', // Dark background for the entire page
  },
  container: {
    maxWidth: '650px',
    margin: 'auto',
    padding: '20px',
    fontFamily: "'Roboto', sans-serif",
    color: '#f5f5f5', // Light text for readability
    backgroundColor: '#1e1e1e', // Darker background for container
    borderRadius: '10px',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.7)', // Heavier shadow for depth in dark mode
    textAlign: 'center',
  },
  header: {
    fontSize: '28px',
    fontWeight: '600',
    color: '#ffffff', // White text for header
    marginBottom: '25px',
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)', // Subtle shadow for text in dark mode
  },
  dropzone: {
    border: '2px dashed #76c7c0', // Complementary color for dark mode
    padding: '25px',
    borderRadius: '8px',
    textAlign: 'center',
    cursor: 'pointer',
    backgroundColor: '#333333', // Darker shade for dropzone
    transition: 'background-color 0.3s ease',
  },
  dropzoneText: {
    color: '#76c7c0', // Same color as the dropzone border
    fontWeight: '500',
    fontSize: '16px',
  },
  section: {
    marginTop: '30px',
  },
  subHeader: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#e0e0e0', // Light gray for subheaders
    marginBottom: '15px',
  },
  fileList: {
    listStyle: 'none',
    paddingLeft: '0',
  },
  fileItem: {
    padding: '8px 0',
    fontSize: '14px',
    color: '#bbbbbb', // Light gray for file items
  },
  formatOptions: {
    display: 'flex',
    justifyContent: 'space-evenly',
    flexWrap: 'wrap',
    gap: '10px',
    padding: '10px 0',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '16px',
    backgroundColor: '#333333', // Dark background for checkboxes
    padding: '8px',
    borderRadius: '4px',
    color: '#76c7c0', // Light color for checkbox text
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.6)', // Slight shadow for buttons in dark mode
    cursor: 'pointer',
    transition: 'transform 0.2s ease',
  },
  uploadButton: {
    marginTop: '30px',
    width: '100%',
    padding: '12px',
    fontSize: '18px',
    fontWeight: '600',
    backgroundColor: '#76c7c0', // Complementary color for button
    color: '#1e1e1e', // Dark text for contrast
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  progressContainer: {
    marginTop: '30px',
  },
  progressText: {
    fontSize: '16px',
    fontWeight: '500',
    color: '#f5f5f5', // White text for progress
    marginTop: '10px',
  },
  statusMessage: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#4caf50', // Green for success message
    marginTop: '15px',
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
  },
};

export default Home;
