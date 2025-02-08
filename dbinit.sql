-- Create USERS table
CREATE TABLE users (
    user_id CHAR(24) PRIMARY KEY DEFAULT substring(md5(random()::text), 1, 24),
    name VARCHAR(100),
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50)
);

CREATE TABLE jobs (
    job_id          CHAR(24) PRIMARY KEY DEFAULT SUBSTRING(md5(random()::text), 1, 24),
    title           VARCHAR(100) NOT NULL,
    company         VARCHAR(100) NOT NULL,
    location        VARCHAR(100) NOT NULL,
    listing_url     TEXT NOT NULL,
    posted_date     DATE,
    about_role      TEXT,
    requirements    TEXT,
    full_description TEXT,
    scraped_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    salary          NUMERIC CHECK (salary >= 0),
    embedding VECTOR(1536) -- Added vector column for embeddings
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

CREATE TABLE user_primary_resume (
    user_id CHAR(24) PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
    resume_id CHAR(24) UNIQUE REFERENCES resumes(id) ON DELETE SET NULL
);


-- Create RESUMES table with a foreign key to users
CREATE TABLE resumes (
    id CHAR(24) PRIMARY KEY DEFAULT substring(md5(random()::text), 1, 24),
    user_id CHAR(24) REFERENCES users(user_id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    professional_summary TEXT NOT NULL,
    skills TEXT[],
    employment_history JSONB,
    education JSONB,
    preferences JSONB,
    embedding VECTOR(1536) -- Added vector column for embeddings
);


CREATE OR REPLACE FUNCTION set_primary_resume()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if the user already has a primary resume
    IF NOT EXISTS (SELECT 1 FROM user_primary_resume WHERE user_id = NEW.user_id) THEN
        -- Set the new resume as the primary one
        INSERT INTO user_primary_resume (user_id, resume_id)
        VALUES (NEW.user_id, NEW.id);
    ELSE
        -- If the user has a primary resume, update it to the new resume
        UPDATE user_primary_resume
        SET resume_id = NEW.id
        WHERE user_id = NEW.user_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER after_resume_insert
AFTER INSERT ON resumes
FOR EACH ROW
EXECUTE FUNCTION set_primary_resume();


-- manually update resume_id for a user
-- UPDATE user_primary_resume
-- SET resume_id = 'new_resume_id'
-- WHERE user_id = 'user_id';

