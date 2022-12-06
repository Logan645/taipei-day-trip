const signInOutBtn = document.querySelector('.signin_up_btn');
const signInBlock = document.querySelector('.signIn');
const to_signup = document.querySelector('#to_signup');
const signUpBlock = document.querySelector('.signUp');
const to_signin = document.querySelector('#to_signin');

signInOutBtn.addEventListener('click', function(){
    signUpBlock.style.display = 'none';
    signInBlock.style.display = 'block';
})

to_signup.addEventListener('click', function(){
    signInBlock.style.display = 'none';
    signUpBlock.style.display = 'block';
})

to_signin.addEventListener('click', function(){
    signUpBlock.style.display = 'none';
    signInBlock.style.display = 'block';
})

const closeSign = document.querySelectorAll('.close_sign');
closeSign.forEach(btn => btn.addEventListener('click', function(){
    signInBlock.style.display = 'none';
    signUpBlock.style.display = 'none';
}))
