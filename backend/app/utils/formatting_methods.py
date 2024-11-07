from functools import wraps


def format_date_long_suffix(func):
    @wraps(func)
    def wrapper(self):
        date = func(self)
        if date is None:
            return ""

        day = int(date.strftime("%d"))
        suffix = (
            "th" if 11 <= day <= 13 else {1: "st", 2: "nd", 3: "rd"}.get(day % 10, "th")
        )
        return date.strftime(f"%B {day}{suffix}, %Y")

    return wrapper

    ## mm/dd/yyyy
    ## mm/yy
    ## b/dd/yyyy
