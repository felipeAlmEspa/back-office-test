import { FormUpdateEmailUIHookProps } from "./FormUpdateEmailUI.hook";
import { FormProvider } from "react-hook-form";
import { LoadingModule } from "@/components/Loadings/LoadingModule";
import { Button } from "@itsa-develop/itsa-fe-components";
import { FormEmailDataUI } from "../../Create/FormEmailData/FormEmailDataUI.controller";

export const FormUpdateEmailUIView = ({
  methods,
  handleFormSubmit,
  isLoading,
  isLoadingTypesEmail,
}: FormUpdateEmailUIHookProps) => {
  if (isLoading || isLoadingTypesEmail) {
    return <LoadingModule message="Cargando..." />;
  }

  return (
     <div className="flex flex-col h-full min-h-0 p-4 w-full" >
      <FormProvider {...methods}>
        <div className="flex flex-col h-full min-h-0 p-2 w-full space-y-4">
          <FormEmailDataUI  />
        </div>
      </FormProvider>
      <div className="flex justify-end mt-2">
        <Button
          type="primary"
          label="Guardar Cambios"
          size="middle"
          onClick={handleFormSubmit}
        />
      </div>
    </div>
  );
};
