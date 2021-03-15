'''
Author: Aiden, Sky
Description: COnverting original csv files
Date: 2021-01-27 00:24:06
LastEditors: Aiden Chang
LastEditTime: 2021-01-27 00:24:17
'''

DROP TABLE IF EXISTS athletes;
DROP TABLE IF EXISTS games;
DROP TABLE IF EXISTS cities;
DROP TABLE IF EXISTS games_cities;
DROP TABLE IF EXISTS ages;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS medals;
DROP TABLE IF EXISTS nocs;
DROP TABLE IF EXISTS athletes_nocs;





/* 
First task 
List all the NOCs (National Olympic Committees), in alphabetical order by abbreviation. These entities, by the way, are mostly equivalent to countries. But in some cases, you might find that a portion of a country participated in a particular games (e.g. one guy from Newfoundland in 1904) or some other oddball situation.
*/

CREATE TABLE nocs (
    id SERIAL,
    noc_name text,
    region text,
    notes text
);

\copy nocs from 'nocs.csv' DELIMITER ',' CSV NULL AS ''

SELECT nocs.noc_name
FROM nocs
ORDER BY nocs.noc_name;

/* 
Second task
List the names of all the athletes from Kenya. If your database design allows it, sort the athletes by last name(ours does not).
*/

CREATE TABLE athletes (
    id SERIAL,
    full_name text,
    sex text,
    height float,
    weights float
);

CREATE TABLE athletes_nocs (
    athlete_id integer,
    noc_id integer
);

\copy athletes from 'athletes.csv' DELIMITER ',' CSV NULL AS 'NA'
\copy athletes_nocs from 'athletes_nocs.csv' DELIMITER ',' CSV NULL AS 'NA'

SELECT nocs.region, athletes.full_name
FROM athletes, nocs, athletes_nocs
WHERE athletes.id = athletes_nocs.athlete_id
AND nocs.id = athletes_nocs.noc_id
AND nocs.region = 'Kenya';


/*
Third task
List all the medals won by Greg Louganis, sorted by year. Include whatever fields in this output that you think appropriate.
*/

CREATE TABLE medals (
    id SERIAL,
    athlete_id integer,
    game_id integer,
    event_id integer,
    medal text
);

CREATE TABLE events (
    id SERIAL,
    event_name text,
    sport text
);

CREATE TABLE games (
    id SERIAL,
    games text,
    game_year integer,
    season text
);

\copy events from 'events.csv' DELIMITER ',' CSV NULL AS 'NA'
\copy games from 'games.csv' DELIMITER ',' CSV NULL AS 'NA'
\copy medals from 'medals.csv' DELIMITER ',' CSV NULL AS ''

SELECT games.game_year, athletes.full_name, medals.medal, games.games, events.event_name, events.sport
FROM events, games, medals, athletes
WHERE athletes.full_name LIKE '%Greg%%Louganis%'
AND games.id = medals.game_id
AND events.id = medals.event_id
AND athletes.id = medals.athlete_id
ORDER BY games.game_year;

/*
Fourth Task
List all the NOCs and the number of gold medals they have won, in decreasing order of the number of gold medals.
*/

SELECT nocs.noc_name, COUNT(medals.medal)
FROM nocs, athletes, medals, athletes_nocs
WHERE medals.medal = 'Gold'
AND medals.athlete_id = athletes.id
AND nocs.id = athletes_nocs.noc_id
AND athletes.id = athletes_nocs.athlete_id
GROUP BY nocs.noc_name
ORDER BY COUNT(medals.medal) DESC;


/* 
The next three tables have no purpose in solving the prompt
*/
CREATE TABLE cities (
    id SERIAL,
    city_name text
);

CREATE TABLE games_cities (
    game_id integer,
    city_id integer
);

CREATE TABLE ages (
    id SERIAL,
    athlete_id integer,
    game_id integer,
    age integer
);

\copy cities from 'cities.csv' DELIMITER ',' CSV NULL AS 'NA'
\copy games_cities from 'games_cities.csv' DELIMITER ',' CSV NULL AS ''
\copy ages from 'ages.csv' DELIMITER ',' CSV NULL AS 'NA'
