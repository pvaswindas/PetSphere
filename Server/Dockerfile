# Lightweight Python 3.10 image as the base
FROM python:3.10-slim

# Prevent Python from writing .pyc files (improves performance)
ENV PYTHONDONTWRITEBYTECODE=1

# Ensure output is displayed immediately in the logs
ENV PYTHONUNBUFFERED=1

# Set the working directory inside the container
WORKDIR /app

# Install necessary system dependencies
RUN apt-get update && apt-get install -y \
    postgresql-client \
    gcc \
    python3-dev \
    libpq-dev \
    libmagic1 \
    && rm -rf /var/lib/apt/lists/*

# Copy the dependencies file and install packages
COPY requirements.txt .
RUN pip --no-cache-dir install -r requirements.txt

# Copy the entire project into the container
COPY . .

# Expose port 8000 to allow external access
EXPOSE 8000

# Create necessary directories for storing static and media files
RUN mkdir -p /app/staticfiles /app/mediafiles

# Start the Django project using Daphne as the ASGI server
CMD [ "daphne", "-b", "0.0.0.0", "-p", "8000", "petsphere.asgi:application" ]
