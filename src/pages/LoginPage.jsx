import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Form from '../components/LoginForm'

const LoginPage = () => {
    let navigate = useNavigate();
    useEffect(() => {
        let authToken = sessionStorage.getItem('Auth Token')
        if (authToken) {
            navigate('/');
        }
    }, [navigate])
    return (
        <Form />
    )
};

export default LoginPage;