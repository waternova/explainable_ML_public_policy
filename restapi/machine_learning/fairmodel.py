import numpy as np
import pandas as pd
from itertools import combinations
from sklearn.linear_model import LogisticRegression
from sklearn import metrics
from sklearn.metrics import accuracy_score
from sklearn.model_selection import train_test_split
# import matplotlib.pyplot as plt
from restapi.machine_learning.util import preparedata

# Gets thresholds with positive class first
def get_fair_thresholds(model, protectiveAtt, dataFile= 'df_math_cleaned.csv'):
    df_math = pd.read_csv(dataFile)
    y, X = preparedata(df_math)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=42)
    #splitting data into test for each group in protective attribute
    X_test_class1 = X_test[X_test[protectiveAtt]==1]
    X_test_class2 = X_test[X_test[protectiveAtt]==0]
    y_test_class1 = y_test[X_test[protectiveAtt]==1]
    y_test_class2 = y_test[X_test[protectiveAtt]==0]

    #Creating ROC for class 1
    probs_class1 = model.predict_proba(X_test_class1)
    preds_class1 = probs_class1[:,1]
    fpr_class1, tpr_class1, threshold_class1 = metrics.roc_curve(y_test_class1, preds_class1)
    # roc_auc_class1 = metrics.auc(fpr_class1, tpr_class1)

    #Creating ROC for class 2
    probs_class2 = model.predict_proba(X_test_class2)
    preds_class2 = probs_class2[:,1]
    fpr_class2, tpr_class2, threshold_class2 = metrics.roc_curve(y_test_class2, preds_class2)
    # roc_auc_class2 = metrics.auc(fpr_class2, tpr_class2)

    #Creating threshold tables
    df_class1_thresh = pd.DataFrame()
    df_class1_thresh['fpr'] = fpr_class1
    df_class1_thresh['tpr'] = tpr_class1
    df_class1_thresh['threshold'] = threshold_class1

    df_class2_thresh = pd.DataFrame()
    df_class2_thresh['fpr'] = fpr_class2
    df_class2_thresh['tpr'] = tpr_class2
    df_class2_thresh['threshold'] = threshold_class2

    # #Plotting ROC curves
    # plt.title('Receiver Operating Characteristic')
    # plt.plot(fpr_class1, tpr_class1, 'b', label = 'AUC = %0.2f' % roc_auc_class1)
    # plt.plot(fpr_class2, tpr_class2, 'b', label = 'AUC = %0.2f' % roc_auc_class2)
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
        for index2, row2 in df_class2_thresh.iterrows():
            fpr_c2,tpr_c2,threshold_c2 = row2['fpr'], row2['tpr'],row2['threshold']
            if fpr_c2 > fpr_c1:
                if tpr_c2 > tpr_c1:
                    new_greatest = 'class2'
                else:
                    new_greatest = 'class1'
                if new_greatest != greatest_tpr:
                    # plt.plot(fpr_c1,tpr_c1,'ro')
                    # plt.plot(fpr_c2,tpr_c2,'ro')
                    thresholds.append((threshold_c1, threshold_c2))
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
  

