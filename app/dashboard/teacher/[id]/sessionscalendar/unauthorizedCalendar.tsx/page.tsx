export default function UnauthorizedPage() {
  return (
    <div className="text-center py-10">
      <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
      <p className="text-gray-600 mt-2">You need a BASIC or PRO subscription to access this page.</p>
    </div>
  );
}
