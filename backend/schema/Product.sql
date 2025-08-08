CREATE TABLE Product (
    id serial PRIMARY KEY, 
    name varchar(100) NOT NULL,
    description varchar(100) NOT NULL, 
    price NUMERIC(10,2) NOT NULL,
    stock INT NOT NULL,
    createdAt TIMESTAMP default CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP default CURRENT_TIMESTAMP
);