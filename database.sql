CREATE TABLE tasks (
	id SERIAL PRIMARY KEY,
	name VARCHAR (100),
	status VARCHAR (10) DEFAULT 'Incomplete'
	);

ALTER TABLE tasks
ADD due_date DATE; 
CREATE TABLE categories (
	id SERIAL PRIMARY KEY,
	name VARCHAR(30)
);

CREATE TABLE tasks_categories (
	id SERIAL PRIMARY KEY,
	task_id INT REFERENCES tasks,
	category_id INT REFERENCES categories
	);
	
INSERT INTO categories (name)
VALUES ('Chores');
INSERT INTO categories (name)
VALUES ('School');
INSERT INTO categories (name)
VALUES ('Personal');
INSERT INTO categories (name)
VALUES ('Work');
INSERT INTO categories (name)
VALUES ('Financial');



