async function sleep(seconds) {
    await new Promise(resolve => {
        setTimeout(resolve, seconds * 1000);
    })
}

async function update() {
    const info = await getVersionDetails()
    console.log(info)
    const fs = require("fs")
    const prompt = require("prompt-sync")();
    let api = {};
    try {api = require('./api.json')}
    catch {api.git = ""}
    console.log("\u001b[31mITT A KULCSOD EZT MÁSOLD KI MERT A FRISSÍTÉS UTÁN LEHET HOGY ÚJRA KÉRNI FOGJUK!!!\u001b[0m")
    const choice = prompt("EZT MÁSOLD KI: '\u001b[32m" + api.git + "\u001b[0m' (ha itt nincs semmi akkor még nem írtál be kulcsot)\nHa megvagy nyomj ENTER-t vagy ha mégse akarod frissíteni akkor CTRL+C-t\n")
    if(choice === null) return
    for(let fileI = 0; fileI < info.files.length; fileI++){
        console.log("UPDATING: " + info.files[fileI] + "....")
        fs.writeFileSync(info.files[fileI], await getFileContent(info.files[fileI]))
        console.log("\u001b[32mUPDATED: " + info.files[fileI] + "\u001b[0m")
    }
    fs.writeFileSync("api.json", '{"version":"' + info.version + '"}')
}

async function getVersionDetails() {
    try {
        while (true) {
            await sleep(2)
            let res = await fetch("https://redmentasolver.github.io/src/info.json")
            if (res.status === 200) {
                res = await res.json()
                return res
            }
        }
    } catch (err) {
        throw new Error("Error fetching info")
    }
}

async function getFileContent(filename){
    try {
        while (true) {
            await sleep(2)
            console.log("\u001b[33mFETCHING FILE CONTENT... " + filename + "\u001b[0m")
            let res = await fetch("https://redmentasolver.github.io/src/" + filename)
            if (res.status === 200) {
                res = await res.text()
                return res
            }
        }
    } catch (err) {
        throw new Error("Error fetching file: " + filename)
    }
}

function returnHigherVersion(version1, version2){
    console.log(version1, version2)
    version1 = version1.split(".")
    version2 = version2.split(".")
    for(let i = 0; i < version1.length; i++){
        if(Number.isNaN(Number(version1[i]))) return version2.join(".")
        else if(Number.isNaN(Number(version2[i]))) return version1.join(".")
        if(Number(version1[i]) != Number(version2[i])) {
            if(Number(version1[i]) > Number(version2[i])) return version1.join(".")
            else return version2.join(".")
        }
    }
    return version1.join(".")
}

module.exports = {getVersionDetails, returnHigherVersion, update}
