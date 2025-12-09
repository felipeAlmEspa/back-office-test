import { queryClient } from "@/constants";
import {
  ControlActionsProvider,
  UIProvider,
} from "@itsa-develop/itsa-fe-components";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactNode } from "react";




export const ProviderApp = ({ children }: { children: ReactNode }) => {
  return (
    <ControlActionsProvider
      fnApiValidatePermissionAction={async () => {
        return true;
      }}
    >
      <UIProvider>
        <QueryClientProvider client={queryClient}>
          {children}
          <ReactQueryDevtools />
        </QueryClientProvider>
      </UIProvider>
    </ControlActionsProvider>
  );
};
