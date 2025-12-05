import { LoadingApp } from "@/components/Loadings/LoadingApp";
import { IMainLayoutUIProps } from "./MainLayoutUI.hook";
import { AppLayout } from "@itsa-develop/itsa-fe-components";
import { UserProfileDrawer } from "@/components/UserProfile/UserProfileDrawer";


export const MainLayoutUIView = ({
  children,
  isLoadingNavigation,
  isLoadingPermissions,
  onClickOptionMenu,
  userActions,
  localPath,
  isProfileDrawerOpen,
  onCloseProfileDrawer,
  userInformation,
  isLoadingUserInformation,
  currentModuleId,
}: IMainLayoutUIProps) => {
  if (isLoadingNavigation || isLoadingPermissions) {
    return <LoadingApp />;
  }
  return (
    <>
      <AppLayout
        loading={false}
        currentPath={localPath}
        widthSidebar={235}
        onClickOptionMenu={onClickOptionMenu}
        userActions={userActions}
      >
        {children}
      </AppLayout>
      <UserProfileDrawer
        open={isProfileDrawerOpen}
        onClose={onCloseProfileDrawer}
        userInformation={userInformation}
        isLoading={isLoadingUserInformation}
        currentModuleId={currentModuleId}
      />
    </>
  );
};
