'use client'

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import Loading from "@/components/Loading";
import { getAuthorizationCodeUrl } from "@/utils/spotify";

const Page = () => {
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
      <Loading size={100} />
    </div>
  );
}

export default Page;
