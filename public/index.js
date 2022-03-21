const puppeteer = require('puppeteer')
const express = require('express')
const app = express()
const PORT = process.env.PORT || 8000

const cors = require('cors')
app.use( cors() )

app.get('/', function (req, res) {
    res.json('This is my webscraper')
})


dates = {
    year: 2022,
    month: 04,
    day: 18
}



numberOfPeople = 2
numberOfNights = 2
allHotels = []


async function start() {
    const browser = await puppeteer.launch({ headless: false})
    const page = await browser.newPage()
    await page.setViewport({ width: 1920, height: 1800 });
    
    for (let i = 1; i < numberOfNights + 1; i++ ){ 
        for (let j = 1; j < numberOfPeople ; j++ ) {
            
            url = `https://www.booking.com/searchresults.html?label=gen173nr-1FCAEoggI46AdIM1gEaIgBiAEBmAExuAEXyAEM2AEB6AEB-AECiAIBqAIDuAKP07GRBsACAdICJDYyZDk0ZGIxLTI0OGMtNDE2Zi1hNzQ1LWFmZDk3ODIyMzZjNNgCBeACAQ&sid=03db0587da8f916f436e8669e5ba9a6a&aid=304142&checkin_monthday=${dates.day}&checkin_year_month=${dates.year}-${dates.month}&checkout_monthday=${dates.day + i}&checkout_year_month=${dates.year}-${dates.month}&dest_id=900050772&dest_type=city&from_history=1&group_adults=${j}&group_children=0&no_rooms=1&si=ad&si=ai&si=ci&si=co&si=di&si=la&si=re&order=price&nflt=distance%3D3000`

            await page.goto(url)
            const propLeft = await page.evaluate( () => document.querySelector('h1._30227359d._0db903e42').innerText.trim())
            const propertiesLeft = Number(propLeft.replace(/\D/g,''))
            const hotelData = await page.evaluate(() => 
            Array.from(document.querySelectorAll('div._7192d3184'))
            .map(hotel => ({
                title: hotel.querySelector('div.fde444d7ef._c445487e2').innerText.trim(),
                price: hotel.querySelector('span.fde444d7ef._e885fdc12').innerText.replaceAll('€','').trim(),
                location: hotel.querySelector('span.af1ddfc958.eba89149fb').innerText.trim()
            }) )
            )
            metaData ={
                checkInYear: dates.year,
                checkInMonth:dates.month,
                checkInDay: dates.day,
                checkOutYear: dates.year,
                checkOutMonth:dates.month,
                checkOutDay: dates.day+i,
                numberOfPeople: j,
                propLeft: propertiesLeft
            }
              
            allHotels.push(metaData)
            allHotels.push(hotelData) 
        }
    }    
    await browser.close()
}

test = [
    {
    title: 'Little Paradise Street Zone',
    price: '59',
    location: 'Haad Rin'
  },
  {
    title: 'Little Paradise - SHA Extra Plus',
    price: '64',
    location: 'Haad Rin Nok, Haad Rin'
  },
  {
    title: 'Sea Breeze Resort - SHA Plus',
    price: '59',
    location: 'Haad Rin Nai, Haad Rin'
  }
]

app.get('/results', (req, res) => {
    // start()
    // const data = test.map(instance => `<h1>${instance.price}</h1>` )
    res.json(test)
})

app.listen(PORT, ()=> console.log(`server is listening on PORT: ${PORT}` ))  



// async function start() {
//     const browser = await puppeteer.launch({ headless: false})
//     const page = await browser.newPage()
//     await page.setViewport({ width: 1920, height: 1800 });
// const url = 'https://www.booking.com/searchresults.html?label=gen173nr-1FCAEoggI46AdIM1gEaIgBiAEBmAExuAEXyAEM2AEB6AEB-AECiAIBqAIDuAKP07GRBsACAdICJDYyZDk0ZGIxLTI0OGMtNDE2Zi1hNzQ1LWFmZDk3ODIyMzZjNNgCBeACAQ&sid=03db0587da8f916f436e8669e5ba9a6a&aid=304142&checkin_monthday=17&checkin_year_month=2022-04&checkout_monthday=18&checkout_year_month=2022-04&dest_id=900050772&dest_type=city&from_history=1&group_adults=2&group_children=0&no_rooms=1&si=ad&si=ai&si=ci&si=co&si=di&si=la&si=re&order=price&nflt=distance%3D3000'
    

    // await page.goto(url)
    
    // console.log('******************************************************************')
    
    // const propLeft = await page.evaluate( () => document.querySelector('h1._30227359d._0db903e42').innerText.trim())
    // const hotels = await page.evaluate(() => 
    //     Array.from(document.querySelectorAll('div._7192d3184'))
    //     .map(hotel => ({
        //         title: hotel.querySelector('div.fde444d7ef._c445487e2').innerText.trim(),
        //         price: hotel.querySelector('span.fde444d7ef._e885fdc12').innerText.trim(),
        //         location: hotel.querySelector('span.af1ddfc958.eba89149fb').innerText.trim()
        //     }) )
        //  )
        // console.log(propLeft)
        // console.log('******************************************************************')
        // console.log(hotels)
        // console.log('##################################################################')
        
        // await browser.close()
        
    
    
        // let checkIn = `checkin_monthday=${dates.day}&checkin_year_month=${dates.year}-${dates.month}`
        // let checkOut = `checkout_monthday=${dates.day}&checkout_year_month=${dates.year}-${dates.month}`
        // let group_adults =`group_adults=${1}`