// represents fullmoon dates from the file
const datesDisplay = document.querySelector(".datesDisplay")
const hotelDisplay = document.querySelector(".hotelDisplay")
const loadedDatesDisplay = document.querySelector(".loadedDatesDisplay")
// used to display error message
const errorDiv = document.querySelector(".errorDiv")
// DOM element used to represent results in a table
const result = document.querySelector(".result")

const moreInfo = document.getElementById("moreInfo")
// display "Loading.."
const loadingDOM = document.querySelector(".loading-text")
// display room types and days searched to the user while fetching the data
const loadPROG_Types = document.getElementById("loadPROG-Types")
const loadPROG_Nights = document.getElementById("loadPROG-Nights")

function tableHeaders(max) {
    result.innerHTML = ""
    hotelDisplay.innerHTML = ""
    const mainHeaders = [".N.", ".P.", "R type", "H left", "Link"]
    for (let n = 1; n < max+1; n++) {
        mainHeaders.push(n)
    }
    const mainTable = document.createElement("table")
    const mainHeaderRow = document.createElement("tr")
    // ** date cell **
    const mainDateRow = document.createElement("tr")
    const fmDate = document.createElement("th")

    fmDate.colSpan = `${max+5}`
    fmDate.style.background = "#f763e3"
    fmDate.style.padding = "10px"
    fmDate.style.fontSize = "1.3rem"
    fmDate.style.textAlign = "left"
    mainDateRow.appendChild(fmDate)
    mainTable.appendChild(mainDateRow)
    // *** end of date cell ******
    mainHeaders.map((header) => {
        let th = document.createElement("th")
        th.innerText = header
        mainHeaderRow.appendChild(th)
    })
    mainTable.appendChild(mainHeaderRow)
    return { mainTable, fmDate }
}

const axiosCall = async (nights, id) => {
    const HotelsArray = []
    for (let i = 1; i < nights + 1; i++) {
        for (let p = 1; p < 3; p++) {
            // room types 1 - any, 2 - private
            const { data } = await axios.get(`/api/bookings/${id}/${i}/${p}`)
            HotelsArray.push(data.data)
            loadPROG_Types.innerHTML = `Room types searched: ${p}`
        }
        loadPROG_Nights.innerHTML = `<div> Days searched ${i}</div>`
    }
    const flatHotelsArray = HotelsArray.flat()
    if (HotelsArray) {
        loadingDOM.style.visibility = "hidden"
    } else if (!HotelsArray) {
        errorDiv.innerHTML = `<div class="alertalert-danger">Can't Fetch Data, HotelsArray is empty </div>`
        return
    }
    loadPROG_Types.innerHTML = ""
    loadPROG_Nights.innerHTML = ""
    return flatHotelsArray
}

// function that gets the scraping data and represents it in the DOM
const myFunction = async (id) => {
    loadingDOM.style.visibility = "visible"
    moreInfo.innerHTML = ""
    const uniqueDates = []

    try {
        // function calling axios get method puppeteer-start-fn that gets hotels data
        const flatHotelsArray = await axiosCall(4, id)
        let maxProp = 15

        function createTable(property = { title: "n/a" }) {
            const uniqueHotels = []
            const { mainTable, fmDate } = tableHeaders(maxProp)
            const searchDate = `Date:  ${flatHotelsArray[0][0].year} - ${flatHotelsArray[0][0].month} - ${flatHotelsArray[0][0].day}`
            fmDate.innerHTML = searchDate

            if (!uniqueDates.includes(searchDate)) {
                uniqueDates.push(searchDate)
                const newDate = document.createElement("div")
                newDate.classList = "new_date_container"
                newDate.innerHTML = searchDate
                newDate.addEventListener("click", () => {
                    createTable()
                })
                loadedDatesDisplay.appendChild(newDate)
            }

            // ******* mapping nr 1 ******
            flatHotelsArray.map((searches) => {
                const mainTableRow = document.createElement("tr")
                // ******* mapping nr 2 ******
                searches.map((hotel) => {
                    const mainTableDataCell = document.createElement("td")
                    mainTableDataCell.innerText = `${hotel.price}`

                    if (hotel.title) {
                        mainTableDataCell.addEventListener("click", () => {
                            createTable(hotel)
                        })

                        if (hotel.title.includes("OUT!")) {
                            mainTableDataCell.style.backgroundColor = "#f763e3"
                            mainTableDataCell.innerHTML = `<a target="_blank" href="${hotel.link}">${hotel.price}</a>`
                        }
                        if (hotel.title.includes("WET!")) {
                            mainTableDataCell.style.backgroundColor = "#938dff"
                            mainTableDataCell.innerHTML = `<a target="_blank" href="${hotel.link}">${hotel.price}</a>`
                        }
                        if (!uniqueHotels.includes(hotel.title)) {
                            uniqueHotels.push(hotel.title)
                            const newHotel = document.createElement("div")
                            newHotel.classList = "hotel-container"
                            newHotel.innerHTML = `${hotel.title} - ${hotel.rating}`
                            newHotel.addEventListener("click", () => {
                                createTable(hotel)
                            })
                            if (property.title === hotel.title) {
                                newHotel.style.backgroundColor = "#ccf176"
                            }
                            hotelDisplay.appendChild(newHotel)
                        }
                    }

                    if (hotel.searchLink) {
                        mainTableDataCell.innerHTML = `<a target="_blank" href="${hotel.searchLink}">Link</a>`
                    }
                    if(hotel.hotelsLeft && maxProp < hotel.hotelsLeft) {
                        maxProp = hotel.hotelsLeft
                        // createTable()
                    }

                    if (property.title === hotel.title) {
                        mainTableDataCell.style.backgroundColor = "#ccf176"
                        moreInfo.innerHTML = ` <h3><a class"hotel_Link" target="_blank" href="${hotel.link}">${hotel.title}</a>  - ${hotel.rating} </h3>`
                    }

                    mainTableRow.appendChild(mainTableDataCell)
                }) // end of mapping nr 2
                mainTable.appendChild(mainTableRow)
            }) // end of mapping nr1
            result.appendChild(mainTable)

        }
        
        createTable()
    } catch (error) {
        errorDiv.innerHTML = `<div class="alertalert-danger">Can't Fetch Data</div>`
    }
    loadingDOM.style.visibility = "hidden"
}

// getting full moon dates from a file and adding to DOM element datesDisplay
const fetchDates = async () => {
    try {
        const { data } = await axios.get("/api/dates")
        // console.log(data)
        const dataAr = data.data
        const arLen = Number(dataAr.length)
        if (arLen < 1) {
            datesDisplay.innerHTML = `There are no dates to select. Please create a new date`
        }
        const datos = data.data.map((dates) => {
            const { _id: dateID } = dates
            return `<div class="date-container">
       <button  class="dateBtn" id="${dates._id}" onclick="myFunction(this.id)" > ${dates.year}-${dates.month}-${dates.day}  </button> <button class="delete-btn"  type="button" data_id="${dateID}"  > X </button> </div> `
        })
        datesDisplay.innerHTML = datos.join("")
        addListener()
    } catch (error) {
        datesDisplay.innerHTML = `<div class="alertalert-danger">Can't Fetch Data</div>`
    }
}

fetchDates()

// submit form -> createDate
const btn = document.querySelector(".submit-btn")
const input = document.querySelector(".form-input")
const formAlert = document.querySelector(".form-alert")

btn.addEventListener("click", async (e) => {
    e.preventDefault()
    const dateValue = input.value
    const dateArray = dateValue.split("-")
    const year = dateArray[0]
    const month = dateArray[1]
    const day = dateArray[2]
    try {
        await axios.post("/api/dates", { year, month, day })
        fetchDates()
    } catch (error) {
        formAlert.textContent = error.response.data.msg
    }
    input.value = ""
})
//*************************************************** */

const addListener = async () => {
    // await fetchDates()
    const delete_btn = document.querySelectorAll(".delete-btn")
    const buttons = [...delete_btn]
    buttons.map((btn) => {
        btn.addEventListener("click", async (e) => {
            const id = e.target.attributes.data_id.value

            try {
                await axios.delete(`/api/dates/${id}`)
                fetchDates()
            } catch (error) {
                console.log(error)
            }
        })
    })
}
