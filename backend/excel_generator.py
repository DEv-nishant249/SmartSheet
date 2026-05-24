import pandas as pd
from openpyxl import load_workbook
from openpyxl.styles import Font


def create_excel(data, filename):
    df = pd.DataFrame(data)

    filepath = f"generated/{filename}"

    df.to_excel(filepath, index=False)

    workbook = load_workbook(filepath)
    sheet = workbook.active

    for cell in sheet[1]:
        cell.font = Font(bold=True)

    for column in sheet.columns:
        max_length = 0
        column_letter = column[0].column_letter

        for cell in column:
            try:
                if len(str(cell.value)) > max_length:
                    max_length = len(str(cell.value))
            except:
                pass

        adjusted_width = max_length + 5
        sheet.column_dimensions[column_letter].width = adjusted_width

    workbook.save(filepath)

    return filepath
