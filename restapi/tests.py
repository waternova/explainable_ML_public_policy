from django.test import TestCase
from restapi.models import MlModel
from django.utils import timezone
import restapi.util as util
from restapi.machine_learning.logregmodel2 import preparelist

class MlModelTestCase(TestCase):
    def setUp(self):
        MlModel.objects.create(
            name="important model", 
            description="very important",
            modified=timezone.now())

    def test_MlModels_have_description(self):
        """MlModels have a description"""
        imp = MlModel.objects.get(name="important model")
        self.assertEqual(imp.description, 'very important')

class RestapiUtilTestCase(TestCase):
    def test_get_column_names_from_file_gets_names(self):
        col_names = util.get_column_names_from_file('example/df_math_cleaned_smaller.csv')
        self.assertCountEqual(col_names, ['sex','traveltime','failures','absences','G3_class'])

    def test_get_factor_list_from_file_gets_list(self):
        factor_list = util.get_factor_list_from_file('example/df_math_cleaned_smaller.csv', 'G3_class', ['failures', 'absences'])
        self.assertCountEqual(factor_list, ['failures','absences','C(sex)','C(traveltime)'])

class LogRegModelTestCase(TestCase):
    def test_preparelist_gets_a_coefficient_list_based_on_factors(self):
        factors = [{"name": "factor1", "weight": 2.4}, {"name": "factor2", "weight": 1.4}, {"name": "Intercept", "weight": 0.3}]
        coefficient_list = preparelist(factors, ["factor2", "factor1", "Intercept"], 0.5)
        self.assertListEqual(coefficient_list, [1.4, 2.4, 0.5])
