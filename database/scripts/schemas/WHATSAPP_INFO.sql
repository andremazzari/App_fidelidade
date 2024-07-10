create table app_fidelidade.whatsapp_info (
	companyId binary(16) primary key,
	token varchar(512),
	tokenExpiresAt timestamp,
	fbUserId varchar(20),
	wabaId varchar(15),
	wabaName varchar(100),
	phoneId varchar(20),
	phoneNumber varchar(20),
	phoneName varchar(100),
	phoneVerificationStatus varchar(15),
	updatedAt timestamp not null default current_timestamp on update current_timestamp
);