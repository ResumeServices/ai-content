#!/bin/bash


# usage example:

# sh mongodb_backup_suggestions.sh "mongodb://[username]:[password]@[SERVER_URL_1]:27017,[SERVER_URL_2]:27017,[SERVER_URL_3]:27017/[DB_NAME]?authSource=[DB_NAME]&replicaSet=[REPLICA_NAME]&ssl=false" "/Users/[YOUR_USER_NAME]/[FULL_PATH_TO_FOLDER_WHERE_BACKUP_WILL_BE_SAVED]"

# FULL_PATH_TO_FOLDER_WHERE_BACKUP_WILL_BE_SAVED should be the full path to the folder that will contain db content. For example, if your files are located in folder ~/my_tests/mongodb_dbs under your user on macbook the FULL_PATH_TO_FOLDER_WHERE_BACKUP_WILL_BE_SAVED would be /Users/[YOUR_USER_NAME]/my_tests/mongodb_dbs. I recommend to use the same folder where the script is located.

collections=("job_categories_skill" "jobs_categories_titles" "suggestions_experience" "suggestions_summary")

error_handle() {
    if [ $1 -ne 0 ]
        then
            echo "Execution error (Line $2): $3." 1>&2
            exit 1
    fi
}

sourceURI=""
if [ "$1" ]; then
    sourceURI=$1
fi

sourceOutPut=""
if [ "$2" ]; then
    sourceOutPut=$2
fi

mkdir -p $sourceOutPut
chmod 0777 $sourceOutPut

echo "MongoURL: $sourceURI"
echo "Folder Path: $sourceOutPut"

for collection in ${collections[@]}; do
  echo "Getting $collection collection from source..."
  
  mongodump -v --uri="$sourceURI" --out="$sourceOutPut/" --collection=$collection
  
  error_handle $? $LINENO "Getting data from collection $collection"
done