import os
import smtplib
from datetime import datetime, timedelta, timezone
from email.message import EmailMessage

from jose import jwt, JWTError
from passlib.context import CryptContext
from fastapi import HTTPException, status

SECRET_KEY = os.getenv("SECRET_KEY", "change-me")
ALGORITHM = "HS256"

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str):
    return pwd_context.hash(password)


def verify_password(password: str, hashed_password: str):
    return pwd_context.verify(password, hashed_password)


def create_access_token(data: dict, expires_minutes: int = 60):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=expires_minutes)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def create_email_verification_token(email: str):
    return create_access_token(
        {"sub": email, "type": "email_verification"},
        expires_minutes=60 * 24,
    )


def create_password_reset_token(email: str):
    return create_access_token(
        {"sub": email, "type": "password_reset"},
        expires_minutes=60,
    )


def decode_token(token: str):
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired token",
        )


def send_verification_email(to_email: str, token: str):
    backend_url = os.getenv("BACKEND_URL", "http://localhost:8000")
    verification_link = f"{backend_url}/auth/verify-email?token={token}"

    smtp_host = os.getenv("SMTP_HOST")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_user = os.getenv("SMTP_USER")
    smtp_password = os.getenv("SMTP_PASSWORD")
    smtp_from = os.getenv("SMTP_FROM", smtp_user)

    print("SMTP_HOST =", smtp_host)
    print("SMTP_USER =", smtp_user)
    print("SMTP_FROM =", smtp_from)

    if not smtp_host or not smtp_user or not smtp_password:
        print(f"EMAIL VERIFICATION LINK: {verification_link}")
        return

    message = EmailMessage()
    message["Subject"] = "Validez votre compte CineDB"
    message["From"] = smtp_from
    message["To"] = to_email
    message.set_content(
        f"""Bonjour,

Cliquez sur ce lien pour valider votre compte CineDB :

{verification_link}

Si vous n'avez pas créé ce compte, ignorez ce message.
"""
    )

    with smtplib.SMTP(smtp_host, smtp_port) as smtp:
        smtp.starttls()
        smtp.login(smtp_user, smtp_password)
        smtp.send_message(message)

    print(f"Verification email sent to {to_email}")


def send_reset_password_email(to_email: str, token: str):
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
    reset_link = f"{frontend_url}/reset-password?token={token}"

    smtp_host = os.getenv("SMTP_HOST")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_user = os.getenv("SMTP_USER")
    smtp_password = os.getenv("SMTP_PASSWORD")
    smtp_from = os.getenv("SMTP_FROM", smtp_user)

    if not smtp_host or not smtp_user or not smtp_password:
        print(f"PASSWORD RESET LINK: {reset_link}")
        return

    message = EmailMessage()
    message["Subject"] = "Réinitialisation de votre mot de passe CineDB"
    message["From"] = smtp_from
    message["To"] = to_email
    message.set_content(
        f"""Bonjour,

Cliquez sur ce lien pour réinitialiser votre mot de passe CineDB :

{reset_link}

Ce lien expire dans 1 heure.

Si vous n'avez pas fait cette demande, ignorez ce message.
"""
    )

    with smtplib.SMTP(smtp_host, smtp_port) as smtp:
        smtp.starttls()
        smtp.login(smtp_user, smtp_password)
        smtp.send_message(message)

    print(f"Password reset email sent to {to_email}")