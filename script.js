const content = require("./ai_contents.json");
var fs = require("fs");
const ObjectID = require('mongodb').ObjectID;

const jobs_categories_titles = content.map((item, i) => {
  return {
    jobCategory: item.jobCategory,
    jobTitle: item.jobTitle,
  };
});
writeFIle("jobs_categories_titles", jobs_categories_titles);

const suggestions_summary = content.map((item, i) => {
  const suggestion = item.experience.split(". ").map((item)=>item[0]!=="-"?`- ${item}`:item)
  return {
    jobCategory: item.jobCategory,
    jobTitle: item.jobTitle,
    suggestion: item.summary.split(". "),
  };
});
writeFIle("suggestions_summary", suggestions_summary);

const suggestions_experience = content.map((item, i) => {
  const suggestion = item.experience.split(". ").map((item)=>item[0]==="-"?item.slice(2, item.length):item)
  return {
    jobCategory: item.jobCategory,
    jobTitle: item.jobTitle,
    suggestions: suggestion
  };
});
writeFIle("suggestions_experience", suggestions_experience);

const unique = [];
content.map((x) =>
  unique.filter((a) => a.jobCategory == x.jobCategory).length > 0
    ? null
    : unique.push(x)
);

const job_categories_skill = unique.map((item, i) => {
  const date = new Date().toISOString();
  return {
    job_category: item.jobCategory,
    education: "",
    skills: skill_categories(item.jobCategory),
    date_created: date,
    timestamp: date,
  };
});

writeFIle("job_categories_skill", job_categories_skill);

function skill_categories(category) {
  const categoryFiltred = content.filter(
    (item) => item.jobCategory === category
  );
  const result = [];
  categoryFiltred.map((item, i) => {
    item.skills.split(", ").map((item) => {

      result.push({
        skillName: item,
        count: "",
      });
    });
  });
  return result
    .map((item, i) => {
      const objectId = new ObjectID();
      const _id = objectId.toHexString();
      const date = new Date().toISOString();
      return {
        skillName: item.skillName,
        count: getCount(item.skillName, result),
        _id,
        timestamp: date
      };
    })
    .filter((v, i, a) => a.findIndex((t) => t.skillName === v.skillName) === i);
}

function getCount(name, data) {
  return data.filter((item) => item.skillName === name).length;
}

function writeFIle(name, data) {
  fs.writeFile(`./json_files/${name}.json`, JSON.stringify(data), function (err) {
    if (err) throw err;
    console.log("complete", name);
  });
}
