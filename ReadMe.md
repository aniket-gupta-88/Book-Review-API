Book Review API
This is a RESTful API for managing books and their reviews, with user authentication. Users can register, log in, add books, review books, and manage their own books and reviews. The API also includes a search functionality for books.

🚀 Features
User Authentication: Register and log in users with JWT-based authentication.

Book Management:

Add new books (authenticated users only).

View all books.

View a single book by ID.

Update existing books (only by the user who added them).

Delete books (only by the user who added them, also deletes associated reviews).

Search books by title or author (whole word, case-insensitive).

Review Management:

Add reviews to books (authenticated users only).

View all reviews for a specific book.

View a single review by ID.

Update existing reviews (only by the user who created them).

Delete reviews (only by the user who created them).

Automatically updates book's average rating and number of reviews when reviews are added or deleted.

Secure Password Handling: Passwords are hashed using bcryptjs.

Environment Variables: Sensitive information is managed via .env files.

📦 Project Structure
book-review-api/
├── controllers/
│ ├── authController.js # Logic for user registration and login
│ ├── bookController.js # Logic for book-related operations
│ └── reviewController.js # Logic for review-related operations
├── models/
│ ├── Book.js # Mongoose schema for Book documents
│ ├── Review.js # Mongoose schema for Review documents
│ └── User.js # Mongoose schema for User documents (with password hashing)
├── routes/
│ ├── authRoutes.js # API endpoints for authentication
│ ├── bookRoutes.js # API endpoints for books
│ └── reviewRoutes.js # API endpoints for reviews
├── middlewares/
│ └── authMiddleware.js # Middleware for JWT verification and route protection
├── app.js # Express application setup and middleware configuration
├── server.js # Entry point, connects to DB and starts server
└── config/
└── db.js # Database connection logic

🛠️ Technologies Used
Node.js: JavaScript runtime environment.

Express.js: Web framework for Node.js.

MongoDB: NoSQL database.

Mongoose: ODM (Object Data Modeling) for MongoDB and Node.js.

jsonwebtoken: For implementing JSON Web Tokens for authentication.

bcryptjs: For password hashing.

dotenv: To load environment variables from a .env file.

morgan: HTTP request logger middleware.

cors: Middleware for enabling Cross-Origin Resource Sharing.

⚙️ Setup Instructions
Follow these steps to get the project up and running on your local machine.

1. Clone the Repository (if applicable)
   If this project is in a Git repository, clone it:

git clone <repository-url>
cd book-review-api

Otherwise, navigate into your project folder:

cd book-review-api

2. Install Dependencies
   Install all the required Node.js packages using npm:

npm install

3. Environment Variables
   Create a .env file in the root of your project directory (book-review-api/.env). This file will store your sensitive configuration details.

PORT=5000
MONGO_URI=mongodb+srv://guptaaniket8828:YOUR_ACTUAL_PASSWORD_HERE@cluster0.4tycwif.mongodb.net/book-review-api?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=YOUR_SUPER_SECURE_RANDOM_JWT_SECRET_HERE_ATLEAST_32_CHARS

Important:

Replace YOUR_ACTUAL_PASSWORD_HERE with the password for your MongoDB Atlas user (guptaaniket8828).

Replace YOUR_SUPER_SECURE_RANDOM_JWT_SECRET_HERE_ATLEAST_32_CHARS with a long, random string. This is crucial for JWT security.

Do not commit your .env file to version control. Ensure .env is listed in your .gitignore file.

4. MongoDB Atlas Configuration
   If you are using MongoDB Atlas (as indicated by your MONGO_URI):

Database User: Ensure you have a database user (guptaaniket8828 in your case) with read and write access to your cluster. If you don't remember the password, you'll need to reset it in the MongoDB Atlas dashboard under "Database Access".

Network Access: Add your current IP address (or "Allow Access from Anywhere" for development, but be cautious in production) to the IP Whitelist in MongoDB Atlas under "Network Access". This allows your server to connect to the database.

▶️ How to Run Locally
Ensure MongoDB is running: If you're using a local MongoDB instance, start it. If using MongoDB Atlas, ensure your network access is configured.

Start the server:

node server.js

You should see messages in your console indicating that MongoDB is connected and the server is running on the specified port (e.g., Server running on port 5000).

The API will be accessible at http://localhost:5000.

📊 Database Schema Design
This API uses three main collections: users, books, and reviews.

Entities and Relationships (ER Diagram)
+----------------+ +----------------+ +----------------+
| User | | Book | | Review |
+----------------+ +----------------+ +----------------+
| \_id (ObjectId) |<----- | \_id (ObjectId) |<----- | \_id (ObjectId) |
| username (str) | | title (str) | | user (ObjectId)| ----> User.\_id
| email (str) | | author (str) | | book (ObjectId)| ----> Book.\_id
| password (str) | | genre (str) | | rating (num) |
| createdAt (Date)| | pubYear (num) | | comment (str) |
+----------------+ | description (str)| | createdAt (Date)|
| avgRating (num)|
| numReviews (num)|
| addedBy (ObjectId)|----> User.\_id
| createdAt (Date)|
+----------------+

Schema Details
User:

\_id: Unique identifier for the user.

username: Unique username (string).

email: Unique email address (string).

password: Hashed password (string).

createdAt: Timestamp of user creation.

Book:

\_id: Unique identifier for the book.

title: Title of the book (string).

author: Author of the book (string).

genre: Genre of the book (string, optional).

publicationYear: Year the book was published (number, optional).

description: Description of the book (string, optional).

averageRating: Calculated average rating of the book (number, default 0).

numReviews: Count of reviews for the book (number, default 0).

addedBy: Reference to the User who added the book (ObjectId).

createdAt: Timestamp of book creation.

Review:

\_id: Unique identifier for the review.

user: Reference to the User who wrote the review (ObjectId).

book: Reference to the Book being reviewed (ObjectId).

rating: Rating given (number, 1-5).

comment: Review comment (string, optional).

createdAt: Timestamp of review creation.

Unique Index: A compound unique index on (user, book) ensures a user can only submit one review per book.

💡 Design Decisions and Assumptions
RESTful API Design: Follows REST principles for resource-based URLs and standard HTTP methods.

JWT Authentication: JSON Web Tokens are used for stateless authentication, suitable for APIs. Tokens are sent in the Authorization: Bearer <token> header.

Password Hashing: bcryptjs is used for secure one-way hashing of passwords, protecting user credentials.

Mongoose Pre/Post Hooks:

Password hashing is handled by a pre('save') hook in the User model.

Automatic calculation and update of averageRating and numReviews on the Book model are handled by post('save') and post('remove') hooks in the Review model. This keeps data consistent without manual intervention in controllers.

Route Protection: A custom authMiddleware is used to protect routes requiring authentication, ensuring only logged-in users can perform certain actions.

Authorization:

Users can only update or delete books they have added.

Users can only update or delete reviews they have created.

Search Functionality: Implemented using MongoDB's $regex operator with word boundaries (\b) for whole-word, case-insensitive searching. This provides a more precise search than simple substring matching.

Error Handling: Basic error handling is implemented with appropriate HTTP status codes (e.g., 400 for bad requests, 401 for unauthorized, 403 for forbidden, 404 for not found, 500 for server errors).

Cascade Delete: When a book is deleted, all associated reviews are automatically removed from the database.

⚡ Example API Requests
You can use tools like curl (command line) or Postman/Insomnia/Thunder Client (GUI) to test these endpoints. Replace http://localhost:5000 with your server's address if it's different.

First, obtain a JWT token by registering or logging in.

1. User Authentication
   Register User
   curl -X POST \
    http://localhost:5000/api/register \
    -H 'Content-Type: application/json' \
    -d '{
   "username": "testuser",
   "email": "test@example.com",
   "password": "password123"
   }'

Login User
curl -X POST \
 http://localhost:5000/api/login \
 -H 'Content-Type: application/json' \
 -d '{
"email": "test@example.com",
"password": "password123"
}'

# Save the "token" from the response for authenticated requests

2. Book Management
   Add a New Book (Requires Token)
   curl -X POST \
    http://localhost:5000/api/books \
    -H 'Content-Type: application/json' \
    -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
    -d '{
   "title": "The Hitchhiker'\''s Guide to the Galaxy",
   "author": "Douglas Adams",
   "genre": "Science Fiction",
   "publicationYear": 1979,
   "description": "A comedic science fiction series about space travel."
   }'

Get All Books
curl -X GET \
 http://localhost:5000/api/books

Get Single Book by ID
curl -X GET \
 http://localhost:5000/api/books/YOUR_BOOK_ID

Update a Book (Requires Token & Ownership)
curl -X PUT \
 http://localhost:5000/api/books/YOUR_BOOK_ID \
 -H 'Content-Type: application/json' \
 -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
 -d '{
"description": "A hilarious and profound science fiction series. (Updated)"
}'

Delete a Book (Requires Token & Ownership)
curl -X DELETE \
 http://localhost:5000/api/books/YOUR_BOOK_ID \
 -H 'Authorization: Bearer YOUR_JWT_TOKEN'

Search Books by Title or Author (Whole Word)
curl -X GET \
 "http://localhost:5000/api/books/search?q=galaxy"

```bash
curl -X GET \
  "http://localhost:5000/api/books/search?q=Adams"

3. Review Management
Add a Review to a Book (Requires Token)
curl -X POST \
  http://localhost:5000/api/reviews/YOUR_BOOK_ID \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  -d '{
    "rating": 5,
    "comment": "An absolutely brilliant read!"
  }'

Get Reviews for a Specific Book
curl -X GET \
  http://localhost:5000/api/reviews/book/YOUR_BOOK_ID

Get Single Review by ID
curl -X GET \
  http://localhost:5000/api/reviews/YOUR_REVIEW_ID

Update a Review (Requires Token & Ownership)
curl -X PUT \
  http://localhost:5000/api/reviews/YOUR_REVIEW_ID \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  -d '{
    "rating": 4,
    "comment": "Still brilliant, but maybe not perfect."
  }'

Delete a Review (Requires Token & Ownership)
curl -X DELETE \
  http://localhost:5000/api/reviews/YOUR_REVIEW_ID \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN'
```
