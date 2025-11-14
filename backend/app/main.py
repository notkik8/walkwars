from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import Base, engine
from .routes import auth, groups, steps

# Создаём таблицы
Base.metadata.create_all(bind=engine)

app = FastAPI(title="WalkWars", version="1.0.0")

# CORS для React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключаем маршруты
app.include_router(auth.router)
app.include_router(groups.router)
app.include_router(steps.router)

@app.get("/")
async def root():
    return {"message": "Welcome to StepSquad API"}
