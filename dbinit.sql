-- Create USERS table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50)
);

-- Create JOB table
CREATE TABLE job (
    job_id SERIAL PRIMARY KEY,
    title VARCHAR(100),
    description TEXT,
    skills_required TEXT
);

-- Create MOCK_INTERVIEW table
CREATE TABLE mock_interview (
    interview_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    job_id INT REFERENCES job(job_id),
    date DATE
);

-- Create QUESTION table
CREATE TABLE question (
    question_id SERIAL PRIMARY KEY,
    content TEXT,
    job_id INT REFERENCES job(job_id)
);

-- Create ANSWER table
CREATE TABLE answer (
    answer_id SERIAL PRIMARY KEY,
    interview_id INT REFERENCES mock_interview(interview_id),
    question_id INT REFERENCES question(question_id),
    content TEXT
);

-- Create REVIEW table
CREATE TABLE review (
    review_id SERIAL PRIMARY KEY,
    interview_id INT REFERENCES mock_interview(interview_id),
    feedback TEXT,
    score INT
);

-- Create PREVIOUS_INTERVIEW table
CREATE TABLE previous_interview (
    prev_interview_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    interview_data JSON
);

-- Create ADMIN table
CREATE TABLE admin (
    admin_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    permissions TEXT
);
