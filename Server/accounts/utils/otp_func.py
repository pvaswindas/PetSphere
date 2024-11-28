from ..models import EmailOTP
from django.utils.timezone import now
import random


def generate_otp(email):
    otp = str(random.randint(100000, 999999))
    otp_entry, created = EmailOTP.objects.update_or_create(
        email=email,
        defaults={
            'otp': otp,
            'created_at': now(),
            'resend_count': 0,
        }
    )
    return otp_entry


def regenerate_otp(old_otp):
    while True:
        otp = str(random.randint(100000, 999999))
        if otp != old_otp:
            return otp


def verify_otp(email, otp):
    try:
        otp_entry = EmailOTP.objects.filter(email=email, otp=otp).first()
        if not otp_entry:
            return False, "Invalid OTP"
        if not otp_entry.is_valid():
            return False, "OTP is expired"
        return True, "OTP is valid"
    except Exception as e:
        return False, f"An error occurred: {str(e)}"


def resend_otp(email):
    otp_entry = EmailOTP.objects.filter(email=email).first()
    if not otp_entry:
        return False, "Invalid email"
    if not otp_entry.can_resend():
        return False, "OTP resend limit reached, try again after some time"

    old_otp = otp_entry.otp
    new_otp = regenerate_otp(old_otp)
    otp_entry.otp = new_otp
    otp_entry.created_at = now()
    otp_entry.resend_count += 1
    otp_entry.save()
    return otp_entry
