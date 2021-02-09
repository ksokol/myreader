alter table USER_FEED
    add url varchar(255);

alter table USER_FEED
    add last_modified varchar(255);

alter table USER_FEED
    add fetched integer;

alter table USER_FEED
    add result_size_per_fetch integer;

alter table ENTRY
    add ENTRY_SUBSCRIPTION_ID bigint;

update USER_FEED uf
set uf.url                   = (select f.FEED_URL
                                from FEED f
                                where uf.USER_FEED_FEED_ID = f.FEED_ID),
    uf.fetched               = (select f.feed_fetched
                                from FEED f
                                where uf.USER_FEED_FEED_ID = f.FEED_ID),
    uf.result_size_per_fetch = (select f.result_size_per_fetch
                                from FEED f
                                where uf.USER_FEED_FEED_ID = f.FEED_ID);

update ENTRY e
set e.ENTRY_SUBSCRIPTION_ID = (select uf.USER_FEED_ID
                               from USER_FEED uf
                               where uf.USER_FEED_FEED_ID = e.ENTRY_FEED_ID);

delete
from ENTRY
where ENTRY_SUBSCRIPTION_ID is null;

alter table ENTRY
    alter column ENTRY_SUBSCRIPTION_ID set not null;

alter table ENTRY
    add constraint ENTRY__SUBSCRIPTION_ID_FK
        foreign key (ENTRY_SUBSCRIPTION_ID) references USER_FEED
            on delete cascade;

alter table ENTRY
    drop column ENTRY_FEED_ID;

alter table USER_FEED
    drop column USER_FEED_FEED_ID;

drop table feed;
