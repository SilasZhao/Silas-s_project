'''
   api-tests.py
   Aiden Chang, Silas Zhao 18 Feb 2021
   Testing api for covid website project 
   CS257 winter2021
'''

import #whatever the covid api program will look like
import unittest

class ApiEndpointTester(unittest.TestCase):
    def setUp(self):
        self.api_endpoint = #not sure what to put here yet, we don't know yet right? since we don't have the api code
    def tearDown(self):
        pass

    '''
    testing for api endpoints
    '''
    
    #testing REQUEST: /total_cases?region_contains={state_keyword}
    def test_get_cases(self):
        self.assertTrue(self.api_endpoint.get_total_cases(), 0)
        self.assertTrue(self.api_endpoint.get_total_cases('california')) #empty lists or dics evaluate to false
        self.assertRaise(ValueError,api_endpoint.get_total_cases,'californiaadadada')

    #testing REQUEST: /total_vaccinations?region_contains={state_keyword}
    def test_get_vaccinations(self):
        self.assertTrue(self.api_endpoint.get_total_vaccinations(), 0)
        self.assertTrue(self.api_endpoint.get_total_vaccinations('california')) #empty lists or dics evaluate to false
        self.assertRaise(ValueError,api_endpoint.get_total_vaccinations,'californiaadadada')


    #testing REQUEST: /cases_by_date?region_name={state}
    def test_get_cases_by_date(self):
        self.assertTrue(self.api_endpoint.get_cases_by_date())
        self.assertTrue(self.api_endpoint.get_cases_by_date('california')) #empty lists or dics evaluate to false
        self.assertTrue(self.api_endpoint.get_cases_by_date('california', '12/07/2021'))
        self.assertRaise(ValueError,api_endpoint.get_cases_by_date,'californiaadadada')
        self.assertRaise(ValueError,api_endpoint.get_cases_by_date,'californiaadadada','12/07/2021')

        
