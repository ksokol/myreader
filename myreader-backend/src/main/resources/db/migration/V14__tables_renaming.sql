alter table FETCH_ERROR alter column FETCH_ERROR_ID rename to ID;
alter table FETCH_ERROR alter column FETCH_ERROR_CREATED_AT rename to CREATED_AT;
alter table FETCH_ERROR alter column FETCH_ERROR_MESSAGE rename to MESSAGE;
alter table FETCH_ERROR alter column FETCH_ERROR_SUBSCRIPTION_ID rename to SUBSCRIPTION_ID;

alter table EXCLUSION_PATTERN alter column EXCLUSION_PATTERN_USER_FEED_ID rename to SUBSCRIPTION_ID;

alter table USER_FEED alter column USER_FEED_ID rename to ID;
alter table USER_FEED alter column USER_FEED_CREATED_AT rename to CREATED_AT;
alter table USER_FEED alter column USER_FEED_TITLE rename to TITLE;
alter table USER_FEED alter column URL set data type VARCHAR(1000);
alter table USER_FEED alter column FETCHED rename to OVERALL_FETCH_COUNT;
alter table USER_FEED alter column USER_FEED_SUM rename to ACCEPTED_FETCH_COUNT;
alter table USER_FEED rename to SUBSCRIPTION;

alter table USER_FEED_ENTRY alter column USER_FEED_ENTRY_ID rename to ID;
alter table USER_FEED_ENTRY alter column USER_FEED_ENTRY_CREATED_AT rename to CREATED_AT;
alter table USER_FEED_ENTRY alter column USER_FEED_ENTRY_IS_READ rename to SEEN;
alter table USER_FEED_ENTRY alter column USER_FEED_ENTRY_USER_FEED_ID rename to SUBSCRIPTION_ID;
alter table USER_FEED_ENTRY rename to SUBSCRIPTION_ENTRY;
