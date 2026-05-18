from flask import Blueprint, request, jsonify
import boto3
import os
import time

upload_bp = Blueprint('upload', __name__)

s3 = boto3.client('s3',
    endpoint_url=os.environ['R2_ENDPOINT'],
    aws_access_key_id=os.environ['R2_ACCESS_KEY'],
    aws_secret_access_key=os.environ['R2_SECRET_KEY'],
)
BUCKET = os.environ['R2_BUCKET_NAME']

@upload_bp.route('/api/upload', methods=['POST'])
def upload():
    file = request.files['file']
    key = f"{int(time.time())}-{file.filename}"
    s3.upload_fileobj(file, BUCKET, key)
    public_url = os.environ.get('R2_PUBLIC_URL', '')
    return jsonify({'key': key, 'url': f"{public_url}/{key}"})
