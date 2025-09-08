import "./page.scss";
import MainLayout from "@/layouts/MainLayout";
import LoginButtons from "@/components/Login/LoginButtons";

const LoginPage = () => {
  return (
    <MainLayout>
      <div className="login_container">
        <h1>로그인</h1>

        <LoginButtons />
      </div>
    </MainLayout>
  );
};

export default LoginPage;
