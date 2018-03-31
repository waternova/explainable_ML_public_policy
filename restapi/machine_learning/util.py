from patsy import dmatrices # pylint: disable=E0611
import numpy as np
import pandas as pd

default_factor_list = ['C(school)', 'age', 'C(sex)', 'C(address)', 
    'C(famsize)', 'C(Pstatus)', 'C(Medu )', 'C(Fedu)', 'C(Fjob)', 'C(traveltime)', 
    'C(studytime)', 'failures', 'C(schoolsup)', 'C(famsup)', 'C(reason)', 
    'C(guardian)', 'C(paid)', 'C(activities)', 'C(nursery)', 'C(higher)', 
    'C(internet)', 'C(romantic)', 'C(famrel)', 'C(freetime)', 'C(goout)', 
    'C(Dalc)', 'C(Walc)', 'C(health)', 'absences']

# given a source dataframe with training data and a column name of a target variable, 
# and a list of factors, get df with factors split
def preparedata(df, target_variable='G3_class', factor_list=default_factor_list):
    y, X = dmatrices(target_variable + ' ~ ' + ' + '.join(factor_list),
                  df, return_type="dataframe")
    y = np.ravel(y)
    return y,X


def get_column_names_from_file(path_to_file):
    df = pd.read_csv(path_to_file)
    return df.columns.values.tolist()


from restapi.models import MlModel, DataSet
def get_factor_list_from_file(dataFile, target_variable, model_id):
    model_desc = MlModel.objects.get(pk=model_id)
    all_columns = get_column_names_from_file(dataFile)
    numeric_columns = model_desc.non_categorical_columns.split(',')
    categorical_columns = set(all_columns) - set([target_variable]) - set(numeric_columns)
    factor_list = numeric_columns + ['C(' + x + ')' for x in categorical_columns]
    print('get_factor_list_from_file')
    print(factor_list)
    return factor_list
