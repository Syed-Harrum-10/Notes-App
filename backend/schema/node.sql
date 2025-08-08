CREATE TABLE notes (
    id serial PRIMARY KEY, 
    title varchar(100) NOT NULL,
    content varchar(100) NOT NULL, 
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    userId INT NOT NULL,
    FOREIGN KEY (userId) REFERENCES auth(id)
);