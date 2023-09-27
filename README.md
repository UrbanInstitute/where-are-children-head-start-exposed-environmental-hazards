# Where Are Children in Head Start Exposed to Environmental Hazards?

## Overview

In this vanilla JavaScript application (all JS in `js/main.js`), there is a Mapbox map referencing a Mapbox-hosted style that passes data to the application.
Client-side state/county name lookup files are stored in the `data/` directory (input/output files referenced in this document are not included as to lower overall directory size).
The `python/` folder includes scripts for combining csv data with shapes to upload to Mapbox.

**If you are rehosting this application, you must use your own Mapbox style and API key.** Change the `mapboxgl.accessToken` and the reference to the style in `new mapboxgl.Map({})`. More detail is given in the `Mapbox style` section below.

## Data processing

### 1. Download source data (`python/source_data/`)

CSVs should be generated prior to starting this step.

- `zcta_indicators.csv` - see [Urban Data Catalog](https://datacatalog.urban.org/dataset/where-are-children-head-start-exposed-environmental-hazards)
- `tract_indicators.csv` - see [Urban Data Catalog](https://datacatalog.urban.org/dataset/where-are-children-head-start-exposed-environmental-hazards)
- `block_group_indicators.csv` - see [Urban Data Catalog](https://datacatalog.urban.org/dataset/where-are-children-head-start-exposed-environmental-hazards)
- `county_fips.csv` - fips lookup for county names
- `zcta_county_xwalk.csv` - ZCTA to county lookup

#### County name update

In the event that county names change, the `python/zctas_county_xwalk.py` script will need to be run, which references `county_fips.csv` and `zcta_county-xwalk.csv` and outputs to `data/zcta_county_xwlak.json`.

#### Data dictionary

The data is separated into 4 groups of variables:

- `P_SLOTS` – overall head start funded slots (for one view)
- `P*\*` - all other variables with P\* are ej indicator percentils
- `PCT\_\*` - race percentages from the decennial census
- `CUME*\*` - overall metric which combines P_SLOTS and each P\*\* variable

There are now variables that end in `_ej` at the block group level that you can use for the environmental risk tab (not the combined). These should be mostly filled for the variables that come from `EJScreen`. (We still use the columns `CUME*P*\*`, without `ej`, for the combined view)

**Special callouts:**

- `ej` = environmental justice (obtained from another datasource)
- `NAs` are present in source data but set to -1 later on to make mapbox play nice

### 2. Download source shapes (`python/source_shapes/`)

Shapes are taken from this [GitHub repository](https://github.com/loganpowell/census-geojson/tree/master/GeoJSON/500k/2020) - specifically the `GEOJSON/500k/2020/` directory. Shapes directly from Census are too detailed. These have been simplified.

- block-group.json
- tract.json
- zip-code-tabulation-area.json

#### 2a. ZCTA shape simplification (`python/simplify_geojson.sh`)

Since the ZCTAs are shown at the national level, the shapes need to be simplified in order to not create a large load. Generate `zip-code-tabulation-area-simple.json` with the shell script `simplify_geojson.sh` based on `zip-code-tabulation-area.json` from the source shape above.

### 3. Combine data and shapes (`python/merge_indicators.py`)

The Python script `python/merge_indicators.py` takes the `source_data/` csvs and combines with the `source_shapes/` json files. Among other steps, NAs are set to "-1". It outputs 3 files in the `geojson_output/` directory:

- `zcta.geojson`
- `block-groups.geojson`
- `tracts.geojson`

### 4. Generate Mapbox mbtiles (`python/make_mbtiles.sh`)

After the geojson files are prepared, convert them to mbtiles with the `python/make_mbtiles.sh` script. This will require the [tippecanoe](https://github.com/felt/tippecanoe) command line tool. The tiles will only be visible at zoom level 8 since the ZCTA shapes are only shown before then. The script will generate 2 files in the `mbtiles_output/` directory:

- `block-groups.mbtiles`
- `tracts.mbtiles`

**NOTE:** do not generate mbiltes for the ZCTA geojson. It will be uploaded directly to Mapbox as to avoid over-simplification of shapes. This is due to the size of metadata in the file and the 500kb limit of mbtiles on Mapbox.

### 5. Upload files to Mapbox

- `zcta.geojson` - uploaded to Mapbox directly. Mapbox will convert this to mbtiles.
- `block-groups.mbtiles` - uploaded to Mapbox
- `tracts.mbtiles` - uploaded to Mapbox

#### 5a. Replace data sources in layers

Once the tilesets have been generated, replace the layer sources in the Mapbox style with the new tilesets.

**NOTE:** this will require replacing the `source-layer` ID in the JavaScript code (`js/main.js`) `map.addLayer()` functions.

## Mapbox style

Rendering tiles on the Mapbox server allows the client load to be reduced, but those files are beholden to the limits (and costs) set by Mapbox. We have opted for this solution. See steps below to get your own Mapbox configuration setup:

- See the `mapbox-style.json` for style configuration.
- Once the tilesets have been generated, uploaded, and replaced in the style, replace the Mapbox style ID in `js/main.js` under the `new mapboxgl.Map({})` declaration.
- You must use your own Mapbox API key, `mapboxgl.accessToken` sets this in `js/main.js`.
- If colors/bins are changing, they are determined in the Mapbox style.

## pym.js

This application uses [pym.js](http://blog.apps.npr.org/pym.js/) to embed on parent pages via iframe with dynamic height. The `pym` library is stored in `js/pym.min.js`. The `child.html` file is what's embedded in the iframe. The parent page must contain the following code:

```html
<div id="environmental-risk">&nbsp;</div>
<script type="text/javascript" src="https://url.to.host/js/pym.min.js"></script>
<script>
  var pymParent = new pym.Parent(
    "environmental-risk",
    "https://url.to.host/child.html",
    {}
  );
</script>
```

## Google Analytics

Throughout the application, you'll find reference to `gtag()` functions. These are to capture Google Analytics events. If rehosting, you can remove these if you don't want to track events, or replace the Google ID in the head of `child.html`.

## Appendix

Indicators for each geography level

- Block Group
  - PM 2.5
  - Ozone
  - Diesel PM
  - Cancer risk
  - Respiratory index
  - Lead
- Tract
  - Green space
  - Flood risk
  - Fire risk
  - Heat risk
- ZCTA
  - All of the above
