#import dependencies
import numpy as np
import pandas as pd
import datetime as dt
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
from flask import Flask, jsonify

#create engine
engine = create_engine("sqlite:///Resources/hawaii.sqlite")

# reflect an existing database into a new model
Base = automap_base()

# reflect the tables
Base.prepare(engine, reflect=True)

# We can view all of the classes that automap found
Base.classes.keys()

# Save references to each table
Measurement = Base.classes.measurement
Station = Base.classes.station

# Create our session (link) from Python to the DB
session = Session(engine)

# create weather app
app = Flask(__name__)


#set up dates for table
last_date = session.query(Measurement.date).order_by(Measurement.date.desc()).first()
last_date = list(np.ravel(last_date))[0]

last_date = dt.datetime.strptime(last_date, "%Y-%m-%d")
last_year = int(dt.datetime.strftime(last_date, "%Y"))
last_m = int(dt.datetime.strftime(last_date, "%m"))
last_d = int(dt.datetime.strftime(last_date, "%d"))

prev_year = dt.date(last_year, last_m, last_d) - dt.timedelta(days=365)
prev_year = dt.datetime.strftime(prev_year, "%Y-%m-%d")


#define app routes and create homepage
@app.route("/")
def home():
    return (
        f"Welcome to the Surf's Up API for Hawaii<br/>"
        f"------------------------------------------------------<br/>"
        f"Routes:<br/>"
        f"------------------------------------------------------<br/>"
        f"/api/v1.0/stations ----- A Complete List of Weather Observation Stations<br/>"
        f"/api/v1.0/precipitaton ----- Last Year's Preciptation Data<br/>"
        f"/api/v1.0/tobs ----- Last Year's Temperature Data<br/>"
        f"/api/v1.0/2013-06-08 ----- TMIN, TAVG, and TMAX for all dates greater than and equal to the start date<br/>"
        f"/api/v1.0/2013-06-08/2014-06-08 ---- TMIN, TAVG, and TMAX for dates between the start and end date inclusive<br/>"
        f"------------------------------------------------------<br/>"
        f"Full Data Range: 2010-01-01 to 2017-08-23 <br/>"
        f"------------------------------------------------------<br/>"
        f"Page Owned by: Tiffany Burns<br/>"
    )


@app.route("/api/v1.0/stations")
def stations():
    results = session.query(Station.name).all()
    all = list(np.ravel(results))
    return jsonify(all)


@app.route("/api/v1.0/precipitaton")
def precipitation():

    results = (
        session.query(Measurement.date, Measurement.prcp, Measurement.station)
        .filter(Measurement.date > prev_year)
        .order_by(Measurement.date)
        .all()
    )

    prcp_data = []
    for result in results:
        precip_dict = {result.date: result.prcp, "Station": result.station}
        prcp_data.append(precip_dict)

    return jsonify(prcp_data)


@app.route("/api/v1.0/tobs")
def tobs():

    results = (
        session.query(Measurement.date, Measurement.tobs, Measurement.station)
        .filter(Measurement.date > prev_year)
        .order_by(Measurement.date)
        .all()
    )

    tobs_data = []
    for result in results:
        temp_dict = {result.date: result.tobs, "Station": result.station}
        tobs_data.append(temp_dict)

    return jsonify(tobs_data)


@app.route("/api/v1.0/<start>")
def start(start):
    sel = [
        Measurement.date,
        func.min(Measurement.tobs),
        func.avg(Measurement.tobs),
        func.max(Measurement.tobs),
    ]

    results = (
        session.query(*sel)
        .filter(func.strftime("%Y-%m-%d", Measurement.date) >= start)
        .group_by(Measurement.date)
        .all()
    )

    dates = []
    for result in results:
        date_list = {}
        date_list["Date"] = result[0]
        date_list["Low Temp"] = result[1]
        date_list["Avg Temp"] = result[2]
        date_list["High Temp"] = result[3]
        dates.append(date_list)
    return jsonify(dates)


@app.route("/api/v1.0/<start>/<end>")
def startEnd(start, end):
    sel = [
        Measurement.date,
        func.min(Measurement.tobs),
        func.avg(Measurement.tobs),
        func.max(Measurement.tobs),
    ]

    results = (
        session.query(*sel)
        .filter(func.strftime("%Y-%m-%d", Measurement.date) >= start)
        .filter(func.strftime("%Y-%m-%d", Measurement.date) <= end)
        .group_by(Measurement.date)
        .all()
    )

    dates = []
    for result in results:
        date_list = {}
        date_list["Date"] = result[0]
        date_list["Low Temp"] = result[1]
        date_list["Avg Temp"] = result[2]
        date_list["High Temp"] = result[3]
        dates.append(date_list)
    return jsonify(dates)


if __name__ == "__main__":
    app.run(debug=True)