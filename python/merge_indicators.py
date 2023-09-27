import geopandas as gpd
import pandas as pd
import json
import numpy as np
import simplejson
import math

## BLOCKS

df = pd.read_csv("source_data/block_group_indicators.csv")


def match_geojson_indicators(data):
    new_file = {}
    new_file["type"] = data["type"]
    #     new_file['name'] = data['name']
    new_file["features"] = []

    for feature in data["features"]:
        new_feature = {}
        new_feature["properties"] = {}
        geoid = int(feature["properties"]["GEOID"])
        this_feature = df[(df["block_id"] == geoid)]
        if this_feature.shape[0] == 0:
            continue
        #         new_feature['id'] = int(geoid)
        new_feature["type"] = feature["type"]
        new_feature["geometry"] = feature["geometry"]
        new_feature["properties"]["GEOID"] = geoid
        for idx, col in enumerate(df.columns[1:]):
            value = round(this_feature[col].iloc[0], 4)
            if math.isnan(value):
                value = -1
            if col == "PCT_American_Indian":
                new_feature["properties"]["PCT_AI"] = value
            elif col == "PCT_Asian_Pacific_Islander":
                new_feature["properties"]["PCT_API"] = value
            else:
                new_feature["properties"][col] = value
        new_file["features"].append(new_feature)

    return new_file

# https://github.com/loganpowell/census-geojson/blob/master/GeoJSON/500k/2020/block-group.json
with open("source_shapes/block-group.json", encoding="utf-8") as file:
    data_gh = json.load(file)

gh_file = match_geojson_indicators(data_gh)

with open("geojson_output/block-groups.geojson", "w") as json_file:
    this_file = simplejson.dumps(gh_file, ignore_nan=True)
    json_file.write(this_file)

## ZCTAS

df_zcta = pd.read_csv("source_data/zcta_indicators.csv")

# https://github.com/loganpowell/census-geojson/blob/master/GeoJSON/500k/2020/zip-code-tabulation-area.json
with open("source_shapes/zip-code-tabulation-area-simple.json", encoding="utf-8") as file:
    data_zctas = json.load(file)


def match_zcta_indicators(data):
    new_file = {}
    new_file["type"] = data["type"]
    #     new_file['name'] = data['name']
    new_file["features"] = []

    for feature in data["features"]:
        new_feature = {}
        new_feature["properties"] = {}
        geoid = int(feature["properties"]["GEOID20"])
        this_feature = df_zcta[(df_zcta["zcta"] == geoid)]
        if this_feature.shape[0] == 0:
            continue
        #         new_feature['id'] = int(geoid)
        new_feature["type"] = feature["type"]
        new_feature["geometry"] = feature["geometry"]
        new_feature["properties"]["GEOID"] = geoid
        for idx, col in enumerate(df_zcta.columns[1:]):
            value = round(this_feature[col].iloc[0], 4)
            if math.isnan(value):
                value = -1
            if col == "PCT_American_Indian":
                new_feature["properties"]["PCT_AI"] = value
            elif col == "PCT_Asian_Pacific_Islander":
                new_feature["properties"]["PCT_API"] = value
            else:
                new_feature["properties"][col] = value
        new_file["features"].append(new_feature)

    return new_file


zcta_geojson_file = match_zcta_indicators(data_zctas)

with open("geojson_output/zcta.geojson", "w") as json_file:
    this_file = simplejson.dumps(zcta_geojson_file, ignore_nan=True)
    json_file.write(this_file)

## TRACTS

df_tract = pd.read_csv("source_data/tract_indicators.csv")
# https://github.com/loganpowell/census-geojson/blob/master/GeoJSON/500k/2020/tract.json
with open("source_shapes/tract.json", encoding="utf-8") as file:
    data_tract = json.load(file)


def match_tract_indicators(data):
    new_file = {}
    new_file["type"] = data["type"]
    #     new_file['name'] = data['name']
    new_file["features"] = []

    for feature in data["features"]:
        new_feature = {}
        new_feature["properties"] = {}
        geoid = int(feature["properties"]["GEOID"])
        this_feature = df_tract[(df_tract["tract_id"] == geoid)]
        if this_feature.shape[0] == 0:
            continue
        #         new_feature['id'] = int(geoid)
        new_feature["type"] = feature["type"]
        new_feature["geometry"] = feature["geometry"]
        new_feature["properties"]["GEOID"] = geoid
        for idx, col in enumerate(df_tract.columns[1:]):
            value = round(this_feature[col].iloc[0], 4)
            if math.isnan(value):
                value = -1
            if col == "PCT_American_Indian":
                new_feature["properties"]["PCT_AI"] = value
            elif col == "PCT_Asian_Pacific_Islander":
                new_feature["properties"]["PCT_API"] = value
            else:
                new_feature["properties"][col] = value
        new_file["features"].append(new_feature)

    return new_file


tract_geojson_file = match_tract_indicators(data_tract)

with open("geojson_output/tracts.geojson", "w") as json_file:
    this_file = simplejson.dumps(tract_geojson_file, ignore_nan=True)
    json_file.write(this_file)
