'use client'

import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

import Loading from "@/components/Loading";
import { getAuthorizationCodeUrl } from "@/utils/spotify";

const Page = () => {
  const urlHash = location.search; 
  const params = useMemo(() => new URLSearchParams(urlHash), [urlHash]);
  const iss = params.get('iss');
  const isSpotify = iss?.includes('spotify');

  const router = useRouter();

  useEffect(() => {
    if (isSpotify) {
      const url = getAuthorizationCodeUrl();
      router.push(url);
    }
  }, [isSpotify, router]);

  if (!isSpotify) {
    return (
      <div>Something Wrong...</div>
    );
  }
  return (
    <div className="center_screen">
      <Loading width={100} height={100} />
    </div>
  );
}

export default Page;
