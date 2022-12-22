const price = document.querySelector('.price > #price')
const morning = document.querySelector('input[id = morning]')
morning.addEventListener('click',()=>{
    price.innerText = '2000'
})
const afternoon = document.querySelector('input[id = afternoon]')
afternoon.addEventListener('click',()=>{
    price.innerText = '2500'
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

//圖片左右滑動
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

//date input的min是明天
const date = document.querySelector('#date')
const Today =new Date()
// 比較特別的是 getMonth() 預設會從零開始，所以我們把他 +1 來修正結果。
date.min = Today.getFullYear()+ '-' + (Today.getMonth()+1) + '-' +(Today.getDate()+1)

//將行程加入購物車
async function addToCart(event){
    event.preventDefault() //避免網頁將資訊變成QueryString
    const id = document.URL.split('/').slice(-1)[0]
    //選擇input name=time被勾選的元素
    const time = document.querySelector('input[name="time"]:checked')
    const date = document.querySelector('#date')
    const data ={
        "attractionId": id,
        "date": date.value,
        "time": time.value,
        "price": price.textContent
    }
    console.log(data);
    const config ={
        method: "POST",
        body: JSON.stringify(data),
        headers: { //headers必須要是小寫
            "Content-type": "application/json",
            "Accept": "application/json"
        }
    }
    const res = await fetch('/api/booking', config)
    const response = await res.json()
    if(response.ok){
        window.location.href='/booking'
    }
}

//按鈕被點擊時送出訂單
const booking_form = document.querySelector(".booking_form")
booking_form.addEventListener('submit', async(event)=>{
    event.preventDefault()
    const response = await fetch('/api/user/auth');
    const data = await response.json();
    // console.log(data['data']);
    if(data['data']){
        await addToCart(event)
    }else{
        const signIn = document.querySelector('.signIn')
        signInBlock.style.display = 'block'
        const signInMessage = document.querySelector('.signIn #message');
        signInMessage.textContent = '請先登入'
    }
})