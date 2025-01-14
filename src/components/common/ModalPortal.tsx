import { ReactNode } from "react";
import ReactDOM from "react-dom";

interface Props {
  children: ReactNode;
}

const ModalPortal = (props: Props) => {
  const { children } = props;
  const modalElement = document.getElementById("modal");
  if (!modalElement) {
    return <></>;
  }
  
  return ReactDOM.createPortal(children, modalElement);
};

export default ModalPortal;