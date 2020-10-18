import csv

csvpath = r"Submission\PyPoll\Resources\election_data.csv"
print(csvpath)

ttl_votes = 0
candidates = {}

# read in the csv file

with open(csvpath, "r") as csvfile:
    election_data = csv.reader(csvfile, delimiter=',')
    csv_header = next(election_data)

    # for each row in the data set complete the below loop

    for row in election_data:
        ttl_votes += 1
        candidate = row[2]

        if candidate in candidates.keys():
            candidates[candidate] += 1
        else:
            candidates[candidate] = 1

Wins = max(candidates, key=candidates.get) #link provided during office hours: https://stackoverflow.com/questions/268272/getting-key-with-maximum-value-in-dictionary

# create a new dictionary with percentages

percentages = {}
for key in candidates.keys():
    perc = candidates[key] / ttl_votes
    percentages[key] = perc

print(percentages)

# what list will print out for each candidate

stringlist = []
for key in percentages.keys():
    myString = key + ": " + str(round(percentages[key]* 100, 3)) + "% (" + str(candidates[key]) + ")"
    stringlist.append(myString)

print(stringlist)

message = "\n".join(stringlist)

# create candidate strings for text file

summary = f"""Election Results
-------------------------
Total Votes: {ttl_votes}
-------------------------
{message}
-------------------------
Winner: {Wins}
-------------------------"""

#write summary string
with open(r"Submission\PyPoll\Analysis\poll_results.txt", "w") as file1:
    file1.write(summary)
