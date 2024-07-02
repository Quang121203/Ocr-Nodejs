import './register.css'
import { useRef } from 'react';
import { useNavigate } from "react-router-dom";
import axios from '../../config/axios';
import { toast } from 'react-toastify';

const Register = () => {
    const usernameInputRef = useRef();
    const passwordInputRef = useRef();
    const re_passwordInputRef = useRef();

    const navigate = useNavigate();

    const onClickRegister = async () => {
        const username = usernameInputRef.current.value.trim();
        const password = passwordInputRef.current.value.trim();
        const re_password = re_passwordInputRef.current.value.trim();
        if (username === "" || password === "" || re_password === "") {
            alert("Please enter full information");
        }
        else if (password !== re_password) {
            alert("Passwords must be same");
        }
        else {
            const res = await axios.post('register', { username, password });
            if (res) {
                if (+res.EC === 1) toast.error(res.EM);
                else {
                    toast.success(res.EM);
                    navigate("/login");
                }
            }
        }

    }
    return (
        <section className="vh-100">
            <div className="container-fluid h-custom">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col-md-9 col-lg-6 col-xl-5">
                        <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
                            className="img-fluid" alt="img" />
                    </div>
                    <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
                        <form>

                            {/* <!-- Email input --> */}
                            <div data-mdb-input-init className="form-outline mb-4">
                                <input type="username" id="form3Example3" className="form-control form-control-lg"
                                    placeholder="Enter a valid user name" ref={usernameInputRef} />
                                <label className="form-label" htmlFor="form3Example3">User name</label>
                            </div>

                            {/* <!-- Password input --> */}
                            <div data-mdb-input-init className="form-outline mb-3">
                                <input type="password" id="form3Example4" className="form-control form-control-lg"
                                    placeholder="Enter password" ref={passwordInputRef} />
                                <label className="form-label" htmlFor="form3Example4">Password</label>
                            </div>

                            <div data-mdb-input-init className="form-outline mb-3">
                                <input type="password" id="form3Example4" className="form-control form-control-lg"
                                    placeholder="Enter re-password" ref={re_passwordInputRef} />
                                <label className="form-label" htmlFor="form3Example4">Re-Password</label>
                            </div>

                            <div className="text-center text-lg-start mt-4 pt-2">
                                <button type="button" className="btn btn-primary btn-lg px-5" onClick={() => onClickRegister()}>
                                    Register
                                </button>
                                <p class="small fw-bold mt-2 pt-1 mb-0">Login<a href="/login"
                                    class="link-danger mx-2">here</a></p>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
            <div
                className="d-flex flex-column flex-md-row text-center text-md-start justify-content-between py-4 px-4 px-xl-5 bg-primary">
                {/* <!-- Copyright --> */}
                <div className="text-white mb-3 mb-md-0">
                    Copyright © 2020. All rights reserved.
                </div>
                {/* <!-- Copyright --> */}
            </div>
        </section>
    );
}

export default Register;

