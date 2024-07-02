import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useSelector } from 'react-redux';
import { selectUser } from '../../redux/userSlice';
import Logout from '../Logout/logout';
import { NavLink } from 'react-router-dom';

const Navbars = () => {
    const user = useSelector(selectUser);

    return (
        <>
            {user.isAdmin ?
                (<Navbar expand="lg" className="bg-body-tertiary py-3">
                    <Container>
                        <NavLink to="ocr" className='navbar-brand'>OCR</NavLink>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="me-auto">
                                <NavLink to="user" className="nav-link">User</NavLink>
                                <NavLink to="pdf" className="nav-link">PDF</NavLink>
                            </Nav>
                            <Logout />
                        </Navbar.Collapse>
                    </Container>

                </Navbar>)
                :
                <></>
            }
        </>

    );
}

export default Navbars;