create table app_fidelidade.users (
	userId binary(16),
	companyId binary(16),
	userType char(1),
	name char(20),
	email varchar(40),
	passwordHash varbinary(60),
	isEmailVerified bool not null default false,
	createdAt timestamp not null default current_timestamp,
	updatedAt timestamp not null default current_timestamp on update current_timestamp
);