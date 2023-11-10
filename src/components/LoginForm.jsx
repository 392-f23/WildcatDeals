import { useState, forwardRef } from 'react';
import './LoginForm.css';
import { firebaseSendPasswordResetEmail, signInWithEmailAndPassWD, signInWithGoogle } from '../utilities/firebase';
import { useNavigate } from "react-router-dom";
import { Alert as MuiAlert, Snackbar, Typography } from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';

const Form = () => {
    let navigate = useNavigate();
    const [inputs, setinputs] = useState({
        email: "",
        password: ""
    });

    const [warnemail, setwarnemail] = useState(false);
    const [warnpass, setwarnpass] = useState(false);
    const [danger, setdanger] = useState(true);

    const [eye, seteye] = useState(true);
    const [pass, setpass] = useState("password");

    const [openAlert, setOpenAlert] = useState(false);
    const Alert = forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });

    const handleClick = () => {
        setOpenAlert(true);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenAlert(false);
    };


    const inputEvent = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        if (name === "email") {
            if (value.length > 0) {
                setdanger(true);
            }
        }
        setinputs((lastValue) => {
            return {
                ...lastValue,
                [name]: value
            }
        });
    };

    const validateEmail = (email) => {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    };

    const submitForm = (e) => {
        e.preventDefault();
        setwarnemail(false);
        setwarnpass(false);
        if (inputs.password === "") {
            setwarnpass(true);
        }
        if (inputs.email === "") {
            setwarnemail(true);
        } else if (!validateEmail(inputs.email)) {
            setwarnemail(true);
            setdanger(false);
        } else {
            signInWithEmailAndPassWD(inputs, navigate, setOpenAlert);
        }
    };

    const sendPasswordResetEmail = () => {
        if (inputs.email === "") {
            setwarnemail(true);
        } else if (!validateEmail(inputs.email)) {
            setwarnemail(true);
            setdanger(false);
        } else {
            firebaseSendPasswordResetEmail(inputs.email);
        }
    }

    const Eye = () => {
        if (pass === "password") {
            setpass("text");
            seteye(false);
        } else {
            setpass("password");
            seteye(true);
        }
    };

    return (
        <>
            <div className="container-login">
                <div className="card-login">
                    <div className="form-login">
                        <Snackbar open={openAlert} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                            <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                                Wrong username or password.
                            </Alert>
                        </Snackbar>
                        <div className="left-side">
                            <img src="https://news.northwestern.edu/assets/Stories/2023/06/aerial1940__FitMaxWzk3MCw2NTBd.jpg" alt="Northwestern University Evanston Campus" />
                        </div>

                        <div className="right-side">
                            <div className="logo-login text-[#4E2A84]">
                                <PetsIcon sx={{ mr: 1 }} onClick={() => navigate("/")} />
                                <Typography
                                    variant="h6"
                                    noWrap
                                    component="a"
                                    onClick={() => navigate("/")}
                                    sx={{
                                        mr: 2,
                                        fontFamily: "monospace",
                                        fontWeight: 700,
                                        letterSpacing: ".3rem",
                                        color: "inherit",
                                        textDecoration: "none",
                                        cursor: "pointer", // This line makes the cursor change to a hand (pointer) when hovering over the element
                                    }}
                                >
                                    Wildcat Deals
                                </Typography>
                            </div>

                            <form onSubmit={submitForm}>

                                <div className="input_text" >
                                    <input data-cy="email" className={` ${warnemail ? "warning" : ""}`} type="text" pattern="[^\s]+" placeholder="Enter Email" name="email" value={inputs.email} onChange={inputEvent} />
                                    <p data-cy="emailwarn" className={` ${danger ? "danger" : ""}`} ><i className="fa fa-warning"></i>Please enter a valid email address.</p>
                                </div>
                                <div className="input_text">
                                    <input data-cy="password" className={` ${warnpass ? "warning" : ""}`} type={pass} placeholder="Enter Password" name="password" value={inputs.password} onChange={inputEvent} />
                                    <i onClick={Eye} className={`fa ${eye ? "fa-eye-slash" : "fa-eye"}`}></i>
                                </div>
                                <div className="recovery">
                                    <a className='cursor-pointer' onClick={sendPasswordResetEmail}>Forgot Password?</a>
                                </div>
                                <div className="btn-login">
                                    <button data-cy="signinbutton" type="submit">Sign in</button>
                                    <button type="button" className="mt-2" onClick={() => setinputs({ email: "test@a.com", password: "123456" })}>Fill In Test User</button>
                                </div>

                            </form>
                            <hr />
                            <div className="boxes-login">
                                <span onClick={() => signInWithGoogle(navigate)}><img src="https://imgur.com/XnY9cKl.png" alt="Google Logo" /></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Form;