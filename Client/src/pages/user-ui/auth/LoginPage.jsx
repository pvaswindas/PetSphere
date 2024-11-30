import AuthLayout from "../../../components/user/auth/AuthLayout";
import LoginFormPanel from "../../../components/user/auth/LoginFormPanel";

function LoginPage() {
    return <AuthLayout AuthContent={LoginFormPanel} link='/signup' text='SignUp'/>;
}

export default LoginPage;
