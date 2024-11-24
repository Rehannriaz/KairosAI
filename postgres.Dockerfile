# Use the official PostgreSQL image as the base
FROM postgres:latest

# Environment variables for PostgreSQL
ENV POSTGRES_USER=admin
ENV POSTGRES_PASSWORD=admin123
ENV POSTGRES_DB=mock_interview_db

# Copy the initialization script into the Docker image
COPY dbinit.sql /docker-entrypoint-initdb.d/

# Expose the default PostgreSQL port
EXPOSE 5432
