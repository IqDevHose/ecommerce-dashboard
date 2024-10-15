// spinner component


const Loading = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col gap-1 items-center justify-center">
        <div className="flex items-center justify-center">
          <div className="w-10 h-10 border-t-2 border-b-2 border-gray-900 rounded-full animate-spin"></div>
        </div>
        <p className="text-gray-500">Loading...</p>
      </div>
    </div>
  );
};

export default Loading;

