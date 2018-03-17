from django.test import TestCase
from restapi.models import MlModel
from django.utils import timezone

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
