//確認登入狀況
(async ()=>{    
    const response = await fetch('/api/user/auth');
    const data = await response.json();
    if (data["data"]){
        // console.log(data["data"]);
        const userName = document.querySelector('#userName');
        userName.textContent = data["data"]["name"]
        await getCartData()
        // 伸縮footer
        await(function(){
            // console.log('視窗內部高度'+window.innerHeight);
            // console.log('body高度' + document.body.offsetHeight);
            // console.log(window.innerHeight-document.body.offsetHeight);
            if(window.innerHeight-document.body.offsetHeight>0){
                const footer = document.createElement('div')
                const height = window.innerHeight-document.body.offsetHeight
                footer.style = `height: ${height}px; background: #757575`
                const body = document.querySelector('body')
                body.appendChild(footer)
            }
        })()
    }else{
        window.location.href = '/'
    }
})()
//取得預定⾏程，並將購物車資料呈現在畫面中
async function getCartData(){
    const name = document.querySelector('#name')
    const date = document.querySelector('#date')
    const time = document.querySelector('#time')
    const price = document.querySelector('#price')
    const address = document.querySelector('#address')
    const attraction_img = document.querySelector('.attraction_img')
    const total_price = document.querySelector('#total_price')
    const res = await fetch('/api/booking');
    const data = await res.json();
    if (data['data']){
        // console.log(data['data']);
        name.textContent = data['data']['attraction']['name']
        date.textContent = data['data']['date']
        time.textContent = data['data']['time']
        price.textContent = data['data']['price']
        address.textContent = data['data']['attraction']['address']
        attraction_img.style.backgroundImage = `url(${data['data']['attraction']['image']})`;
        total_price.textContent = data['data']['price']
        cartData =  data['data']
    }else{
        const content = document.querySelector('.content')
        content.innerHTML = ''
        const message = document.querySelector('#nullMessage')
        message.innerHTML = '目前沒有任何待預訂的行程'
    }
}

//刪除預定⾏程API
async function deleteCartData(){
    const config = {method: "DELETE"    }
    const res = await fetch('/api/booking', config);
    const response = await res.json();
    if (response.ok){
        location.reload()
        // getCartData()
    }
}
const deleteIcon = document.querySelector('#delete_icon')
deleteIcon.addEventListener('click', deleteCartData)
// ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝

//金流相關設定
// SetupSDK
TPDirect.setupSDK(126880, 'app_rNEVwMNMBUGwXTKVPRWxdy9eHB5R7DiY32JhGSE7g1YTzrBfJ3GATNToD0Zd', 'sandbox')

//設定外觀
const fields = {
    number: {
        // css selector
        element: '#card-number',
        placeholder: '**** **** **** ****'
    },
    expirationDate: {
        // DOM object
        element: document.getElementById('card-expiration-date'),
        placeholder: 'MM / YY'
    },
    ccv: {
        element: '#card-ccv',
        placeholder: 'ccv'
    }
}
TPDirect.card.setup({
    fields: fields,
    styles: {
        // Style all elements
        'input': {
            'color': 'gray'
        },
        // Styling ccv field
        'input.ccv': {
            // 'font-size': '16px'
        },
        // Styling expiration-date field
        'input.expiration-date': {
            // 'font-size': '16px'
        },
        // Styling card-number field
        'input.card-number': {
            // 'font-size': '16px'
        },
        // style focus state
        ':focus': {
            // 'color': 'black'
        },
        // style valid state
        '.valid': {
            'color': 'green'
        },
        // style invalid state
        '.invalid': {
            'color': 'red'
        },
        // Media queries
        // Note that these apply to the iframe, not the root window.
        '@media screen and (max-width: 400px)': {
            'input': {
                'color': 'orange'
            }
        }
    },
    // 此設定會顯示卡號輸入正確後，會顯示前六後四碼信用卡卡號
    isMaskCreditCardNumber: true,
    maskCreditCardNumberRange: {
        beginIndex: 4, 
        endIndex: 11
    }
})
//監測欄位的更新輸入狀況
TPDirect.card.onUpdate(function (update) {
    /* Disable / enable submit button depend on update.canGetPrime  */
    /* ============================================================ */
    // update.canGetPrime === true
    //     --> you can call TPDirect.card.getPrime()
    const submitButton = document.querySelector('#submitOrder')
    if (update.canGetPrime) {
        submitButton.removeAttribute('disabled')
        // $('button[type="submit"]').removeAttr('disabled')
    } else {
        submitButton.setAttribute('disabled', true)
        // $('button[type="submit"]').attr('disabled', true)
    }


    /* Change card type display when card type change */
    /* ============================================== */

    // cardTypes = ['visa', 'mastercard', ...]
    // var newType = update.cardType === 'unknown' ? '' : update.cardType
    // document.querySelector('#cardtype').text(newType)
    /* Change form-group style when tappay field status change */
    /* ======================================================= */

    // number 欄位是錯誤的
    if (update.status.number === 2) {
        setNumberFormGroupToError('.card-number-group')
    } else if (update.status.number === 0) {
        setNumberFormGroupToSuccess('.card-number-group')
    } else {
        setNumberFormGroupToNormal('.card-number-group')
    }
    //到期日錯誤
    if (update.status.expiry === 2) {
        setNumberFormGroupToError('.expiration-date-group')
    } else if (update.status.expiry === 0) {
        setNumberFormGroupToSuccess('.expiration-date-group')
    } else {
        setNumberFormGroupToNormal('.expiration-date-group')
    }
    // CCV錯誤 
    if (update.status.ccv === 2) {
        setNumberFormGroupToError('.ccv-group')
    } else if (update.status.ccv === 0) {
        setNumberFormGroupToSuccess('.ccv-group')
    } else {
        setNumberFormGroupToNormal('.ccv-group')
    }
})

// 表單送出時，跟後端互動
const orderForm = document.querySelector('.content')
orderForm.addEventListener('submit', function (event) {
    // console.log(cartData);
    // console.log(userData);
    // fix keyboard issue in iOS device
    forceBlurIos()
    
    const tappayStatus = TPDirect.card.getTappayFieldsStatus()
    // console.log(tappayStatus)

    // Check TPDirect.card.getTappayFieldsStatus().canGetPrime before TPDirect.card.getPrime
    if (tappayStatus.canGetPrime === false) {
        alert('付款出問題，請重新輸入')
        event.preventDefault()
        // return false
    }
    // Get prime
    TPDirect.card.getPrime(function (result) {
        if (result.status !== 0) {
            // alert('get prime error ' + result.msg)
            return
        }
        // alert('get prime 成功，prime: ' + result.card.prime)
        const name = document.querySelector('#inputName').value
        const email = document.querySelector('#inputEmail').value
        const phone = document.querySelector('#inputPhone').value
        const requestBody ={
            "prime": result.card.prime,
            "order": {
                "price": cartData['price'],
                "trip": {
                "attraction": cartData['attraction'],
                "date": cartData['date'],
                "time": cartData['time']
                },
                "contact": {
                "name": name,
                "email": email,
                "phone": phone
                }
            }
        };
        // console.log(requestBody);
        const config = {
            method: "POST",
            body: JSON.stringify(requestBody),
            headers: { 
                "Content-type": "application/json"
            }
        };
        (async ()=>{
            const res = await fetch('api/order', config)
            const response = await res.json()
            if (response.data) {
                // console.log(response.data);
                window.location.replace(`/thankyou?number=${response.data.number}`)
            }
        })()
    })
    // return false
    event.preventDefault()
})

function setNumberFormGroupToError(selector) {
    element = document.querySelector(`${selector}`)
    element.classList.add('has-error')
    element.classList.remove('has-success')
    // $(selector).addClass('has-error')
    // $(selector).removeClass('has-success')
}

function setNumberFormGroupToSuccess(selector) {
    element = document.querySelector(`${selector}`)
    element.classList.remove('has-error');
    element.classList.add('has-success');
    // $(selector).removeClass('has-error')
    // $(selector).addClass('has-success')
}

function setNumberFormGroupToNormal(selector) {
    element = document.querySelector(`${selector}`)
    element.classList.remove('has-error');
    element.classList.remove('has-success');
    // $(selector).removeClass('has-error')
    // $(selector).removeClass('has-success')
}

function forceBlurIos() {
    if (!isIos()) {
        return
    }
    var input = document.createElement('input')
    input.setAttribute('type', 'text')
    // Insert to active element to ensure scroll lands somewhere relevant
    document.activeElement.prepend(input)
    input.focus()
    input.parentNode.removeChild(input)
}

function isIos() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}
