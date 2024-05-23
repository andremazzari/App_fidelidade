create table app_fidelidade.redeem_history (
	id binary(16),
	phone bigint unsigned,
	redeem_id int unsigned auto_increment,
	points tinyint unsigned,
	created_at timestamp not null default current_timestamp,
	primary key (redeem_id)
)