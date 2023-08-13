import { MDBInput } from "mdb-react-ui-kit";
import { useState, useEffect } from "react";
import { useLoginUserMutation, useRegisterUserMutation } from "../services/authApi";
import { toast } from "react-toastify";
import { useHistory } from "react-router"
import { useAppDispatch } from "../app/hooks";
import { setUser } from "../features/authSlice";
import Role from "../models/Role";
import axios from "axios";
const initialState = {
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: ""
}
export const Auth = () => {

    const [formValue, setFormValue] = useState(initialState);
    const { name, phone, email, password, confirmPassword } = formValue;
    const [showRegister, setShowRegister] = useState(false);
    const history = useHistory();
    const dispatch = useAppDispatch();
    const handleChange = (e: any) => {
        setFormValue({ ...formValue, [e.target.name]: e.target.value });
    };
    const [errorName, setErrorName] = useState('');
    const [errorPhone, setErrorPhone] = useState('');
    const [errorEmail, setErrorEmail] = useState('');
    const [errorPassword, setErrorPassword] = useState('');
    const roleUser = new Role(2, "ROLE_USER");


    const [RegisterUser, {
        data: registerData,
        isSuccess: isRegisSuccess,
        isError: isRegisError,
        error: regisError
    }
    ] = useRegisterUserMutation();

    const handleLogin = async () => {
        await axios.post("http://localhost:8080/api/auth/authenticate", {
            email: email,
            password: password
        }).then(response => {
            dispatch(setUser({ name: response.data.email, token: response.data.access_token }));
            toast.success("User Login Successfully");
            history.push('/search');

        }).catch(error => {
            toast.error(error.response.data.error);
            console.log(error);
        });

    };

    const handleRegister = async () => {
        if (confirmPassword !== password) {
            toast.error("Passwords do not match");
        } else {
            await RegisterUser({ name, phone, email, password, roles: [roleUser] });
        }
    };


    useEffect(() => {
        if (isRegisSuccess && registerData) {
            toast.success("User registration Successfully");
            setShowRegister(false);
        }
        if (isRegisError && regisError) {
            toast.error("User registration failed");
            // console.log(regisError);
            const { name: dataErrorName, phone: dataErrorPhone, email: dataErrorEmail, password: dataErrorPassword } = (regisError as any).data;
            if (dataErrorName) { setErrorName(dataErrorName) } else { setErrorName('') };
            if (dataErrorPhone) { setErrorPhone(dataErrorPhone) } else { setErrorPhone('') };
            if (dataErrorEmail) { setErrorEmail(dataErrorEmail) } else { setErrorEmail("") };
            if (dataErrorPassword) { setErrorPassword(dataErrorPassword) } else { setErrorPassword('') };
        }
    }, [isRegisSuccess, registerData, isRegisError, regisError]);

    return (
        <div className="container py-4 h-100">
            <div className="row d-flex justify-content-center align-items-center h-100">
                <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                    <div className="card bg-dark text-white" style={{ borderRadius: "1rem" }}>
                        <div className="card-body p-4 text-center">
                            <div className="mb-md-5 mt-md-4 pb-5">
                                <h2 className="fw-bold mb-2 text-uppercase">
                                    {!showRegister ? "Login" : "Register"}
                                </h2>
                                <p className="text-white-50 mb-4">
                                    {!showRegister
                                        ? "Please enter your Email & Password"
                                        : "Please enter User detail"}
                                </p>
                                {showRegister && (
                                    <>
                                        {errorName && <p className="error-message m-0">{errorName}</p>}
                                        <div className="form-outline form-white mb-4">
                                            <MDBInput
                                                type="text"
                                                name="name"
                                                value={name}
                                                onChange={handleChange}
                                                label="Name"
                                                className="form-control form-control-lg" />
                                        </div>
                                        {errorPhone && <p className="error-message m-0">{errorPhone}</p>}
                                        <div className="form-outline form-white mb-4">
                                            <MDBInput
                                                type="text"
                                                name="phone"
                                                value={phone}
                                                onChange={handleChange}
                                                label="Phone"
                                                className="form-control form-control-lg" />
                                        </div>
                                    </>
                                )}
                                {errorEmail && <p className="error-message m-0">{errorEmail}</p>}
                                <div className="form-outline form-white mb-4">
                                    <MDBInput
                                        type="email"
                                        name="email"
                                        value={email}
                                        onChange={handleChange}
                                        label="Email"
                                        className="form-control form-control-lg" />
                                </div>
                                {errorPassword && <p className="error-message m-0">{errorPassword}</p>}
                                <div className="form-outline form-white mb-4">
                                    <MDBInput
                                        type="password"
                                        name="password"
                                        value={password}
                                        onChange={handleChange}
                                        label="Password"
                                        className="form-control form-control-lg" />
                                </div>
                                {showRegister && (
                                    <>

                                        <div className="form-outline form-white mb-4">
                                            <MDBInput
                                                type="password"
                                                name="confirmPassword"
                                                value={confirmPassword}
                                                onChange={handleChange}
                                                label="Confirm Password"
                                                className="form-control form-control-lg" />
                                        </div>
                                    </>
                                )}
                                {!showRegister
                                    ? (
                                        <button className="btn btn-outline-light btn-lg px-5"
                                            type="button"
                                            onClick={handleLogin}>
                                            Login
                                        </button>
                                    )
                                    : (
                                        <button className="btn btn-outline-light btn-lg px-5" type="button"
                                            onClick={handleRegister}>
                                            Register
                                        </button>
                                    )}
                            </div>
                            <div>
                                <h6 className="mb-0">
                                    {!showRegister ? (
                                        <>Don't have an account
                                            <p className="text-white-50 fw-bold" style={{ cursor: "pointer" }} onClick={() => setShowRegister(true)}>
                                                Sign Up
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            Already have an account ?
                                            <p className="text-white-50 fw-bold" style={{ cursor: "pointer" }} onClick={() => setShowRegister(false)}>
                                                Sign In
                                            </p>
                                        </>
                                    )}
                                </h6>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}