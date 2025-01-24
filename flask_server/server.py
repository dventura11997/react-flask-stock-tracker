#Start-up steps
# cd C:\Users\danie\OneDrive\Work\Career\Coding\Folio\Peak2Trough\react-flask-stock-tracker\flask_server
# env/scripts/activate
# Python server.py 

import jwt
import datetime
from flask import Flask, request, jsonify, session, redirect, url_for
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import and_, text
import numpy as np
import pandas as pd

app = Flask(__name__)
app.secret_key = "hello"
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'mssql+pyodbc://MSI/dev?driver=ODBC+Driver+17+for+SQL+Server'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # Optional, disables a warning

db = SQLAlchemy(app)  # Initialize SQLAlchemy with your app

class users(db.Model):
    id = db.Column("id", db.Integer, primary_key=True)
    first_name = db.Column(db.String(100))
    last_name = db.Column(db.String(100))
    email = db.Column(db.String(100))
    password = db.Column(db.String(100))
    preferred_broker = db.Column(db.String(100))

class users_stocks(db.Model):
    user_stock_id = db.Column("id", db.Integer, primary_key=True)
    email = db.Column(db.String(100))
    ticker = db.Column(db.String(100))
    date_added = db.Column(db.String(100))

class users_alert(db.Model):
    stock_alert_id = db.Column("id", db.Integer, primary_key=True)
    email = db.Column(db.String(100))
    ticker = db.Column(db.String(100))
    date_added = db.Column(db.String(100))
    alert_type = db.Column(db.String(100))
    alert_threshold = db.Column(db.String(100))


@app.route('/join', methods=['POST'])
def join_form():
    try:
        # Get the data from the POST request
        data = request.json  # This will be a JSON object
        email=data.get('Email')
        
        # Ensure all required fields are present
        required_fields = ['FirstName', 'LastName', 'Email', 'Password', 'PreferredBroker']
        
        # Check for missing fields
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return jsonify({'error': f'Missing fields: {", ".join(missing_fields)}'}), 400

        # Ensure no fields are empty
        if not all([data.get(field) for field in required_fields]):
            return jsonify({'error': 'Fields cannot be empty'}), 400
        
        user = users.query.filter_by(email=email).first()
        if user:
            return jsonify({'error': f'User already exists: {email}'}), 400
        
        # Add the new user directly to the database
        new_user = users(
            first_name=data.get('FirstName'),
            last_name=data.get('LastName'),
            email=email,
            password=data.get('Password'),
            preferred_broker=data.get('PreferredBroker')
        )

        db.session.add(new_user)
        db.session.commit()
        
        # Respond with a success message
        return jsonify({"message": "User added successfully", "data": data}), 200
    
    except Exception as e:
        # Catch all unexpected errors
        return jsonify({'error': f'An error occurred: {str(e)}'}), 500
    
@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.json  # This will be a JSON object

        # Validate input
        email = data.get('Email')
        password = data.get('Password')
        if not email or not password:
            return jsonify({'error': 'Email and password are required'}), 400
        
        # Check if user exists
        user = users.query.filter_by(email=email).first()
        if not user:
            return jsonify({'error': 'Username not found'}), 401
        
        password = users.query.filter(and_(users.email == email, users.password == password)).first()
        if not password:
            return jsonify({'error': 'Invalid password'}), 401
        
        # Create JWT token for a secure session
        token = jwt.encode({
            'user_id': user.id,
            'email': user.email,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
        }, app.config['SECRET_KEY'], algorithm='HS256')
        return jsonify({'token': token}), 200
    
    except Exception as e:
        return jsonify({'error': f'An error occurred: {str(e)}'}), 500
    
    
@app.route('/save_stock', methods=['POST'])
def save_stock():
    try:
        data = request.json
        ticker = data.get('Ticker')
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
        
        if not ticker:
            return jsonify({'error': 'Ticker required'}), 400

        #date_added = .now(datetime.timezone.utc)
        date_added = datetime.datetime.utcnow()

        try:
            # Decode the JWT and get the user data
            decoded_token = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            #user = users.query.get(decoded_token['user_id'])  # Get user by user_id
            email = decoded_token.get('email')
        
            stock_repeat = users_stocks.query.filter_by(email=email, ticker=ticker).first()
            if stock_repeat:
                return jsonify({'error': f'Stock already added for {email}: {ticker}'}), 400

            # Add the new user directly to the database
            new_user_stock = users_stocks(
                email=email,
                ticker=data.get('Ticker'),
                date_added=date_added,
            )

            db.session.add(new_user_stock)
            db.session.commit()

            # Respond with a success message
            return jsonify({"message": "User stock added successfully", "data": data}), 200

        except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
            return jsonify({'error': 'Invalid or expired token, user may not have logged in'}), 401

    except Exception as e:
        return jsonify({'error': f'An error occurred: {str(e)}'}), 500

@app.route('/save_alert', methods=['POST'])
def save_alert():
    try:
        try:
            data = request.json
            ticker = data.get('Ticker')
            alert_type = data.get('AlertType')
            alert_threshold = data.get('AlertThreshold')
        except Exception as e:
            return jsonify({'error': 'Couldnt get data from request'}), 401

        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
        
        if not (ticker and alert_type and alert_threshold):
            return jsonify({'error': 'Ticker required'}), 400

        date_added = datetime.datetime.utcnow()

        try:
            # Decode the JWT and get the user data
            decoded_token = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            #user = users.query.get(decoded_token['user_id'])  # Get user by user_id
            email = decoded_token.get('email')

            alert_repeat = users_alert.query.filter_by(email=email, ticker=ticker, alert_threshold=alert_threshold).first()
            if alert_repeat:
                return jsonify({'error': f'Stock alert already added for: {email}, {ticker}, {alert_threshold}'}), 400


            # Add the new user directly to the database
            new_user_alert = users_alert(
                email=email,
                ticker=ticker,
                date_added=date_added,
                alert_type=alert_type,
                alert_threshold=alert_threshold,
            )

            db.session.add(new_user_alert)
            db.session.commit()

            # Respond with a success message
            return jsonify({"message": "User stock alert added successfully", "data": data}), 200
        
        except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
            return jsonify({'error': 'Invalid or expired token, user may not have logged in'}), 401
    
    except Exception as e:
        return jsonify({'error': f'An error occurred: {str(e)}'}), 500


@app.route('/profile', methods=['GET'])
def profile():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'error': 'Token is missing'}), 401

    try:
        # Decode the JWT and get the user data
        decoded_token = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        #user = users.query.get(decoded_token['user_id'])  # Get user by user_id
        email = decoded_token.get('email')

        con = db.engine.connect()  # Adjust according to your database driver
        #Uses the email param
        query = text("SELECT * FROM [dev].[p2t_int].[profile_stock_data] WHERE email = :email")
        result = pd.read_sql_query(query, con, params={"email": email})

        result_dict = result.to_dict(orient='records')

        return jsonify(result_dict), 200
    
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
        return jsonify({'error': 'Invalid or expired token'}), 401

@app.route('/stock_kpis', methods=['GET'])
def get_stock_data():
    try:
        con = db.engine.connect()  # Adjust according to your database driver
        result = pd.read_sql_query("SELECT * FROM [dev].[p2t_int].[stock_data]", con)

        result_dict = result.to_dict(orient='records')

        db.session.commit()

        return jsonify(result_dict), 200

    except Exception as e:
        return jsonify({'error': f'An error occured fetching stock data from the db: {str(e)}'}), 500
    
@app.route('/stock_ts', methods=['GET'])
def get_stock_ts():
    try:
        con = db.engine.connect()  # Adjust according to your database driver
        result = pd.read_sql_query("SELECT * FROM [dev].[p2t_raw].[stock_ts]", con)

        if result['Close'].isna().any():  # Check if there are any NaN values in the 'Close' column
            result['Close'] = result['Close'].replace(np.nan, None)  # Replace NaN with None

        # Format the 'Date' column to the desired format
        result['Date'] = result['Date'].dt.strftime('%Y-%m-%d %H:%M:%S.%f')

        result_dict = result.to_dict(orient='records')

        db.session.commit()

        return jsonify(result_dict), 200

    except Exception as e:
        return jsonify({'error': f'An error occured fetching stock data from the db: {str(e)}'}), 500
    

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)

