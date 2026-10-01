# Expense Tracker

A web app to track personal expenses, built with Node.js, Express, PostgreSQL, and Bootstrap. Users can add, edit, delete, and filter expenses, with live totals shown in summary cards.

## How to run

**Backend**

1. Create a PostgreSQL database named `expense_tracker`.
2. Run `backend/schema.sql` on it to create the `expenses` table and add sample data.
3. Copy `backend/.env.example` to a new file named `.env`, and write your PostgreSQL password in it.
4. Open a terminal in the `backend` folder and run:
   ```
   npm install
   node server.js
   ```
5. The server runs on `http://localhost:3000`.

**Frontend**

1. Open `frontend/index.html` with Live Server (or open it directly in the browser).
2. Make sure the backend server is running first.

## Features

- [x] Add an expense (with validation)
- [x] Delete an expense
- [x] Edit an expense
- [x] Filter by category
- [x] Summary cards (total, count, highest)
- [x] Data is saved in a PostgreSQL database

## Screenshots

See the `backend/screenshots` folder for API endpoint tests. The frontend is a Bootstrap page with a navbar, summary cards (built with CSS Grid), an add-expense form, a filterable table, and an edit modal — fully connected to the backend API.

## What was the hardest part?

The trickiest part was getting PostgreSQL's password authentication working correctly, and remembering to convert the amount and date fields (using ::float8 and to_char) so the API returns clean JSON instead of PostgreSQL's raw types.

## Demo Video
You can watch the application walkthrough video here: [Watch Demo Video](https://drive.google.com/file/d/1Spro4Ft2DWQnCgf7PoENlNCu8UfN3l1y/view?usp=sharing)

