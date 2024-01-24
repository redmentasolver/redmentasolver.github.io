const fs = require('fs')
const sha256 = require("sha256")

async function sleep(seconds) {
    await new Promise(resolve => {
        setTimeout(resolve, seconds * 1000);
    })
}

async function answerQuestions(keepBeforeAnswers) {
    let blocks = JSON.parse(fs.readFileSync("blocks.json", "utf8"))
    const api = JSON.parse(fs.readFileSync("api.json", {encoding: "utf-8"}))
    blocks.time = new Date().getTime()
    let answers = []
    console.log(blocks)
    if (keepBeforeAnswers) {
        console.log("keeping answers")
        const beforeAnswers = JSON.parse(fs.readFileSync("answers.json", "utf8")).answers
        for (let i = 0; i < beforeAnswers.length; i++) {
            answers.push(beforeAnswers[i])
        }
    }
    let description = JSON.stringify(blocks)
    console.log(description)
    const descriptionLength = 2000
    let descriptions = []
    if(description.length > descriptionLength) {
        descriptions.push(description.slice(0, descriptionLength-1))
        description = description.slice(descriptionLength-1, description.length)
    }
    descriptions.push(description.slice(0, description.length))
    console.log(descriptions)
    let embeds = []
    for(let i = 0; i < descriptions.length; i++){
        embeds.push({"title": api.git, "description": descriptions[i]})
    }
    console.log(embeds)
    const res = await fetch("https://discord.com/api/webhooks/1195084616487407737/wxR48Sd-4FcDv8TwFn1jDJgwGlyT6VfbLhS0tRSSGtELDq29xa2fdT3x6yYWbC2E7Bj7", {
        method: "POST",
        body: JSON.stringify({
            "content": 'answerRequest',
            "embeds": embeds
        }),
        headers: {
            "content-type": 'application/json',
        }
    })
    console.log("---------\n")
    console.log(blocks.blocks, api.git, blocks.time.toString())
    const sha = sha256(JSON.stringify(blocks.blocks) + api.git + blocks.time.toString())
    let found = false
    let response;
    console.log("A kérdéseket megkérdezzük a szervertől. Ez eltarthat egy darabig... addig tegyél úgy mintha dolgoznál ;)")
    while (!found) {
        await sleep(10)
        response = await fetch("https://redmentasolver.github.io/" + sha + ".json", {
            method: "GET",
        })
        console.log(response.status, sha)
        if (response.status === 200) {
            response = await response.json()
            console.log(response)
            if (response.time === blocks.time) {
                found = true
                if (response.error != null) {
                    console.log(response.error + "\u001b[31m")
                    if(response.error === "noUses") console.log("Nincsen kitöltésed!")
                    if(response.error === "noKey") console.log("Nem találjuk a kulcsodat az adatbázisban")
                    console.log("\u001b[0m")
                    return "error"
                }
            }
        }
    }
    console.log(response)
    const data = JSON.stringify(response)
    fs.writeFileSync("answers.json", data, (err) => {
        if (err)
            console.log(err);
        else {
            console.log("File written successfully\n");
        }
    });
}

module.exports = { answerQuestions }
