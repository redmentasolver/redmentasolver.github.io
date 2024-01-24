const child_process = require("child_process")
async function setup() {
    child_process.execSync("npm i --save prompt-sync selenium-webdriver geckodriver sha256 chromedriver")
    const prompt = require("prompt-sync")();
    const fs = require("fs")
    const key = prompt("A (titkos) kulcsod: ")
    fs.writeFileSync("api.json", JSON.stringify({"git": key}))
    fs.writeFileSync("ACTIVATECODE.bat", "node activateCode.js")
}
module.exports = {setup}