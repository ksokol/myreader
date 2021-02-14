alter table USER_FEED
    add TAG varchar(255);

alter table USER_FEED
    add COLOR varchar(255);

update USER_FEED uf
set uf.tag   = (select uft.USER_FEED_TAG_NAME
                from user_feed_tag uft
                where uft.USER_FEED_TAG_ID = uf.USER_FEED_USER_FEED_TAG_ID),
    uf.COLOR = (select uft.USER_FEED_TAG_COLOR
                from user_feed_tag uft
                where uft.USER_FEED_TAG_ID = uf.USER_FEED_USER_FEED_TAG_ID);

alter table USER_FEED
    drop column USER_FEED_USER_FEED_TAG_ID;

drop table USER_FEED_TAG;
