"use client"

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import "@/styles/commonStyle.scss";
import Loading from "@/components/common/Loading";
import MainLayout from "@/layouts/MainLayout";
import { getAuthorizationCodeUrl } from "@/utils/spotify";

const Content = () => {
  const searchParams = useSearchParams();
  const errorCode = searchParams?.get('error_code');
  const code = searchParams.get('code');

  const [isEmailSent, setIsEmailSent] = useState(false);  

  const router = useRouter();

  useEffect(() => {
    if (errorCode === 'provider_email_needs_verification') {
      setIsEmailSent(true);
    } else if (code) {
      router.push(getAuthorizationCodeUrl());
    } else {
      router.push('/');
    }
  }, [searchParams, router, code, errorCode]);

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
      <Loading size={50} />
    </div>
  );
}

const Page = () => {
  return (
    <Suspense>
      <Content />
    </Suspense>
  );
}

export default Page;