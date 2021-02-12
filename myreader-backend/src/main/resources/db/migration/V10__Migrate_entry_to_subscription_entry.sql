alter table USER_FEED_ENTRY
    add url varchar(1000);

alter table USER_FEED_ENTRY
    add guid varchar(1000);

alter table USER_FEED_ENTRY
    add title varchar(1000);

alter table USER_FEED_ENTRY
    add content LONGVARCHAR;

update USER_FEED_ENTRY ufe
set ufe.url     = (select e.ENTRY_URL
                   from ENTRY e
                   where ufe.USER_FEED_ENTRY_ENTRY_ID = e.ENTRY_ID),
    ufe.guid    = (select e.ENTRY_GUID
                   from ENTRY e
                   where ufe.USER_FEED_ENTRY_ENTRY_ID = e.ENTRY_ID),
    ufe.title   = (select e.ENTRY_TITLE
                   from ENTRY e
                   where ufe.USER_FEED_ENTRY_ENTRY_ID = e.ENTRY_ID),
    ufe.content = (select e.ENTRY_CONTENT
                   from ENTRY e
                   where ufe.USER_FEED_ENTRY_ENTRY_ID = e.ENTRY_ID);

alter table USER_FEED_ENTRY
    drop column USER_FEED_ENTRY_ENTRY_ID;

alter table USER_FEED
    drop column LAST_FEED_ENTRY;

drop table ENTRY;

