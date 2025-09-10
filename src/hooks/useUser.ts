import { SessionContext } from "@/components/providers/SupabaseAuthProvider";
import { useContext } from "react";

const useUser = () => {
  const sessionContext = useContext(SessionContext);
  const user = sessionContext.session?.user;

  return user;
};

export default useUser;
