alter table USER_FEED_ENTRY
    add TAGS VARCHAR(100) ARRAY DEFAULT ARRAY[];

update USER_FEED_ENTRY ufe
set ufe.tags = (
    select ARRAY_AGG(ufet.tag) from USER_FEED_ENTRY_TAGS ufet where ufet.USER_FEED_ENTRY_ID = ufe.USER_FEED_ENTRY_ID
);

drop table USER_FEED_ENTRY_TAGS;
