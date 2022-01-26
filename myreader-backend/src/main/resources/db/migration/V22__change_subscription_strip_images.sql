alter table SUBSCRIPTION add STRIP_IMAGES boolean default false not null;
update SUBSCRIPTION set STRIP_IMAGES = false;
