from fastapi import FastAPI
import recommender as rec
from course import format_name

app = FastAPI()


@app.get("/api/{course_major}/{course_id}")
async def get_recs(course_major: str, course_id: int):
    return {"recs": rec.recommend(format_name(course, course_id), n_recs=4)}

@app.get("/api/tags")
async def get_tags():
    return 