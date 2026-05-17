from flask import Flask
from flask_cors import CORS
import db
from routes.push import push_bp
from routes.list import list_bp

app = Flask(__name__)
CORS(app)

db.init_db()
app.register_blueprint(push_bp)
app.register_blueprint(list_bp)

@app.route('/api/health')
def health():
    return {'status': 'ok'}

if __name__ == '__main__':
    app.run(port=3001, debug=True)
