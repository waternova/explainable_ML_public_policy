import numpy as np
import pandas as pd
from itertools import combinations
from sklearn.linear_model import LogisticRegression
from sklearn import metrics
from sklearn.metrics import accuracy_score
from sklearn.model_selection import train_test_split
# import matplotlib.pyplot as plt
from restapi.machine_learning.util import preparedata
from restapi.util import get_factor_list_from_file


# Gets thresholds with positive class first
def get_fair_thresholds(model, numeric_columns, protectiveAtt, dataFile, target_variable):
    df_data = pd.read_csv(dataFile)
    factor_list_wo_categories = get_factor_list_from_file(dataFile, target_variable, numeric_columns)
    y, X = preparedata(df_data, target_variable, factor_list_wo_categories)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=42)
    #splitting data into test for each group in protective attribute
    X_test_class1 = X_test[X_test[protectiveAtt]==1]
    X_test_class0 = X_test[X_test[protectiveAtt]==0]
    y_test_class1 = y_test[X_test[protectiveAtt]==1]
    y_test_class0 = y_test[X_test[protectiveAtt]==0]

    #Creating ROC for class 1
    probs_class1 = model.predict_proba(X_test_class1)
    preds_class1 = probs_class1[:,1]
    fpr_class1, tpr_class1, threshold_class1 = metrics.roc_curve(y_test_class1, preds_class1)
    # roc_auc_class1 = metrics.auc(fpr_class1, tpr_class1)

    #Creating ROC for class 0
    probs_class0 = model.predict_proba(X_test_class0)
    preds_class0 = probs_class0[:,1]
    fpr_class0, tpr_class0, threshold_class0 = metrics.roc_curve(y_test_class0, preds_class0)
    # roc_auc_class0 = metrics.auc(fpr_class0, tpr_class0)

    #Creating threshold tables
    df_class1_thresh = pd.DataFrame()
    df_class1_thresh['fpr'] = fpr_class1
    df_class1_thresh['tpr'] = tpr_class1
    df_class1_thresh['threshold'] = threshold_class1

    df_class0_thresh = pd.DataFrame()
    df_class0_thresh['fpr'] = fpr_class0
    df_class0_thresh['tpr'] = tpr_class0
    df_class0_thresh['threshold'] = threshold_class0

    # #Plotting ROC curves
    # plt.title('Receiver Operating Characteristic')
    # plt.plot(fpr_class1, tpr_class1, 'b', label = 'AUC = %0.2f' % roc_auc_class1)
    # plt.plot(fpr_class0, tpr_class0, 'b', label = 'AUC = %0.2f' % roc_auc_class0)
    # plt.legend(loc = 'lower right')
    # plt.plot([0, 1], [0, 1],'r--')
    # plt.xlim([0, 1])
    # plt.ylim([0, 1])
    # plt.ylabel('True Positive Rate')
    # plt.xlabel('False Positive Rate')


    greatest_tpr = None
    thresholds = []

    #Calculating intersection between the two ROC curves where fpr == tpr for both
    for index,row in df_class1_thresh.iterrows():
        fpr_c1,tpr_c1,threshold_c1 = row['fpr'], row['tpr'],row['threshold']
        for index0, row0 in df_class0_thresh.iterrows():
            fpr_c0,tpr_c0,threshold_c0 = row0['fpr'], row0['tpr'],row0['threshold']
            if fpr_c0 > fpr_c1:
                if tpr_c0 > tpr_c1:
                    new_greatest = 'class0'
                else:
                    new_greatest = 'class1'
                if new_greatest != greatest_tpr:
                    # plt.plot(fpr_c1,tpr_c1,'ro')
                    # plt.plot(fpr_c0,tpr_c0,'ro')
                    thresholds.append((threshold_c0, threshold_c1))
                greatest_tpr = new_greatest
                break


    # plt.show()
    # plt.savefig('roc_curve.png')
    # print(len(thresholds))

    #Calculate final threshold
    final_threshold_avg = float('inf')
    final_thresholds = None
    for x in thresholds:
        avg_threshold = (x[0] + x[1])/2
        if abs(avg_threshold - 0.50) < abs(final_threshold_avg-0.50):
            final_threshold_avg = avg_threshold
            final_thresholds = x
    return final_thresholds
  

