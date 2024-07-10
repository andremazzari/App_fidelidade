create table app_fidelidade.password_reset (
	userId binary(16),
	token binary(16),
	expiresAt TIMESTAMP,
	createdAt timestamp default current_timestamp,
	usedAt timestamp null default null
);