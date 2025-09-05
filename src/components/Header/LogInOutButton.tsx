"use client";

import useUser from "@/hooks/useUser";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";

const LogInoutButton = () => {
  const user = useUser();

  const router = useRouter();

  const onClickLogoutButton = async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert("로그아웃 실패");
    } else {
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
