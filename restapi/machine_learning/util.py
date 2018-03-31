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
