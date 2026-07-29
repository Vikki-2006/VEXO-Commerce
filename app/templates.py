from fastapi.templating import Jinja2Templates

templates = Jinja2Templates(directory="app/templates")

def format_currency_filter(amount):
    try:
        amount = int(amount)
        s = str(amount)
        if len(s) <= 3:
            return f"₹{s}"
        last_three = s[-3:]
        remaining = s[:-3]
        groups = []
        while len(remaining) > 0:
            groups.append(remaining[-2:])
            remaining = remaining[:-2]
        groups.reverse()
        formatted = ",".join(groups) + "," + last_three
        return f"₹{formatted}"
    except Exception:
        return f"₹{amount}"

def format_date_filter(date_str):
    try:
        from datetime import datetime
        if not date_str:
            return ""
        if isinstance(date_str, datetime):
            return date_str.strftime("%d %b %Y")
        # Handle string parsing
        date_str_clean = str(date_str)
        if "T" in date_str_clean:
            dt = datetime.strptime(date_str_clean.split("T")[0], "%Y-%m-%d")
        elif " " in date_str_clean:
            dt = datetime.strptime(date_str_clean.split(" ")[0], "%Y-%m-%d")
        else:
            dt = datetime.strptime(date_str_clean, "%Y-%m-%d")
        return dt.strftime("%d %b %Y")
    except Exception:
        try:
            return date_str.strftime("%d %b %Y")
        except Exception:
            return str(date_str)

templates.env.filters["format_currency"] = format_currency_filter
templates.env.filters["format_date"] = format_date_filter
