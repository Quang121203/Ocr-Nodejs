import { useSelector} from 'react-redux';
import { selectUser} from '../../redux/userSlice';
import { Navigate } from "react-router-dom";
const AuthRoute = ({ children }) => {
   
    const user = useSelector(selectUser);
  
    return (
        <>
            {user.username==='' ? children : (<Navigate to="/ocr" />)}
        </>

    );
}

export default AuthRoute