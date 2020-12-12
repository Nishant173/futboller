import re


def lcc2ucc(string: str) -> str:
    """Converts lower-camel-case to upper-camel-case"""
    return string[0].upper() + string[1:]


def ucc2lcc(string: str) -> str:
    """Converts upper-camel-case to lower-camel-case"""
    return string[0].lower() + string[1:]


def ucc2underscored(string: str) -> str:
    """Converts upper-camel-case to underscore-separated (lower-case)"""
    words = re.findall(pattern="[A-Z][^A-Z]*", string=string)
    words = [word.lower() for word in words]
    return "_".join(words)


def lcc2underscored(string: str) -> str:
    """Converts lower-camel-case to underscore-separated (lower-case)"""
    string_ucc = lcc2ucc(string=string)
    return ucc2underscored(string=string_ucc)


def underscored2ucc(string: str) -> str:
    """Converts underscore-separated (lower-case) to upper-camel-case"""
    words = string.split('_')
    words_capitalized = [word.strip().capitalize() for word in words]
    return "".join(words_capitalized)


def underscored2lcc(string: str) -> str:
    """Converts underscore-separated (lower-case) to lower-camel-case"""
    string_ucc = underscored2ucc(string=string)
    return ucc2lcc(string=string_ucc)