const {exec} = require('child_process')
const puppeteer = require('puppeteer')

const rackupMoney = async (slug, show) => {

    const browser = await puppeteer.launch(
        {
            headless: ! show,
            args: ['--proxy-server=socks5://127.0.0.1:9050']
        }
    )

    const testPage = await browser.newPage()
    await testPage.goto('https://check.torproject.org/')
    const isUsingTor = await testPage.$eval('body', el =>
        el.innerHTML.includes('Congratulations. This browser is configured to use Tor')
    )
    
    if (isUsingTor) {
        console.log('Puppeteer using tor, all good.')
    } else {
        console.log('Not using Tor. Closing...')
        return await browser.close()
    }
    
    testPage.close()

    try {
        const page = await browser.newPage()

        page.goto('https://utip.io/' + slug, {waitUntil: 'networkidle2', timeout: 0})

        await page.waitFor(30000)
    
        await page.click(
            'img[src="https://cdn.utip.eu/build/images/play_white.2549a3e4.svg"]',
        )

        await page.waitFor(60000)

        const success = await page.evaluate(() => {
            return document.querySelector('button-no-style.button-donation.button-donation-mobile') !== null
        })

        if (success) {
            await page.click(
                '.yellow-btn.button-no-style',
            )

            console.log('Money credited !')

            await page.waitFor(10000)
        } else {
            // No ads maybe ?
        }

    } catch(e) {
        console.error(e)
    }

    browser.close()
}

function letsGo () {

    if (process.argv.length < 3) {

        console.warn('Use this program like this: "node money.js <your-utip-slug> <options: show>"')

    } else {

        console.log('\n\nClear previous tor...\n\n\n\n')

        exec('taskkill /IM "tor.exe" /F', (error, stdout, stderr) => {
            if (! error && stdout && ! stderr) {
                console.log('Tor stopped')
            } else {
                console.log('Tor couldn\'t be stopped, probably already stopped')
            }

            console.log('Starting tor...')

            exec('tor&', (error, stdout, stderr) => {

                if (! error && stdout && ! stderr) {
                    console.log('Tor started')
                } else {
                    console.error('Error while starting tor, please make sure tor is started')
                }

            })

            setTimeout(() => {

                const slug = process.argv[2]
                const show = process.argv.length > 3 && process.argv[3] === 'show'
                console.log("Let's run an ad on " + slug + "'s page :")

                rackupMoney(slug, show).then(() => {
                    letsGo()
                })

            }, 2000)

        })
    }
}

letsGo()
