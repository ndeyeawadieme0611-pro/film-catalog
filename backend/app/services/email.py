import os
import smtplib
from email.message import EmailMessage


SMTP_HOST = os.getenv("SMTP_HOST")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
SMTP_FROM = os.getenv("SMTP_FROM", SMTP_USER)


def send_verification_email(to_email: str, token: str):
    verification_link = f"http://localhost:8000/auth/verify-email?token={token}"

    if not SMTP_HOST or not SMTP_USER or not SMTP_PASSWORD:
        print(f"EMAIL VERIFICATION LINK: {verification_link}")
        return

    message = EmailMessage()
    message["Subject"] = "Validez votre compte CineDB"
    message["From"] = SMTP_FROM
    message["To"] = to_email

    message.set_content(
        f"""
Bonjour,

Merci de créer votre compte CineDB.

Cliquez sur ce lien pour valider votre compte :
{verification_link}

Si vous n'avez pas créé ce compte, ignorez ce message.
"""
    )

    with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as smtp:
        smtp.starttls()
        smtp.login(SMTP_USER, SMTP_PASSWORD)
        smtp.send_message(message)