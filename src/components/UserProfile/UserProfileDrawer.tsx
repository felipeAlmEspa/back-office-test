import { IUserInformation, IUserRole } from "@itsa-develop/itsa-fe-components";
import { Drawer, Avatar, Divider, Tag, Skeleton } from "antd";
import { UserOutlined, MailOutlined, IdcardOutlined, TagOutlined } from "@ant-design/icons";

export interface IUserProfileDrawerProps {
  open: boolean;
  onClose: () => void;
  userInformation: IUserInformation | undefined;
  isLoading: boolean;
  currentModuleId?: number;
}

export const UserProfileDrawer = ({
  open,
  onClose,
  userInformation,
  isLoading,
  currentModuleId,
}: IUserProfileDrawerProps) => {
  const currentRole = userInformation?.roles?.find(
    (role: IUserRole) => role.moduleId === currentModuleId
  );

  return (
    <Drawer
      title="Perfil de Usuario"
      placement="right"
      onClose={onClose}
      open={open}
      width={400}
    >
      {isLoading ? (
        <div className="flex flex-col items-center gap-4">
          <Skeleton.Avatar active size={100} />
          <Skeleton active paragraph={{ rows: 4 }} />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {/* Avatar y nombre */}
          <div className="flex flex-col items-center gap-3 pb-4">
            <Avatar
              size={100}
              src={userInformation?.picture}
              icon={!userInformation?.picture && <UserOutlined />}
              className="bg-primary-500"
            />
            <h2 className="text-xl font-semibold text-gray-800 m-0">
              {userInformation?.name || "Usuario"}
            </h2>
            {currentRole && (
              <Tag color="blue" className="text-sm">
                {currentRole.name}
              </Tag>
            )}
          </div>

          <Divider className="my-2" />

          {/* Información de contacto */}
          <div className="flex flex-col gap-4">
            <h3 className="text-base font-medium text-gray-700 m-0">
              Información de Contacto
            </h3>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <MailOutlined className="text-lg text-primary-500" />
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">Correo electrónico</span>
                <span className="text-sm text-gray-800">
                  {userInformation?.email || "No disponible"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <IdcardOutlined className="text-lg text-primary-500" />
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">Identificación</span>
                <span className="text-sm text-gray-800">
                  {userInformation?.identificationType}: {userInformation?.identification || "No disponible"}
                </span>
              </div>
            </div>
          </div>

          <Divider className="my-2" />

          {/* Roles */}
          <div className="flex flex-col gap-3">
            <h3 className="text-base font-medium text-gray-700 m-0">
              Roles Asignados
            </h3>

            <div className="flex flex-wrap gap-2">
              {userInformation?.roles && userInformation.roles.length > 0 ? (
                userInformation.roles.map((role: IUserRole) => (
                  <Tag
                    key={role.id}
                    icon={<TagOutlined />}
                    color={role.moduleId === currentModuleId ? "green" : "default"}
                  >
                    {role.name}
                  </Tag>
                ))
              ) : (
                <span className="text-sm text-gray-500">Sin roles asignados</span>
              )}
            </div>
          </div>
        </div>
      )}
    </Drawer>
  );
};
