import { BreadcrumbCustom } from "@itsa-develop/itsa-fe-components";
import { useLocation, useNavigate } from "react-router-dom";

export interface IBreadcrumProps {
  title: string;
  description: string;
  action?: () => void;
}

export const Breadcrumb = ({ title, description, action: action }: IBreadcrumProps) => {


  const navigate = useNavigate();
  const location = useLocation();

  const goBack = () => {
    navigate(location.pathname, { replace: true });
    navigate(-1);
  };


  const handleAction = () => {
    if (action) {
      action();
    } else {
      goBack();
    }
  };


  return (
    <BreadcrumbCustom
      title={title}
      description={description}
      action={handleAction}
    />
  );
};
