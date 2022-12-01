const price = document.querySelector('.price > #price')
const morning = document.querySelector('input[id = morning]')
morning.addEventListener('click',()=>{
    price.innerText = 2000
})
const afternoon = document.querySelector('input[id = afternoon]')
afternoon.addEventListener('click',()=>{
    price.innerText = 2500
})


async function fetchAttractionApi(){
    const id = document.URL.split('/').slice(-1)
    const apiUrl = '/api/attraction/' + id
    const response = await fetch(apiUrl)
    const data = await response.json()
    const attractionList = data['data']
    const name = document.querySelector('.name')
    name.innerText = attractionList['name']
    const category = document.querySelector('.category')
    category.innerText = attractionList['category']
    const mrt = document.querySelector('.mrt')
    mrt.innerText = attractionList['mrt']
    const description = document.querySelector('.description')
    description.innerText = attractionList['description']
    const address = document.querySelector('#address')
    address.innerText = attractionList['address']
    const transport = document.querySelector('#transport')
    transport.innerText = attractionList['transport']
    
}
fetchAttractionApi()