# Use Python 3.11 slim as the base image
FROM python:3.11-slim

# Set the working directory inside the container
WORKDIR /app

# Copy requirements file first (allows for better caching)
COPY requirements.txt .

# Copy the app directory with its structure
COPY app ./app

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Create instance directory and set permissions (for SQLite DB)
RUN mkdir -p /app/app/instance && \
    chmod -R 777 /app/app/instance

# Set environment variables
ENV FLASK_APP=app/app.py       # Entry point for Flask
ENV FLASK_ENV=production      # Production mode (no debug)
ENV DATABASE_URL=sqlite:////app/app/instance/data.db  # DB path

# Expose port 5000 (default Flask port)
EXPOSE 5000

# Command to run the Flask application
CMD ["python", "-m", "flask", "run", "--host=0.0.0.0"]
