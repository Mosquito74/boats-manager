CREATE TABLE BOAT(
    ID int not null AUTO_INCREMENT,
    NAME varchar(100) not null,
    DESCRIPTION varchar(1000),
    TYPE varchar(50),
    LENGTH int,
    MAKE varchar(50),
    LAUNCH_YEAR int,
    PRIMARY KEY (ID)
);

