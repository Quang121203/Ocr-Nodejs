import { useRef, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { toast } from 'react-toastify';
import axios from '../../config/axios';

const UpdateUser = ({ handleClose, show, id, fetchUser }) => {
    const usernameInputRef = useRef();
    const isAdminInputRef = useRef();

    useEffect(() => {
        id && getUser(id);
    }, [show,id])

    const onClickUpdate = async () => {
        const username = usernameInputRef.current.value.trim();
        const isAdmin = isAdminInputRef.current.value;
        if (username === "" || isAdmin === "") {
            alert("Please enter full information");
        }
        else {
            let admin = +isAdmin === 1 ? true : false;
            const response = await axios.put('/users', { id: id, username: username, isAdmin: admin });
            if (response && +response.EC === 0) {
                toast.success(response.EM);
                handleClose();
                fetchUser();
            }
        }
    }

    const getUser = async (id) => {
        const response = await axios.get(`users/${id}`);
        if (response && +response.EC === 0) {
            usernameInputRef.current.value = response.DT.username;
        }
    }

    return (
        <>
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Update Information</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">Username</label>
                        <input className="form-control" id="username" ref={usernameInputRef} />
                    </div>

                    <Form.Select aria-label="Default select example" ref={isAdminInputRef}>
                        <option value="2">isAdmin</option>
                        <option value="1">True</option>
                        <option value="2">False</option>
                    </Form.Select>

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

export default UpdateUser;