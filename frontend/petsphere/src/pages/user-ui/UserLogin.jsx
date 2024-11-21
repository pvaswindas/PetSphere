import AuthLayout from "../../components/user/auth/AuthLayout";
import LoginFormPanel from "../../components/user/auth/LoginFormPanel";

function UserLogin() {
    return <AuthLayout AuthContent={LoginFormPanel} link='/signup' text='SignUp'/>;
}

export default UserLogin;
