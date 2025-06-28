export default function UnauthorizedPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
            <h1 className="text-4xl font-bold text-red-600 mb-4">Acces interzis</h1>
            <p className="text-lg text-gray-700">
                Nu ai permisiunea de a accesa această pagină.
            </p>
      </div>
    );
}