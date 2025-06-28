export default function Legend() {
  return (
    <div className="flex flex-col gap-2 text-sm text-gray-700 bg-white/70 p-4 rounded-lg shadow-md w-fit">
      <p className="font-semibold mb-1">Legend:</p>
      <div className="flex items-center gap-2">
        <span className="w-3 h-3 rounded-full bg-blue-500"></span>
        <span>Scheduled session</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-3 h-3 rounded-full bg-green-500"></span>
        <span>Completed session</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-3 h-3 rounded-full bg-red-500"></span>
        <span>Cancelled session</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-3 h-3 rounded-full bg-orange-500"></span>
        <span>Cancelled with refund</span>
      </div>
    </div>
  );
}
