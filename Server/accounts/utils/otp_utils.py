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
    redis_client.expire(key, OTP_EXPIRE_SECONDS)
    return otp


def resend_otp(email):
    key = f"{OTP_PREFIX}{email}"
    otp_data = redis_client.hgetall(key)
    if not otp_data:
        return None, "No existing OTP data for this email"
    resend_count = otp_data.get("resend_count")
    if resend_count >= MAX_RESEND_COUNT:
        return None, "OTP resend count reached"
    old_otp = otp_data.get("otp")
    redis_client.hincrby(key, "resend_count", 1)
    return old_otp


def verify_otp(email, otp):
    key = f"{OTP_PREFIX}{email}"
    otp_data = redis_client.hgetall(key)
    stored_otp = otp_data.get("otp")
    created_at = datetime.isoformat(otp_data.get("created_at"))

    if datetime.now() > (created_at + timedelta(seconds=OTP_EXPIRE_SECONDS)):
        return False, "OTP expired"

    if stored_otp != otp:
        return False, "Invalid OTP"

    return True, "OTP is valid"
