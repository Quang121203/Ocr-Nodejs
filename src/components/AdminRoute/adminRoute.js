import { useSelector } from 'react-redux';
import { selectUser } from '../../redux/userSlice';
import { Navigate } from "react-router-dom";


const AdminRoute = ({ children }) => {

    const user = useSelector(selectUser);

    return (
        <>
            {user.isAdmin ? children : (<Navigate to="/" />)}
        </>

    );
}

export default AdminRoute