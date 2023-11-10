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

    // pervent scrolling
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        }
    }, [])

    return (
        <Form />
    )
};

export default LoginPage;