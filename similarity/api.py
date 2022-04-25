from fastapi import FastAPI, Header, HTTPException, Query
from pydantic import BaseModel
from typing import List, Optional, Dict, Union
import random

import recommender as rec
from course import format_name
from dataset import lookup_by_name
from threading import Timer
import notif_component



app = FastAPI()

class Feedback(BaseModel):
    targets: Optional[List[str]] = None
    tags: Optional[List[str]] = None
    pos: Optional[List[str]] = None 
    neg: Optional[List[str]] = None
    done: Optional[List[str]] = None

class UserSign(BaseModel):
    course: str
    email: str
    sections: List[str]

# class Rec(BaseModel):
#     label: List[str] = None

# class CourseRecs(BaseModel):
#     combined_targets: List[str] = None
#     targets: List[Rec] = None 
#     combined_tags: List[str] = None 
#     tags: List[Rec] = None 

@app.put("/api/recs/", response_model=Dict[str, Union[List[List[str]], Dict[str, List[List[str]]]]])
async def get_recommendations(fb: Feedback):

    _targets = [] if fb.targets is None else fb.targets
    _tags = [] if fb.tags is None else fb.tags 
    _pos = [] if fb.pos is None else fb.pos
    _neg = [] if fb.neg is None else fb.neg 
    _done = [] if fb.done is None else fb.done 

    def format_score(score):
        return f'{score*100:.1f}'

    return {
        "targets": {
            t: [[repr(c), format_score(score)] for c, score in rec.rec_by_names([t], _pos, _neg, _done)] for t in _targets
        },
        "tags": {
            t: [[repr(c), format_score(score)] for c, score in rec.rec_by_tags([t], _pos, _neg, _done)] for t in _tags
        },
        "combined_tags": [[repr(c), format_score(score)] for c, score in rec.rec_by_tags(_tags, _pos, _neg, _done)],
        "combined_targets": [[repr(c), format_score(score)] for c, score in rec.rec_by_names(_targets, _pos, _neg, _done)],
        "all": [[repr(c), format_score(score)] for c, score in rec.rec_by_names_and_tags(_targets, _tags, _pos, _neg, _done)]
    } 


@app.post("/api/signup/", status_code=201)
async def signup(s: UserSign):
    notif_component.notify_me_email(s.email, s.course, s.sections)
    t = Timer(random.randint(30, 60), notif_component.send_signup_email(s.email, s.course, s.sections))
    t.start() # after 30 seconds, "hello, world" will be printed
    return {'course': s.course, 'email': s.email, 'sections': s.sections}



# @app.get("/api/{course_major}/{course_id}")
# async def get_recs(course_major: str, course_id: int):
#     return {"recs": [repr(c) for c in rec.rec_by_name(format_name(course_major, course_id))]}


# @app.get("/api/recs/")
# async def get_recs(
#     targets: Optional[List[str]] = Query(None),
#     tags: Optional[List[str]] = Query(None),
#     pos: Optional[List[str]] = Query(None), 
#     neg: Optional[List[str]] = Query(None),
#     done: Optional[List[str]] = Query(None)
# ):
#     _targets = [] if targets is None else targets
#     _tags = [] if tags is None else tags 
#     _pos = [] if pos is None else pos
#     _neg = [] if neg is None else neg 
#     _done = [] if done is None else done 

#     return {
#         "target": {
#             t: [repr(c) for c in rec.rec_by_names([t], _pos, _neg, _done)] for t in _targets
#         },
#         "tag": {
#             t: [repr(c) for c in rec.rec_by_tags([t], _pos, _neg, _done)] for t in _tags
#         },
#         "tags": {
#             repr(c) for c in rec.rec_by_tags(_tags, _pos, _neg, _done)
#         },
#         "targets": {
#             repr(c) for c in rec.rec_by_names(_targets, _pos, _neg, _done) 
#         }
#     }

