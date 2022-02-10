const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()


const server1 = process.env.SERVER_1;
const server2 = process.env.SERVER_2;
const port1 = process.env.PORT_1;
const port2 = process.env.PORT_2;
const dbName = process.env.DB_NAME;
const username = process.env.USERNAME;
const password = process.env.PASSWORD;



const suggestions_experience_data = require("./json_files/suggestions_experience.json")
const suggestions_summary_data = require("./json_files/suggestions_summary.json");
const jobs_categories_titles_data = require("./json_files/jobs_categories_titles.json");
const job_categories_skill_data = require("./json_files/job_categories_skill.json");
const url = `mongodb://${username}:${password}@${server1}:${port1},${server2}:${port2}/?authSource=${dbName}&readPreference=primary&appname=MongoDB%20Compass&directConnection=false&ssl=true`;




MongoClient.connect(url, { useUnifiedTopology: true }, function(err, client) {

    if(err){
      console.log({err})
      return 
    }
    console.log("connected")
    const db = client.db(dbName);

    
    insertMany("ai_suggestions_summary", suggestions_summary_data)
    insertMany("ai_suggestions_experience", suggestions_experience_data)
    insertMany("ai_jobs_categories_titles", jobs_categories_titles_data)
    insertMany("ai_job_categories_skill", job_categories_skill_data)

    //insert data into DB
    async function insertMany(collectionName, values) {
        await createCollection(collectionName)
        db.collection(collectionName).insertMany(values, function(err, res) {
          if (err) throw err;
          console.log("1 document updated",collectionName);
        //   db.close();
        });
    }

    //create collection
    function createCollection(collectionName) {
       return db.createCollection(collectionName)
    }
});


