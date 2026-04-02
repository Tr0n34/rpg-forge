alter table character_sheet add column allocation_profile varchar(30) not null default 'POLYVALENT';
alter table character_sheet add column strength integer not null default 0;
alter table character_sheet add column agility integer not null default 0;
alter table character_sheet add column constitution integer not null default 0;
alter table character_sheet add column perception integer not null default 0;
alter table character_sheet add column intelligence integer not null default 0;
alter table character_sheet add column willpower integer not null default 0;
alter table character_sheet add column charisma integer not null default 0;
