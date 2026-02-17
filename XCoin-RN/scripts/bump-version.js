const fs = require("fs");
const path = require("path");

const appJsonPath = path.resolve(__dirname, "../app.json");
const appJson = JSON.parse(fs.readFileSync(appJsonPath, "utf8"));

// Increment version (patch)
const [major, minor, patch] = appJson.expo.version.split(".").map(Number);
appJson.expo.version = `${major}.${minor}.${patch + 1}`;

// Increment versionCode
if (!appJson.expo.android) appJson.expo.android = {};
if (!appJson.expo.android.versionCode) appJson.expo.android.versionCode = 1;
appJson.expo.android.versionCode += 1;

fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2) + "\n");
console.log(
  `Updated to version ${appJson.expo.version} and versionCode ${appJson.expo.android.versionCode}`,
);
