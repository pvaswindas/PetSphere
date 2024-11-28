import AuthLayout from "../../components/user/auth/AuthLayout";
import SignUpFormPanel from "../../components/user/auth/SignUpFormPanel";

function UserSignUp() {
    return <AuthLayout AuthContent={SignUpFormPanel} />;
}

export default UserSignUp;
