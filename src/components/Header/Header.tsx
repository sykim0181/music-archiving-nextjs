import Link from "next/link";

import "@/styles/Header.scss";
import LogInoutButton from "./LogInOutButton";

const Header = () => {
  return (
    <header>
      <div className="header_content">
        <div className="left_header_content">
          <button>
            <Link href={"/"}>Home</Link>
          </button>

          <div className="left_header_content_divider" />

          <button>
            <Link href={"/archive"}>Archive</Link>
          </button>

          <div className="left_header_content_divider" />

          <button>
            <Link href={"/collections"}>Collection</Link>
          </button>
        </div>

        <div className="right_header_content">
          <LogInoutButton />
        </div>
      </div>
    </header>
  );
};

export default Header;
