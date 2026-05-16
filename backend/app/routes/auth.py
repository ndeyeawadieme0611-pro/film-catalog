import os
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.schemas.auth import (
    RegisterRequest,
    LoginRequest,
    TokenResponse,
    ForgotPasswordRequest,
    ResetPasswordRequest,
)
from app.services.auth import (
    hash_password,
    verify_password,
    create_access_token,
    create_email_verification_token,
    create_password_reset_token,
    decode_token,
    send_verification_email,
    send_reset_password_email,
)

router = APIRouter(prefix="/auth", tags=["Auth"])

skip_email = os.getenv("SKIP_EMAIL_VERIFICATION", "false").lower() == "true"

@router.post("/register")
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == payload.email).first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    user = User(
    nom=payload.nom,
    prenom=payload.prenom,
    email=payload.email,
    hashed_password=hash_password(payload.password),
    is_active=skip_email,
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    if not skip_email:
        token = create_email_verification_token(user.email)
        send_verification_email(user.email, token)
        return {"message": "Compte créé. Vérifiez votre email pour l'activer."}

    return {"message": "Compte créé avec succès. Vous pouvez vous connecter."}

@router.get("/verify-email")
def verify_email(token: str, db: Session = Depends(get_db)):
    payload = decode_token(token)

    if payload.get("type") != "email_verification":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid verification token",
        )

    email = payload.get("sub")
    user = db.query(User).filter(User.email == email).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    user.is_active = True
    db.commit()

    return {"message": "Email verified successfully. You can now log in."}


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()

    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Please verify your email before logging in",
        )

    token = create_access_token({"sub": user.email})

    return {
    "access_token": token,
    "token_type": "bearer",
    "email": user.email,
    "nom": user.nom,
    "prenom": user.prenom,
}


@router.post("/forgot-password")
def forgot_password(payload: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()

    if user and user.is_active:
        token = create_password_reset_token(user.email)
        send_reset_password_email(user.email, token)

    return {"message": "Si cet email existe, un lien de réinitialisation a été envoyé."}


@router.post("/reset-password")
def reset_password(payload: ResetPasswordRequest, db: Session = Depends(get_db)):
    decoded = decode_token(payload.token)

    if decoded.get("type") != "password_reset":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Token invalide",
        )

    user = db.query(User).filter(User.email == decoded.get("sub")).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Utilisateur introuvable",
        )

    user.hashed_password = hash_password(payload.new_password)
    db.commit()

    return {"message": "Mot de passe réinitialisé avec succès."}