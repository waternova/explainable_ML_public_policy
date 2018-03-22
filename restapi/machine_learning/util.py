from patsy import dmatrices # pylint: disable=E0611
import numpy as np

default_factor_list = ['C(school)', 'age', 'C(sex)', 'C(address)', 
    'C(famsize)', 'C(Pstatus)', 'C(Medu )', 'C(Fedu)', 'C(Fjob)', 'C(traveltime)', 
    'C(studytime)', 'failures', 'C(schoolsup)', 'C(famsup)', 'C(reason)', 
    'C(guardian)', 'C(paid)', 'C(activities)', 'C(nursery)', 'C(higher)', 
    'C(internet)', 'C(romantic)', 'C(famrel)', 'C(freetime)', 'C(goout)', 
    'C(Dalc)', 'C(Walc)', 'C(health)', 'absences']

# preparing training and testing data
def preparedata(df, factor_list=default_factor_list):
    y, X = dmatrices('G3_class ~ ' + ' + '.join(factor_list),
                  df, return_type="dataframe")
    y = np.ravel(y)
    return y,X