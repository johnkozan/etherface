import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import useFileInput from "use-file-input";

import { Spinner } from 'components/Controls/Spinner';


export const FileUploader = ({ accept, children, onFileUpload, ...rest }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileSelect = useFileInput(
    (files) => {
      setFile(files[0]);
    },
    { accept, multiple: false }
  );

  useEffect(() => {
    if (!file) { return; }
    const reader = new FileReader(file);

    reader.onloadstart = () => {
      setLoading(true)
    };

    reader.onloadend = () => {
      setLoading(false)
    };

    reader.onload = e => {
      setResult(e.target.result)
      onFileUpload(e.target.result);
    };

    reader.onError = e => {
      setError(e);
    }

    try {
      reader.readAsText(file);
    } catch (e) {
      setError(e)
    }
  }, [file]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <Button onClick={handleFileSelect} {...rest}>
      { children }
    </Button>
  );
}
