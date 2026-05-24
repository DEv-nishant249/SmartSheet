import re
def parse_text(text):
    rows = []

    lines = text.strip().split("\n")

    if not lines:
        return rows

    # First line = headers
    headers = [h.strip() for h in lines[0].split(",")]

    # Remaining lines = data
    for line in lines[1:]:

        if not line.strip():
            continue

        values = [v.strip() for v in line.split(",")]

        row = {}

        for i in range(min(len(headers), len(values))):
            row[headers[i]] = values[i]

        rows.append(row)

    return rows