import { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import axios from '../../config/axios';
import { toast } from 'react-toastify';
import UpdateUser from '../../components/ModalUpdate/updateUser';

const User = () => {
    const [listUser, setListUser] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [userCurrent, setUserCurrent] = useState(null);

    useEffect(() => {
        fetchUser();
    }, [])

    const fetchUser = async () => {
        const response = await axios.get('users');
        if (response && +response.EC === 0) {
            setListUser(response.DT);
        }
    }

    const onClickDelete = async (id) => {
        const response = await axios.delete(`users/${id}`)
        if (response) {
            if (+response.EC === 0) {
                toast.success(response.EM);
                fetchUser();
            }
            else {
                toast.delete(response.EM);
            }
        }
    }

    const onClickShowModal = (id) => {
        setUserCurrent(id)
        setShowModal(true)
    }

    return (
        <div className='container'>
            <Table striped bordered hover className='my-4'>
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Username</th>
                        <th>Created At</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {listUser.length > 0 && listUser.map((user, key) =>
                        <tr key={'key ' + user.id}>
                            <td>{key + 1}</td>
                            <td>{user.username}</td>
                            <td>{new Date(user.createdAt).getDate() + "/" + new Date(user.createdAt).getMonth() + "/" + new Date(user.createdAt).getFullYear()}</td>
                            <td>
                                {user.isAdmin ? "Admin" :
                                    (
                                        <>
                                            <button className="btn btn-danger mx-2" onClick={() => onClickDelete(user.id)}>Delete</button>
                                            <button className="btn btn-primary" onClick={() => onClickShowModal(user.id)}>Update</button>
                                        </>
                                    )

                                }

                            </td>
                        </tr>
                    )
                    }

                </tbody>
            </Table>
            <UpdateUser handleClose={() => { setShowModal(false) }} show={showModal} id={userCurrent} fetchUser={fetchUser} />
        </div>
    );
}

export default User;