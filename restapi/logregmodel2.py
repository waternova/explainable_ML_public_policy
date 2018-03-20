import numpy as np
import pandas as pd
from patsy import dmatrices
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split


# preparing training and testing data
def preparedata(df):
    y, X = dmatrices('G3_class ~ C(school) + age + C(sex) + C(address) + \
                  C(famsize) + C(Pstatus) + C(Medu ) + C(Fedu)+ C(Fjob)+C(traveltime)+C(studytime)+failures+\
                  C(schoolsup)+ C(famsup)+C(reason)+C(guardian)+C(paid)+C(activities)+C(nursery)+C(higher)+\
                  C(internet)+C(romantic)+C(famrel)+C(freetime)+C(goout)+C(Dalc)+C(Walc)+C(health)+absences',
                  df, return_type="dataframe")
    y = np.ravel(y)
    return y,X


# preparing list of coefficients
def preparelist(factors, cols, intercept):
    factor_data_frame = pd.DataFrame(factors)  # variable name changed
    coefficient_list = []
    for col in cols:
        if col == 'Intercept':  # Default was 0.366298367 ==> Put in DB
            coefficient_list.append(intercept)
        else:
            values = factor_data_frame[factor_data_frame.name == col]['weight'].values
            if len(values) > 0:
                coefficient_list.append(values[0])
            # TODO: this is a hack to make it work
            elif col == "C(activities)[T.yes]":
                coefficient_list.append(0)
            else:
                print("did not find ", col)
    return coefficient_list
    
# rebuilding model
def logreg(factors, intercept):
    # "factors" has all the values such as is_enabled, is_binary, is_balanced
    # for example)
    # print(factors[0]["alias"])
    # print(factors[0]["is_enabled"])
    # print(factors[0]["weight"])
    ##
    df_math = pd.read_csv('df_math_cleaned.csv')
    y, X = preparedata(df_math)
    coefficient_list = preparelist(factors, X.columns, intercept)
    X_train, X_test, y_train, y_test = \
        train_test_split(X, y, test_size=.9, random_state=42)
    model = LogisticRegression()
    model.fit(X_train, y_train)  # It would be nice if we didn't have to do this
    model.coef_ = np.array([coefficient_list])
    return model.score(X_test, y_test)  # Average accuracy of cross vaidated logistic regression model

# Test code for retraining
# Reverse the signs of weights of all enabled factors and return
# The intercept is not used
def retrain(factors, intercept):
    for factor in factors:
        if factor["is_enabled"]:
            factor["weight"] = factor["weight"] * (-1.0)
    return factors
