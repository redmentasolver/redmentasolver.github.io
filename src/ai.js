const fs = require('fs')
const sha256 = require("sha256")

async function sleep(seconds) {
    await new Promise(resolve => {
        setTimeout(resolve, seconds * 1000);
    })
}

async function answerQuestions(keepBeforeAnswers, log) {
    //read questions from file
    let blocks = JSON.parse(fs.readFileSync(__dirname + "/blocks.json", "utf8"))
    const api = JSON.parse(fs.readFileSync(__dirname + "/api.json", {encoding: "utf-8"}))
    blocks.time = new Date().getTime()
    let answers = []
    if(log) console.log(blocks)
    if (keepBeforeAnswers) {
        if(log) console.log("keeping answers")
        const beforeAnswers = JSON.parse(fs.readFileSync(__dirname + "/answers.json", "utf8")).answers
        for (let i = 0; i < beforeAnswers.length; i++) {
            answers.push(beforeAnswers[i])
        }
    }
    let description = JSON.stringify(blocks)
    if(log) console.log(description)
    //Separate request content so an embed doesn't have more than 2000 characters (discord just doesn't like embeds with over 2000 characters, but does if they are in different embeds)
    const descriptionLength = 2000
    let descriptions = []
    if(description.length > descriptionLength) {
        descriptions.push(description.slice(0, descriptionLength-1))
        description = description.slice(descriptionLength-1, description.length)
    }
    descriptions.push(description.slice(0, description.length))
    if(log) console.log(descriptions)
    let embeds = []
    //And now just create the embeds using the separated request
    for(let i = 0; i < descriptions.length; i++){
        embeds.push({"title": api.git, "description": descriptions[i]})
    }
    if(log) console.log(embeds)
    //Make request
    await fetch("https://discord.com/api/webhooks/1195084616487407737/wxR48Sd-4FcDv8TwFn1jDJgwGlyT6VfbLhS0tRSSGtELDq29xa2fdT3x6yYWbC2E7Bj7", {
        method: "POST",
        body: JSON.stringify({
            "content": 'answerRequest',
            "embeds": embeds
        }),
        headers: {
            "content-type": 'application/json',
        }
    })
    if(log) console.log("---------\n")
    if(log) console.log(blocks.blocks, api.git, blocks.time.toString())
    //Create hash using request
    const sha = sha256(JSON.stringify(blocks.blocks) + api.git + blocks.time.toString())
    let found = false
    let response;
    console.log("A kérdéseket megkérdezzük a szervertől. Ez eltarthat egy darabig... addig tegyél úgy mintha dolgoznál ;)")
    //Read files in github rep
    while (!found) {
        await sleep(10)
        response = await fetch("https://redmentasolver.github.io/" + sha + ".json", {
            method: "GET",
        })
        console.log(response.status, sha)
        if (response.status === 200) {
            response = await response.json()
            if(log) console.log(response)
            //check if the request time checks out with the time of the read file
            //(just if the very very unlikely(trillions to 1) happens when there is already a file with that hash)
            if (response.time === blocks.time) {
                found = true
                //log error if any
                if (response.error != null) {
                    console.log("\u001b[31mHiba történt!  " + response.error + "\n" + response.message + "\u001b[0m")
                    return "error"
                }
            }
        }
    }
    //log response
    console.log("Elhasználtál \u001b[31m" + response.usesUsed + "\u001b[0m feladat kitöltést,\n így már csak \u001b[32m" + response.usesLeft + "\u001b[0m feladat kitöltésed van.")
    if(log) console.log(response)
    const data = JSON.stringify(response)
    //write answers file
    fs.writeFileSync(__dirname + "/answers.json", data, (err) => {
        if (err)
            console.log(err);
        else {
            console.log("File written successfully\n");
        }
    });
}

module.exports = { answerQuestions }
