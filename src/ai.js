const fs = require('fs')
const sha256 = require("sha256")

async function sleep(seconds) {
    await new Promise(resolve => {
        setTimeout(resolve, seconds * 1000);
    })
}

async function answerQuestions(keepBeforeAnswers, log) {
    //read questions from file
    let blocks = JSON.parse(fs.readFileSync(__dirname + "/blocks.json", "utf8")).blocks
    const api = JSON.parse(fs.readFileSync(__dirname + "/api.json", { encoding: "utf-8" }))
    const apiKey = sha256(api.git)
    const answers = []
    for(let i = 0; i < blocks.length; i++) {
        console.log(blocks[i])
        const res = await fetch("https://pf5dfco1fk.execute-api.eu-north-1.amazonaws.com/ask", {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                "key": apiKey,
                "block": blocks[i]
            })
        })
        if(res.status == 200) {
            const json = await res.json()
            console.log(json)
            answers.push(json)
        } else {
            console.log("failed", res.status)
        }
    }
    const data = JSON.stringify({"answers": answers})
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
