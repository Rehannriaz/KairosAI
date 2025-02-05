-- Create USERS table
CREATE TABLE users (
    user_id CHAR(24) PRIMARY KEY DEFAULT substring(md5(random()::text), 1, 24),
    name VARCHAR(100),
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50)
);

-- Create JOB table
CREATE TABLE job (
    job_id CHAR(24) PRIMARY KEY DEFAULT substring(md5(random()::text), 1, 24),
    title VARCHAR(100),
    description TEXT,
    skills_required TEXT
);

-- Create MOCK_INTERVIEW table
CREATE TABLE mock_interview (
    interview_id CHAR(24) PRIMARY KEY DEFAULT substring(md5(random()::text), 1, 24),
    user_id CHAR(24) REFERENCES users(user_id),
    job_id CHAR(24) REFERENCES job(job_id),
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    interview_data JSONB -- Store interview-specific data in JSON format (e.g., answers, feedback)
);

-- Create REVIEW table
CREATE TABLE review (
    review_id CHAR(24) PRIMARY KEY DEFAULT substring(md5(random()::text), 1, 24),
    interview_id CHAR(24) REFERENCES mock_interview(interview_id),
    feedback TEXT,
    score INT
);

-- Create PREVIOUS_INTERVIEW table
CREATE TABLE previous_interview (
    prev_interview_id CHAR(24) PRIMARY KEY DEFAULT substring(md5(random()::text), 1, 24),
    user_id CHAR(24) REFERENCES users(user_id),
    job_id CHAR(24) REFERENCES job(job_id),
    interview_data JSONB -- Store interview-specific data in JSON format (e.g., questions, answers, feedback)
);

-- Create ADMIN table
CREATE TABLE admin (
    admin_id CHAR(24) PRIMARY KEY DEFAULT substring(md5(random()::text), 1, 24),
    user_id CHAR(24) REFERENCES users(user_id),
    permissions TEXT
);

-- Create RESUMES table with a foreign key to users
CREATE TABLE resumes (
    id CHAR(24) PRIMARY KEY DEFAULT substring(md5(random()::text), 1, 24), -- 24-character identifier for the resume
    user_id CHAR(24) REFERENCES users(user_id) ON DELETE CASCADE, -- Foreign key referencing users
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    professional_summary TEXT NOT NULL,
    skills TEXT[], -- Array of strings for skills
    employment_history JSONB, -- Use JSONB for storing the employment history as an object
    education JSONB, -- Use JSONB for education details as an object
    preferences JSONB -- Use JSONB for preferences details as an object
);
