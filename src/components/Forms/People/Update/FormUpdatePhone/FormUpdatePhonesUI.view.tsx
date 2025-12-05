import { FormUpdatePhonesUIHookProps } from "./FormUpdatePhonesUI.hook";
import { FormProvider } from "react-hook-form";
import { LoadingModule } from "@/components/Loadings/LoadingModule";
import { Button } from "@itsa-develop/itsa-fe-components";
import { FormPhoneDataUI } from "@/components/Forms/People/Create/FormPhoneData/FormPhoneDataUI.controller";

export const FormUpdatePhonesUIView = ({
  methods,
  handleFormSubmit,
  isLoading,
  isLoadingTypesPhone,
  isLoadingUpdatePhonePeople,
}: FormUpdatePhonesUIHookProps) => {
  if (isLoading || isLoadingTypesPhone) {
    return <LoadingModule message="Cargando..." />;
  }

  return (
     <div className="flex flex-col h-full min-h-0 p-4 w-full" >
      <FormProvider {...methods}>
        <div className="flex flex-col h-full min-h-0 p-2 w-full space-y-4">
          <FormPhoneDataUI />
        </div>
      </FormProvider>
      <div className="flex justify-end mt-2">
        <Button
          type="primary"
          label="Guardar Cambios"
          size="middle"
          onClick={handleFormSubmit}
          disabled={isLoadingUpdatePhonePeople}
        />
      </div>
    </div>
  );
};
