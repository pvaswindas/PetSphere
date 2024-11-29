import React from "react";
import AuthLayout from "../../components/user/auth/AuthLayout";
import OtpVerification from "../../components/user/auth/OtpVerfication";

function SignUpOTP() {
    return (
        <AuthLayout AuthContent={OtpVerification}/>
    )
}

export default SignUpOTP