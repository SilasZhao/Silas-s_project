import csv 
def openfile(filename):
    csvFile =open(filename, "r")
    reader = csv.reader(csvFile)
    return reader

def writefile_cases(reader, case_date):
    #table1:
    csvFile1 = open(case_date, "w")
    case_date_w= csv.writer(csvFile1)
    #check redundancy
    for row in reader:
        if reader.line_num == 1:
            continue
        case_date = []
        for i in range(len(row)):
            if in_case_date(i):
                if row[i] == '':
                    row[i] = 'Null'
                case_date.append(row[i])
        case_date_w.writerow(case_date)
        
def writefile_vaccine(reader, file):
    #table1:
    csvFile1 = open(file, "w")
    case_date_w= csv.writer(csvFile1)

    for row in reader:
        if reader.line_num == 1:
            continue
        case_date = []
        for i in range(len(row)):
            if in_case_vaccine(i):
                if row[i] == 'N/A':
                    row[i] = 'Null'
                case_date.append(row[i])
        case_date_w.writerow(case_date)
def writefile_US(reader, file):
    #table1:
    csvFile1 = open(file, "w")
    case_date_w= csv.writer(csvFile1)

    for row in reader:
        if reader.line_num == 1:
            continue
        case_date = []
        for i in range(len(row)):
            if in_US(i):
                if row[i] == 'N/A':
                    row[i] = 'Null'
                case_date.append(row[i])
        case_date_w.writerow(case_date)

def writefile_vaccination_US(reader, file):
    #table1:
    csvFile1 = open(file, "w")
    case_date_w= csv.writer(csvFile1)

    for row in reader:
        if reader.line_num == 1:
            continue
        case_date = []
        for i in range(len(row)):
            if in_vaccination_US(i):
                if row[i] == 'N/A':
                    row[i] = 'Null'
                case_date.append(row[i])
        case_date_w.writerow(case_date)

def in_vaccination_US(index):
    if index ==1 or index == 3 or index == 7 or index == 8:
        return True
    else:
        return False
def in_US(index):
    if index <=1 or index == 12 or index == 13:
        return True
    else:
        return False
def in_case_date(index):
    list = [0,1,2,4,6,8,9,19,21]
    if index in list:
        return True
    else:
        return False

def in_case_vaccine(index):
    if index < 1:
        return True
    elif index >=5 and index <=8:
        return True
    else:
        return False

def main():
    reader = openfile("all-states-history.csv")
    writefile_cases(reader,"new_state_date.csv")
    #\copy  states_code from 'state_code.csv' DELIMITER ',' CSV NULL AS 'Null'
    # cases_in_us
    #pg_dump --no-owner --no-privileges -U postgres covid > covid.sql
    """
    SELECT DISTINCT states_code.states, cases_date.cases
        FROM cases_date, states_code
        WHERE day = (SELECT MAX(day) FROM cases_date)
        AND UPPER(states_code.states) LIKE UPPER(%s)
        AND states_code.code = cases_date.states;

    SELECT DISTINCT cases_date.day, cases_date.states, cases_date.cases
        FROM cases_date, states_code
        WHERE UPPER(states_code.states) LIKE UPPER('%al%')
        AND states_code.code = cases_date.states
        AND cases_date.day = '2021-02-28'
        ORDER BY cases_date.day;
    get vaccination 
    case1: 
    SELECT DISTINCT vaccinations_in_US.day, vaccinations_in_US.people_with_1_or_more_doses
        FROM vaccinations_in_US 
        ORDER BY vaccinations_in_US.day;
    case2:
    SELECT DISTINCT cases_date.day, cases_date.cases
        FROM cases_date
        WHERE cases_date.states = '%s'
        ORDER BY cases_date.day;
    """
main()