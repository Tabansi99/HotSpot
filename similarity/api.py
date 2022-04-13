from fastapi import FastAPI
import recommender as rec
from course import format_name

app = FastAPI()


@app.get("/api/{course_major}/{course_id}")
async def get_recs(course_major: str, course_id: int):
    return {"recs": rec.rec_by_name(format_name(course_major, course_id))}

# @app.get("/api/tags")
# async def get_tags():
#     return None