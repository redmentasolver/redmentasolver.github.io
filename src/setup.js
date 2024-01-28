const child_process = require("child_process")
async function setup() {
    child_process.execSync("npm i --save prompt-sync selenium-webdriver geckodriver sha256 chromedriver")
    const prompt = require("prompt-sync")();
    const fs = require("fs")
    const update = require("./update")
    let key = null
    try{
        const api = JSON.parse(fs.readFileSync(__dirname + "/api.json"))
        if(api.git == null) throw new Error()
        console.log("Megtaláltuk ezt a kulcsot a fájlok között: '\u001b[32m" + api.git + "\u001b[0m' Szeretnéd ezt használni?")
        const choice = prompt("ENTER ha igen CTRL+C ha nem")
        if(choice == null) throw new Error()
        else key = api.git
    } catch(err){
        key = prompt("A (titkos) kulcsod: ")
    }
    fs.writeFileSync(__dirname + "/api.json", JSON.stringify({"git": key, "version": (await update.getVersionDetails()).version}))
    fs.writeFileSync("ACTIVATECODE.bat", "node activateCode.js")
}
module.exports = {setup}
