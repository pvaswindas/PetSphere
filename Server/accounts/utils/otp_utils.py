import redis
import random
from datetime import datetime, timedelta


redis_client = redis.StrictRedis(host='localhost', port=6379, db=0,
                                 decode_responses=True)


OTP_PREFIX = "otp_"
MAX_RESEND_COUNT = 10
OTP_EXPIRE_SECONDS = 600


def generate_otp(email):
    otp = str(random.randint(100000, 999999))
    key = f"{OTP_PREFIX}{email}"

    redis_client.hmset(key, {
        "otp": otp,
        "created_at": datetime.now().isoformat(),
        "resend_count": 0
    })

    expiry_minutes = 10
    redis_client.expire(key, OTP_EXPIRE_SECONDS)
    return otp, expiry_minutes


def resend_otp(email):
    key = f"{OTP_PREFIX}{email}"
    otp_data = redis_client.hgetall(key)
    if not otp_data:
        return None, "No existing OTP data for this email"
    resend_count = int(otp_data.get("resend_count"))

    if resend_count >= MAX_RESEND_COUNT:
        return None, "OTP resend count reached"
    old_otp = otp_data.get("otp")
    created_at_str = otp_data.get("created_at")
    created_at = datetime.fromisoformat(created_at_str)
    expiry_time = created_at + timedelta(seconds=OTP_EXPIRE_SECONDS)
    remaining_time = expiry_time - datetime.now()

    expiry_minutes = int(max(0, remaining_time.total_seconds() / 60))
    otp_entry = {
        "otp": old_otp,
        "expiry_minutes": expiry_minutes
    }
    redis_client.hincrby(key, "resend_count", 1)
    return otp_entry, "OTP resent successfully"


def verify_otp(email, otp):
    key = f"{OTP_PREFIX}{email}"
    otp_data = redis_client.hgetall(key)
    if not otp_data:
        return False, "OTP data not found"
    stored_otp = otp_data.get("otp")
    created_at_str = otp_data.get("created_at")
    try:
        created_at = datetime.fromisoformat(created_at_str)
    except ValueError:
        return False, "Invalid created_at format"
    if datetime.now() > (created_at + timedelta(seconds=OTP_EXPIRE_SECONDS)):
        return False, "OTP expired"
    if stored_otp != otp:
        return False, "Invalid OTP"
    redis_client.delete(key)
    return True, "OTP is valid"
