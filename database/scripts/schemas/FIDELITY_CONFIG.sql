create table app_fidelidade.fidelity_config (
	companyId binary(16),
	target tinyint unsigned,
	whatsappMessageEnabled boolean,
	whatsappTemplateId varchar(20) null,
	updatedAt timestamp not null default current_timestamp on update current_timestamp
);