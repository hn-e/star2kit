from flask import Blueprint, jsonify
import db

list_bp = Blueprint('list', __name__)

@list_bp.route('/api/list')
def list_items():
    conn = db.get_db()
    items = conn.execute('SELECT * FROM items').fetchall()
    conn.close()
    return jsonify([dict(item) for item in items])
