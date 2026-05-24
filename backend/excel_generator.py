import pandas as pd
import os


def create_excel(data, filename):

    # create generated folder
    os.makedirs("generated", exist_ok=True)

    filepath = os.path.join("generated", filename)

    # first row = headers
    headers = data[0]

    # remaining rows = actual data
    rows = data[1:]

    # create dataframe properly
    df = pd.DataFrame(rows, columns=headers)

    # save excel
    df.to_excel(filepath, index=False)

    print("Excel created successfully")

    return filepath