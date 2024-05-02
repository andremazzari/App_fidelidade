create table app_fidelidade.users (
	id binary(16),
	name char(20),
	email varchar(40),
	password_hash varbinary(60),
	is_email_verified bool not null default false
	created_at timestamp not null default current_timestamp
	updated_at timestamp not null default current_timestamp on update current_timestamp
)