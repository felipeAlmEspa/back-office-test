import {
  ControlActionsProvider,
  UIProvider,
} from "@itsa-develop/itsa-fe-components";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactNode } from "react";
export const ProviderApp = ({ children }: { children: ReactNode }) => {
  const queryClient = new QueryClient();
  return (
    <UIProvider>
      <QueryClientProvider client={queryClient}>
        <ControlActionsProvider fnApiValidatePermissionAction={async () => {
          return true;
        }}>
          {children}
          <ReactQueryDevtools />
        </ControlActionsProvider>
      </QueryClientProvider>
    </UIProvider>
  );
};
