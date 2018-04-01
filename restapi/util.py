import pandas as pd


def get_factor_list_from_file(path_to_file, target_variable, arithmetic_columns):
    all_columns = get_column_names_from_file(path_to_file)
    categorical_columns = set(all_columns) - set([target_variable]) - set(arithmetic_columns)
    factor_list = arithmetic_columns + ['C(' + x + ')' for x in categorical_columns]
    return factor_list


def get_column_names_from_file(path_to_file):
    df = pd.read_csv(path_to_file)
    return df.columns.values.tolist()


def get_numeric_columns(model_id):
    model_desc = MlModel.objects.get(pk=model_id)
    return model_desc.non_categorical_columns.split(',')
