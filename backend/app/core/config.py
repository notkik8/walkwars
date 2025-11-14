from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "WalkWars"
    database_url: str = "postgresql://localhost/walkwars"
    secret_key: str = "secret_key"
    debug: bool = True
    core_origins: list = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        "http://localhost:8000",
    ]
    static_dir: str = "static"
    images_dir: str = "static/img"

    class Config:
        env_file = ".env"


settings = Settings()
