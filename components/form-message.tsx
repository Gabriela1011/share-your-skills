export type Message =
  | { success: string }
  | { error: string }
  | { message: string };

export function FormMessage({ message }: { message: Message }) {
  return (
    <div className="flex flex-col gap-2 w-full max-w-md text-sm">
      {"success" in message && (
        <div className="bg-green-100 text-green-800 border border-green-400 px-4 py-2 rounded text-sm">
          {message.success}
        </div>
      )}
      {"error" in message && (
        <div className="bg-red-100 text-red-800 border border-red-400 px-4 py-2 rounded text-sm">
          {message.error}
        </div>
      )}
      {"message" in message && (
        <div className="bg-gray-100 text-gray-800 border border-gray-300 px-4 py-2 rounded text-sm">{message.message}</div>
      )}
    </div>
  );
}
