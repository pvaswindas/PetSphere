import React from "react";
import AuthLayout from "../../../components/user/auth/AuthLayout";
import CreateUsernameForm from "../../../components/user/auth/CreateUsernameForm";

function CreateUsername() {
    return (
        <AuthLayout AuthContent={CreateUsernameForm}/>
    )
}

export default CreateUsername