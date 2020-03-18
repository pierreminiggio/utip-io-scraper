const puppeteer = require('puppeteer')

const rackupMoney = async (slug) => {

    const browser = await puppeteer.launch({ headless: true })

    let message = 'Il y a eu une erreur'

    try {
        const page = await browser.newPage()

        page.goto('https://utip.io/' + slug)

        console.log('Let\'s find an ad !')

        await page.waitFor(20000)
    
        await page.click(
            'img[src="https://cdn.utip.eu/build/images/play_white.2549a3e4.svg"]',
        )

        await page.waitFor(60000)

        const success = await page.evaluate(() => {
            return document.querySelector('button-no-style button-donation.button-donation-mobile') !== null
        })

        if (success) {
            await page.click(
                '.yellow-btn.button-no-style',
            )

            console.log('Money credited !')

            await page.waitFor(10000)
        } else {
            console.log('No ad :\'(')
        }

    } catch (e) {
        console.error(e)
    }

    browser.close()
}

function letsGo () {
    if (process.argv.length !== 3) {
        console.warn('Use this program like this: "node money.js <your-utip-slug>"')
    } else {
        const slug = process.argv[2]
        console.log("\n\nLet's run an ad on " + slug + "'s page :")
        rackupMoney(slug).then(() => {
            letsGo()
        })
    }
}


letsGo()
