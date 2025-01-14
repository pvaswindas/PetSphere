import AuthLayout from "../../../components/user/auth/AuthLayout";
import ForgotPasswordForm from "../../../components/user/auth/ForgotPasswordForm";

function ForgotPassword() {
    return <AuthLayout AuthContent={ForgotPasswordForm} link='/signup' text='SignUp'/>;
}

export default ForgotPassword;
