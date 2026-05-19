from flask import Blueprint, jsonify
import boto3
import os

files_bp = Blueprint('files', __name__)

s3 = boto3.client('s3',
    endpoint_url=os.environ.get('S3_ENDPOINT'),
    region_name=os.environ.get('S3_REGION', 'us-east-1'),
    aws_access_key_id=os.environ['S3_ACCESS_KEY'],
    aws_secret_access_key=os.environ['S3_SECRET_KEY'],
)
BUCKET = os.environ['S3_BUCKET_NAME']

@files_bp.route('/api/files')
def files():
    result = s3.list_objects_v2(Bucket=BUCKET)
    items = []
    for obj in result.get('Contents', []):
        items.append({
            'key': obj['Key'],
            'size': obj['Size'],
            'lastModified': obj['LastModified'].isoformat(),
            'url': f"{os.environ.get('S3_PUBLIC_URL', '')}/{obj['Key']}",
        })
    return jsonify(items)
