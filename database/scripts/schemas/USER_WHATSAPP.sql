create table app_fidelidade.user_whatsapp (
	id binary(16) primary key,
	token varchar(512),
	token_expires_at timestamp,
	fb_user_id varchar(20),
	waba_id varchar(15),
	waba_name varchar(100),
	phone_id varchar(20),
	phone_number varchar(20),
	phone_name varchar(100),
	phone_verification_status varchar(15),
	updated_at timestamp not null default current_timestamp on update current_timestamp
);