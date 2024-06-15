create table app_fidelidade.fidelity_config (
	id binary(16),
	target tinyint unsigned,
	whatsapp_message_enabled boolean,
	updated_at timestamp not null default current_timestamp on update current_timestamp
);