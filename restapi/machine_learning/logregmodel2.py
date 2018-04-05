import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, confusion_matrix
from restapi.machine_learning.util import preparedata


def preparelist(factors, cols, intercept):
    # Gets list of coefficients from factors in the same order as in cols
    factor_data_frame = pd.DataFrame(factors)
    coefficient_list = []
    for col in cols:
        if col == 'Intercept':  
            coefficient_list.append(intercept)
        else:
            values = factor_data_frame[factor_data_frame.name == col]['weight'].values
            if len(values) > 0:
                coefficient_list.append(values[0])
            else:
                print("did not find ", col)
    return coefficient_list


def build_model_from_factors(factors, intercept, y, X):
    # "factors" has all the values such as is_enabled, is_binary, is_balanced
    # for example:
    # print(factors[0]["alias"])
    # print(factors[0]["is_enabled"])
    # print(factors[0]["weight"])
    ##
    assert intercept is not None, "intercept is None"
    coefficient_list = preparelist(factors, X.columns, intercept)
    X_train, X_test, y_train, y_test = \
        train_test_split(X, y, test_size=.25, random_state=42)
    model = LogisticRegression()
    model.fit(X_train, y_train)  # It would be nice if we didn't have to do this
    model.coef_ = np.array([coefficient_list]) 
    return model 

  
def test_model(model, X, y, thresholds=None, balanced_factor=None):
    X_train, X_test, y_train, y_test = \
        train_test_split(X, y, test_size=.25, random_state=42)
    if balanced_factor is None:
        y_pred = model.predict(X_test) > 0.5
        y_true = y_test
        cm = confusion_matrix(y_true, y_pred)
        result = [
            accuracy_score(y_true, y_pred), 
            { 
                'all': {
                'true_negative_count': cm[0][0],
                'false_positive_count': cm[0][1],
                'false_negative_count': cm[1][0],
                'true_positve_count': cm[1][1]}
            }
        ]
    else:
        X_test_class1 = X_test[X_test[balanced_factor]==1]
        X_test_class0 = X_test[X_test[balanced_factor]==0]
        y_test_class1 = y_test[X_test[balanced_factor]==1]
        y_test_class0 = y_test[X_test[balanced_factor]==0]
        y_pred_0 = model.predict_proba(X_test_class0)[:,1] > thresholds[0]
        y_pred_1 = model.predict_proba(X_test_class1)[:,1] > thresholds[1]
        y_true = np.concatenate([y_test_class1, y_test_class0])
        y_pred = np.concatenate([y_pred_1, y_pred_0])
        cm0 = confusion_matrix(y_test_class0, y_pred_0)
        cm1 = confusion_matrix(y_test_class1, y_pred_1)
        result = [
            accuracy_score(y_true, y_pred), 
            { 
                'negative_class': {
                    'true_negative_count': cm0[0][0],
                    'false_positive_count': cm0[0][1],
                    'false_negative_count': cm0[1][0],
                    'true_positve_count': cm0[1][1]},
                'positive_class': {
                    'true_negative_count': cm1[0][0],
                    'false_positive_count': cm1[0][1],
                    'false_negative_count': cm1[1][0],
                    'true_positve_count': cm1[1][1]}
            }
        ]
    return result


# Retrain passed factors using dataFile as input csv
def retrain(factor_list_wo_categories, target_variable, factors, dataFile):
    df_math = pd.read_csv(dataFile)
    y, X = preparedata(df_math, target_variable, factor_list_wo_categories)
    for factor in factors:
        if not factor["is_enabled"]:
            X = X.drop(factor["name"], axis=1)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=42)
    model = LogisticRegression()
    model.fit(X_train, y_train)
    # enabling/disabling factors
    for factor in factors:
        col_list = X.dtypes.index.tolist()
        factor_name = factor['name']
        if factor_name in col_list:
            col_num_in_X = col_list.index(factor_name)
            factor["weight"] = model.coef_[0][col_num_in_X]
    return model, {'factors': factors}
