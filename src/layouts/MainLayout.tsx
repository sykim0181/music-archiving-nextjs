import "@/styles/layouts/MainLayout.scss";
import Header from "@/components/common/Header";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  backgroundColor?: string;
}

const MainLayout = (props: Props) => {
  const { children, backgroundColor } = props;

  return (
    <div className="main_layout" style={{
      backgroundColor: backgroundColor ?? '#EBEBEB'
    }}>
      <Header />
      <div className="content_container">
        {children}
      </div>

      <div id="modal" />
    </div>
  );
};

export default MainLayout;