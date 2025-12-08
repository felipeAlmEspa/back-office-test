

import { LoginUIView } from "./LoginUI.view";
import { useLoginUI } from "./LoginUI.hook";

const LoginUI = () => {
  const hook = useLoginUI();


  return (
    <LoginUIView
      {...hook}
    />
  );
};

export default LoginUI;