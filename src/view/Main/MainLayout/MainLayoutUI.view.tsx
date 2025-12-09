import { IMainLayoutUIProps } from "./MainLayoutUI.hook";
import { AppLayout } from "@itsa-develop/itsa-fe-components";
import { UserProfileDrawer } from "@/components/UserProfile/UserProfileDrawer";
import { LoadingApp } from "@/components/Loadings/LoadingApp";

export const MainLayoutUIView = ({
  children,
  isLoadingApp,
  userOptions,
  handleNavigate,
  isNavigationLoading,
}: IMainLayoutUIProps) => {
  return (
    <>
      <AppLayout
        loadingAppLayout={isLoadingApp}
        onClickOptionMenu={(option) => {
          handleNavigate(option.item.data?.path ?? "");
        }}
        userActions={userOptions}
      >
        {isNavigationLoading ? <LoadingApp /> : children}
      </AppLayout>
      <UserProfileDrawer
        open={false}
        onClose={() => {}}
        userInformation={undefined}
        isLoading={false}
        currentModuleId={0}
      />
    </>
  );
};
