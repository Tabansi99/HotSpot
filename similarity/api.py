from fastapi import FastAPI
import recommender as rec

app = FastAPI()


@app.get("/api/{course}/{course_id}")
async def get_recs(course: str, course_id: int):
    return {"recs": rec.recommend(course, course_id, n_recs=4)}