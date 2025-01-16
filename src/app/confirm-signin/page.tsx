'use client'

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

import Loading from "@/components/common/Loading";
import { getAuthorizationCodeUrl } from "@/utils/spotify";

const Content = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const iss = searchParams.get('iss');
    const isSpotify = iss?.includes('spotify');

    if (isSpotify) {
      const url = getAuthorizationCodeUrl();
      router.push(url);
    }
  }, [searchParams, router]);

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
