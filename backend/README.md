## Business Case Summary

This is the frontend work of the Operational Management System using Toyota Production System (TPS) principles.


## TPS Alignment Explanation

The system follows Toyota Production System by promoting the workflow and visual management. The enforced satus includes (NEW → IN_PROGRESS → BLOCKED → DONE) to ensure that the work progresses in a organized manner.


## Setup Instructions

Install dependencies:

npm install

Create an .env.local file:

NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api

NEXT_PUBLIC_API_KEY=your_api_key_here

Run an development server:
npm run dev

The Application runs at http://localhost:3000

## API Documentation

Hosted at:

http://localhost:3001/api

GET /workorders

GET /workorders/{id}

POST /workorders

POST /upload (CSV intake)

## CSV Template
The Required columns:
title, description, department, priority, requesterName







