const price = document.querySelector('.price > #price')
const morning = document.querySelector('input[id = morning]')
morning.addEventListener('click',()=>{
    price.innerText = '2000元'
})
const afternoon = document.querySelector('input[id = afternoon]')
afternoon.addEventListener('click',()=>{
    price.innerText = '2500元'
})


async function fetchAttractionApi(){
    const id = document.URL.split('/').slice(-1)
    const apiUrl = '/api/attraction/' + id
    const response = await fetch(apiUrl)
    const data = await response.json()
    const attractionList = await data['data']
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
    const slider = document.querySelector('.slider')
     for(let i of attractionList['images']){
        let img =document.createElement('img')
        img.src = i
        slider.appendChild(img)
    }
    const allItems = slider.children;
    // console.log(allItems);
    const slider_index = document.querySelector('#slider_index');
    for(let i=0; i<allItems.length; i++){
        let span = document.createElement('span')
        if(i===0){
            span.className = 'current_slider_index_icon'
        }else{
            span.className = 'slider_index_icon'
        }
        // span.innerText = i + 1;
        slider_index.appendChild(span)
    }    
}

fetchAttractionApi()

// window.onload = function(){
//     const slider = document.querySelector('.slider')
//     const allItems = slider.children;
//     // console.log(allItems);
//     const slider_index = document.querySelector('#slider_index');
//     for(let i=0; i<allItems.length; i++){
//         let span = document.createElement('span')
//         if(i===0){
//             span.className = 'current_slider_index_icon'
//         }else{
//             span.className = 'slider_index_icon'
//         }
//         span.innerText = i + 1;
//         slider_index.appendChild(span)
//     }    
// }

function refresh(){
    const attraction_img = document.querySelector('.attraction_img')
    let width = getComputedStyle(attraction_img).width
    width = Number(width.slice(0,-2)) //這段什麼意思
    // console.log(width);
    slider.style.left = index * width * -1 +'px';
    const slider_index = document.querySelector('#slider_index');
    const indexNum = slider_index.children.length
    for(let i=1; i<indexNum+1; i++){
        const index = document.querySelector(`.slider_index > span:nth-child(${i})`)
        index.className = 'slider_index_icon'
    }
    const nex_index = document.querySelector(`.slider_index > span:nth-child(${index+1})`)
    nex_index.className = 'current_slider_index_icon'    
}
let index = 0
function rightShift(){
    const slider = document.querySelector('.slider')
    const allItems = slider.children;
    if(index < (allItems.length-1)){
        index ++;
    }
    refresh()
}

function leftshift(){
    if(index > 0){
        index--;
    }
    refresh()
}
