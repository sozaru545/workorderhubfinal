import { useEffect, useState } from "react";
import { api } from "../services/api";
import { WorkOrder, Status } from "../types/workorder";

type WorkOrdersApiResponse =
  | WorkOrder[]
  | {
      data?: WorkOrder[];
      success?: boolean;
      requestId?: string;
      error?: any;
    };

export default function Dashboard() {
  const [orders, setOrders] = useState<WorkOrder[]>([]);
  const [error, setError] = useState<{ message: string; requestId: string } | null>(null);

  const statuses: Status[] = ["NEW", "IN_PROGRESS", "BLOCKED", "DONE"];

  useEffect(() => {
    (async () => {
      try {
        // If your API expects query string, pass it here
        const result = (await api.listWorkOrders("page=1&limit=1000")) as WorkOrdersApiResponse;

        // ✅ Ensure orders is always an array
        const list = Array.isArray(result) ? result : result?.data;
        setOrders(Array.isArray(list) ? list : []);
        setError(null);
      } catch (err: any) {
        setOrders([]);
        setError({
          message: err?.message || "Failed to load the board",
          requestId: err?.requestId || "N/A",
        });
      }
    })();
  }, []);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Work Order Dashboard</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>
            <strong>Error:</strong> {error.message}
          </p>
          <p className="text-sm font-mono">Request ID: {error.requestId}</p>
        </div>
      )}

      <div className="grid grid-cols-4 gap-4">
        {statuses.map((status) => {
          const byStatus = orders.filter((o) => o.status === status);

          return (
            <div
              key={status}
              className="border rounded-lg p-4 bg-gray-100 shadow-sm min-h-[400px]"
            >
              <h2 className="font-bold border-b border-gray-300 mb-4 pb-2 text-gray-700 uppercase tracking-wider">
                {status}
              </h2>

              <div className="text-3xl font-black mb-4 text-blue-600">{byStatus.length}</div>

              <ul className="space-y-2">
                {byStatus.map((order) => (
                  <li
                    key={order.id}
                    className="bg-white p-3 shadow-sm rounded border-l-4 border-blue-400 text-sm font-medium"
                  >
                    {order.title}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}