//確認登入狀況
// async function checkUserStatus(){
//     response = await fetch('/api/user/auth');
//     data = await response.json();
//     if (data["data"]){
//         pass
//     }else{
//         window.location.href = '/'
//     }
// }
// checkUserStatus()
(async()=>{
    const userName = document.querySelector('#userName');
    const response = await fetch('/api/user/auth');
    const data = await response.json();
    if (data["data"]){
        console.log(data["data"]);
        userName.textContent = data["data"]["name"]
        getCartData()
    }else{
        window.location.href = '/'
    }
})()

const name = document.querySelector('#name')
const date = document.querySelector('#date')
const time = document.querySelector('#time')
const price = document.querySelector('#price')
const address = document.querySelector('#address')
const attraction_img = document.querySelector('.attraction_img')
//取得預定⾏程，並將購物車資料呈現在畫面中
async function getCartData(){
    const res = await fetch('/api/booking');
    const data = await res.json();
    console.log(data);
    name.textContent = data['data']['attraction']['name']
    date.textContent = data['data']['date']
    time.textContent = data['data']['time']
    price.textContent = data['data']['price']
    address.textContent = data['data']['attraction']['address']
    attraction_img.style.backgroundImage = `url(${data['data']['attraction']['image']})`;
}
//刪除預定⾏程API
async function deleteCartData(){
    const config = {method: "DELETE"    }
    const res = await fetch('/api/booking', config);
    const response = await res.json();
    if (response.ok){
        const section = document.querySelector('section')
        section.innerHTML = '目前沒有任何待預定行程'
    }
}
const deleteIcon = document.querySelector('#delete_icon')
deleteIcon.addEventListener('click', deleteCartData)