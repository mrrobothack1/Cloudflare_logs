"use strict";
const fs = require("fs");
const { BigQuery } = require("@google-cloud/bigquery");
const { Storage } = require("@google-cloud/storage");
const bigquery = new BigQuery();
const storage = new Storage();
// Folder to process
const FOLDERS = ["PERU"];
const shouldProcessFiles = (path) => {
  return FOLDERS.some((folder) => path.startsWith(folder));
};
const getTable = async (table, schema) => {
  const t = await table.get({
    autoCreate: false,
  });
  if (t) {
    return t;
  }
  console.log("Table does not exists, creating new");
  return table.create({
    schema: {
      fields: schema,
    },
  });
};
async function gcsbq(file, context) {
  const schema = require(`./${process.env.SCHEMA}`);
  const datasetId = process.env.DATASET;
  const tableId = process.env.TABLE;
  const dataset = await bigquery.dataset(datasetId).get({ autoCreate: true });
  const table = await getTable(dataset[0].table(tableId), schema);
  if (file.name.includes("tableMeta") || !shouldProcessFiles(file.name)) {
    return;
  }
  console.log(`Starting job for ${file.name}`);
  await storage
    .bucket(file.bucket)
    .file(file.name)
    .download({ destination: "/tmp/input" });
  const content = fs.readFileSync("/tmp/input").toString();
  if (content) {
    let index = 0;
    const lines = content.split("\n");
    for (const line of lines) {
      if (line) {
        try {
          const row = JSON.parse(line);
          await table[0].insert([row]);
        } catch (e) {
          console.error({
            error: `Failed for ${file.name} at line ${index}`,
            message: e.message,
            stack: e.stack,
            line,
          });
        }
      }
      index += 1;
    }
  }
}
module.exports.gcsbq = gcsbq;