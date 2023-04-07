import decimal


def get_value_type(value: str) -> str:
    """Returns wheter the value is numeric, categorical or none"""
    if value is None:
        return None
    elif isinstance(value, decimal.Decimal):
        return "numeric"
    elif isinstance(value, int):
        return "numeric"
    elif isinstance(value, float):
        return "numeric"
    return "categorical"

