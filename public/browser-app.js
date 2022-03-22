// represents fullmoon dates from the file
const datesDisplay = document.querySelector('.datesDisplay')
// used to display error message
const errorDiv = document.querySelector('.errorDiv')
// DOM element used to represent results in a table
const result = document.querySelector('.result')

const moreInfo = document.getElementById('moreInfo')
// display "Loading.."
const loadingDOM = document.querySelector('.loading-text')
// display room types and days searched to the user while fetching the data
const loadPROG_Types = document.getElementById('loadPROG-Types')
const loadPROG_Nights = document.getElementById('loadPROG-Nights')

// function that gets the scraping data and represents it in the DOM
const  myFunction = async (id) => {
 
  loadingDOM.style.visibility = 'visible'
  const HotelsArray = []

  let mainHeaders = ['.N.', '.P.', 'R type', 'H left','Link',1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25]
  let mainTable = document.createElement('table')
  let mainHeaderRow = document.createElement('tr')
  // ** date cell **
  let mainDateRow = document.createElement('tr')
  let fmDate = document.createElement('th')
  fmDate.colSpan ='30'
  fmDate.style.background = '#f763e3'
  fmDate.style.padding = "10px"
  fmDate.style.fontSize = "1.3rem"

  mainDateRow.appendChild(fmDate)
  mainTable.appendChild(mainDateRow)
  // *** end of date cell ******
  mainHeaders.map(header => {
      let th = document.createElement('th')
      th.innerText = header
      mainHeaderRow.appendChild(th)
  })
  mainTable.appendChild(mainHeaderRow)

  try {   
    for (let i=1; i<5; i++) {  // nights
      for (let p = 1; p < 3 ; p++ ) {  // room types 1 - any, 2 - private
        const { data } = await axios.get(`/api/bookings/${id}/${i}/${p}`)
        HotelsArray.push(data.data)
        loadPROG_Types.innerHTML = `Room types searched: ${p}`
      }
      loadPROG_Nights.innerHTML = `<div> Days searched ${i}</div>`
    }
    const flatHotelsArray = HotelsArray.flat()
    // console.log(flatHotelsArray)  
    if(HotelsArray){
      loadingDOM.style.visibility = 'hidden'
    } else if (!HotelsArray) {
       errorDiv.innerHTML = `<div class="alertalert-danger">Can't Fetch Data, HotelsArray is empty </div>`
       return
    } 
    loadPROG_Types.innerHTML =  ''
    loadPROG_Nights.innerHTML = ''
    function createTable() {
      moreInfo.innerHTML = '<h2>Hotel name </h2> <h3>Rating</h3> <h3>Select hotel to see the link</h3>'
      mainTable.innerHTML = ''
      fmDate.innerHTML = "OUT! - is in pink.  Date: "
      mainTable.appendChild(mainDateRow)
      mainTable.appendChild(mainHeaderRow)
      result.innerHTML = ''
      // ******* mapping ******
      flatHotelsArray.map(searches => {
      const mainTableRow = document.createElement('tr')
      // ******* mapping ******
      searches.map(hotel => {

        if(hotel.year) {
          fmDate.innerHTML = `OUT! - is in pink.  Date:  ${hotel.year} - ${hotel.month} - ${hotel.day}`
      }
        const mainTableDataCell = document.createElement('td')
        mainTableDataCell.innerText = `${hotel.price}`
        if(hotel.searchLink){
          mainTableDataCell.innerHTML = `<a target="_blank" href="${hotel.searchLink}">Link</a>`
        }

        if(hotel.title) {
            mainTableDataCell.addEventListener("click", function chooseHotel() {
                mainTable.innerHTML = ''
                mainTable.appendChild(mainDateRow)
                mainTable.appendChild(mainHeaderRow)
                result.innerHTML = ''
                
                moreInfo.innerHTML =  ` <h2>Hotel name: ${hotel.title} </h2> <h3>Rating: ${hotel.rating}</h3><h3><a class"hotel_Link" target="_blank" href="${hotel.link}">Hotel's link</a></h3>`
                // ******* mapping ******
                flatHotelsArray.map((arrays)=> {
                    const mainTableRow = document.createElement('tr')
                    // ******* mapping ******
                    arrays.map(el => {
                      
                        const mainTableDataCell = document.createElement('td')
                        mainTableDataCell.innerText = `${el.price}`

                        if(el.searchLink){
                          mainTableDataCell.innerHTML = `<a target="_blank" href="${el.searchLink}">Link</a>`
                        }
                        if(el.title === hotel.title){
                            mainTableDataCell.style.backgroundColor = '#ccf176';
                        }      
                        if(el.title && el.title.includes('OUT!')){
                            mainTableDataCell.style.backgroundColor = '#f763e3'; 
                            mainTableDataCell.innerHTML = `<a target="_blank" href="${el.link}">${el.price}</a>` 
                        } 
                        if(el.title) {
                            mainTableDataCell.addEventListener("click", createTable)
                        }

                        mainTableRow.appendChild(mainTableDataCell) 
                    })
                    mainTable.appendChild(mainTableRow)
               })
               // ********************************************************
               result.appendChild(mainTable)
            })   
        }
        if(hotel.title && hotel.title.includes('OUT!')){
            mainTableDataCell.style.backgroundColor = '#f763e3';
            mainTableDataCell.innerHTML = `<a target="_blank" href="${hotel.link}">${hotel.price}</a>`
        } 

        mainTableRow.appendChild(mainTableDataCell)       
      })
    mainTable.appendChild(mainTableRow)
    })
    result.appendChild(mainTable)
    }

    createTable()

  } catch (error) {
  errorDiv.innerHTML = `<div class="alertalert-danger">Can't Fetch Data</div>`
  }
  loadingDOM.style.visibility = 'hidden'
}


// getting full moon dates from a file and adding to DOM element datesDisplay

const fetchDates = async () => {
  try {
    const  { data } = await axios.get('/api/dates')
    // console.log(data)
    const dataAr = data.data
    const arLen = Number(dataAr.length)
    if(arLen  < 1){
      datesDisplay.innerHTML = `There are no dates to select. Please create a new date`
    }
    const datos = data.data.map((dates) => {
      const {_id: dateID} = dates
      return (`<div class="date-container">
       <button  class="dateBtn" id="${dates._id}" onclick="myFunction(this.id)" > ${dates.year}-${dates.month}-${dates.day}  </button> <button class="delete-btn"  type="button" data_id="${dateID}"  > X </button> </div> `)
    })
    datesDisplay.innerHTML = datos.join('') 
    addListener()   
  } catch (error) {
    datesDisplay.innerHTML = `<div class="alertalert-danger">Can't Fetch Data</div>`
  }
}

fetchDates()


// submit form -> createDate
const btn = document.querySelector('.submit-btn')
const input = document.querySelector('.form-input')
const formAlert = document.querySelector('.form-alert')

btn.addEventListener('click', async (e) => {
  e.preventDefault()
  const dateValue = input.value
  const dateArray = dateValue.split("-")
  const year = dateArray[0]
  const month = dateArray[1]
  const day = dateArray[2]
  try {
    await axios.post('/api/dates', {year, month, day})
    fetchDates()
  } catch (error) {
    formAlert.textContent = error.response.data.msg
  }
  input.value = ''
})
//*************************************************** */

const addListener = async () => {
  // await fetchDates()
  const delete_btn = document.querySelectorAll('.delete-btn')
  const buttons = [...delete_btn]
  buttons.map(btn => {
    btn.addEventListener('click', async (e) => {
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





