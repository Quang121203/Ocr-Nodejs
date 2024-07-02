import { useRef, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { toast } from 'react-toastify';
import axios from '../../config/axios';

const UpdatePDF = ({ handleClose, show, id, getListPDF }) => {
    const nameInputRef = useRef();
    const numberInputRef = useRef();
    const addressInputRef = useRef();
    const dateInputRef = useRef(null);
    const typeInputRef = useRef();
    const contentInputRef = useRef();

    useEffect(() => {
        id && getPDF(id);
    }, [show, id])

    const onClickUpdate = async () => {
        const name = nameInputRef.current.value.trim();
        const number = numberInputRef.current.value.trim();
        const address = addressInputRef.current.value.trim();
        const date = dateInputRef.current.value.trim();
        const content = contentInputRef.current.value.trim();
        const type = typeInputRef.current.value.trim();

        if (name === "" || number === "" || address === "" || date === "" || content === "" || type === "") {
            alert("Please enter full information");
        }
        else {
            var parts = date.split('-');

            var yyyy = parts[0];
            var mm = parts[1];
            var dd = parts[2];

            var formattedDate = dd + '/' + mm + '/' + yyyy;
            const response = await axios.put('/pdf', { id, name, number, adress: address, content: content, type: type, date: formattedDate });
            if (response && +response.EC === 0) {
                toast.success(response.EM);
                handleClose();
                getListPDF();
            }
        }
    }

    const getPDF = async (id) => {
        const response = await axios.get(`pdf/${id}`);
        if (response && +response.EC === 0) {
            nameInputRef.current.value = response.DT.name;
            numberInputRef.current.value = response.DT.number;
            addressInputRef.current.value = response.DT.adress;
            typeInputRef.current.value = response.DT.type;
            contentInputRef.current.value = response.DT.content;

            var parts = response.DT.date.split('/');

            var dd = parts[0];
            var mm = parts[1];
            var yyyy = parts[2];

            var formattedDate = yyyy + '-' + (mm.length === 1 ? '0' + mm : mm) + '-' + (dd.length === 1 ? '0' + dd : dd);
            dateInputRef.current.value = formattedDate;
        }
    }

    return (
        <>
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Update PDF</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Name</label>
                        <input className="form-control" id="name" ref={nameInputRef} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="number" className="form-label">Number</label>
                        <input className="form-control" id="number" ref={numberInputRef} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="address" className="form-label">Address</label>
                        <input className="form-control" id="address" ref={addressInputRef} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label" htmlFor="date">Date</label>
                        <input id="date" type="date" ref={dateInputRef} className="form-control" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="type" className="form-label">Type</label>
                        <input className="form-control" id="type" ref={typeInputRef} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="content" className="form-label">Content</label>
                        <input className="form-control" id="content" ref={contentInputRef} />
                    </div>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => onClickUpdate()}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default UpdatePDF;