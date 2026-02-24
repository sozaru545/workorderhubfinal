import { useState } from "react";
import { useRouter } from "next/router";
import { api, ApiError } from "../../services/api";
import ErrorAlert from "../../components/ErrorAlert";

export default function CreateWorkOrder() {
  const router = useRouter();

  const [error, setError] = useState<ApiError | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    department: "FACILITIES",
    priority: "LOW",
    requesterName: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);
    setLoading(true);

    try {
      await api.createWorkOrder(formData);
      router.push("/dashboard");
    } catch (err) {
      setError(err as ApiError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 max-w-2xl mx-auto text-black">
      <h1 className="text-2xl font-bold mb-4">New Work Order</h1>

      <ErrorAlert error={error} />

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-white p-6 border rounded shadow-sm">
        <input required minLength={5} placeholder="Title"
          className="border p-2 rounded"
          onChange={e => setFormData({ ...formData, title: e.target.value })}
        />

        <textarea required minLength={10} placeholder="The description"
          className="border p-2 rounded"
          onChange={e => setFormData({ ...formData, description: e.target.value })}
        />

        <input required minLength={3} placeholder="Requester Name"
          className="border p-2 rounded"
          onChange={e => setFormData({ ...formData, requesterName: e.target.value })}
        />

        <button disabled={loading}
          className="bg-blue-600 text-white p-2 font-bold rounded disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}