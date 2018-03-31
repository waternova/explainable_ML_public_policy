from django.test import TestCase
from restapi.models import MlModel
from django.utils import timezone
import restapi.util as util

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
        self.assertListEqual(col_names, ['sex','traveltime','failures','absences','G3_class'])
