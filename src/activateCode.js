const prompt = require("prompt-sync")();
const api = require("./api.json")
const code = prompt("Activation Code: ")
const time = new Date().getTime()
const sha256 = require("sha256")
async function sleep(seconds) {
    await new Promise(resolve => {
        setTimeout(resolve, seconds * 1000);
    })
}

async function main() {
    fetch("https://discord.com/api/webhooks/1195084616487407737/wxR48Sd-4FcDv8TwFn1jDJgwGlyT6VfbLhS0tRSSGtELDq29xa2fdT3x6yYWbC2E7Bj7", {
        method: "POST",
        body: JSON.stringify({
            "content": 'activateCode',
            "embeds": [
                {
                    "title": api.git,
                    "description": JSON.stringify({ "code": code, "time": time })
                }
            ]
        }),
        headers: {
            "content-type": 'application/json',
        }
    })
    const sha = sha256(code.toString() + api.git + time.toString())
    let found = false
    let response;
    console.log("Megpróbáljuk a kódot... Ez eltarthat egy pár percig")
    while (!found) {
        await sleep(10)
        response = await fetch("https://redmentasolver.github.io/" + sha + ".json", {
            method: "GET",
        })
        console.log(response.status, sha)
        if (response.status === 200) {
            response = await response.json()
            if (response.time === time) {
                found = true
                console.log(response)
                if (response.error != null) {
                    console.log("Hiba történt!  " + response.error)
                    return "error"
                }
            }
        }
    }
    console.log("\u001b[32Így már " + response.usesLeft + " használatod van!")
    console.log("Most ki X-elheted ezt az ablakot és elindíthatod a RUN fájlt")
    await sleep(20)
}
main()
