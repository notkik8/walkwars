# Файлик конфигурации тестовой бд, для легкого взаимодействия с бд для тестов
import pytest
import json
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from backend.app.main import app
from backend.app.database import Base, get_db
from backend.app.models import Group

# Тестовая БД (можно PostgreSQL, можно SQLite)
SQLALCHEMY_DATABASE_URL_TEST = "sqlite:///./test.db"
# Для SQLite нужно connect_args; для PostgreSQL это не нужно
engine = create_engine(
    SQLALCHEMY_DATABASE_URL_TEST, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# Создаём / удаляем таблицы один раз за сессию тестов
@pytest.fixture(scope="session", autouse=True)
def prepare_database():
    Base.metadata.create_all(bind=engine)
    SessionLocal = sessionmaker(bind=engine)
    db = SessionLocal()

    with open("tests/groups.json", encoding="utf-8") as f:
        groups = json.load(f)

    for g in groups:
        db.add(Group(**g))
    db.commit()
    db.close()

    yield
    Base.metadata.drop_all(bind=engine)

# Даём каждому тесту свою сессию БД
@pytest.fixture(scope="function")
def db_session():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


# Клиент FastAPI с подменённой зависимостью get_db
@pytest.fixture(scope="function")
def client(db_session):
    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()

# Создаем тестового пользователя для проверки входа W в чатик
@pytest.fixture(scope="function", autouse=True)
def register_user(client):
    client.post(
        "/auth/register",
        json={
            "username": "psina",
            "email": "kot@pes.com",
            "password": "123",
        },
    )


@pytest.fixture(scope="function")
def authenticated_client(register_user, client):
    # логин
    resp = client.post(
        "/auth/login",
        data={"username": "psina", "password": "123"},
    )
    assert resp.status_code == 200

    # если /auth/login возвращает JSON {"access_token": "...", "token_type": "bearer"}
    token = resp.json()["access_token"]
    client.headers.update({"Authorization": f"Bearer {token}"})

    yield client
