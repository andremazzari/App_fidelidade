create table app_fidelidade.fidelity_config (
	id binary(16),
	target tinyint unsigned,
	updated_at timestamp not null default current_timestamp on update current_timestamp
)