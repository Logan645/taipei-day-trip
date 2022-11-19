from flask import Blueprint, json, request, jsonify
from api.models import Attraction, db

attractions = Blueprint("attractions",__name__,)

@attractions.route('/api/attractions')
def api_attractions():
    try:
        page = request.args.get('page')
        keyword = request.args.get('keyword')
        if page is None:
            page = 0
        page = int(page)
        skip_row = page*12
        if keyword:
            sql = f'''select * from attractions where name LIKE "%%{keyword}%%" 
                or category = "{keyword}" limit 12 offset {skip_row}'''
        else:
            sql = f'select * from attractions limit 12 offset {skip_row}'
        data = db.engine.execute(sql).fetchall()
        attractions_arr=[]
        for i in data:
            images=json.loads(i[9])
            item = {
                '"id"': i[0],
                '"name"': i[1],
                '"category"': i[2],
                '"description"': i[3],
                '"address"': i[4],
                '"transport"': i[5],
                '"mrt"': i[6],
                '"lat"': i[7],
                '"lng"': i[8],
                '"images"': images
            }
            attractions_arr.append(item)
        skip_row = (page+1)*12
        if keyword:
            sql = f'''select * from attractions where name LIKE "%%{keyword}%%" 
                or category = "{keyword}" limit 12 offset {skip_row}'''
        else: 
            sql = f'select * from attractions limit 12 offset {skip_row}'
        next_page_data = db.engine.execute(sql).fetchall()
        if next_page_data == []:
            next_page = None
        else:
            next_page = page + 1
        return {
            '"nextPage"':next_page,
            '"data"':attractions_arr
        }
    except:
        return {
        '"error"': True,
        '"message"': "發生錯誤"
        },500

@attractions.route('/api/attraction/<attractionId>')
def api_attractionId(attractionId):
    #不確定為何下面這行不能work
    # data = Attraction.query.filter_by(id=attractionId).first()
    sql = 'select * from attractions where id = {}'.format(attractionId)
    data = db.engine.execute(sql).fetchone()
    # result = {
    #         "id": data[0],
    #         "name": data[1],
    #         "category": data[2],
    #         "description": data[3],
    #         "address": data[4],
    #         "transport": data[5],
    #         "mrt": data[6],
    #         "lat": data[7],
    #         "lng": data[8],
    #         "images": images
    #         }
    try:
        images=json.loads(data[9])
        return {
            '"data"' : {
            '"id"': data[0],
            '"name"': data[1],
            '"category"': data[2],
            '"description"': data[3],
            '"address"': data[4],
            '"transport"': data[5],
            '"mrt"': data[6],
            '"lat"': data[7],
            '"lng"': data[8],
            '"images"': images
            }
        }
    except:
        return {
        '"error"': True,
        '"message"': "發生錯誤，ID搜尋不到"
        },500

@attractions.route('/api/categories')
def show_categories():
    sql = 'select category from attractions'
    data = db.engine.execute(sql)
    print(data)
    print(type(data))
    try:
        category_list = []
        for i in data:
            i = str(i)
            category = i.replace("('","")
            category = category.replace("',)","")
            if category in set(category_list):
                pass
            else:  
                category_list.append(category)
        print(category_list)
        return {
            '"data"':category_list
        }
    except:
        return {
        '"error"': True,
        '"message"': "發生錯誤"
        },500

# @attractions.route('/api/test')
# def test_sql():
#     sql_cmd = "select *from attractions where id = 1"
#     query_data = db.engine.execute(sql_cmd).fetchall()
#     print(query_data)
#     return jsonify({
# 		'name':query_data[0][1]
# 		})
