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

@app.route("/", methods=["GET"])
def home():

    user_id = request.args.get("user_id")
    cur = mysql.connection.cursor()

    cur.execute('SELECT goal_type_id, goal_type FROM goal_types WHERE user_id = %s', (user_id,))
    goal_types = cur.fetchall()

    response_data = {
        "goal_types": [{"goal_type_id": row[0], "goal_type": row[1]} for row in goal_types]
    }
    return jsonify(response_data)


@app.route("/goalTypes", methods=["POST"])
def create_goalTypes():

    user_id = request.args.get("user_id")

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

@app.route("/goalTypes", methods=["PUT"])
def update_goalTypes():
    user_id = request.args.get("user_id")
    data = request.json

    goal_type_id = data.get("goal_type_id")
    updated_goal_type = data.get("goal_type")

    if not goal_type_id or not updated_goal_type:
        return jsonify({"error": "Goal type ID and updated goal type are required"}), 400

    cur = mysql.connection.cursor()
    try:
        # Update the goal type in the database
        cur.execute(
            'UPDATE goal_types SET goal_type = %s WHERE goal_type_id = %s AND user_id = %s',
            (updated_goal_type, goal_type_id, user_id)
        )
        mysql.connection.commit()

        # Check if the update affected any rows
        if cur.rowcount == 0:
            return jsonify({"error": "No matching goal type found or no changes made"}), 404

    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()

    return jsonify({"message": "Goal type updated successfully"})


@app.route("/goalTypes", methods=["DELETE"])
def delete_goalTypes():
    user_id = request.args.get("user_id")
    data = request.json

    goal_type_id = data.get("goal_type_id")

    if not goal_type_id:
        return jsonify({"error": "Goal type ID is required"}), 400

    cur = mysql.connection.cursor()
    try:
        # Delete the goal type from the database
        cur.execute(
            'DELETE FROM goal_types WHERE goal_type_id = %s AND user_id = %s',
            (goal_type_id, user_id)
        )
        mysql.connection.commit()

        # Check if the delete operation affected any rows
        if cur.rowcount == 0:
            return jsonify({"error": "No matching goal type found"}), 404

    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()

    return jsonify({"message": "Goal type deleted successfully"})


@app.route("/<goalType>/goals", methods=["GET"])
def get_goals():
    pass

@app.route("/<goalType>/goals", methods=["POST"])
def create_goals(goalType):
    user_id = request.args.get("user_id")
    if not user_id:
        return jsonify({"error": "User ID is required"}), 400

    # Extract goal data from the request JSON payload
    data = request.json
    goal_title = data.get("goal_title")
    goal_description = data.get("goal_description")
    goal_status = data.get("goal_status")
    goal_type_id = data.get("goal_type_id")

    if not all([goal_title, goal_description, goal_status, goal_type_id]):
        return jsonify({"error": "All goal data is required"}), 400

    try:
        cur = mysql.connection.cursor()
        
        # Insert the new goal into the goals table
        cur.execute(
            '''
            INSERT INTO goals (user_id, goal_type_id, goal_title, goal_description, goal_status)
            VALUES (%s, %s, %s, %s, %s)
            ''',
            (user_id, goal_type_id, goal_title, goal_description, goal_status)
        )
        
        # Commit changes and get the ID of the newly inserted goal
        mysql.connection.commit()
        new_goal_id = cur.lastrowid
    
        return jsonify({
            "goal_id": new_goal_id,
            "user_id": user_id,
            "goal_type_id": goal_type_id,
            "goal_title": goal_title,
            "goal_description": goal_description,
            "goal_status": goal_status,
        }), 201

    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()

@app.route("/<goalType>/goals", methods=["PUT"])
def update_goals():
    pass

@app.route("/<goalType>/goals", methods=["DELETE"])
def delete_goals():
    pass


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)



