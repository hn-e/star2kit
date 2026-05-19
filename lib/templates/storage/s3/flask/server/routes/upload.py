from flask import Blueprint, request, jsonify
import boto3
import os
import time

upload_bp = Blueprint('upload', __name__)

s3 = boto3.client('s3',
    endpoint_url=os.environ.get('S3_ENDPOINT'),
    region_name=os.environ.get('S3_REGION', 'us-east-1'),
    aws_access_key_id=os.environ['S3_ACCESS_KEY'],
    aws_secret_access_key=os.environ['S3_SECRET_KEY'],
)
BUCKET = os.environ['S3_BUCKET_NAME']

@upload_bp.route('/api/upload', methods=['POST'])
def upload():
    file = request.files['file']
    key = f"{int(time.time())}-{file.filename}"
    s3.upload_fileobj(file, BUCKET, key)
    public_url = os.environ.get('S3_PUBLIC_URL', '')
    return jsonify({'key': key, 'url': f"{public_url}/{key}"})
