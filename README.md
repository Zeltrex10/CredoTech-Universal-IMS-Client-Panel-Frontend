
# CredoTech Universal IMS Client Panel – Setup and Running Guide 📦

## Prerequisites ⚙️

Ensure you have the following installed:

- Node.js (v14 or later) 🖥️
- npm (v6 or later) 📲

## Clone the Repository 🔽

Clone the repository to your local machine:

```bash
git clone <link-to-your-github-repository>
```

Navigate into the project directory:

```bash
cd <your-project-directory>
```

## Frontend Setup 🖥️

1. Change to the frontend directory:

    ```bash
    cd client
    ```

2. Install the required dependencies:

    ```bash
    npm install
    ```

3. Run the frontend development server:

    ```bash
    npm run dev
    ```

Your frontend should now be running on [http://localhost:5173/](http://localhost:5173/). 🚀

## Backend Setup ⚙️

1. Change to the backend directory:

    ```bash
    cd server
    ```

2. Install the required dependencies:

    ```bash
    npm install
    ```

3. Run the backend development server:

    ```bash
    npm run dev
    ```

The backend should now be running on [http://localhost:8000](http://localhost:8000). 🔥

## Features Overview 🌟

### CredoTech Universal IMS – Client Panel 📋

#### Added Features

##### Login 🔑

- **Authentication**: Users authenticate via token-based authentication. 🔐
- **Session Management**: Tokens expire after 10 minutes, ensuring secure sessions. ⏳
- **Security**: API uses hashed passwords and unique tokens for each session. 🔒

##### Register 📝

- **User Registration**: Stores user's full name, username, email, and password (with confirmation). 📧
- **Data Storage**: Information is stored in `registers.json` with hashed passwords and unique user IDs. 🗃️
- **Roles**: Default role is "Client" (activation/deactivation features coming soon, currently managed by the admin panel). ⚙️

##### Dashboard 📊

- **Inventory Statistics**:
  - Total Products 📦
  - Categories 📑
  - Stock 📈
  - Low Stock Products ⚠️
- **Stock Tracking**: Tracks daily percentage changes in stock values (increase/decrease). 📉

##### Product Management 🛒

###### Product Page

- **New Product Modal**:
  - Stores data in `products.json`. 📄
  - Fields: Product Name, Description, SKU, Category (e.g., Hardware, Electronics, Clothing), Quantity, Low Stock Threshold. 📦
  - **Image Upload**: Stores images in Firebase and fetches image URLs for display. 📸

- **Product Table**:
  - Displays: Product Name, SKU, Category, Quantity, Status (In Stock/Low Stock), Actions (Edit/Delete). ⚙️
  - **Search**: Highlights keywords in product names, SKUs, and categories. 🔍
  - **Sorting**: Click column headers to sort data. 📊
  - **Pagination**: Divides entries across pages for easier navigation. 📑

- **Modals**:
  - **Edit Product**: Allows updating product details. ✏️
  - **View Product**: Displays details like image, name, description, quantity, status, and SKU. 🔍

##### Category Management 📂

###### Categories Page

- **Search & Filters**:
  - Search Bar for filtering categories. 🔎
  - Date Filter to select products by creation date. 📅

- **Category Table**:
  - Displays: Name, Description, Products Linked, Created Date. 🗂️
  - **Actions**:
    - **View**: Displays detailed category modal. 👀
    - **Edit**: Allows modifying category details. ✏️
    - **Delete**: Permanently removes category. 🗑️
  - **Pagination**: Allows navigation across multiple pages. 📄

- **Modals**:
  - **View Category**: Displays read-only details (Name, Description, Products Linked, Date Created). 📄
  - **Edit Category**: Allows editing of Name, Description, and Associated Products. ✏️
  - **Add Category**: Option to add new categories. ➕

##### Transaction Management 💳

- **Transaction Table**:
  - Displays: Product Name, Transaction Type (Stock In/Out), Quantity, Date, Added By. 📅
  - **Color-coded Labels**:
    - Red for Stock Out. 🔴
    - Green for Stock In. 🟢

- **Filtering & Actions**:
  - **Filters**: Filter transactions by Start & End Date. 📆
  - **Search**: Allows quick lookup of transactions. 🔍
  - **Action Buttons**:
    - **Add Transaction**: Opens modal for adding new transactions. ➕
    - **Clear All Transactions**: Deletes all transaction records. 🧹

- **Add Transaction Modal**:
  - Select transaction type (Stock In/Out). 🔄
  - Enter product name and quantity before saving. 📦

## Backend Configuration 🔧

The backend uses the following modules:

- `bcrypt`: For password hashing. 🔐
- `cors`: For handling cross-origin requests. 🌐
- `dotenv`: For managing environment variables. 🗃️
- `express`: Web server framework. ⚙️
- `jsonwebtoken`: For creating and verifying JWT tokens. 🛡️
- `ws`: WebSocket for real-time communication. 📡

Backend data is stored in files such as `registers.json` and `products.json`, and the backend supports functionality like user authentication and CRUD operations for product and category management.

## Additional Notes 📝

- **Frontend**: Built with React, using Vite for fast development, and integrates with Firebase for image hosting. ⚛️
- **Backend**: Built with Express.js, with JWT for secure authentication and file-based data storage for simplicity. 🔧
