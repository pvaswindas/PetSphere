# Petsphere - Social Media & Marketplace for Pet Lovers

![Petsphere Logo](petsphere.preview.png)

## 🐶 Overview

**Petsphere** is a unique **social media plus marketplace** designed exclusively for pet lovers. It allows users to connect, share, and interact through engaging social features while also providing a dedicated space for buying, selling, or adopting pets. Users can create profiles and share updates, message other pet enthusiasts, engage in one-on-one video calls, and explore pet listings. Petsphere fosters a fun and interactive community while making pet adoption and pet-related transactions seamless and secure.

## 🌟 Features

### 🐾 Social Interaction
- User profiles with pet galleries
- Like, comment, and share posts
- Follow other pet owners
- Direct messaging with WebSocket-based real-time chat

### 🎥 Communication & Media
- One-on-one video calling using WebRTC
- Seamless image and video uploads through chat
- Interactive paw stories (similar to Instagram Stories)

### 🛍 Pet Listings
- Buy, sell, or adopt pets through verified listings
- Filter listings by breed, location, and availability
- Contact sellers directly via chat

### 🔐 Security & Moderation
- Role-based access control (Users, Admins, Moderators)
- JWT authentication for secure login
- Rate limiting & CSRF protection

### 🛠 Admin Dashboard
- User and post moderation
- Community management tools
- Announcements management
- Analytics and engagement tracking

## 🏗 Tech Stack

### Backend
- **Django (ASGI) & Django REST Framework** – API and backend logic
- **Django Channels** – Real-time WebSocket chat
- **PostgreSQL** – Database storage
- **Redis** – Caching and async task management
- **Celery & Celery Beat** – Background task processing
- **Stripe** – Payment integration (future feature)

### Frontend
- **React & Redux Toolkit** – Modern UI with state management
- **Tailwind CSS** – Efficient and responsive styling
- **Axios** – API communication
- **WebSocket** for real-time features
- **WebRTC** – Video calling support

### DevOps & Deployment
- **Docker & Docker Compose** – Containerized development
- **GitHub Actions** – CI/CD for testing and deployment
- **AWS EC2** – Cloud hosting
- **Nginx (within Docker)** – Reverse proxy setup

## 🚀 Getting Started

### Prerequisites
```bash
# Required installations
- Python 3.10+
- Node.js 18+
- PostgreSQL
- Redis
- Docker & Docker Compose
```

### Development Setup

1. **Clone the repository**
```bash
https://github.com/pvaswindas/PetSphere.git
cd Petsphere
```

2. **Backend Setup**
```bash
cd Server
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows
pip install -r requirements.txt
python manage.py migrate
daphne petsphere.asgi:application
```

3. **Frontend Setup**
```bash
cd Client
npm install
npm run dev
```

4. **Run using Docker**
```bash
docker-compose up --build
```

## 📁 Project Structure

```
Petsphere/
├── backend/               # Django backend
│   ├── apps/
│   │   ├── accounts/      # User authentication
│   │   ├── chat/          # WebSocket chat
│   │   ├── posts/         # Posts & media sharing
│   │   ├── petlistings/   # Buy, sell, and adopt pets
│   │   ├── payments/      # Stripe integration (future)
│   └── config/           # Django settings & configurations
├── frontend/              # React frontend
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── pages/        # Page components
│   │   ├── store/        # Redux store
│   └── public/           # Static assets
├── docker/                # Docker-related files
├── .github/workflows/     # CI/CD workflows
└── Dockerfile             # Backend Dockerfile
```

## 🔍 API Overview
- RESTful architecture
- JWT authentication
- WebSocket support for chat
- API rate limiting

## 🛡 Security Measures
- Secure authentication & authorization
- CORS protection
- Input validation & rate limiting
- CSRF protection

## 📊 Monitoring & Analytics
- Error tracking & logging
- Database performance monitoring
- Web traffic analytics

## 🤝 Community & Support

## 📬 Contact
For any queries or contributions:
- **GitHub**: https://github.com/pvaswindas
- **Email**: pvaswindas.dev@gmail.com

---
Made by Aswin Das

