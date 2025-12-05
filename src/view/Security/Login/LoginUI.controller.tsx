

import { LoginUIView } from "./LoginUI.view";
import { useLoginUI } from "./LoginUI.hook";
export const LoginUI = () => {
  const hook = useLoginUI();


  return (
    <LoginUIView
      {...hook}
    />
  );
};
