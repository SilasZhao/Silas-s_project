DROP TABLE IF EXISTS vaccinations_region;
DROP TABLE IF EXISTS cases_date;
DROP TABLE IF EXISTS cases_and_vaccination_in_US;


CREATE TABLE vaccinations_region(
	region text,
	people_with_1_or_more_doses integer,
	people_with_1_or_more_doses_per_100K integer,
	people_with_2_doses integer,
	people_with_2_doses_per_100K integer,
);

CREATE TABLE cases_date(
	day date,
	states text,
	death integer,
	deathIncrease integer,
	hospitalized integer,
	hospitalizedCurrently integer,
	hospitalizedIncrease integer,
	cases integer,
	cases_increased integer
);

CREATE TABLE cases_in_US(
	day date,
	cases integer,
	cases_increased integer
);
CREATE TABLE vaccinations_in_US(
	day date,
	total_doses_administered_daily integer,
	people_with_1_or_more_doses integer,
	people_with_2_doses integer
);
CREATE TABLE states_code(
	states text,
	code text
);
