import AuthLayout from "../../../components/user/auth/AuthLayout";
import SignUpFormPanel from "../../../components/user/auth/SignUpFormPanel";

function SignupPage() {
    return <AuthLayout AuthContent={SignUpFormPanel} />;
}

export default SignupPage;
