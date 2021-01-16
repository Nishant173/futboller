from typing import Dict, List, Union

from django.db.models import QuerySet
import pandas as pd

from py_utils.data_analysis import transform


def queryset_to_dataframe(qs: QuerySet,
                          drop_id: bool) -> pd.DataFrame:
    data = pd.DataFrame(data=list(qs.values()))
    if drop_id:
        data = transform.drop_columns_if_exists(data=data, columns=['id'])
    return data


def queryset_to_list(qs: QuerySet,
                     drop_id: bool) -> Union[List[Dict], List]:
    data = queryset_to_dataframe(qs=qs, drop_id=drop_id)
    list_obj = transform.dataframe_to_list(data=data)
    return list_obj