import { writeFile } from "fs";

const jsonData = {
  buildDate: new Date().getTime(),
};

const jsonContent = JSON.stringify(jsonData);

writeFile("./public/meta.json", jsonContent, "utf8", function (error) {
  if (error) {
    console.log(
      "An error occurred while saving build date and time to meta.json"
    );
    return console.log(error);
  }

  console.log("Latest build date and time updated in meta.json file");
});
