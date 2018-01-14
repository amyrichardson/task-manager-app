CREATE TABLE tasks (
	id SERIAL PRIMARY KEY,
	name VARCHAR (100),
	status VARCHAR (10) DEFAULT 'Incomplete'
	);

INSERT INTO tasks (name)
VALUES ('Wash bedding');
INSERT INTO tasks (name)
VALUES ('Fold laundry');
INSERT INTO tasks (name)
VALUES ('Buy groceries');
INSERT INTO tasks (name)
VALUES ('Cook dinner');
INSERT INTO tasks (name, status)
VALUES ('Call Mom', 'Complete');
