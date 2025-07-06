export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
<div className="max-w-md w-full space-y-8 p-8 rounded-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            404 - Page Not Found
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            The page you are looking for could not be found.
          </p>
          <p className="mt-4 text-sm text-red-600">
            Please check the URL and try again.
          </p>
        </div>
      </div>
    </div>
  );
}
