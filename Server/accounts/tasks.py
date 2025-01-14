from celery import shared_task
from environs import Env
from twilio.rest import Client
import logging
from django.core.mail import EmailMessage
from django.conf import settings
from django.template.loader import render_to_string
from .utils.tokens import token_generator

env = Env()
env.read_env()

BASE_URL = env.str("BASE_URL")
account_sid = env.str("TWILIO_ACCOUNT_SID")
auth_token = env.str("TWILIO_AUTH_TOKEN")
twilio_phone_number = env.str("TWILIO_PHONE_NUMBER")

client = Client(account_sid, auth_token)

logger = logging.getLogger(__name__)


@shared_task
def send_otp_email(user_email, otp, expiry_minutes):
    """
    Sends an OTP email to a user for registration verification.

    Parameters:
        user_email (str): The recipient's email address.
        otp (str): The one-time password to include in the email.
        expiry_minutes (int): The validity period of the OTP in minutes.

    Returns:
        A message indicating whether the email was sent successfully or not.
    """
    subject = 'Your OTP for Registration on PetSphere'
    message = render_to_string(
        "emails/registration/registration_otp.html",
        {"otp": otp, "expiry_minutes": expiry_minutes}
    )
    from_email = settings.EMAIL_HOST_USER
    recipient_list = [user_email]

    email = EmailMessage(
        subject=subject,
        body=message,
        from_email=from_email,
        to=recipient_list,
    )
    email.content_subtype = "html"

    try:
        email.send()
        return f'OTP sent to {user_email}'
    except Exception as e:
        return f'Failed to send OTP: {str(e)}'


@shared_task
def send_reset_email(user):
    """
    Sends a password reset email containing a unique reset link.

    Parameters:
        user: The user object for whom the password reset email is being sent.

    Returns:
        A message indicating whether the email was sent successfully or not.
    """
    token = token_generator.make_token(user)
    uid = user.pk
    reset_password_url = f"?uid={uid}&token={token}"
    reset_url = f"http://localhost:3000/reset-password?uid={uid}&token={token}"

    subject = 'Reset Your Password'
    from_email = settings.EMAIL_HOST_USER
    recipient_list = [user.email]
    message = render_to_string(
        "emails/password/reset_password.html",
        {"reset_url": reset_url}
    )

    email = EmailMessage(
        subject=subject,
        body=message,
        from_email=from_email,
        to=recipient_list,
    )
    email.content_subtype = "html"

    try:
        email.send()
        return reset_password_url
    except Exception as e:
        return f"Failed to send email: {str(e)}"


@shared_task
def twilio_send_otp(phone_number, otp):
    """
    Sends an OTP via Twilio SMS for mobile number validation.

    Args:
        phone_number: The recipient's phone number, including country code.
        otp (str): The one-time password to send.

    Returns:
        str: The SID of the message sent or an error message.
    """
    try:
        message = client.messages.create(
            body=(
                "Your verification code is {otp}. Use this to complete "
                "your mobile number verification. This code is valid for "
                "10 minutes. Do not share it with anyone.".format(otp=otp)
            ),
            from_=twilio_phone_number,
            to=phone_number
        )
        return message.sid
    except Exception as e:
        logger.error(
            f"Error sending OTP to {phone_number}: {str(e)}"
        )
        return f"Failed to send OTP: {str(e)}"
