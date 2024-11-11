from flask import Flask, request, jsonify
from flask_mysqldb import MySQL
from flask_cors import CORS
from dotenv import load_dotenv
import os
import logging

app = Flask(__name__)
CORS(app)
mysql = MySQL(app)

load_dotenv()

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app.config["MYSQL_HOST"] = os.getenv("MYSQL_HOST")
app.config["MYSQL_USER"] = os.getenv("MYSQL_USER")
app.config["MYSQL_PASSWORD"] = os.getenv("MYSQL_PASSWORD")
app.config["MYSQL_DB"] = os.getenv("MYSQL_DB")

@app.route("/", methods=["GET", "POST"])
def home():
    user_id = request.args.get("user_id")

    if request.method == "POST":
        data = request.json
        new_goal_type = data.get("goal_type")
        
        if not new_goal_type:
            return jsonify({"error": "Goal type is required"}), 400

        cur = mysql.connection.cursor()
        try:
            # Insert the new goal type into the database
            cur.execute(
                'INSERT INTO goal_types (user_id, goal_type) VALUES (%s, %s)',
                (user_id, new_goal_type)
            )
            mysql.connection.commit()

            # Fetch the newly inserted ID
            new_goal_type_id = cur.lastrowid

        except Exception as e:
            mysql.connection.rollback()
            return jsonify({"error": str(e)}), 500
        finally:
            cur.close()

        return jsonify({
            "goal_type_id": new_goal_type_id,
            "goal_type": new_goal_type
        })

    elif request.method == "GET":
        cur = mysql.connection.cursor()

        cur.execute('SELECT goal_type_id, goal_type FROM goal_types WHERE user_id = %s', (user_id,))
        goal_types = cur.fetchall()

        response_data = {
            "goal_types": [{"goal_type_id": row[0], "goal_type": row[1]} for row in goal_types]
        }

        return jsonify(response_data)


# @app.route("/goalTypes", methods=["GET, POST"])
# def goalTypes():
#     pass

@app.route("/<goalType>/goals", methods=["GET, POST"])
def goals():
    pass


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)