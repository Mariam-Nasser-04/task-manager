# TaskMaster - Task Management System

![TaskMaster Screenshot](screenshots/app-preview.png) *(Add a screenshot later)*

## 🚀 Features
- User authentication (Login/Register)
- Create, edit, and delete tasks
- Mark tasks as complete/incomplete
- Dark/Light mode toggle
- Task statistics dashboard
- Responsive design

## 🛠️ Tech Stack
- **Frontend**: HTML5, CSS3, JavaScript
- **Backend**: Python (Flask)
- **Database**: SQLite
- **Containerization**: Docker

## 📦 Prerequisites
- Docker 20.10+
- Docker Compose 1.29+ (optional)

## 🏃‍♂️ Quick Start

### Method 1: Using Docker Only
```bash
# Pull the image
docker pull mariamnasser/task-manager:latest

# Run the container
docker run -d -p 5000:5000 -v task_data:/app/app/instance --name taskmaster mariamnasser/task-manager
