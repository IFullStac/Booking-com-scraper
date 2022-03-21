// represents fullmoon dates from the file
const datesDisplay = document.querySelector('.datesDisplay')
// used to display error message
const errorDiv = document.querySelector('.errorDiv')
// DOM element used to represent results in a table
const result = document.querySelector('.result')

const moreInfo = document.getElementById('moreInfo')

const loadingDOM = document.querySelector('.loading-text')

// function that gets the scraping data and represents it in the DOM
const  myFunction = async (id) => {
  loadingDOM.style.visibility = 'visible'
  try {
    const { data } = await axios.get(`/api/bookings/${id}`)
    if(data){
      loadingDOM.style.visibility = 'hidden'
    }
    let mainHeaders = ['.N.', '.P.', 'R type', 'H left',1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25]
    let mainTable = document.createElement('table')
    let mainHeaderRow = document.createElement('tr')
    // ** date cell **
    let mainDateRow = document.createElement('tr')
    let fmDate = document.createElement('th')
    fmDate.colSpan ='29'
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

    function createTable() {
      moreInfo.innerHTML = '<h2>Hotel name </h2> <h3>Rating</h3>'
      mainTable.innerHTML = ''
      fmDate.innerHTML = "OUT! - is in pink.  Full Moon Date: "
      mainTable.appendChild(mainDateRow)
      mainTable.appendChild(mainHeaderRow)
      result.innerHTML = ''
      data.data.map(searches => {
      const mainTableRow = document.createElement('tr')
      searches.map(hotel => {

        if(hotel.year) {
          fmDate.innerHTML = `OUT! - is in pink.  Full Moon Date:  ${hotel.year} - ${hotel.month} - ${hotel.day}`
      }
        const mainTableDataCell = document.createElement('td')
        mainTableDataCell.innerText = `${hotel.price}`

        if(hotel.title) {
            mainTableDataCell.addEventListener("click", function chooseHotel() {
                mainTable.innerHTML = ''
                mainTable.appendChild(mainDateRow)
                mainTable.appendChild(mainHeaderRow)
                result.innerHTML = ''
                
                moreInfo.innerHTML =  ` <h2>Hotel name: ${hotel.title} </h2> <h3>Rating: ${hotel.rating}</h3>`
                data.data.map((arrays)=> {
                    const mainTableRow = document.createElement('tr')

                    arrays.map(el => {
                        // if(el.year){

                        // }
                        const mainTableDataCell = document.createElement('td')
                        mainTableDataCell.innerText = `${el.price}`
                        if(el.title === hotel.title){
                            mainTableDataCell.style.backgroundColor = '#ccf176';
                        }      
                        if(el.title && el.title.includes('OUT!')){
                            mainTableDataCell.style.backgroundColor = '#f763e3';  
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
    const { data } = await axios.get('/api/bookings')
    const datos = data.data.map((dates) => {
      return `<button id="${dates.id}" onclick="myFunction(this.id)" class="dateBtn" > ${dates.year}-${dates.month}-${dates.day}</button>`
    })
    datesDisplay.innerHTML = datos.join('')    
  } catch (error) {
    datesDisplay.innerHTML = `<div class="alertalert-danger">Can't Fetch Data</div>`
  }
}
fetchDates()

  // submit form

// const btn = document.querySelector('.submit-btn')
// const input = document.querySelector('.form-input')
// const formAlert = document.querySelector('.form-alert')
//   btn.addEventListener('click', async (e) => {
//     e.preventDefault()
//     const dateValue = input.value
//     try {
//       const { data } = await axios.post('/api/bookings', {year: dateValue })
//       const newDate = document.createElement('button')
//       newDate.className = "newDatesBtn"
//       newDate.innerText = data.laikas
//       datesDisplay.appendChild(newDate)
//     } catch (error) {
//       // console.log(error.response)
//       formAlert.textContent = error.response.data.msg
//     }
    
//     input.value = ''
//   })
