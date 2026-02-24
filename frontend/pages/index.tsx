import { useEffect, useState } from "react";
import { api } from "../services/api";
import { WorkOrder } from "../types/workorder";
import Link from "next/link";

type WorkOrdersApiResponse =
  | WorkOrder[]
  | {
      data?: WorkOrder[];
      success?: boolean;
      page?: number;
      limit?: number;
      total?: number;
      error?: any;
      requestId?: string;
    };

export default function WorkOrdersList() {
  const [orders, setOrders] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{ message: string; requestId: string } | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const result = (await api.listWorkOrders("page=1&limit=10")) as WorkOrdersApiResponse;

        // ✅ Ensure `orders` is ALWAYS an array
        const list = Array.isArray(result) ? result : result?.data;

        setOrders(Array.isArray(list) ? list : []);
      } catch (err: any) {
        setError({
          message: err?.message || "An unexpected error occurred",
          requestId: err?.requestId || "N/A",
        });
        setOrders([]); // keep state consistent
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="p-10 font-sans text-black bg-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Work Orders</h1>
        <div className="flex gap-2">
          <button className="bg-green-600 text-white px-4 py-2 rounded text-sm font-bold hover:bg-green-700 transition shadow-sm">
            📥 Import CSV
          </button>
          <Link
            href="/workorders/create"
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-bold hover:bg-blue-700 transition shadow-sm"
          >
            + New Order
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded mb-4 shadow-sm">
          <p className="font-bold">Connection Error</p>
          <p>{error.message}</p>
          <p className="text-xs mt-1 font-mono opacity-70">Request ID: {error.requestId}</p>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center p-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-500 animate-pulse">Fetching from backend...</p>
        </div>
      ) : (
        <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm bg-white">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 font-semibold text-gray-700">Title</th>
                <th className="p-4 font-semibold text-gray-700">Department</th>
                <th className="p-4 font-semibold text-gray-700">Priority</th>
                <th className="p-4 font-semibold text-gray-700">Status</th>
                <th className="p-4 font-semibold text-gray-700">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-blue-50/50 transition-colors">
                  <td className="p-4 font-medium text-gray-900">{order.title}</td>
                  <td className="p-4 text-xs font-mono text-gray-500 uppercase">{order.department}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded text-[10px] font-black tracking-wider ${
                        order.priority === "HIGH"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {order.priority}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 rounded bg-blue-100 text-blue-800 text-[10px] font-black uppercase tracking-tighter">
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <Link
                      href={`/workorders/${order.id}`}
                      className="text-blue-600 font-bold text-sm hover:text-blue-800 underline-offset-4 hover:underline"
                    >
                      DETAILS →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {orders.length === 0 && !error && (
            <div className="p-20 text-center">
              <p className="text-gray-400 italic">No orders are found in the system.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}