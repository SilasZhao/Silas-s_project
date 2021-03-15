REQUEST: /cases_by_date

GET parameters
    region_contains (Optional, default: '') -- return the latest total cases in the specific region, case-insensitively
    can we use a checklist to get the multiple parameters?
    date (Optional, default: 'Latest day') --return the latest total cases in the specific day

RESPONSE: a JSON list of dictionaries, each of which represents one
state's total cases, sorted in cases, by a descending order. Each dictionary in this
list will have the following fields.

   region_name -- (TEXT) the state name
   date -- (DATE) the date
   total_cases -- (INTEGER) the total cases in that state
   
EXAMPLE(S):
    /get_total_cases?region_contains={state_keyword}
    //fill this later!!!!!

--------------------------------

REQUEST: /get_total_vaccinations
GET parameters
    region (Optional, default: '') -- return the states that 
        its name contains in region, case-insensitively

RESPONSE: a JSON list of dictionaries, each of which represents one
state's total vaccinations, sorted in cases, by a descending order. Each dictionary in this
list will have the following fields.

   region_name -- (TEXT) the state name
   total_vaccinations -- (INTEGER) the total cases in that state

EXAMPLE(S):
    get_total_vaccination?region_contains={state_keyword}
    //fill this later!!!!!

------------------------------------------------------------------------------
    
REQUEST: region_contains={state_keyword}
RESPONSE: a JSON int of the total number of vaccination cases in America if no optional arguments are specified. If an optional argument is specified, this will return a JSON dictionary with each state containing the state_keyword parameter as a key(string), and the value as the vaccinations for that state.
SQL statement:
SELECT People_with_1_or_more_doses FROM vaccinations_region WHERE region = 'Alaska';

REQUEST: /cases_by_date?[region_name={state},given_date={date}]
RESPONSE: A JSON list of dictionaries, each of which represents a dataset in one day, sorted by date. If no optional arguments are given, the dictionary will contain cases by day for the United States with the following fields. 
	name -- (string) the region name                                                
	cases_dates -- (list) list that contains the date and the case of the date given with the format of each value in the list as date:case
	
If only the state optional argument is given, the dictionary will contain cases by day for the specified state. The dictionary will have the following fields.
	name -- (string) the region name
	cases_dates -- (list) list that contains the date and the case of the date given with the format of each value in the list as date:case

If both optional arguments are given, the dictionary will contain the case of the specified date with the following fields.
	name -- (string) the region name
	date -- (string) the requested date
	case -- (int) the cases on the date
