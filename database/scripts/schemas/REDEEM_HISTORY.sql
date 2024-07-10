create table app_fidelidade.redeem_history (
	redeemId int unsigned auto_increment,
	companyId binary(16),
	phone bigint unsigned,
	points tinyint unsigned,
	createdAt timestamp not null default current_timestamp,
	redeemedBy binary(16),
	primary key (redeemId)
);