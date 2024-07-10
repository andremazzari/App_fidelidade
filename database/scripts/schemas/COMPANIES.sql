create table app_fidelidade.companies (
	companyId binary(16),
	createdAt timestamp not null default current_timestamp,
	updatedAt timestamp not null default current_timestamp on update current_timestamp,
	primary key (companyId)
);