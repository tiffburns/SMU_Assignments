import csv

csvpath = r"Submission\PyPoll\Resources\election_data.csv"
print(csvpath)

ttl_votes = 0

candidates = {}

with open(csvpath, "r") as csvfile:
    election_data = csv.reader(csvfile, delimiter=',')
    csv_header = next(election_data)

    for row in election_data:
        ttl_votes += 1

        candidate = row[2]
        if candidate in candidates.keys():
            candidates[candidate] += 1
        else:
            candidates[candidate] = 1


#https://stackoverflow.com/questions/268272/getting-key-with-maximum-value-in-dictionary
winner = max(candidates, key=candidates.get) #stolen from the internet

percentages = {}
for key in candidates.keys():
    perc = candidates[key] / ttl_votes
    percentages[key] = perc

print(percentages)

listOfStrings = []
for key in percentages.keys():
    myString = key + ": " + str(round(percentages[key], 3) * 100) + "% (" + str(candidates[key]) + ")"
    listOfStrings.append(myString)

print(listOfStrings)

finalString = "\n".join(listOfStrings)

summaryString = f"""Election Results
-------------------------
Total Votes: {ttl_votes}
-------------------------
{finalString}
-------------------------
Winner: {winner}
-------------------------"""

with open("Submission\PyPoll\Analysis\poll_results.txt", "w") as file1:
    file1.write(summaryString)
