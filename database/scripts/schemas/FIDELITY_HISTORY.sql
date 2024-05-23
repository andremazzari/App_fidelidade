create table app_fidelidade.fidelity_history (
	id binary(16),
	phone bigint unsigned,
	points tinyint unsigned,
	target tinyint unsigned,
	created_at timestamp(1) not null default current_timestamp(1),
	redeemed_at timestamp null default null,
	redeem_id int null default null
);
