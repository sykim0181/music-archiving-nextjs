"use client";

import useUser from "@/hooks/useUser";
import { setAccessToken } from "@/lib/redux/spotify";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

const LogInoutButton = () => {
  const user = useUser();

  const dispatch = useDispatch();
  const router = useRouter();

  const onClickLogoutButton = async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log("Failed to sign out:", error);
    } else {
      const response = await fetch(`/api/auth/logout`, {
        method: "POST",
      });
      const data = await response.json();
      console.log("/api/auth/logout", data);
      if (data.token) {
        dispatch(setAccessToken(data.token));
      }
      alert("로그아웃 완료");
      router.push("/");
    }
  };

  if (user) {
    return <button onClick={onClickLogoutButton}>Log Out</button>;
  } else {
    return (
      <button>
        <Link href={"/login"}>Log In</Link>
      </button>
    );
  }
};

export default LogInoutButton;
