"use client"

import { Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import "@/styles/commonStyle.scss";
import Loading from "@/components/common/Loading";

const Content = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams?.get('code');
    const error = searchParams?.get('error');
    const state = searchParams?.get('state');

    if (error) {
      console.log(`Authorization Failed: ${error} (${state})`);
    }

    fetch(`/api/spotify/auth/get-access-token?code=${code}`, {
      method: 'POST'
    })
      .then((response) => {
        if (response.status !==  200) {
          console.log('Failed to fetch spotify access token with an authorization code');
          setTimeout(() => {
            router.push('/');
          }, 3000);
        } else {
          const redirectUrl = window.sessionStorage.getItem('redirectUrl') ?? '/';
          window.sessionStorage.removeItem('redirectUrl');
          router.push(redirectUrl);
        }
      })
      .catch((error) => {
        console.log('Error fetching spotify access token:', error);
        setTimeout(() => {
          router.push('/');
        }, 3000);
      })

  }, [router, searchParams]);

  return (
    <div className="center_screen">
      <Loading size={50} />
    </div>
  )
}

const Page = () => {
  return (
    <Suspense>
      <Content />
    </Suspense>
  );
}

export default Page;
