import "./page.scss";
import LoginButtons from "@/components/Login/LoginButtons";

const LoginPage = () => {
  return (
    <div className="login_container">
      <h1>로그인</h1>

      <LoginButtons />
    </div>
  );
};

export default LoginPage;
