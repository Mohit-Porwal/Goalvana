from flask import Flask, request, jsonify
from flask_mysqldb import MySQL
from flask_cors import CORS
from dotenv import load_dotenv
import os
import logging

import requests

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
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')

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
def get_goals(goalType):

    user_id = request.args.get("user_id")
    goal_type_id = request.args.get("goal_type_id")

    if not user_id:
        return jsonify({"error": "User ID is required"}), 400
    if not goal_type_id:
        return jsonify({"error": "Goal type ID is required"}), 400

    try:
        cur = mysql.connection.cursor()

        query = '''
            SELECT goal_id, user_id, goal_type_id, goal_title, goal_description, goal_status
            FROM goals
            WHERE user_id = %s AND goal_type_id = %s
        '''
        cur.execute(query, (user_id, goal_type_id))
        goals = cur.fetchall()

        # Group goals based on their status
        goals_by_status = {
            "Not started": [],
            "In Progress": [],
            "Completed": []
        }

        for goal in goals:
            goal_data = {
                "goal_id": goal[0],
                "user_id": goal[1],
                "goal_type_id": goal[2],
                "goal_title": goal[3],
                "goal_description": goal[4],
                "goal_status": goal[5],
            }

            if goal_data["goal_status"] in goals_by_status:
                goals_by_status[goal_data["goal_status"]].append(goal_data)

        return jsonify(goals_by_status), 200

    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()


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
def update_goals(goalType):
    """
    Updates a goal based on the provided data. Expects the goal ID to identify which goal to update.
    """
    data = request.json

    # Validate required fields
    goal_id = data.get("goal_id")
    if not goal_id:
        return jsonify({"error": "Goal ID is required"}), 400

    user_id = data.get("user_id")
    goal_title = data.get("goal_title")
    goal_description = data.get("goal_description")
    goal_status = data.get("goal_status")

    # Ensure at least one field is provided to update
    if not any([goal_title, goal_description, goal_status]):
        return jsonify({"error": "At least one field to update is required"}), 400

    try:
        cur = mysql.connection.cursor()

        # Build the query dynamically based on the provided fields
        update_fields = []
        params = []

        if goal_title:
            update_fields.append("goal_title = %s")
            params.append(goal_title)
        if goal_description:
            update_fields.append("goal_description = %s")
            params.append(goal_description)
        if goal_status:
            update_fields.append("goal_status = %s")
            params.append(goal_status)

        # Add updated_at field
        update_fields.append("updated_at = NOW()")

        # Finalize query
        params.append(goal_id)
        params.append(user_id)
        query = f"UPDATE goals SET {', '.join(update_fields)} WHERE goal_id = %s AND user_id = %s"

        cur.execute(query, tuple(params))
        mysql.connection.commit()

        return jsonify({"message": "Goal updated successfully"}), 200

    except Exception as e:
        print("Error updating goal:", e)
        return jsonify({"error": "An error occurred while updating the goal"}), 500


@app.route("/<goalType>/goals", methods=["DELETE"])
def delete_goals(goalType):
    """
    Deletes a goal based on the provided goal ID.
    """
    goal_id = request.args.get("goal_id")
    user_id = request.args.get("user_id")

    if not goal_id or not user_id:
        return jsonify({"error": "Goal ID and User ID are required"}), 400

    try:
        cur = mysql.connection.cursor()

        # Delete the goal
        query = "DELETE FROM goals WHERE goal_id = %s AND user_id = %s"
        cur.execute(query, (goal_id, user_id))
        mysql.connection.commit()

        if cur.rowcount == 0:
            return jsonify({"message": "No goal found with the provided ID"}), 404

        return jsonify({"message": "Goal deleted successfully"}), 200

    except Exception as e:
        print("Error deleting goal:", e)
        return jsonify({"error": "An error occurred while deleting the goal"}), 500


@app.route("/goalInsights", methods=["GET"])
def get_goal_insights():
    user_id = request.args.get("user_id")
    if not user_id:
        return jsonify({"error": "Missing user_id"}), 400
    
    try:
        cur = mysql.connection.cursor()
        
        # Queries to count total goal types and goals
        queries = {
            "total_goal_types": "SELECT COUNT(goal_type_id) FROM goal_types WHERE user_id = %s",
            "total_goals": "SELECT COUNT(goal_id) FROM goals WHERE user_id = %s",
            "total_not_started": "SELECT COUNT(goal_status) FROM goals WHERE goal_status = %s AND user_id = %s",
            "total_in_progress": "SELECT COUNT(goal_status) FROM goals WHERE goal_status = %s AND user_id = %s",
            "total_completed": "SELECT COUNT(goal_status) FROM goals WHERE goal_status = %s AND user_id = %s"
        }
        
        # Execute queries and store results
        cur.execute(queries["total_goal_types"], (user_id,))
        total_goal_types = cur.fetchone()[0]
        
        cur.execute(queries["total_goals"], (user_id,))
        total_goals = cur.fetchone()[0]

        statuses = {
            "Not started": 0,
            "In progress": 0,
            "Completed": 0
        }

        for status in statuses:
            cur.execute(queries[f"total_{status.lower().replace(' ', '_')}"], (status, user_id))
            statuses[status] = cur.fetchone()[0]

        # Calculate percentages
        if total_goals > 0:
            percent_of_not_started = (statuses["Not started"] / total_goals) * 100
            percent_of_in_progress = (statuses["In progress"] / total_goals) * 100
            percent_of_completed = (statuses["Completed"] / total_goals) * 100
        else:
            percent_of_not_started = percent_of_in_progress = percent_of_completed = 0

        return jsonify({
            "total_goal_types": total_goal_types,
            "total_goals": total_goals,
            "total_not_started": statuses["Not started"],
            "total_in_progress": statuses["In progress"],
            "total_completed": statuses["Completed"],
            "percent_of_not_started": percent_of_not_started,
            "percent_of_in_progress": percent_of_in_progress,
            "percent_of_completed": percent_of_completed
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        cur.close()

@app.route('/api/openai', methods=['POST'])
def call_openai():
    data = request.json
    prompt = data.get('prompt')

    headers = {
        'Authorization': f'Bearer {OPENAI_API_KEY}',
        'Content-Type': 'application/json'
    }
    payload = {
        'model': 'gpt-4o-mini',
        'messages': [{'role': 'user', 'content': prompt}],
        'max_tokens': 400,
        'temperature': 0.8
    }

    response = requests.post('https://api.openai.com/v1/chat/completions', headers=headers, json=payload)

    if response.status_code == 200:
        return jsonify(response.json())
    else:
        return jsonify({'error': 'Failed to fetch OpenAI response'}), response.status_code

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)



