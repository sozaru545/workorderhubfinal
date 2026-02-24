export type Department = 'FACILITIES' | 'IT' | 'SECURITY' | 'HR';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';
export type Status = 'NEW' | 'IN_PROGRESS' | 'BLOCKED' | 'DONE';

export interface WorkOrder {
  id: string;
  title: string;
  description: string;
  department: Department;
  priority: Priority;
  status: Status;
  requesterName: string;
  assignee?: string;
}