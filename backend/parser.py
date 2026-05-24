import re


def parse_text(text):

    text = text.strip()

    if not text:
        return []

    # clean spaces
    text = text.replace("\t", " ")
    text = re.sub(r"\s+", " ", text)

    # ---------------- FIND HEADER ----------------
    first_id = re.search(r"\d{3,},", text)

    if not first_id:
        return []

    split_index = first_id.start()

    header_text = text[:split_index].strip()
    rows_text = text[split_index:].strip()

    # headers
    headers = [h.strip() for h in header_text.split(",")]

    total_columns = len(headers)

    parsed_data = []

    # ADD HEADER ROW
    parsed_data.append(headers)

    # ---------------- SPLIT ROWS ----------------
    row_pattern = r'(\d{3,},.*?)(?=\s\d{3,},|$)'

    found_rows = re.findall(row_pattern, rows_text)

    for row_text in found_rows:

        row = [item.strip() for item in row_text.split(",")]

        # FIX COLUMN SIZE
        if len(row) < total_columns:
            row += [""] * (total_columns - len(row))

        if len(row) > total_columns:
            row = row[:total_columns]

        parsed_data.append(row)

    print(parsed_data)

    return parsed_data