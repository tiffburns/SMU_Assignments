import csv
import numpy as np

csvpath = r"Submission\PyBank\Resources\budget_data.csv"
print(csvpath)

ttl_months = 0
ttl_profit = 0
starter_row = True
last_row = 0
new_dict = {}

# read in the csv file

with open(csvpath, "r") as csvfile:
    budget_data = csv.reader(csvfile, delimiter=',')
    csv_header = next(budget_data)

    # Read each row in the data set and perform this loop

    for row in budget_data:
        ttl_months += 1
        ttl_profit += int(row[1])

        if starter_row:
            last_row = int(row[1])
            starter_row = False
        else:
            change = int(row[1]) - last_row
            new_dict[row[0]] = change
            last_row = int(row[1])

averageChange = np.mean(list(new_dict.values()))

#get the min & max values

#https://stackoverflow.com/questions/268272/getting-key-with-maximum-value-in-dictionary
maxChangeMonth = max(new_dict, key=new_dict.get) #teacher offered dictionary
maxChangeValue = new_dict[maxChangeMonth]

minChangeMonth = min(new_dict, key=new_dict.get) #teacher offered dictionary
minChangeValue = new_dict[minChangeMonth]

summaryString = f"""Finanical Analysis
-------------------------
Total Months: {ttl_months}
Total: ${ttl_profit}
Average Change: ${round(averageChange, 2)}
Greatest Increase in Profits: {maxChangeMonth} (${maxChangeValue})
Greatest Decrease in Profits: {minChangeMonth} (${minChangeValue})
"""

#write summary string
with open(r"Submission\PyBank\Analysis\bank_results.txt", "w") as file1:
    file1.write(summaryString)
