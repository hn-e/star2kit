from flask import Blueprint, jsonify
import boto3
import os

files_bp = Blueprint('files', __name__)

s3 = boto3.client('s3',
    endpoint_url=os.environ['R2_ENDPOINT'],
    aws_access_key_id=os.environ['R2_ACCESS_KEY'],
    aws_secret_access_key=os.environ['R2_SECRET_KEY'],
)
BUCKET = os.environ['R2_BUCKET_NAME']

@files_bp.route('/api/files')
def files():
    result = s3.list_objects_v2(Bucket=BUCKET)
    items = []
    for obj in result.get('Contents', []):
        items.append({
            'key': obj['Key'],
            'size': obj['Size'],
            'lastModified': obj['LastModified'].isoformat(),
            'url': f"{os.environ.get('R2_PUBLIC_URL', '')}/{obj['Key']}",
        })
    return jsonify(items)
