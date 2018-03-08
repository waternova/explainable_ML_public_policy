import numpy as np
import pandas as pd
from patsy import dmatrices
from sklearn.linear_model import LogisticRegression
from sklearn.cross_validation import train_test_split
from sklearn import metrics
from sklearn.cross_validation import cross_val_score

#preparing training and testing data
def preparedata(df):
    y, X = dmatrices('G3_class ~ C(school) + age + C(sex) + C(address) + \
                  C(famsize) + C(Pstatus) + C(Medu ) + C(Fedu)+ C(Fjob)+C(traveltime)+C(studytime)+failures+\
                  C(schoolsup)+ C(famsup)+C(reason)+C(guardian)+C(paid)+C(activities)+C(nursery)+C(higher)+\
                  C(internet)+C(romantic)+C(famrel)+C(freetime)+C(goout)+C(Dalc)+C(Walc)+C(health)+absences',
                  df, return_type="dataframe")
    y = np.ravel(y)
    return y,X

#preparing list of coefficents
def preparelist(coefdata, cols):
    factors = pd.DataFrame(coefdata)
    coeflist= []
    for col in cols:
        if col == 'Intercept':
            coeflist.append(0.366298367)
        else:
            coeflist.append(factors[factors.name == col]['weight'])
    return coeflist
    
#rebuilding model
def logreg(coefdata): 
    df_math = pd.read_csv('df_math_cleaned.csv')
    y, X = preparedata(df_math)
    coeflist = preparelist(coefdata, X.columns)
    model = LogisticRegression()
    model.coef_ = coeflist
    scores = cross_val_score(LogisticRegression(), X, y, scoring='accuracy', cv=10)
    print(scores)
    return scores.mean() # Average accuracy of cross vaidated logistic regression model