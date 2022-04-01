const puppeteer = require("puppeteer")
const { Temporal } = require("@js-temporal/polyfill")

const start = async (dates, nights, private) => {
    allHotels = []
    const people = 4
    const Priv = Number(private)
    let privateQuery = ""
    let roomType = "-"
    if (Priv == 2) {
        privateQuery = "&nflt=rpt%3D1"
        roomType = "P"
    }

    const browser = await puppeteer.launch({ args: ["--no-sandbox"] }) // deployed
    // const browser = await puppeteer.launch({ headless: false }) //to view the page in development
    const page = await browser.newPage()
    await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36"
    )
    // await page.setViewport({ width: 1000, height: 1600 }) // use these settings in development mode, when needed to inspect the page
    for (let j = 1; j < people + 1; j++) {
        const checkInDateTemp = Temporal.PlainDate.from({
            year: dates.year,
            month: dates.month,
            day: dates.day,
        })
        const checkInDate = checkInDateTemp.toString()
        const checkOutDate = checkInDateTemp
            .add({ days: Number(nights) })
            .toString()

        url = `https://www.booking.com/searchresults.html?ss=Haad+Rin&ssne=Haad+Rin&ssne_untouched=Haad+Rin&label=gen173nr-1FCAEoggI46AdIM1gEaIgBiAEBmAExuAEXyAEM2AEB6AEB-AECiAIBqAIDuAKMu-ORBsACAdICJGI0NmFkOTc0LWQ0MzEtNDM2Yi04MzBmLWE0NmJjOTQ2ZmQyZtgCBeACAQ&sid=d4e0e21c8c8f2fed3e94446ddf676a26&aid=304142&lang=en-us&sb=1&src_elem=sb&src=searchresults&dest_id=900050772&dest_type=city&checkin=${checkInDate}&checkout=${checkOutDate}&group_adults=${j}&no_rooms=1&group_children=0&sb_travel_purpose=leisure&order=price&selected_currency=THB${privateQuery}`

        await page.goto(url)
        const propLeft = await page.evaluate(() =>
            document.querySelector("h1.e1f827110f.d3a14d00da").innerText.trim()
        )
        const propertiesLeft = Number(propLeft.replace(/\D/g, ""))
        const hotelData = await page.evaluate(() =>
            Array.from(document.querySelectorAll("div.d20f4628d0")).map(
                (hotel) => {
                    let title = ""
                    try {
                        title = hotel
                            .querySelector("div.fcab3ed991.a23c043802")
                            .innerText.trim()
                    } catch (error) {
                        title: "n/a"
                    }
                    let price = ""
                    try {
                        price = hotel
                            .querySelector("span.fcab3ed991.bd73d13072")
                            .innerText.replaceAll("THB", "")
                            .replaceAll(",", "")
                            .replaceAll(" ", "")
                            .trim()
                    } catch (error) {
                        price: "n/a"
                    }
                    let rating = ""
                    try {
                        rating = hotel
                            .querySelector("div.b5cd09854e.d10a6220b4")
                            .innerText.trim()
                    } catch (error) {
                        rating: "n/a"
                    }
                    let link = ""
                    try {
                        link = hotel.querySelector("a.e13098a59f").href
                    } catch (error) {
                        link: "n/a"
                    }

                    return {
                        title,
                        price,
                        rating,
                        link,
                    }
                }
            )
        )
        const revHotels = hotelData.slice(0, propertiesLeft)
        // next 4 lines of code is pure cheating. value pair names set as "price" so its possible to map full array into the table directly
        revHotels.unshift({ price: "Link", searchLink: url })
        revHotels.unshift({ price: propertiesLeft }) // properties left
        revHotels.unshift({ price: roomType }) // room tyme
        revHotels.unshift({ price: j }) // number of people
        revHotels.unshift({
            price: nights,
            year: dates.year,
            month: dates.month,
            day: dates.day,
        }) // number of nights
        allHotels.push(revHotels)
    } // end of j loop
    await browser.close()
    return allHotels
}

module.exports = start
