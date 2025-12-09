import { IMainLayoutUIProps } from "./MainLayoutUI.hook";
import { AppLayout } from "@itsa-develop/itsa-fe-components";
import { UserProfileDrawer } from "@/components/UserProfile/UserProfileDrawer";

export const MainLayoutUIView = ({
  children,
  isLoadingPermissions,
  userOptions,
  handleNavigate,
}: IMainLayoutUIProps) => {
  return (
    <>
      <AppLayout
        loadingAppLayout={isLoadingPermissions}
        onClickOptionMenu={(option) => {
          handleNavigate(option.item.data?.path ?? "");
        }}
        userActions={userOptions}
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
