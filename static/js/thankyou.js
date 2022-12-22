const order_id = document.querySelector('#order_id')
order_id.textContent = document.URL.split('=').slice(-1)[0]

if(window.innerHeight-document.body.offsetHeight>0){
    const footer = document.createElement('div')
    const height = window.innerHeight-document.body.offsetHeight
    footer.style = `height: ${height}px; background: #757575`
    const body = document.querySelector('body')
    body.appendChild(footer)
}

(async ()=>{    
    const response = await fetch('/api/user/auth');
    const data = await response.json();
    if (data["data"]){
        return
    }else{
        window.location.href = '/'
    }
})()