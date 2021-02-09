alter table FETCH_ERROR
    add FETCH_ERROR_SUBSCRIPTION_ID bigint;

update FETCH_ERROR fe
set fe.FETCH_ERROR_SUBSCRIPTION_ID = (select uf.USER_FEED_ID
                                      from USER_FEED uf
                                      where uf.USER_FEED_FEED_ID = fe.FETCH_ERROR_FEED_ID);

delete from FETCH_ERROR where FETCH_ERROR_SUBSCRIPTION_ID is null;

alter table FETCH_ERROR alter column FETCH_ERROR_SUBSCRIPTION_ID set not null;

alter table FETCH_ERROR
    add constraint FETCH_ERROR__SUBSCRIPTION_ID_FK
        foreign key (FETCH_ERROR_SUBSCRIPTION_ID) references USER_FEED
            on delete cascade;

alter table FETCH_ERROR drop column FETCH_ERROR_FEED_ID;
