import './App.css';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import { useState } from 'react';
import axios from 'axios';

function App() {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const onChangeFile = (e) => {
    const file = e.target.files[0];
    const type = file.type

    if (type === 'application/pdf') {
      setFile(file);
    }
    else {
      setFile(null);
      alert('Please import a PDF file');
    }

  }

  const onClickOCR = async (e) => {
    if (!file) {
      alert("Please import file")
      return;
    }
    setIsLoading(true);

    const data = new FormData();
    const fileName = Date.now() + file.name;
    data.append("name", fileName);
    data.append("file", file);

    const response = await axios.post('http://localhost:8080/upload', data, {
      responseType: 'blob'
    });
    setIsLoading(false);
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');

  }


  return (
    <div className='container d-flex justify-content-center align-items-center flex-column App'>
      <InputGroup className="mb-3">
        <Form.Control
          placeholder="File"
          type="file"
          onChange={onChangeFile}
        />
      </InputGroup>

      {file ? (
        !isLoading ? (
          <Button variant="primary col-6" onClick={() => onClickOCR()}>OCR</Button>
        ) : (
          <Button variant="secondary col-6">Loading......</Button>
        )
      ) : (
        <Button variant="secondary col-6" onClick={() => alert("Please import file")}>OCR</Button>
      )}


    </div >
  );
}

export default App;
