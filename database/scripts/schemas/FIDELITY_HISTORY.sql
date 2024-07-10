create table app_fidelidade.fidelity_history (
	fidelityId int unsigned auto_increment,
	companyId binary(16),
	phone bigint unsigned,
	points tinyint unsigned,
	target tinyint unsigned,
	createdAt timestamp(1) not null default current_timestamp(1),
	redeemedAt timestamp null default null,
	redeemId int null default null,
	canceledAt timestamp(1) null default null,
	whatsappMessageId varchar(65) null default null,
	originalFidelityId int unsigned null default null,
	createdBy binary(16),
	canceledBy binary(16),
	primary key (fidelityId)
);