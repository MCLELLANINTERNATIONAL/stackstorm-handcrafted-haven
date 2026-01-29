export default function DeleteProfilePage() {
    return (
      <div className="max-w-4xl">
        <h1 className="text-2xl font-semibold text-red-600">
          Delete Seller Profile
        </h1>
  
        <p className="mt-2 text-gray-600">
          This action is permanent and cannot be undone.
        </p>
  
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-6">
          <p className="text-sm text-gray-700">
            Confirmation and delete logic goes here.
          </p>
  
          <button
            className="mt-4 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Permanently Delete Profile
          </button>
        </div>
      </div>
    );
  }
  