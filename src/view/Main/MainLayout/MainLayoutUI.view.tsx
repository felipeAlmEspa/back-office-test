import { IMainLayoutUIProps } from "./MainLayoutUI.hook";
import { AppLayout } from "@itsa-develop/itsa-fe-components";
import { UserProfileDrawer } from "@/components/UserProfile/UserProfileDrawer";

export const MainLayoutUIView = ({
  children,
  isLoadingPermissions,
  userOptions,
}: IMainLayoutUIProps) => {
  return (
    <>
      <AppLayout
        loadingAppLayout={isLoadingPermissions}
        currentPath={""}
        onClickOptionMenu={() => {}}
        userActions={userOptions}
        onChangeModule={() => {}}
        onChangeAgency={() => {}}
        openKeysMenuOptions={[]}
        itemsMenuOptions={[]}
        onOpenKeysChange={() => {}}
      >
        {children}
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
