// represents fullmoon dates from the file
const datesDisplay = document.querySelector('.datesDisplay')
// used to display error message
const errorDiv = document.querySelector('.errorDiv')
// DOM element used to represent results in a table
const result = document.querySelector('.result')


// function that gets the scraping data and represents it in the DOM
const  myFunction = async (id) => {
  try {
    const { data } = await axios.get(`/api/bookings/${id}`)
    console.log("single searh")
    console.log(data.data[0])
    
    let headers = ['Nights', 'People', 'Room type', 'Hotels left',1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25]
    let t1 = document.createElement('table')
    let headerRow = document.createElement('tr')

    headers.map(header => {
        let th = document.createElement('th')
        th.innerText = header
        headerRow.appendChild(th)
    })

    t1.appendChild(headerRow)
    data.data.map(searches => {
      const tr = document.createElement('tr')
      searches.map(hotel => {
  
          const td = document.createElement('td')
          td.innerText = `${hotel.price}`
          if(hotel.title && hotel.title.includes('OUT!')){
              td.style.backgroundColor = '#f763e3';  
          } 
          tr.appendChild(td)
      })
      t1.appendChild(tr)
  })
    result.appendChild(t1)

    
  } catch (error) {
    errorDiv.innerHTML = `<div class="alertalert-danger">Can't Fetch Data</div>`
  }

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
