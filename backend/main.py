from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

app = FastAPI()

# Разрешаем запросы с фронтенда, запущенного на другом порту
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], # Адрес, где работает React
    allow_methods=["*"],
    allow_headers=["*"],
)

# Модель для хранения задачи (всего одно поле)
class Task(BaseModel):
    text: str

# База данных в памяти: список словарей {"text": "...", "id": ...}
tasks_db = []
task_id_counter = 1

# API: Получить все задачи
@app.get("/tasks", response_model=List[dict])
def get_tasks():
    return tasks_db

# API: Добавить новую задачу
@app.post("/tasks")
def add_task(task: Task):
    global task_id_counter
    new_task = {"id": task_id_counter, "text": task.text}
    tasks_db.append(new_task)
    task_id_counter += 1
    return new_task

# API: Удалить задачу по её id
@app.delete("/tasks/{task_id}")
def delete_task(task_id: int):
    global tasks_db
    tasks_db = [task for task in tasks_db if task["id"] != task_id]
    return {"ok": True}
