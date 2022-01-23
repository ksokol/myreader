update EXCLUSION_PATTERN set PATTERN = replace(PATTERN, '.*', '');
update EXCLUSION_PATTERN set PATTERN = replace(PATTERN, ',*', '');
update EXCLUSION_PATTERN set PATTERN = replace(PATTERN, '\', '');
update EXCLUSION_PATTERN set PATTERN = replace(PATTERN, '*', '');
