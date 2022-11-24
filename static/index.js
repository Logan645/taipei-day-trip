console.log('載入成功');

function attraction(id, image, name, mrtName, categoryName){
    let attraction = document.createElement('div');
    attraction.className = 'attraction';
    attraction.id = 'attraction'+id;
    document.querySelector('.attractions').appendChild(attraction);
    let attraction_img = document.createElement('div');
    attraction_img.className = 'attraction_img';
    attraction_img.id = 'image'+id;
    attraction_img.style.backgroundImage = `url(${image})`;
    document.querySelector('#attraction'+id).appendChild(attraction_img);
    let attraction_name = document.createElement('div');
    attraction_name.className = 'attraction_name';
    attraction_name.id = 'name'+id;
    attraction_name.textContent = name;
    document.querySelector('#image'+id).appendChild(attraction_name);
    let info = document.createElement('div');
    info.className = 'info';
    info.id = 'info'+id
    document.querySelector('#attraction'+id).appendChild(info);
    let mrt = document.createElement('div');
    mrt.className = 'mrt';
    mrt.id = 'mrt'+id;
    mrt.textContent = mrtName; 
    document.querySelector('#info'+id).appendChild(mrt);
    let category = document.createElement('div');
    category.className = 'category';
    category.id = 'category'+id;
    category.textContent = categoryName; 
    document.querySelector('#info'+id).appendChild(category);
}
// console.log(document.querySelector('.attractions'));
let id = 1
let url = 'https://www.travel.taipei/d_upload_ttn/sceneadmin/image/A0/B0/C0/D14/E810/F21/48d66fbd-1ba3-4efd-837a-3767db5f52e0.jpg';
let name1 = '國立故宮博物院'
let mrt = '士林'
let category = '藝文館所'

attraction(id, url, name1, mrt, category)