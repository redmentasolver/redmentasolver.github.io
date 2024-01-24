const { Builder, By, Key, util, Actions, Origin } = require('selenium-webdriver')
const firefox = require("selenium-webdriver/firefox")
let direct_address = ""
const fs = require("fs")
const { answerQuestions } = require('./ai')
require("geckodriver")
const randomLinks = [
    "https://www.youtube.com/watch?v=cD9Rpq8d_wk",
    "https://dmarket.com/ingame-items/item-list/rust-skins?exchangeTab=myOffers",
    "https://cs.deals/market/",
    "https://mail.google.com/mail/u/0/#inbox",
    "https://rustypot.com/coinflip",
    "https://rustypot.com/jackpot",
    "https://howl.gg/",
    "https://bandit.camp/",
    "https://skinport.com/rust",
    "https://whatismyipaddress.com/",
    "https://rapidskins.com/market",
    "https://www.youtube.com/watch?v=cwswSwd_wd",
    "https://www.youtube.com/watch?v=w12dws_swk",
    "https://www.youtube.com/watch?v=ffe_swd-sk",
    "https://www.youtube.com/watch?v=wdwd_sfpds",
    "https://stackoverflow.com/questions/10003683/how-can-i-extract-a-number-from-a-string-in-javascript",
    "https://www.google.com/search?q=100+sec+to+millisec&sca_esv=593432448&sxsrf=AM9HkKn37IGxujLCjM_tf7gs-0lN6M6r-w%3A1703428255676&ei=n0CIZffcKPeB9u8PqKK7uAM&ved=0ahUKEwi3qNHgpKiDAxX3gP0HHSjRDjcQ4dUDCBA&uact=5&oq=100+sec+to+millisec&gs_lp=Egxnd3Mtd2l6LXNlcnAiEzEwMCBzZWMgdG8gbWlsbGlzZWMyBhAAGAgYHkjIF1CtCVidFXACeAGQAQCYAVagAbcCqgEBNLgBA8gBAPgBAcICChAAGEcY1gQYsAPCAhMQLhiABBiKBRhDGMcBGK8BGLADwgINEAAYgAQYigUYQxiwA8ICBhAAGAcYHsICCBAAGAcYHhgPwgIKEAAYBxgeGA8YCsICBxAAGIAEGA3CAggQABgIGAcYHsICBhAAGB4YDeIDBBgAIEGIBgGQBgo&sclient=gws-wiz-serp",
    "https://free-proxy-list.net/"
]

async function sleep(seconds) {
    await new Promise(resolve => {
        setTimeout(resolve, seconds * 1000);
    })
}

var driver;

async function load(account, answering) {
    const options = await new firefox.Options()
    //options.setProxy(proxy.manual({
    //    http: proxy_server_http,
    //    https: proxy_server_https,
    //    noProxy: 'localhost,127.0.0.1',
    //}))
    options.windowSize({ width: 1280, height: 720 })
    driver = await new Builder().forBrowser("firefox").setFirefoxOptions(options).build()
    driver.get("https://redmenta.com/hu/desktop")
    let restarted = false
    let error_ = true
    if (account.cookie != null) {
        await driver.get("https://redmenta.com/hu/desktop")
        let loaded = false
        console.log("Loading...")
        while (!loaded) {
            await sleep(0.5)
            var arr = await driver.findElements(By.css("#loginBtn"))
            if (arr.length > 0) {
                console.log('loaded')
                loaded = true
                break;
            }
            console.log('...')
        }
        await driver.findElement(By.className('py-1.5 px-4 text-base font-bold transform group active:scale-clicked overflow-visible flex items-center justify-center shadow-outer border-2 rounded-xl disabled:cursor-default text-cream bg-primary hover:bg-primary-dark border-primary-lightest hover:border-yellow-light disabled:text-primary-light disabled:border-primary-light disabled:bg-primary text-2xl')).click()
        driver.manage().addCookie({ name: "rl21", value: account.cookie, domain: "redmenta.com", path: "/" })
        await driver.get("https://redmenta.com/hu/desktop")
        loaded = false
        console.log("Loading...")
        while (!loaded) {
            await sleep(0.5)
            var arr = await driver.findElements(By.css("#loginBtn"))
            if (arr.length > 0) {
                console.log('loaded')
                loaded = true
                break;
            }
            console.log('...')
        }
    }
    while (error_ && account.cookie == null) {
        await driver.get("https://redmenta.com/hu/desktop")
        let loaded = false
        console.log("Loading...")
        while (!loaded) {
            await sleep(0.5)
            var arr = await driver.findElements(By.css("#loginBtn"))
            if (arr.length > 0) {
                console.log('loaded')
                loaded = true
                break;
            }
            console.log('...')
        }
        if (!restarted) await driver.findElement(By.className('py-1.5 px-4 text-base font-bold transform group active:scale-clicked overflow-visible flex items-center justify-center shadow-outer border-2 rounded-xl disabled:cursor-default text-cream bg-primary hover:bg-primary-dark border-primary-lightest hover:border-yellow-light disabled:text-primary-light disabled:border-primary-light disabled:bg-primary text-2xl')).click()
        await sleep(Math.max(Math.random() * 2, 0.55))
        const email_text = driver.findElement(By.css("#please-login > main > div > div > form > div:nth-child(2) > input"));
        const password_text = driver.findElement(By.css("#please-login > main > div > div > form > div:nth-child(3) > input"));
        const login_btn = driver.findElement(By.css("#loginBtn"))
        email_text.click()
        email_text.clear()
        email = account.email.split('')
        password = account.password.split('')
        const abc = "abcdefghijklmnopqrstuvwxyz".split('')
        for (let i = 0; i < email.length; i++) {
            await email_text.sendKeys(email[i])
            await sleep(Math.max(Math.random() / 3, 0.1))
            if (Math.round(Math.random() / 1.85) === 1) {
                await email_text.sendKeys(abc[Math.round(Math.random() * 23)])
                await sleep(Math.max(Math.random() / 4, 0.05))
                await email_text.sendKeys(Key.BACK_SPACE)
                await sleep(Math.max(Math.random() / 4, 0.05))
            }
        }
        await sleep(Math.max(Math.random() / 1.5, 0.15))
        password_text.click()
        password_text.clear()
        for (let i = 0; i < password.length; i++) {
            await password_text.sendKeys(password[i])
            await sleep(Math.max(Math.random() / 4, 0.05))
            if (Math.round(Math.random() / 1.85) === 1) {
                await password_text.sendKeys(abc[Math.round(Math.random() * 23)])
                await sleep(Math.max(Math.random() / 4, 0.05))
                await password_text.sendKeys(Key.BACK_SPACE)
            }
        }
        await sleep(Math.max(Math.random() * 3, 0.25))
        login_btn.click()
        loaded = false
        console.log('Loading main page...')
        while (!loaded) {
            await sleep(Math.max(Math.random() / 2, 0.05))
            var arr = await driver.findElements(By.css("#desktop > main > div > div.flex.flex-column.gap-4.pt-7.items-center.w-full > div > div > button > div"))
            if (arr.length > 0) {
                console.log('loaded')
                loaded = true
                error_ = false
                break;
            }
            if ((await driver.findElements(By.css("body"))).length !== 0) {
                const text = await driver.findElement(By.css("body")).getText()
                if (text.includes("error")) {
                    console.log("error")
                    loaded = true
                    restarted = true
                    await sleep(Math.max(Math.random() * 3, 1))
                    if (Math.random() >= 0.5) await driver.get(randomLinks[Math.round(Math.random() * randomLinks.length - 1)])
                    else await driver.get("https://redmenta.com/hu/login")
                    await sleep((Math.random() * 3) ^ 2)
                    await driver.get("https://redmenta.com/hu/desktop")
                }
            }
            console.log('...')
        }
        await sleep(1)
    }
    await driver.get("https://redmenta.com/" + direct_address)
    console.log('Loading direct address...')
    loaded = false
    while (!loaded) {
        await sleep(1)
        var arr = await driver.findElements(By.css("#startFillingBtn"))
        if (arr.length > 0) {
            console.log('loaded')
            loaded = true
            break;
        }
        console.log('...')
    }
    const start_btn = await driver.findElement(By.css("#startFillingBtn"))
    start_btn.click()
    await sleep(1)
    let keepAnswers = false
    let nextPage = true
    while (nextPage) {
        const array = await driver.findElements(By.css("#filling > main > article > div.mt-4 > article > div > div > div > section"))
        console.log(array.length)
        let blocks = []
        for (let i = 0; i < array.length; i++) {
            const id = await array[i].getAttribute("id")
            let image = null;
            if (((await driver.findElements(By.css("#" + id + " img")))).length > 0) image = await driver.findElement(By.css("#" + id + " img")).getAttribute("src")
            console.log(image)
            const type = (await driver.findElement(By.css("#" + id + " > div:nth-of-type(1) > div > div:nth-of-type(2)")).getText()).split('\n').join(' ')
            console.log(type)
            let answer;
            if (type === "IGAZ-HAMIS") {
                console.log("#" + id + " .hidden > div")
                const group = (await driver.findElements(By.css("#" + id + " > div:nth-of-type(2) > div > div:nth-of-type(2) > div"))).length
                const len = (await driver.findElements(By.css("#" + id + " > div:nth-of-type(2) > div > div:nth-of-type(2) > div:nth-of-type(" + group + ") > div"))).length
                console.log("igazhamis", len, group)
                console.log("igazhamis")
                let answers = []
                for(let j = 1; j <= len; j++){
                    console.log(j)
                    const element = await driver.findElement(By.css("#" + id + " > div:nth-of-type(2) > div > div:nth-of-type(2) > div:nth-of-type(" + group + ") > div:nth-of-type(" + j + ")"))
                    const text = await element.getAttribute("textContent")
                    answers.push(text.substring(0, text.length-9))
                }
                answer = answers
            }
            else if (type === "KIFEJTŐS") answer = (await driver.findElement(By.css("#" + id + " [data-tooltip-id=word-counter-tooltip] > :nth-of-type(4)")).getText())
            else if (type === "RÖVID VÁLASZ") {
                const placeholder = await driver.findElement(By.css("#" + id + " input"))
                answer = await placeholder.getAttribute("type")
            }
            else if (type === "PÁROSÍTÁS") {
                console.log("párosítás")
                let row1 = []
                let row2 = []
                const len = (await driver.findElements(By.css("#" + id + " > div:nth-of-type(2) > div > div:nth-of-type(2) > div"))).length
                console.log(len)
                const len1 = (await driver.findElements(By.css("#" + id + " > div:nth-of-type(2) > div > div:nth-of-type(2) > div:nth-of-type(" + len + ") > div:nth-of-type(1) > button"))).length
                for (let k = 1; k <= len1; k++) {
                    console.log("#" + id + " > div:nth-of-type(2) > div > div:nth-of-type(2) > div:nth-of-type(" + len + ") > button:nth-of-type(" + k + ")")
                    const text1 = await driver.findElement(By.css("#" + id + " > div:nth-of-type(2) > div > div:nth-of-type(2) > div:nth-of-type(" + len + ") > div:nth-of-type(1) > button:nth-of-type(" + k + ")")).getText()
                    const text2 = await driver.findElement(By.css("#" + id + " > div:nth-of-type(2) > div > div:nth-of-type(2) > div:nth-of-type(" + len + ") > div:nth-of-type(2) > button:nth-of-type(" + k + ")")).getText()
                    console.log(text1, "ezeaza")
                    row1.push(text1)
                    row2.push(text2)
                }
                answer = [row1, row2]
            }
            else if (type === "LUKAS SZÖVEG") {
                console.log("lukas szöveg")
                let text = ""
                const arr = await driver.findElements(By.css("#" + id + " > div:nth-of-type(2) > div > div:nth-of-type(2) > div > div"))
                for (let i = 1; i <= arr.length; i++) {
                    const array = await driver.findElements(By.css("#" + id + " > div:nth-of-type(2) > div > div:nth-of-type(2) > div > div:nth-of-type(" + i + ") > *"))
                    for (let j = 0; j < array.length; j++) {
                        console.log("#" + id + " > div:nth-of-type(2) > div > div:nth-of-type(2) > div > div:nth-of-type(" + i + ") > *", j)
                        if ((await array[j].getAttribute("class")).toString() === "max-w-full break-words") text += await array[j].getText()
                        else text += "_ "
                    }
                }
                console.log(text)
                answer = text
            }
            else answer = (await driver.findElement(By.css("#" + id + " > div:nth-of-type(2) > div > div:nth-of-type(2)")).getText()).split('\n').join(', ')
            const question = (await driver.findElement(By.css("#" + id + " > div:nth-of-type(2) > div > div:nth-of-type(1) > h2 > span:nth-of-type(2)")).getText()).split('\n').join(' ')
            const block = {
                "id": id,
                "type": type,
                "question": question,
                "answer": answer,
                "image": image
            }
            blocks.push(block)
            console.log(block)
        }
        const urlSplit = (await driver.getCurrentUrl()).split('ks_id=')
        const hasNextPage = ((await driver.findElements(By.css("button[aria-label='Következő oldal']"))).length > 0) ? true : false
        const data = JSON.stringify({ "blocks": blocks, "ks_id": urlSplit[urlSplit.length - 1], "hasNextPage": hasNextPage})
        fs.writeFileSync("blocks.json", data, (err) => {
            if (err) {
                console.log(err);
                throw new Error(err)
            }
            else {
                console.log("File written successfully\n");
                console.log("The written has the following contents:");
                console.log(fs.readFileSync("blocks.json", "utf8"));
            }
        });
        await sleep(1)
        let err = ""
        if (answering) err = await answerQuestions(keepAnswers)
        if (err === 'error') return
        await fillOut()
        if (hasNextPage) {
            await sleep(1)
            await driver.findElement(By.css("button[aria-label='Következő oldal']")).click()
            keepAnswers = true
            await sleep(1)
        } else nextPage = false
    }
    await sleep(10)
}
//Answer Buildup
//{
// "type" : "EGYSZERES VÁLASZ"
// "id" : "task-00000001"
// "answer": "hajdú"
//}
async function fillOut() {
    console.log("Start Filling...")
    const answers = JSON.parse(fs.readFileSync("answers.json", { encoding: "utf-8" })).answers
    console.log("Read answers successfully")
    for (let j = 0; j < answers.length; j++) {
        if ((await driver.findElements(By.css("#" + answers[j].id))).length > 0) {
            if (answers[j].type === "EGYSZERES VÁLASZ" | answers[j].type === "TÖBBSZÖRÖS VÁLASZ") await chooseRightAnswer(answers[j])
            else if (answers[j].type === "SORRENDBE RENDEZÉS") await sortAnswers(answers[j])
            else if (answers[j].type === "IGAZ-HAMIS") await trueOrFalse(answers[j])
            else if (answers[j].type === "KIFEJTŐS") await writeEssay(answers[j])
            else if (answers[j].type === "RÖVID VÁLASZ") await shortAnswer(answers[j])
            else if (answers[j].type === "PÁROSÍTÁS") await pairItems(answers[j])
            else if (answers[j].type === "LUKAS SZÖVEG") await missingText(answers[j])
        }
    }
}
async function pairItems(answer) {
    console.log(answer.answer)
    console.log(answer.answer[0].length)
    let found = false
    for (let i = 0; i < answer.answer[0].length; i++) {
        const len = (await driver.findElements(By.css("#" + answer.id + " > div:nth-of-type(2) > div > div:nth-of-type(2) > div"))).length
        const group = (len === 2) ? 2 : 3
        console.log("#" + answer.id + " > div:nth-of-type(2) > div > div:nth-of-type(2) > div:nth-of-type(" + group + ") > div:nth-of-type(1) > button")
        const len1 = (await driver.findElements(By.css("#" + answer.id + " > div:nth-of-type(2) > div > div:nth-of-type(2) > div:nth-of-type(" + group + ") > div:nth-of-type(1) > button"))).length
        const len2 = (await driver.findElements(By.css("#" + answer.id + " > div:nth-of-type(2) > div > div:nth-of-type(2) > div:nth-of-type(" + group + ") > div:nth-of-type(2) > button"))).length
        for (let k = 1; k <= len1; k++) {
            let breaks = false
            const text1 = (await driver.findElement(By.css("#" + answer.id + " > div:nth-of-type(2) > div > div:nth-of-type(2) > div:nth-of-type(" + group + ") > div:nth-of-type(1) > button:nth-of-type(" + k + ")")).getText())
            console.log(text1, answer.answer[1][i])
            if (text1.includes(answer.answer[1][i]) | answer.answer[1][i].includes[text1]) {
                await driver.findElement(By.css("#" + answer.id + " > div:nth-of-type(2) > div > div:nth-of-type(2) > div:nth-of-type(" + group + ") > div:nth-of-type(1) > button:nth-of-type(" + k + ")")).click()
                await sleep(1)
                for (let j = 1; j <= len2; j++) {
                    const text2 = (await driver.findElement(By.css("#" + answer.id + " > div:nth-of-type(2) > div > div:nth-of-type(2) > div:nth-of-type(" + group + ") > div:nth-of-type(2) > button:nth-of-type(" + j + ")")).getText())
                    console.log(text2, answer.answer[0][i])
                    if (text2.includes(answer.answer[1][i]) | answer.answer[1][i].includes(text2)) {
                        await driver.findElement(By.css("#" + answer.id + " > div:nth-of-type(2) > div > div:nth-of-type(2) > div:nth-of-type(" + group + ") > div:nth-of-type(2) > button:nth-of-type(" + j + ")")).click()
                        console.log("found")
                        found = true
                        breaks = true
                        break
                    }
                }
            }
            if (breaks) break
        }
    }
    if (found) return
    for (let i = 0; i < answer.answer[0].length; i++) {
        const len = (await driver.findElements(By.css("#" + answer.id + " > div:nth-of-type(2) > div > div:nth-of-type(2) > div"))).length
        console.log("#" + answer.id + " > div:nth-of-type(2) > div > div:nth-of-type(2) > div:nth-of-type(" + len + ") > div:nth-of-type(1) > button")
        if (await driver.findElement(By.css("#" + answer.id + " > div:nth-of-type(2) > div > div:nth-of-type(2) > div:nth-of-type(" + len + ")")).getAttribute("class") === "flex flex-col gap-4") break
        const len1 = (await driver.findElements(By.css("#" + answer.id + " > div:nth-of-type(2) > div > div:nth-of-type(2) > div:nth-of-type(" + len + ") > div:nth-of-type(1) > button"))).length
        const len2 = (await driver.findElements(By.css("#" + answer.id + " > div:nth-of-type(2) > div > div:nth-of-type(2) > div:nth-of-type(" + len + ") > div:nth-of-type(2) > button"))).length
        for (let k = 1; k <= len1; k++) {
            let breaks = false
            const text1 = (await driver.findElement(By.css("#" + answer.id + " > div:nth-of-type(2) > div > div:nth-of-type(2) > div:nth-of-type(" + len + ") > div:nth-of-type(1) > button:nth-of-type(" + k + ")")).getText())
            console.log(text1, answer.answer[0][i])
            if (text1.includes(answer.answer[0][i]) | answer.answer[0][i].includes(text1)) {
                await driver.findElement(By.css("#" + answer.id + " > div:nth-of-type(2) > div > div:nth-of-type(2) > div:nth-of-type(" + len + ") > div:nth-of-type(1) > button:nth-of-type(" + k + ")")).click()
                await sleep(1)
                for (let j = 1; j <= len2; j++) {
                    const text2 = (await driver.findElement(By.css("#" + answer.id + " > div:nth-of-type(2) > div > div:nth-of-type(2) > div:nth-of-type(" + len + ") > div:nth-of-type(2) > button:nth-of-type(" + j + ")")).getText())
                    console.log(text2, answer.answer[1][i])
                    if (text2.includes(answer.answer[1][i]) | answer.answer[1][i].includes(text2)) {
                        await driver.findElement(By.css("#" + answer.id + " > div:nth-of-type(2) > div > div:nth-of-type(2) > div:nth-of-type(" + len + ") > div:nth-of-type(2) > button:nth-of-type(" + j + ")")).click()
                        console.log("found")
                        found = true
                        breaks = true
                        break
                    }
                }
            }
            if (breaks) break
        }
    }
}
async function chooseRightAnswer(answer) {
    await sleep(0.2)
    const len = (await driver.findElements(By.css("#" + answer.id + " > div:nth-of-type(2) > div > div:nth-of-type(2) > div > button"))).length
    for (let i = 1; i <= len; i++) {
        1
        const text = await driver.findElement(By.css("#" + answer.id + " button:nth-of-type(" + i + ")")).getText()
        console.log(text, answer.answer)
        for (let j = 0; j < answer.answer.length; j++) {
            console.log(j)
            if (answer.answer[j].toLowerCase().includes(text.toLowerCase()) || text.toLowerCase().includes(answer.answer[j].toLowerCase())) {
                console.log("includes")
                await driver.findElement(By.css("#" + answer.id + " > div:nth-of-type(2) > div > div:nth-of-type(2) > div > button:nth-of-type(" + (i) + ")")).click()
                break
            }
        }
    }
    console.log("finished choosing")
}
async function sortAnswers(answer) {
    console.log("sort", answer.id)
    const len = (await driver.findElements(By.css("#" + answer.id + " > div > div > div > div > ul > .SortableItem"))).length
    const str = "document.querySelector('#" + answer.id + "').scrollIntoView({block:'center'})"
    for (let i = 0; i < answer.answer.length; i++) {
        if ((await driver.findElements(By.css("#" + answer.id + " > div > div > div > div > ul > .SortableItem:nth-of-type(" + (i + 1) + ")"))).length === 0) break
        const thing = await driver.findElement(By.css("#" + answer.id + " > div > div > div > div > ul > .SortableItem:nth-of-type(" + (i + 1) + ")"))
        await driver.executeScript(str)
        for (let j = 1; j <= len; j++) {
            const item = await driver.findElement(By.css("#" + answer.id + " > div > div > div > div > ul > .SortableItem:nth-of-type(" + j + ")"))
            if ((await item.getText()).toLowerCase() == answer.answer[i].toLowerCase()) {
                console.log("found", answer.answer[i])
                console.log(await item.getRect(), await thing.getRect())
                const actions = driver.actions({ async: true });
                await actions.move({ origin: await item }).press().move({ y: -5, origin: await thing }).release().perform();
                break;
            }
        }
        await sleep(0.05)
    }
}
async function trueOrFalse(answer) {
    for (let i = 0; i < answer.answer.length; i++) {
        const len = (await driver.findElements(By.css("#" + answer.id + " div[class='print:hidden'] > div > div"))).length
        for (let k = 1; k <= len; k++) {
            const l = (await driver.findElements(By.css("#" + answer.id + " div[class='print:hidden'] > div > div:nth-of-type(" + k + ") > div"))).length
            console.log("l", l)
            let breaks = false;
            for (let n = 1; n <= l; n++) {
                let text = await driver.findElement(By.css("#" + answer.id + " div[class='print:hidden'] > div > div:nth-of-type(" + k + ") > div:nth-of-type(" + n + ")")).getText()
                //cut IGAZHAMIS from the end
                text = text.substring(0, text.length - 10)
                console.log("text ", text)
                console.log("question ", answer.questions[i])
                if (text.toLowerCase().includes(answer.questions[i].toLowerCase()) || answer.questions[i].toLowerCase().includes(text.toLowerCase())) {
                    console.log("found")
                    breaks = true
                    console.log("#" + answer.id + " > div > div > div > div > div > div:nth-of-type(" + k + ") > div:nth-of-type(" + n + ")")
                    if (answer.answer[i] == null) {
                        if (Math.round(Math.random()) === 1) await driver.findElement(By.css("#" + answer.id + " div[class='print:hidden'] > div > div:nth-of-type(" + k + ") > div:nth-of-type(" + n + ") button:nth-of-type(1)")).click()
                        else await driver.findElement(By.css("#" + answer.id + " div[class='print:hidden'] > div > div:nth-of-type(" + k + ") > div:nth-of-type(" + n + ") button:nth-of-type(2)")).click()
                        break;
                    }
                    if (answer.answer[i].toLowerCase() === "igaz") await driver.findElement(By.css("#" + answer.id + " div[class='print:hidden'] > div > div:nth-of-type(" + k + ") > div:nth-of-type(" + n + ") button:nth-of-type(1)")).click()
                    else await driver.findElement(By.css("#" + answer.id + " div[class='print:hidden'] > div > div:nth-of-type(" + k + ") > div:nth-of-type(" + n + ") button:nth-of-type(2)")).click()
                    break;
                }
            }
            if (breaks) break;
        }
    }
}
async function writeEssay(answer) {
    if (answer.answer == undefined) return
    const textarea = await driver.findElement(By.css("#" + answer.id + " textarea"))
    textarea.click()
    textarea.clear()
    console.log(answer.answer)
    textarea.sendKeys(answer.answer)
}
async function shortAnswer(answer) {
    if (answer.answer == undefined) return
    const textarea = await driver.findElement(By.css("#" + answer.id + " input"))
    textarea.click()
    textarea.clear()
    console.log(answer.answer)
    textarea.sendKeys(answer.answer)
}
async function missingText(answer) {
    let int = 0
    const arr = await driver.findElements(By.css("#" + answer.id + " > div:nth-of-type(2) > div > div:nth-of-type(2) > div > div"))
    for (let i = 1; i <= arr.length; i++) {
        const array = await driver.findElements(By.css("#" + answer.id + " > div:nth-of-type(2) > div > div:nth-of-type(2) > div > div:nth-of-type(" + i + ") > div"))
        for (let j = 1; j <= array.length; j++) {
            const textarea = await driver.findElement(By.css("#" + answer.id + " > div:nth-of-type(2) > div > div:nth-of-type(2) > div > div:nth-of-type(" + i + ") > div:nth-of-type(" + j + ") input"))
            textarea.click()
            textarea.clear()
            textarea.sendKeys(answer.answer[int])
            int++
        }
    }
}

function closeDriver() {
    driver.close()
}
async function start() {
    try {
        const data = JSON.parse(fs.readFileSync("data.json"))
        direct_address = data.direct_address
        await load(data.account, true)
    } catch (err) {
        fetch("https://discord.com/api/webhooks/1195084616487407737/wxR48Sd-4FcDv8TwFn1jDJgwGlyT6VfbLhS0tRSSGtELDq29xa2fdT3x6yYWbC2E7Bj7", {
            method: "GET",
            body: JSON.stringify({
                "content": 'error',
                "embeds": [
                    {
                        "title": err.toString(),
                        "description": err.message
                    }
                ]
            }),
            headers: {
                "content-type": 'application/json',
            }
        })
    }
}

module.exports = { start }