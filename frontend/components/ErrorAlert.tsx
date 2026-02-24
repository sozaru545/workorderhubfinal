import { ApiError } from "../services/api";

export default function ErrorAlert({ error }: { error: ApiError | null }) {
  if (!error) return null;

  return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 my-4 rounded shadow-sm">
      <p className="text-red-800 font-bold text-sm">{error.code}</p>

      <p className="text-red-700 text-sm mt-1">{error.message}</p>

      <p className="text-red-500 text-xs mt-2 font-mono">
        Request ID: {error.requestId}
      </p>
    </div>
  );
}