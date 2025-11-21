from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "WalkWars"
    database_url: str = "postgresql://kik8@localhost:5432/walkwars"
    SECRET_KEY: str = "a972a3d21259edf6e4d1bbe02d2845cef8f63b828be9638425cde0b0c9da9f96"
    debug: bool = True
    core_origins: list = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        "http://localhost:8000",
    ]
    ALGORITHM: str = "HS256"
    static_dir: str = "static"
    images_dir: str = "static/img"

    class Config:
        env_file = ".env"


settings = Settings()
