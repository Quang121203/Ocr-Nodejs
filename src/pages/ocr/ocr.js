import './ocr.css';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import { useState } from 'react';
import axios from '../../config/axios';
import convertPdfToImages from '../../services/fileServices';
import CropperImage from '../../components/Cropper/cropper';

import { getInfomation, handleUpload } from '../../services/ocrServices';

const Ocr = () => {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [src, setSrc] = useState(null);

  const onChangeFile = (e) => {
    const _file = e.target.files[0];
    if (_file) {
      const type = _file.type

      if (type === 'application/pdf') {
        setFile(_file);
      }
      else {
        setFile(null);
        alert('Please import a PDF file');
      }
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

    const response = await axios.post('upload', data, {
      responseType: 'blob'
    });
    setIsLoading(false);
    const blob = new Blob([response], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');

  }


  const onClickOCR2 = async (e) => {
    if (!file) {
      alert("Please import file")
      return;
    }
    const image = await convertPdfToImages(file);
    setSrc(image);
  }

  const onClickOCR3 = async (e) => {
    if (!file) {
      alert("Please import file");
      return;
    }

    try {
      setIsLoading(true);

      const imageBase64 = await convertPdfToImages(file);
      const image = new Image();
      image.src = imageBase64;

      image.onload = async () => {
        const { x0, y0, x1, y1, space } = await getInfomation(image);

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = x1 - x0;
        canvas.height = y1 - y0;

        ctx.drawImage(image, x0, y0, x1 - x0 - 150, y1 - y0, 0, 0, x1 - x0, y1 - y0);

        canvas.toBlob(async (blob) => {
          const croppedFile = new File([blob], 'cropped-image.png', { type: 'image/png' });
          const number = await handleUpload(croppedFile);
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(image, x0 + 150, y0, x1 - x0 + 5, y1 - y0, 0, 0, x1 - x0, y1 - y0);

          canvas.toBlob(async (blob) => {
            const croppedFile = new File([blob], 'cropped-image.png', { type: 'image/png' });
            const addressDate = await handleUpload(croppedFile);

            let positionAddress = addressDate.search("ngày");
            let address = (addressDate.slice(0, positionAddress)).replace(/[^A-Za-zÀ-ỹ\s]/g, '').trim();
            let date = addressDate.match(/\d+/g);
            date = date && date.length === 3 ? `${date[0]}/${date[1]}/${date[2]}` : '0/0/0';

            var s = '';
            for (var i = 0; i < space; i++) {
              s += " ";
            }

            const data = new FormData();
            const fileName = Date.now() + file.name;
            data.append("name", fileName);
            data.append("file", file);

            data.append("number", number);
            data.append("adress", address);
            data.append("date", date);
            data.append("string", number + s + addressDate);

            const response = await axios.post('ocr3', data, {
              responseType: 'blob'
            });

            setIsLoading(false);

            const blobResponse = new Blob([response], { type: 'application/pdf' });
            const url = URL.createObjectURL(blobResponse);
            window.open(url, '_blank');

          }, 'image/png');

        }, 'image/png');
      };

    } catch (error) {
      console.error('Error processing image:', error);
      alert('Error processing image');
      setIsLoading(false);
    }
  };




  return (
    <div className='container d-flex my-4 align-items-center flex-column ocr'>
      <InputGroup className="mb-3">
        <Form.Control
          placeholder="File"
          type="file"
          onChange={onChangeFile}
        />
      </InputGroup>

      {file ? (
        !isLoading ? (
          <div className='d-flex '>
            <Button variant="primary col-4" onClick={() => onClickOCR()}>OCR</Button>
            <Button variant="primary col-4 mx-2" onClick={() => onClickOCR2()}>OCR2</Button>
            <Button variant="primary col-4" onClick={() => onClickOCR3()}>OCR3</Button>
          </div>

        ) : (
          <Button variant="secondary col-6">Loading......</Button>
        )
      ) : (
        <Button variant="secondary col-6" onClick={() => alert("Please import file")}>OCR</Button>
      )}

      {src && file &&
        <CropperImage src={src} file={file} />
      }

    </div >

  );
}

export default Ocr;
