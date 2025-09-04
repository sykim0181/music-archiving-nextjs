import { redirect } from "next/navigation";

import "@/styles/commonStyle.scss";
import MainLayout from "@/layouts/MainLayout";
import { getAuthorizationCodeUrl } from "@/utils/spotify";

const Page = async ({
  params,
}: {
  params: Promise<{ code?: string; error_code?: string }>;
}) => {
  const { code, error_code } = await params;

  if (error_code === "provider_email_needs_verification") {
    return (
      <MainLayout>
        <div className="center_screen">
          <p>
            스포티파이 계정에 등록된 이메일 주소로 확인 이메일이 전송되었습니다.
            이메일에 포함된 링크를 클릭하여 로그인을 완료해주세요.
          </p>
        </div>
      </MainLayout>
    );
  }

  if (code) {
    redirect(getAuthorizationCodeUrl());
  }

  redirect("/");
};

export default Page;
