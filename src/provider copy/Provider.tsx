import { TanStackReactQuery } from "./TanStackReactQuery";
import { ControlActionsProvider } from "@itsa-develop/itsa-fe-components";
import { validateActionExecute } from "@/services/security/security.service";

export const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <TanStackReactQuery>
        <ControlActionsProvider
          fnApiValidatePermissionAction={validateActionExecute}
        >
          {children}
        </ControlActionsProvider>
    </TanStackReactQuery>
  );
};
