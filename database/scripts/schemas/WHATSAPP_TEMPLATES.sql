create table app_fidelidade.whatsapp_templates (
	companyId binary(16),
	templateId varchar(20),
	templateName varchar(512),
	languageCode char(5),
	templateStatus varchar(16),
	templateCategory varchar(9),
	componentsConfig JSON null,
	primary key (companyId, templateId)
);