import { ReactNode } from "react"

import "@/styles/PopUpModal.scss";

interface Prop {
  children: ReactNode;
  title?: string;
  className?: string;
}

const PopUpModal = (prop: Prop) => {
  const { children, title, className } = prop;

  return (
    <div
      className={`modal_popup ${className ? className : ""}`}
    >
      <div className="modal_title">
        {title}
      </div>
      
      <div className="modal_content_container">
        {children}
      </div>
    </div>
  )
}

export default PopUpModal