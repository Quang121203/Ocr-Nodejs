import React, { useState, createRef } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import ocr from "../../services/ocrServices";
import axios from '../../config/axios';

export const CropperImage = ({ src, file }) => {
    const [cropData, setCropData] = useState(null);
    const [cropCount, setCropCount] = useState(0);
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const cropperRef = createRef();

    const key = ["Tên công ty", "Số văn bản", "Địa chỉ", "Ngày tháng năm", "Loại", "Nội dung"]


    const getCropData = async () => {
        if (typeof cropperRef.current?.cropper !== "undefined") {
            const src = cropperRef.current?.cropper.getCroppedCanvas().toDataURL();
            setCropData(src);
            setCropCount(cropCount + 1);
            const text = await ocr(src);
            setData([...data, text]);

        }
    };

    const onClickInsert = async () => {
        setIsLoading(true);

        let date = data[3].match(/\d+/g);
        if (!date || date.length != 3) {
            date = "0/0/0";
        }
        else {
            date = `${date[0]}/${date[1]}/${date[2]}`;
        }

        const form = new FormData();
        form.append("name", Date.now() + file.name);
        form.append("file", file);

        form.append("pdfName", data[0].trim());
        form.append("number", data[1].replace(/[^A-Za-zÀ-ỹ\s\d\/\-]/g, '').trim());
        form.append("adress", data[2].replace(/[^A-Za-zÀ-ỹ\s]/g, '').trim());
        form.append("date",date);
        form.append("type", data[4].trim());
        form.append("content", data[5].trim());
        

        const response = await axios.post('ocr', form, {
            responseType: 'blob'
        });

        setIsLoading(false);
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');

    }

    return (
        <div className="container">
            <div className="my-3">


                {cropCount >= 6 ?
                    <>
                        {!isLoading ?
                            <button className="btn btn-primary col-4" onClick={() => onClickInsert()}>
                                Next
                            </button>
                            :
                            <button className="btn btn-secondary col-4" disabled>
                                Loading.....
                            </button>
                        }
                    </>
                    :
                    <>
                        <span className="mx-4">{key[cropCount]}</span>
                        <button onClick={getCropData}>
                            Crop Image
                        </button>
                    </>
                }


            </div>

            <div className="d-flex justify-content-between">
                <div style={{ width: "auto" }}>
                    <Cropper
                        ref={cropperRef}
                        className="col-10"
                        zoomTo={0.5}
                        initialAspectRatio={1}
                        preview=".img-preview"
                        src={src}
                        viewMode={1}
                        minCropBoxHeight={10}
                        minCropBoxWidth={10}
                        background={false}
                        responsive={true}
                        autoCropArea={1}
                        checkOrientation={false}
                        guides={true}
                    />
                </div>

                <img style={{ width: "100%" }} src={cropData} />
            </div>

        </div>
    );
};

export default CropperImage;