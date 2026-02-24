import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { api, ApiError } from '../../services/api'; 
import { WorkOrder, Status } from '../../types/workorder'; 
import ErrorAlert from '../../components/ErrorAlert'; 

export default function WorkOrderDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [order, setOrder] = useState<WorkOrder | null>(null);
  const [error, setError] = useState<ApiError | null>(null); 

  const fetchWorkOrder = async () => {
    if (!id) return;
    try {
      const data = await api.getWorkOrder(id as string); 
      setOrder(data);
    } catch (err: any) {
      setError(err as ApiError);
    }
  };

  useEffect(() => { fetchWorkOrder(); }, [id]);

  const handleStatusChange = async (nextStatus: string) => {
    try {
      setError(null);
      const updatedData = await api.changeStatus(id as string, nextStatus);
      setOrder(updatedData);
    } catch (err: any) {
      setError(err as ApiError);
    }
  };

  if (!order && !error) return <p className="p-10">It is Loading...</p>;


  const allowedTransitions: Record<Status, Status[]> = {
    'NEW': ['IN_PROGRESS'],
    'IN_PROGRESS': ['BLOCKED', 'DONE'],
    'BLOCKED': ['IN_PROGRESS'],
    'DONE': []
  };

  return (
    <div className="p-10 text-black max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{order?.title}</h1>
      
      {/* Surface with errors and the requestId */}
      <ErrorAlert error={error} />

      {order && (
        <div className="mt-4 p-6 border rounded-lg bg-white shadow-sm">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <p><strong>Status:</strong> <span className="font-mono text-blue-600">{order.status}</span></p>
            <p><strong>Priority:</strong> {order.priority}</p>
            <p><strong>Department:</strong> {order.department}</p>
            <p><strong>Requester:</strong> {order.requesterName}</p>
          </div>
          
          <div className="border-t pt-4">
            <p className="font-semibold mb-2 text-gray-700 italic">The Lifecycle Controls (Jidoka)</p>
            <div className="flex gap-3">
              {allowedTransitions[order.status].map(next => (
                <button 
                  key={next}
                  onClick={() => handleStatusChange(next)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-bold transition-colors"
                >
                  Move to {next}
                </button>
              ))}
              {order.status === 'DONE' && <p className="text-green-600 font-bold">The Work Is Completed</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}