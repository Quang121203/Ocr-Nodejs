import Button from 'react-bootstrap/Button';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/userSlice';
import { toast } from 'react-toastify';
import axios from '../../config/axios';

const Logout = () => {
    const dispatch = useDispatch();

    const onClickLogout = async () => {
        const res = await axios.get('logout');

        if (res && +res.EC === 0) {
            toast.success(res.EM);
        }

        dispatch(logout());
    }

    return (
        <Button variant="danger" onClick={() => onClickLogout()} className="col-2 mr-4">Logout</Button>
    );
}

export default Logout;
