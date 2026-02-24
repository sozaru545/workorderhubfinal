## Business Case Summary

WorkOrderHub represents the frontend and backend implementation of an Operational Management System designed to support maintenance and operational workflows. The application enables organizations to efficiently create, track, and manage work orders across multiple departments while maintaining visibility into progress, bottlenecks, and completion status. The system focuses on clarity, traceability, and structured process flow, making it suitable for real-world operational environments where accountability and efficiency are critical.

---

## TPS Alignment Explanation

The system is aligned with **Toyota Production System (TPS)** principles by emphasizing visual management, standardized workflows, and continuous flow of work. Work orders move through a clearly defined lifecycle consisting of **NEW**, **IN_PROGRESS**, **BLOCKED**, and **DONE** statuses. This enforced status progression ensures that work advances in an organized and controlled manner, prevents invalid transitions, and highlights operational constraints. The dashboard view acts as a visual control mechanism, allowing users to quickly identify workload distribution and blocked tasks, which directly supports TPS concepts such as waste reduction, flow optimization, and transparency.

---

## Setup Instructions

To run the frontend application, dependencies must first be installed using `npm install`. A local environment configuration file must then be created to define the API connection details. This file allows the frontend to securely communicate with the backend service.

Create a `.env.local` file in the frontend root directory and define the following variables:

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
NEXT_PUBLIC_API_KEY=your_api_key_here
```

Once configuration is complete, the development server can be started using `npm run dev`. The application will then be accessible through the browser at **[http://localhost:3000](http://localhost:3000)**.

---

## API Documentation

The backend API is hosted locally and exposes all endpoints under the base path shown below:


http://localhost:3001/api


The system provides endpoints to retrieve work orders, retrieve individual work orders by identifier, create new work orders, update work order status, and perform bulk CSV uploads. All API responses follow a standardized format and include a request identifier to support error tracking and debugging.


## CSV Template

The bulk upload feature requires CSV files to follow a defined structure to ensure proper validation and processing. Each CSV file must include the required columns used by the system to create work orders and enforce validation rules.

The required columns are:

title, description, department, priority, requesterName

Rows that do not meet validation requirements are rejected individually, and detailed error feedback is returned to indicate the reason for rejection, while valid rows are processed successfully.

