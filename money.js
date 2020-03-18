const puppeteer = require('puppeteer')

const rackupMoney = async (slug) => {

    const browser = await puppeteer.launch({ headless: false })

    try {
        const page = await browser.newPage()

        await page.goto('https://utip.io/' + slug)

    } catch (e) {
        console.log(e)
    }

    //browser.close()
}

function letsGo () {
    if (process.argv.length !== 3) {
        console.warn('Use this program like this: "node money.js <your-utip-slug>"')
    } else {
        const slug = process.argv[2]
        console.log("\n\nLet's run ads on " + slug + "'s page :")
        rackupMoney(slug)
    }
}


letsGo()
