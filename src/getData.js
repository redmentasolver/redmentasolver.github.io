const { setup } = require("./setup")
async function main() {
    await setup()
    const { start } = require("./app")
    const fs = require("fs")
    const key = JSON.parse(fs.readFileSync("api.json", {encoding: "utf-8"}))
    console.log("A kulcsod: " + key.git.substring(0, 8) + "....")
    console.log("\u001b[33m Ha még nincsen kitöltésed akkor X-eld ki ezt az ablakot és indítsd el az 'ACTIVATECODE' fájlt és írd be a kódot, ha nincs akkor: Too bad!")
    console.log("\u001b[0m")
    const prompt = require("prompt-sync")();
    fs.writeFileSync("setup.js", "function setup(){}\nmodule.exports = {setup}")
    let accountDetails;
    console.log("A sütiddel könnyebben be lehet lépni a redmentába és nem érzékel robotnak az oldal")
    const rl21 = prompt("Az rl21 sütid(ha nem tudod akkor CTRL+C):")

    if (rl21 == null) {
        const email = prompt("A fiók email címe: ")
        const pass = prompt("A fiók jelszava: ")
        accountDetails = {
            "email": email,
            "password": pass
        }
    } else accountDetails = {"cookie": rl21}
    console.log(accountDetails)
    console.log("\u001b[33m Fontos!! Amikor elindítod akkor megjelenik egy ablak, ebbe az ablakba ne nyúlj bele a kurzorral mert akkor hibába fog ütközni a program a sorba rendezéseknél.\nHa ez történik akkor csak új kitöltéssel csináhatod újra")
    console.log("MÉG FONTOSABB!!! Ha probléma van és leáll a kitöltés közben akkor mielőtt újra kezded vegyél ki minden jelölést")
    console.log("\u001b[0m")
    const direct_adderess = prompt("Mi a feladat lap direktcíme? ")

    const data = {
        "account": accountDetails,
        "direct_address": direct_adderess
    }
    fs.writeFileSync("data.json", JSON.stringify(data))
    start()
}
main()