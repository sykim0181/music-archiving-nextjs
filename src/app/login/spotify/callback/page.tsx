"use client"

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import "@/styles/commonStyle.scss";
import Loading from "@/components/common/Loading";
import MainLayout from "@/layouts/MainLayout";

const Content = () => {
  const searchParams = useSearchParams();

  const [isEmailSent, setIsEmailSent] = useState(false);  

  const router = useRouter();

  useEffect(() => {
    const errorCode = searchParams?.get('error_code');
    if (errorCode === 'provider_email_needs_verification') {
      setIsEmailSent(true);
    } else {
      router.push('/');
    }
  }, [searchParams, router]);

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