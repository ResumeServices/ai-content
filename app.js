const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()


const mongoDBUri = process.env.MONGODB_URI;
const PORT = process.env.PORT_1;
const NODE_ENV = process.env.NODE_ENV;
const dbName = process.env.DB_NAME;
const server = process.env.SERVER_1;
const username = process.env.USERNAME;
const password = process.env.PASSWORD;


const suggestions_experience_data = require("./json_files/suggestions_experience.json")
const suggestions_summary_data = require("./json_files/suggestions_summary.json");
const jobs_categories_titles_data = require("./json_files/jobs_categories_titles.json");
const job_categories_skill_data = require("./json_files/job_categories_skill.json");
const url = process.env.MONGODB_URI



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


