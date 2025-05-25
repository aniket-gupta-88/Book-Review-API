# 📚 Book Review API

A RESTful API for managing books and their reviews, with user authentication. Users can register, log in, add books, review books, and manage their own content. Includes search functionality for books.

---

## ⚛️ Features

### 🔐 User Authentication

* Register and log in with JWT-based authentication.

### 📘 Book Management

* Add new books (authenticated users only).
* View all books or a single book by ID.
* Update/delete books (only by the user who added them).
* Deleting a book also deletes all associated reviews.
* Search books by title or author (whole word, case-insensitive).

### ✍️ Review Management

* Add reviews to books (authenticated users only).
* View all reviews for a specific book or a single review by ID.
* Update/delete reviews (only by the user who created them).
* Automatically updates book's average rating and number of reviews.

### 🔐 Secure Password Handling

* Passwords are hashed using `bcryptjs`.

### 📁 Environment Variables

* All sensitive data is stored securely via a `.env` file.

---

## 📆 Project Structure

```
book-review-api/
├── controllers/
│   ├── authController.js
│   ├── bookController.js
│   └── reviewController.js
├── models/
│   ├── Book.js
│   ├── Review.js
│   └── User.js
├── routes/
│   ├── authRoutes.js
│   ├── bookRoutes.js
│   └── reviewRoutes.js
├── middlewares/
│   └── authMiddleware.js
├── config/
│   └── db.js
├── app.js
├── server.js
└── .env
```

---

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd book-review-api
```

Or just navigate to the folder:

```bash
cd book-review-api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
MONGO_URI=mongodb+srv://guptaaniket8828:<YOUR_PASSWORD_HERE>@cluster0.4tycwif.mongodb.net/book-review-api?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=<YOUR_RANDOM_JWT_SECRET_STRING_AT_LEAST_32_CHARS>
```

🚡 **IMPORTANT:**

* Replace `<YOUR_PASSWORD_HERE>` with your MongoDB password.
* Replace `<YOUR_RANDOM_JWT_SECRET_STRING_AT_LEAST_32_CHARS>` with a secure string.

### 4. MongoDB Atlas Setup

* **User Access:** Create a DB user with read/write access.
* **Network Access:** Whitelist your IP or allow access from anywhere (dev only).

---

## ▶️ How to Run Locally

```bash
node server.js
```

Visit: [http://localhost:5000](http://localhost:5000)

---

## 📊 Database Schema Design

### ER Diagram Overview

```
+----------------+     +----------------+     +----------------+
|     User       |<----|     Book       |<----|     Review     |
+----------------+     +----------------+     +----------------+
```

### 📄 User

* `_id`: ObjectId
* `username`: String
* `email`: String
* `password`: Hashed String
* `createdAt`: Date

### 📕 Book

* `_id`: ObjectId
* `title`: String
* `author`: String
* `genre`: String (optional)
* `publicationYear`: Number (optional)
* `description`: String (optional)
* `averageRating`: Number (default: 0)
* `numReviews`: Number (default: 0)
* `addedBy`: ObjectId (User ref)
* `createdAt`: Date

### 🌝 Review

* `_id`: ObjectId
* `user`: ObjectId (User ref)
* `book`: ObjectId (Book ref)
* `rating`: Number (1–5)
* `comment`: String (optional)
* `createdAt`: Date

---

## 💡 Design Decisions & Assumptions

* **RESTful** resource routes
* **JWT Auth** using `Authorization: Bearer <token>`
* **Password Security** via `bcryptjs`
* **Automatic rating updates** via Mongoose hooks on review save/delete
* **Authorization Middleware**: Only resource owners can edit/delete
* **Search** with MongoDB regex and `\b` for whole-word match
* **Cascade Delete**: Deleting a book deletes all related reviews

---

🧪 Example API Requests (using curl)
Replace [http://localhost:5000](http://localhost:5000) and YOUR\_JWT\_TOKEN, YOUR\_BOOK\_ID, etc., accordingly.

1. 🔐 User Authentication
   **Register**

```bash
curl -X POST http://localhost:5000/api/register \
-H 'Content-Type: application/json' \
-d '{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}'
```

**Login**

```bash
curl -X POST http://localhost:5000/api/login \
-H 'Content-Type: application/json' \
-d '{
  "email": "test@example.com",
  "password": "password123"
}'
```

2. 📘 Book Management
   **Add Book**

```bash
curl -X POST http://localhost:5000/api/books \
-H 'Content-Type: application/json' \
-H 'Authorization: Bearer YOUR_JWT_TOKEN' \
-d '{
  "title": "The Hitchhiker'\''s Guide to the Galaxy",
  "author": "Douglas Adams",
  "genre": "Science Fiction",
  "publicationYear": 1979,
  "description": "A comedic science fiction series about space travel."
}'
```

**Get All Books**

```bash
curl -X GET http://localhost:5000/api/books
```

**Get Book by ID**

```bash
curl -X GET http://localhost:5000/api/books/YOUR_BOOK_ID
```

**Update Book**

```bash
curl -X PUT http://localhost:5000/api/books/YOUR_BOOK_ID \
-H 'Content-Type: application/json' \
-H 'Authorization: Bearer YOUR_JWT_TOKEN' \
-d '{
  "description": "Updated description here."
}'
```

**Delete Book**

```bash
curl -X DELETE http://localhost:5000/api/books/YOUR_BOOK_ID \
-H 'Authorization: Bearer YOUR_JWT_TOKEN'
```

**Search Books**

```bash
curl -X GET "http://localhost:5000/api/books/search?q=galaxy"
```

3. ✍️ Review Management
   **Add Review**

```bash
curl -X POST http://localhost:5000/api/reviews/YOUR_BOOK_ID \
-H 'Content-Type: application/json' \
-H 'Authorization: Bearer YOUR_JWT_TOKEN' \
-d '{
  "rating": 5,
  "comment": "An absolutely brilliant read!"
}'
```

**Get Reviews for Book**

```bash
curl -X GET http://localhost:5000/api/reviews/book/YOUR_BOOK_ID
```

**Get Single Review**

```bash
curl -X GET http://localhost:5000/api/reviews/YOUR_REVIEW_ID
```

**Update Review**

```bash
curl -X PUT http://localhost:5000/api/reviews/YOUR_REVIEW_ID \
-H 'Content-Type: application/json' \
-H 'Authorization: Bearer YOUR_JWT_TOKEN' \
-d '{
  "rating": 4,
  "comment": "Still brilliant, just not perfect."
}'
```

**Delete Review**

```bash
curl -X DELETE http://localhost:5000/api/reviews/YOUR_REVIEW_ID \
-H 'Authorization: Bearer YOUR_JWT_TOKEN'
```

📢 License
This project is open-source and free to use under the MIT License.


