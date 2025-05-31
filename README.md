# HG Restro APP:
  It is a comprehensive and modern restaurant management system that streamlines operations such as table management, order tracking, kitchen coordination, and analytics. The application is designed to improve operational efficiency, provide real-time insights, and enhance the customer experience through a responsive and intuitive interface.

## Setup instructions:
  - `npm install`: To install all required dependencies.
  - `npm start`: To start the application
  - `npm run dev`: To start and automatically restart the node application when it detects any changes.

## Features:
1. Dashboard Analytics
	- View of total chefs, clients, revenue, and orders.
	- Visual charts for revenue and order summary.

2. Table Management
	- Real-time table status: Reserved or Available.
	- Add a table with custom names and chair counts.
	- Search and filter by table number or status.

3. Order Management
	- Track order types and statuses (Processing, Served, Not Picked).

4. Menu Management
	- Category-based menu (Drink, Pizza, Burger, etc.).
	- Add/remove items to/from the cart.
	- Mobile-friendly swipe-to-order feature.

5. Checkout & Delivery
	- Collect customer info and cooking instructions.
	- Show estimated delivery time.
	- Summarize the cart with taxes and charges.

6. Chef Order Assignment
   - List chefs and dynamically show the number of orders handled by each.
8. Search & Filters
   - Global search across tables, menu, and orders.
   - Filter panel for analytics, table availability, and order types.
10. POS Touch UI
    - On-screen keyboard for inputs.
    - Persistent cart view with smooth checkout flow.

### Built with:
    Frontend: Built using React.js and Vanilla CSS, ensuring a responsive and user-friendly UI across devices.
    Backend: Created RESTful APIs using Node.js with Express, handling CRUD operations, order processing, and business logic.
    Database: Used MongoDB to store dynamic data like orders, menu items, tables, and chef information.
