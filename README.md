# Course Selling Platform Backend

A backend API service for a course selling platform where administrators can create and manage courses, and users can browse and purchase them.

## Features

### Admin Functionalities
- **Authentication**
  - Sign up with email, password, and personal details
  - Sign in with JWT token generation
  - Password hashing for security

- **Course Management**
  - Create new courses with title, description, price, and image URL
  - Update existing course details
  - View all courses created by the admin
  - Delete courses

### Course Features
- Title
- Description
- Price
- Image URL
- Creator tracking

## Technology Stack

- Node.js
- Express.js
- MongoDB (Database)
- JWT (Authentication)
- Bcrypt (Password Hashing)
- Zod (Input Validation)

## API Endpoints

### Admin Routes
```
POST /api/v1/admin/signup - Register a new admin
POST /api/v1/admin/signin - Login and get JWT token
POST /api/v1/admin/course - Create a new course
PUT /api/v1/admin/course - Update course details
GET /api/v1/admin/bulk - Get all courses by admin
```

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/Tharun2331/Course_Selling_App_Backend.git
   cd Course_Selling_App_Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Create a `.env` file in the root directory
   - Add the following configurations:
     ```
     MONGODB_URI=your_mongodb_connection_string
     ADMIN_JWT_SECRET=your_jwt_secret_key
     PORT=3000
     ```

4. **Start the server**
   ```bash
   npm start
   ```

## API Usage Examples

### Admin Signup
```json
POST /api/v1/admin/signup
{
    "email": "admin@example.com",
    "password": "SecurePass123!",
    "firstName": "John",
    "lastName": "Doe"
}
```

### Admin Signin
```json
POST /api/v1/admin/signin
{
    "email": "admin@example.com",
    "password": "SecurePass123!"
}
```

### Create Course
```json
POST /api/v1/admin/course
Headers: {
    "Authorization": "Bearer your_jwt_token"
}
Body: {
    "title": "MERN Stack Development",
    "description": "Complete MERN Stack Course",
    "imageUrl": "course_image_url",
    "price": 999
}
```

## Error Handling

The API implements proper error handling for:
- Invalid input validation
- Authentication failures
- Database errors
- Duplicate entries
- Server errors

## Security Features

- Password hashing using bcrypt
- JWT token authentication
- Input validation using Zod
- MongoDB injection prevention

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

