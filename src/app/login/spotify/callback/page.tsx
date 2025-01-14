"use client"

import { useRouter, useSearchParams } from "next/navigation";

import "@/styles/commonStyle.scss";
import Loading from "@/components/Loading";
import { useEffect } from "react";
import MainLayout from "@/layouts/MainLayout";

const Page = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const errorCode = searchParams?.get('error_code');
  const isEmailSent = errorCode === 'provider_email_needs_verification';  

  if (isEmailSent) {
    return (
      <MainLayout>
        <div className="center_screen">
          <p>스포티파이 계정에 등록된 이메일 주소로 확인 이메일이 전송되었습니다. 이메일에 포함된 링크를 클릭하여 로그인을 완료해주세요.</p>
        </div>
      </MainLayout>
    );
  }
  return (
    <div className="center_screen">
      <Loading size={100} />
    </div>
  );
}

export default Page;