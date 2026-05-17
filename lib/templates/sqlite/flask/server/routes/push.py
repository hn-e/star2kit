from flask import Blueprint, request, jsonify
import db

push_bp = Blueprint('push', __name__)

@push_bp.route('/api/push', methods=['POST'])
def push():
    data = request.get_json()
    conn = db.get_db()
    conn.execute('INSERT INTO items (name, message) VALUES (?, ?)', [data['name'], data['message']])
    conn.commit()
    conn.close()
    return jsonify({'status': 'ok'})
