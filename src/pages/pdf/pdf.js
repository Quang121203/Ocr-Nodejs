import { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import axios from '../../config/axios';
import { toast } from 'react-toastify';
import UpdatePDF from '../../components/ModalUpdate/updatePDF';

const PDF = () => {
    const [listPDF, setListPDF] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [pdfCurrent, setPdfCurrent] = useState(null);


    useEffect(() => {
        getListPDF();
    }, [])

    const getListPDF = async () => {
        const response = await axios.get('pdf');
        if (response && +response.EC === 0) {
            setListPDF(response.DT);
        }
    }

    const onClickDelete =async (fileName)=>{
        const response = await axios.delete(`pdf/${fileName}`);
        if (response && +response.EC === 0) {
            toast.success(response.EM);
            getListPDF();
        }
    }

    const onClickShowModal = (id) => {
        setPdfCurrent(id)
        setShowModal(true)
    }

    return (
        <div className='container'>
            <Table striped bordered hover className='my-4'>
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Name</th>
                        <th>Number</th>
                        <th>Address</th>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Content</th>
                        <th>Create At</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {listPDF.length > 0 && listPDF.map((pdf, key) =>
                        <tr key={'key ' + pdf.id}>
                            <td>{key + 1}</td>
                            <td>{pdf.name}</td>
                            <td>{pdf.number}</td>
                            <td>{pdf.adress}</td>
                            <td>{pdf.date}</td>
                            <td>{pdf.type}</td>
                            <td>{pdf.content}</td>
                            <td>{new Date(pdf.createdAt).getDate() + "/" + new Date(pdf.createdAt).getMonth() + "/" + new Date(pdf.createdAt).getFullYear()}</td>
                            <td>
                                <>
                                    <button className="btn btn-danger mx-2" onClick={() => onClickDelete(pdf.fileName)}>Delete</button>
                                    <button className="btn btn-primary" onClick={() => onClickShowModal(pdf.id)}>Update</button>
                                </>
                            </td>
                        </tr>
                    )
                    }

                </tbody>
            </Table>
            <UpdatePDF handleClose={() => { setShowModal(false) }} show={showModal} id={pdfCurrent} getListPDF={getListPDF} />
        </div>
    );
}

export default PDF;