alter table SUBSCRIPTION_ENTRY alter column CREATED_AT set not null;

alter table SUBSCRIPTION_ENTRY alter column CREATED_AT set data type TIMESTAMP WITH TIME ZONE;
