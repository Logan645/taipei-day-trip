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