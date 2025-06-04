import React from "react";
import AuthLayout from "../layouts/AuthLayout";
import LoginForm from "../components/auth/Login";

const Login = () => 
{
    return (
        <AuthLayout>
            <LoginForm />
        </AuthLayout>
    );
};

export default Login;