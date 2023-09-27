import pandas as pd

counties = pd.read_csv("source_data/county_fips.csv", dtype={"state_code": "str", "county_code": "str"})
zctas = pd.read_csv("source_data/zcta_county_xwalk.csv", dtype={"zcta": "str", "county": "str"})

states = counties[['state', 'state_name']].drop_duplicates().set_index('state_name')
states.loc['Alaska'][0]
zctas.drop(['county'], axis=1, inplace=True)
zctas['county_state'] = zctas.apply(lambda x: x['county_name'] + ', ' + states.loc[x['state_name']][0], axis=1)
zctas.drop()
zctas[['zcta', 'county_state']].set_index('zcta').to_json('../data/zcta_county_xwlak.json', orient='columns')
