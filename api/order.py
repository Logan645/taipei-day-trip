from flask import *
from api.models import db
import jwt
from dotenv import load_dotenv
import os
import json
from datetime import *
import requests
import time

load_dotenv()
JWT_Key = os.getenv('JWT_Key')
partner_key = os.getenv('partner_key')
order = Blueprint( "order", __name__ )

@order.route('/order', methods=['POST'])
def pay_for_order():
    cookie = request.cookies.get('JWT')
    try:
        if cookie:
            user_id = jwt.decode(cookie, JWT_Key ,algorithms="HS256")['id']
            order = request.json
            prime = order["prime"]
            price = order["order"]["price"]
            name = order["order"]["contact"]["name"]
            email = order["order"]["contact"]["email"]
            phone = order["order"]["contact"]["phone"]
            attraction_id = order["order"]["trip"]["attraction"]["id"]
            date = time.strptime(order["order"]["trip"]["date"], "%Y-%b-%d") #2022-Dec-24
            order_time = order["order"]["trip"]["time"]
            order_number = datetime.now().strftime('%Y%m%d%H%M%S') #%f微秒作为一个十进制数，零填充到 6 位

            # 建立訂單
            request_body = json.dumps({
                "prime": prime,
                "partner_key": partner_key,
                "merchant_id": "logan645_ESUN",
                "order_number": order_number,
                "details":"旅遊行程",
                "amount": price,
                "cardholder": {
                    "phone_number": phone,
                    "name": name,
                    "email": email
                },
                "remember": False
            })
            headers = {
                'Content-type': 'application/json',
                'x-api-key': partner_key
            }
            pay_url = 'https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime'
            res = requests.post(pay_url, data=request_body, headers=headers)
            response = res.json()
            if response['status'] == 0:
                sql = 'DELETE FROM cart WHERE user_id = %s'
                val = (user_id,)
                db.engine.execute(sql, val)
                sql = '''
                    insert into order_data (user_id, attraction_id, date, time, price, order_number, rec_trade_id, bank_transaction_id, name, email, phone, status) 
                    values (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                '''
                val = (user_id, attraction_id, date, order_time, price, order_number, response['rec_trade_id'], response['bank_transaction_id'], name, email, phone, 0)
                db.engine.execute(sql, val)
                result ={
                    "data":{
                        "number":order_number,
                        "payment":{
                            "status": 0,
                            "message": "付款成功"
                        }
                    }
                }
                return jsonify(result), 200
            else:
                sql = 'DELETE FROM cart WHERE user_id = %s'
                val = (user_id,)
                db.engine.execute(sql, val)
                sql = '''
                    insert into order_data (user_id, attraction_id, date, time, price, order_number, name, email, phone) 
                    values (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                '''
                val = (user_id, attraction_id, date, order_time, price, order_number, name, email, phone)
                db.engine.execute(sql, val)
                result = {
                    "error": True,
                    "message": response['msg']
                }
                return jsonify(result), 400

        else:
            response = {
                "error": True,
                "message": "請先登入系統"
            }
            return jsonify(response), 403
    except:
        response = {
            "error": True,
            "message": "伺服器發生錯誤請稍後再試"
        }
        return jsonify(response), 500

@order.route('/order/<orderNumber>', methods=['GET'])
def get_order(orderNumber):
    cookie = request.cookies.get('JWT')
    try:
        if cookie:
            user_id = jwt.decode(cookie, JWT_Key ,algorithms="HS256")['id']
            sql = '''
            select order_number, price, attraction_id, attractions.name, address, images, date, time, order_data.name, email, phone, status 
            from order_data left join attractions on order_data.attraction_id = attractions.id 
            where order_number = %s and user_id = %s;
            '''
            val = (orderNumber, user_id)
            order_data = db.engine.execute(sql, val).fetchone()
            # print(type(order_data[5]))
            response = {
                "data": {
                    "number": order_data[0],
                    "price": order_data[1],
                    "trip": {
                    "attraction": {
                        "id": order_data[2],
                        "name": order_data[3],
                        "address": order_data[4],
                        "image": json.loads(order_data[5])[0]
                    },
                    "date": order_data[6],
                    "time": order_data[7]
                    },
                    "contact": {
                    "name": order_data[8],
                    "email": order_data[9],
                    "phone": order_data[10],
                    },
                    "status": order_data[11]
                }
            }
            return jsonify(response)
        else:
            response = {
                "error": True,
                "message": "請先登入系統"
            }
            return jsonify(response), 403
    except:
        response = {
            "error": True,
            "message": "伺服器發生錯誤請稍後再試"
        }
        return jsonify(response), 500