import Link from 'next/link';

export default function Sidebar() {
  return (
    <div className="w-64 bg-slate-900 text-white min-h-screen p-6 flex flex-col gap-4">
      <h2 className="text-xl font-bold mb-6 text-blue-400">Maintenance App</h2>
      <Link href="/dashboard" className="hover:text-blue-300 transition">Dashboard</Link>
      <Link href="/workorders" className="hover:text-blue-300 transition">Work Orders List</Link>
      <Link href="/workorders/create" className="hover:text-blue-300 transition">+ New Work Order</Link>
    </div>
  );
}