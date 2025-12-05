interface LoadingModuleProps {
  message?: string;
}

export const LoadingModule = ({ message }: LoadingModuleProps) => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex flex-col items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-t-2 border-gray-900"></div>
        <p className="text-sm text-gray-500">{message || "Cargando..."}</p>
      </div>
    </div>
  );
};
