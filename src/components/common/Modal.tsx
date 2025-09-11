"use client";

import { ReactNode } from "react";
import { createPortal } from "react-dom";
import "@/styles/Modal.scss";

interface Props {
  children: ReactNode;
  title?: string;
  className?: string;
}

const Modal = ({ children, title, className }: Props) => {
  return createPortal(
    <div className="modal_overlay">
      <div className={`modal_popup ${className ?? ""}`}>
        <div className="modal_title">
          <p>{title}</p>
        </div>

        <div className="modal_content_container">{children}</div>
      </div>
    </div>,
    document.getElementById("modal-container")!
  );
};

export default Modal;
