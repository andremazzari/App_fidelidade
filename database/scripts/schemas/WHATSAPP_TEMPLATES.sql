create table app_fidelidade.whatsapp_templates (
	id binary(16),
	template_id varchar(20),
	template_name varchar(512),
	language_code char(5),
	template_status varchar(16),
	template_category varchar(9),
	components_config JSON null,
	primary key (id, template_id)
);