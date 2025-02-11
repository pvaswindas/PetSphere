import React from 'react'
import AuthLayout from '../../../components/user/auth/AuthLayout';
import FindYourAccountForm from '../../../components/user/auth/FindYourAccountForm';

function FindYourAccount() {
    return <AuthLayout AuthContent={FindYourAccountForm} link='/signup' text='SignUp'/>;
}

export default FindYourAccount