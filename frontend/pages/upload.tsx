import { useState } from "react";
import { api, ApiError } from "../services/api";
import ErrorAlert from "../components/ErrorAlert";

export default function BulkUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await api.bulkUploadCsv(formData);
      setResults(res);
    } catch (err) {
      setError(err as ApiError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 max-w-4xl mx-auto text-black">
      <h1 className="text-2xl font-bold mb-4">Bulk CSV Intake</h1>

      <ErrorAlert error={error} />

      <form
        onSubmit={handleUpload}
        className="border-2 border-dashed p-10 text-center bg-gray-50 rounded"
      >
        {/* ✅ Accessible label */}
        <label
          htmlFor="csvFile"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Upload CSV file
        </label>

        <input
          id="csvFile"
          name="csvFile"
          type="file"
          accept=".csv"
          className="block mx-auto text-sm"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />

        <button
          disabled={!file || loading}
          className="bg-black text-white px-6 py-2 mt-4 rounded font-bold disabled:opacity-50"
        >
          {loading ? "Processing..." : "Process File"}
        </button>
      </form>

      {results && (
        <div className="mt-6 border p-5 rounded bg-white shadow-sm">
          <p>Total Rows: {results.totalRows}</p>
          <p className="text-green-600">Accepted: {results.accepted}</p>
          <p className="text-red-600">Rejected: {results.rejected}</p>

          {results.errors?.length > 0 && (
            <ul className="text-red-600 text-sm mt-3 list-disc pl-5">
              {results.errors.map((err: any, i: number) => (
                <li key={i}>
                  Row {err.row}: {err.reason || err.message}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}