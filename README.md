# 📝 Blog APP

A full-featured RESTful Blog API built with **NestJS**, **MongoDB**, and **Mongoose**, including **unit/integration tests**, **Swagger documentation**, and clean modular architecture.

---

## 🚀 Features

- ✨ NestJS + Mongoose integration
- ✍️ Create, Read, Update, Delete blog posts
- 🔐 User authentication with JWT
- 👤 User registration and login
- 💬 Post commenting system
- 🧪 Unit testing with Jest
- 📚 API documentation using Swagger
- 📦 Environment configuration with dotenv
- 🧱 Modular, scalable code structure
- 🌐 Ready for Docker (optional)

---

## 📁 Project Structure

```
src/
│
├── posts/                  # Blog post module
│   ├── schemas/            # Mongoose schemas
│   ├── dto/                # Data Transfer Objects
│   ├── posts.module.ts
│   ├── posts.controller.ts
│   └── posts.service.ts
│
├── comments/               # Comment module
│   ├── schemas/
│   ├── dto/
│   ├── comments.module.ts
│   ├── comments.controller.ts
│   └── comments.service.ts
│
├── auth/                   # Authentication module
│   ├── auth.module.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── jwt.strategy.ts
│
├── users/                  # User module
│   ├── schemas/
│   ├── dto/
│   ├── users.module.ts
│   ├── users.controller.ts
│   └── users.service.ts
│
├── app.module.ts           # Root module
├── main.ts                 # App entry point
└── ...
```

---

## 🛠️ Technologies Used

- [NestJS](https://nestjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [Swagger](https://swagger.io/)
- [Jest](https://jestjs.io/)
- [Passport + JWT](https://docs.nestjs.com/security/authentication)

---

## 📦 Installation

1. **Clone the repository:**

```bash
git clone https://github.com/ZaraSdt7/blog-app.git
cd blog-api
```

2. **Install dependencies:**

```bash
npm install
```

3. **Configure environment variables:**

Create a `.env` file based on `.env.example`:

```env
MONGO_URI=mongodb://localhost:27017/blog-db
PORT=3000
JWT_SECRET=yourSecretKey
```

---

## 🧪 Running the App

### 📌 Start in Development

```bash
npm run start:dev
```

### ✅ Run Tests

```bash
npm run test
```

---

## 🧭 API Documentation

After starting the app, open [http://localhost:3000/api](http://localhost:3000/api) in your browser to see Swagger UI.

---

## 🧰 API Endpoints (Overview)

### 📚 Blog Posts

| Method | Endpoint     | Description      |
| ------ | ------------ | ---------------- |
| GET    | `/posts`     | Get all posts    |
| GET    | `/posts/:id` | Get a post by ID |
| POST   | `/posts`     | Create new post  |
| PUT    | `/posts/:id` | Update post      |
| DELETE | `/posts/:id` | Delete post      |

### 💬 Comments

| Method | Endpoint                 | Description             |
| ------ | ------------------------ | ----------------------- |
| GET    | `/comments/post/:postId` | Get comments for a post |
| POST   | `/comments`              | Add a comment           |
| DELETE | `/comments/:id`          | Delete a comment        |

### 🔐 Auth

| Method | Endpoint         | Description             |
| ------ | ---------------- | ----------------------- |
| POST   | `/auth/register` | Register a new user     |
| POST   | `/auth/login`    | Login and receive token |

---

## 🚀 Coming Soon

- 🧪 Integration testing with MongoMemoryServer
- 🐳 Docker support
- 📩 Email verification
- 🛡️ Role-based access control

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 📄 License

MIT License. Free to use, modify, and distribute.
