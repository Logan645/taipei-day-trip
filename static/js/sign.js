const signInOutBtn = document.querySelector('.signin_up_btn');
const signInBlock = document.querySelector('.signIn');
const to_signup = document.querySelector('#to_signup');
const signUpBlock = document.querySelector('.signUp');
const to_signin = document.querySelector('#to_signin');
const signUpInputName = document.querySelector('#signUp input[name="name"]');
const signUpInputEmail = document.querySelector('#signUp input[name="email"]');
const signUpInputPassword = document.querySelector('#signUp input[name="password"]');
const signUpMessage = document.querySelector('.signUp #message');
const signInInputEmail = document.querySelector('#signIn input[name="email"]');
const signInInputPassword = document.querySelector('#signIn input[name="password"]');
const signInMessage = document.querySelector('.signIn #message');
//註冊登入區塊的顯示功能
//點擊右上角的登入/註冊按鈕
signInOutBtn.addEventListener('click', function(){
    if(signInOutBtn.textContent==='登入/註冊'){
        signUpBlock.style.display = 'none';
        signInBlock.style.display = 'block';
        signInMessage.textContent = ''
    }else{
        logout()
    }
})
//點擊彈出視窗中的點此註冊
to_signup.addEventListener('click', function(){
    signInBlock.style.display = 'none';
    signUpBlock.style.display = 'block';
    signUpInputName.value = '';
    signUpInputEmail.value = '';
    signUpInputPassword.value = '';
    signUpMessage.textContent = '';
})
//點擊彈出視窗中的點此登入
to_signin.addEventListener('click', function(){
    signUpBlock.style.display = 'none';
    signInBlock.style.display = 'block';
    signInInputEmail.value = '';
    signInInputPassword.value = '';
    signInMessage.textContent = '';

})
//點擊彈出視窗中的Ｘ
const closeSign = document.querySelectorAll('.close_sign');
closeSign.forEach(btn => btn.addEventListener('click', function(){
    signInBlock.style.display = 'none';
    signUpBlock.style.display = 'none';
}))

//註冊
async function signUp(e){
    e.preventDefault() //避免網頁將資訊變成QueryString
    const data ={
        "name": signUpInputName.value,
        "email": signUpInputEmail.value,
        "password": signUpInputPassword.value
    }
    // console.log(data);
    const config = {
        method: "POST",
        body: JSON.stringify(data),
        headers: { //headers必須要是小寫
            "Content-type": "application/json",
            "Accept": "application/json"
        }
    };
    const response = await fetch('/api/user', config);
    const result = await response.json();
    //註冊發生問題
    if (result.error){
        signUpMessage.textContent = result['message'];
    }
    //註冊成功
    if(result.ok){
        signUpMessage.textContent = '註冊成功';
        signUpInputName.value = '';
        signUpInputEmail.value = '';
        signUpInputPassword.value = '';
    }    
}
const signUpForm = document.querySelector('#signUp')
signUpForm.addEventListener('submit', signUp)

//登入
async function signIn(e){
    e.preventDefault() //避免網頁將資訊變成QueryString
    const data = {
        "email": signInInputEmail.value,
        "password": signInInputPassword.value
    }
    const config = {
        method: "PUT",
        body: JSON.stringify(data),
        headers: { //headers必須要是小寫
            "Content-type": "application/json",
            "Accept": "application/json"
        }
    }
    const response = await fetch('/api/user/auth', config);
    const result = await response.json();
    if (result.error){
        signInMessage.textContent = result['message'];
    }
    if(result.ok){
        location.reload()
    }
}
const signInForm = document.querySelector('#signIn')
signInForm.addEventListener('submit', signIn)

//確認登錄狀態
async function checkUserStatus(){
    response = await fetch('/api/user/auth');
    // console.log(response);
    data = await response.json();
    // console.log(data["data"]);
    if (data["data"]){
        signInOutBtn.textContent='登出系統'
    }else{
        signInOutBtn.textContent='登入/註冊'
    }
}
checkUserStatus()

//登出系統
async function logout(){
    const response = await fetch('/api/user/auth', {method: "DELETE"});
    const result = await response.json();
    if(result.ok){
        location.reload();
    }    
}

scheduleBtn = document.querySelector('.schedule_btn')
scheduleBtn.addEventListener('click',async()=>{
    response = await fetch('/api/user/auth');
    data = await response.json();
    if (data["data"]){
        signInOutBtn.textContent='登出系統'
        window.location.href = '/booking'
    }else{
        signInBlock.style.display = 'block';
        signInMessage.textContent = '請先登入'
        signInOutBtn.textContent='登入/註冊'
    }
})