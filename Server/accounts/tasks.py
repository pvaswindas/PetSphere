from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from .utils.tokens import token_generator


@shared_task
def send_otp_email(user_email, otp):
    subject = 'Your OTP for Email Verification'
    message = f'Your OTP is {otp}. Please use this OTP to verify your email.'
    from_email = settings.EMAIL_HOST_USER
    recipient_list = [user_email]

    try:
        send_mail(subject, message, from_email, recipient_list)
        return f'OTP sent to {user_email}'
    except Exception as e:
        return f'Failed to send OTP: {str(e)}'


@shared_task
def send_password_otp_email(user_email, otp):
    subject = 'Reset Your Password: Verification Code Inside'
    message = render_to_string("emails/forgot_password_email.txt",
                               {"otp": otp})
    from_email = settings.EMAIL_HOST_USER
    recipient_list = [user_email]

    try:
        send_mail(subject, message, from_email, recipient_list)
        return f'OTP sent to {user_email}'
    except Exception as e:
        return f'Failed to send OTP: {str(e)}'


@shared_task
def send_reset_email(user):
    token = token_generator.make_token(user)
    uid = user.pk
    reset_url = (
        f"http://localhost:3000/reset-password?uid={uid}&token={token}"
    )

    try:
        send_mail(
            subject="Reset Your Password",
            message=(
                f"Click the link to reset your password: {reset_url}\n\n"
                "The link will expire in 30 minutes."
            ),
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[user.email],
        )
        return "Email sent successfully"
    except Exception as e:
        return f"Failed to send email: {str(e)}"
