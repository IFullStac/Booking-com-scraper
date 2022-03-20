let { fullMoonDates } = require('../data')
const puppeteer = require('puppeteer')

const getFullMoonDates = (req, res) => {
    res.status(200).json({success: true, data: fullMoonDates })
}
// naujos datos sukurimui
const createDate = (req, res) => {
    const { year } = req.body
    // console.log(req.body)
    if (!year) {
      return res
        .status(400)
        .json({ success: false, msg: 'please provide date value' })
    }
    res.status(201).send({ success: true, laikas: year })
  }
const deleteDate = (req, res) => {
    res.status(200).json({success: true, funkcija : 'delete' })
}


const getBookings = (req, res) => {
    allHotels = []
    const { id } = req.params
    const dates = fullMoonDates.find((data) => data.id === Number(id))
    if (!dates) {
        return res
        .status(404)
        .json({ success: false, msg: `no date with id ${id}` })
    }
    async function start() {
        allHotels = []
        const browser = await puppeteer.launch({ args: ['--no-sandbox'] })
        const page = await browser.newPage()
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36')
        //await page.setViewport({ width: 1000, height: 1600 });
        numberOfNights = 5
        numberOfPeople = 5

        for (let i = 1; i < numberOfNights; i++ ){ 
            for (let j = 1; j < numberOfPeople ; j++ ) {
                // for (let p = 1; p < 3 ; p++ ) {

                    // let checkInYear = dates.year
                    // let checkInMonth = dates.month
                    // let checkInDay = dates.day
                    let checkOutYear = dates.year
                    let checkOutMonth = dates.month
                    let checkOutDay = dates.day + i


                    if (checkOutMonth == 01, 03, 05, 07, 08, 10 && checkOutDay > 31) {
                        checkOutMonth = checkOutMonth + 1
                        checkOutDay = checkOutDay - 31
                    } else if (checkOutMonth == 04, 06, 09, 11 && checkOutDay > 30) {
                        checkOutMonth = checkOutMonth + 1
                        checkOutDay = checkOutDay - 30
                    } else if (checkOutMonth == 02 && checkOutDay > 28) {
                        checkOutMonth = checkOutMonth + 1
                        checkOutDay = checkOutDay - 28
                    } else if (checkOutMonth == 12 && checkOutDay > 31) {
                        checkOutYear = checkOutYear + 1
                        checkOutMonth = 01
                        checkOutDay = checkOutDay - 31
                    } 
 


                    url = `https://www.booking.com/searchresults.html?label=gen173nr-1FCAEoggI46AdIM1gEaIgBiAEBmAExuAEXyAEM2AEB6AEB-AECiAIBqAIDuAKP07GRBsACAdICJDYyZDk0ZGIxLTI0OGMtNDE2Zi1hNzQ1LWFmZDk3ODIyMzZjNNgCBeACAQ&sid=03db0587da8f916f436e8669e5ba9a6a&aid=304142&checkin_monthday=${dates.day}&checkin_year_month=${dates.year}-${dates.month}&checkout_monthday=${checkOutDay}&checkout_year_month=${checkOutYear}-${checkOutMonth}&dest_id=900050772&dest_type=city&from_history=1&group_adults=${j}&group_children=0&no_rooms=1&si=ad&si=ai&si=ci&si=co&si=di&si=la&si=re&order=price&nflt=distance%3D3000&selected_currency=THB`

                    await page.goto(url)
                    const propLeft = await page.evaluate( () => document.querySelector('h1._30227359d._0db903e42').innerText.trim())
                    const propertiesLeft = Number(propLeft.replace(/\D/g,''))
                    const hotelData = await page.evaluate(() => 
                    Array.from(document.querySelectorAll('div._7192d3184'))
                    .map(hotel => ({
                        title: hotel.querySelector('div.fde444d7ef._c445487e2').innerText.trim(),
                        price: hotel.querySelector('span.fde444d7ef._e885fdc12').innerText.replaceAll('THB','').replaceAll(',','').trim(),
                        location: hotel.querySelector('span.af1ddfc958.eba89149fb').innerText.trim(),
                        rating: hotel.querySelector('div._9c5f726ff.bd528f9ea6').innerText.trim()
                    }) )
                    )

                    const revHotels = hotelData.slice( 0, propertiesLeft )
                    // next 4 lines of code is pure cheating. value pair names set as "price" so its possible to map full array into the table directly
                    revHotels.unshift({price: propertiesLeft}) // properties left
                    // if (p === 2){
                    //     revHotels.unshift({price: "P"})  // room tyme
                    // } else {
                    //     revHotels.unshift({price: "-"})  // room tyme
                    // }
                    revHotels.unshift({price: "-"})  // room tyme
                    revHotels.unshift({price: j}) // number of people
                    revHotels.unshift({price: i, year: dates.year , month: dates.month , day: dates.day}) // number of nights
                    allHotels.push(revHotels )
                // } // end of p loop
            } // end of j loop
        } // end of i loop
        await browser.close()

        res.status(200).json({success: true, data: allHotels })
    }
    start()

}


module.exports = {getFullMoonDates, getBookings, createDate } 


