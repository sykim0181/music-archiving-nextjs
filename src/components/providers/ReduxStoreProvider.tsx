"use client";

import store from "@/lib/redux/store";
import { Provider } from "react-redux";

interface Props {
  children: React.ReactNode;
}

const ReduxStoreProvider = ({ children }: Props) => {
  return <Provider store={store}>{children}</Provider>;
};

export default ReduxStoreProvider;
