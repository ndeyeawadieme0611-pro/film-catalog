from sqlalchemy import Column, Integer, String, Float, Text, Boolean
from app.database import Base

class Film(Base):
    __tablename__ = "films"

    id = Column(Integer, primary_key=True, index=True)
    tmdb_id = Column(Integer, unique=True, index=True)
    title = Column(String(255), nullable=False)
    original_title = Column(String(255))
    overview = Column(Text)
    poster_path = Column(String(255))
    release_date = Column(String(20))
    vote_average = Column(Float)
    vote_count = Column(Integer)
    popularity = Column(Float)
    genres = Column(String(500))