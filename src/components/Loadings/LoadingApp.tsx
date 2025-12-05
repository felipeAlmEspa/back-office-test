

export const LoadingApp = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex flex-col items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-t-2 border-gray-900"></div>
        <p className="text-sm text-gray-500">Cargando...</p>
      </div>
    </div>
  );
};
