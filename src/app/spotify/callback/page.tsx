"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

import "@/styles/commonStyle.scss";
import Loading from "@/components/common/Loading";
import { getAccessToken } from "@/utils/spotify";
import { setAccessToken } from "@/lib/redux/spotify";

const Content = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const dispatch = useDispatch();

  useEffect(() => {
    const code = searchParams?.get("code");
    const error = searchParams?.get("error");
    const state = searchParams?.get("state");

    if (error || code === null) {
      console.log(`Authorization Failed: ${error} (${state})`);
      return;
    }

    getAccessToken(code).then((token) => {
      if (token === null) {
        setTimeout(() => {
          router.push("/");
        }, 3000);
        return;
      }

      dispatch(setAccessToken(token));
      const redirectUrl = window.sessionStorage.getItem("redirectUrl") ?? "/";
      window.sessionStorage.removeItem("redirectUrl");
      router.push(redirectUrl);
    });
  }, [router, searchParams, dispatch]);

  return (
    <div className="center_screen">
      <Loading size={50} />
    </div>
  );
};

const Page = () => {
  return (
    <Suspense>
      <Content />
    </Suspense>
  );
};

export default Page;
