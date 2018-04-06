from django.test import TestCase
from restapi.models import MlModel, MlModelDetail
from django.utils import timezone
import numpy as np
import pandas as pd
import restapi.util as util
from restapi.machine_learning.logregmodel2 import preparelist, build_model_from_factors, test_model
from restapi.machine_learning.util import preparedata, drop_disabled_factors

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
        col_names = util.get_column_names_from_file('restapi/machine_learning/testfiles/df_math_cleaned_smaller.csv')
        self.assertCountEqual(col_names, ['sex','traveltime','failures','absences','G3_class'])

    def test_get_factor_list_from_file_gets_list(self):
        factor_list = util.get_factor_list_from_file(
            'restapi/machine_learning/testfiles/df_math_cleaned_smaller.csv', 
            'G3_class', 
            ['failures', 'absences'])
        self.assertCountEqual(factor_list, ['failures','absences','C(sex)','C(traveltime)'])

class LogRegModelTestCase(TestCase):
    def test_preparelist_gets_a_coefficient_list_based_on_factors(self):
        factors = [{"name": "factor1", "weight": 2.4}, {"name": "factor2", "weight": 1.4}, {"name": "Intercept", "weight": 0.3}]
        coefficient_list = preparelist(factors, ["factor2", "factor1", "Intercept"], 0.5)
        self.assertListEqual(coefficient_list, [1.4, 2.4, 0.5])

    def test_preparedata_runs_without_crashing(self):
        df_test = pd.read_csv('restapi/machine_learning/testfiles/df_minimal.csv')
        target_variable = 'G3_class'
        factor_list = ['failures','C(sex)']
        y_expected = np.array([ 0.,  0.,  1.,  0.,  1.,  1.,  0.,  1.,  1.])
        y,X = preparedata(df_test, target_variable, factor_list)
        np.testing.assert_array_equal(y, y_expected)
        # Could also compare X to df_minimal_X.csv

    def test_build_model_from_factors_runs_without_crashing(self):
        y = np.array([ 0.,  0.,  1.,  0.,  1.,  1.,  0.,  1.,  1.])
        X = pd.read_csv('restapi/machine_learning/testfiles/df_minimal_X.csv')
        factors = [
            {"name":"failures", "is_enabled": True, "weight": 1.1},
            {"name":"C(sex)[T.M]", "is_enabled": True, "weight": -1.2}]
        intercept = 1
        model = build_model_from_factors(factors, intercept, y, X)

    def test_build_model_from_factors_runs_without_crashing_when_factor_disabled(self):
        y = np.array([ 0.,  0.,  1.,  0.,  1.,  1.,  0.,  1.,  1.])
        X = pd.read_csv('restapi/machine_learning/testfiles/df_minimal_X.csv')
        factors = [
            {"name":"failures", "is_enabled": False, "weight": 1.1},
            {"name":"C(sex)[T.M]", "is_enabled": True, "weight": -1.2}]
        intercept = 1
        X = drop_disabled_factors(X, factors)
        build_model_from_factors(factors, intercept, y, X)

    def test_test_model_runs_without_crashing_when_factor_disabled(self):
        y = np.array([ 0.,  0.,  1.,  0.,  1.,  1.,  0.,  1.,  1.])
        X = pd.read_csv('restapi/machine_learning/testfiles/df_minimal_X.csv')
        factors = [
            {"name":"failures", "is_enabled": False, "weight": 1.1},
            {"name":"C(sex)[T.M]", "is_enabled": True, "weight": -1.2}]
        intercept = 1
        X = drop_disabled_factors(X, factors)
        model = build_model_from_factors(factors, intercept, y, X)
        test_model(model, X, y)

    def test_drop_disabled_factors_drops_factors(self):
        factors = [
            {"name":"failures", "is_enabled": False, "weight": 1.1},
            {"name":"C(sex)[T.M]", "is_enabled": True, "weight": -1.2},
            {"name":"C(abc)[T.a]", "is_enabled": False, "weight": -1.2}]
        df = pd.DataFrame.from_dict({
            'failures': [0, 1, 2],
            'C(sex)[T.M]': [1, 0, 1],
            "C(abc)[T.a]": [0, 1, 1]})
        dropped_df = drop_disabled_factors(df, factors)
        test_df = pd.DataFrame.from_dict({
            'C(sex)[T.M]': [1, 0, 1]})
        pd.testing.assert_frame_equal(dropped_df, test_df)

    def test_drop_disabled_factors_returns_input_if_nothing_disabled(self):
        factors = [
            {"name":"failures", "is_enabled": True, "weight": 1.1},
            {"name":"C(sex)[T.M]", "is_enabled": True, "weight": -1.2}]
        df = pd.DataFrame.from_dict({
            'failures': [0, 1, 2],
            'C(sex)[T.M]': [1, 0, 1]})
        dropped_df = drop_disabled_factors(df, factors)
        pd.testing.assert_frame_equal(dropped_df, df)


class MlModelDetailTestCase(TestCase):
    def test_store_numeric_data(self):
        mlModel = MlModel.objects.create(
            name="important model", 
            description="very important",
            modified=timezone.now())
        
        MlModelDetail.objects.create(
            model_id=mlModel,
            type="true positive rate",
            intValue=45)

        detailSet = MlModelDetail.objects.filter(model_id=mlModel).filter(type="true positive rate")
        self.assertNotEqual(detailSet.first(), None)
        self.assertEqual(detailSet.first().intValue, 45)
