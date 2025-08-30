"use client";

import { useContext } from "react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";

import "@/styles/Header.scss";
import "@/styles/commonStyle.scss";
import { SessionContext } from "@/lib/supabase/SupabaseAuthProvider";
import { createClient } from "@/utils/supabase/client";
import { setAccessToken } from "@/lib/redux/spotify";

const Header = () => {
  const sessionContext = useContext(SessionContext);

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

  const divider = <p className="left_header_content_divider">/</p>;

  return (
    <header>
      <div className="header_content">
        <div className="left_header_content">
          <button>
            <Link href={"/"}>Home</Link>
          </button>
          {divider}
          <button>
            <Link href={"/archive"}>Archive</Link>
          </button>
          {divider}
          <button>
            <Link href={"/collection"}>Collection</Link>
          </button>
        </div>

        <div className="right_header_content">
          {sessionContext.session ? (
            <button onClick={onClickLogoutButton}>Log Out</button>
          ) : (
            <button>
              <Link href={"/login"}>Log In</Link>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
