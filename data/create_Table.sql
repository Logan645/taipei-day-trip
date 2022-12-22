create table attractions(
        id bigint not null primary key,
        name varchar(255),
        category varchar(255),
        description varchar(10000) ,
        address varchar(1000),
        transport varchar(1000),
        mrt varchar(255),
        latitude FLOAT,
        longitude FLOAT,
        images JSON
        );

create table member(
        id bigint not null primary key auto_increment,
        name varchar(255),
        email varchar(255) unique,
        password varchar(255) not null
);

create table cart(
        id bigint not null primary key auto_increment,
        user_id bigint not null unique,
        attraction_id bigint not null,
        date DATE not null,
        time varchar(100) not null,
        price bigint not null,
        FOREIGN KEY (user_ID) REFERENCES member(id),
        FOREIGN KEY (attraction_id) REFERENCES attractions(id)
        );

create table order_data(
	id bigint NOT NULL primary key AUTO_INCREMENT,
	user_id bigint NOT NULL,
	attraction_id bigint not null,
	date DATE NOT NULL,
	time enum('morning','afternoon') NOT NULL,
	price bigint not null,
	order_number bigint not null unique,
	rec_trade_id varchar(255) DEFAULT NULL,
	bank_transaction_id varchar(255) DEFAULT NULL,
        name varchar(255) not null,
        email varchar(255) not null,
        phone varchar(255) not null,
	status tinyint(1) DEFAULT '1',
	FOREIGN KEY (user_id) REFERENCES member(id),
	FOREIGN KEY (attraction_id) REFERENCES attractions(id)
) ;