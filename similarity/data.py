import firebase_admin
from firebase_admin import credentials, firestore

# Use a service account
cred = credentials.Certificate("secret.json")
firebase_admin.initialize_app(cred)

db = firestore.client()

def get_courses(course_name: str):
	# Read data
	courses_ref = db.collection(u'Courses')
	docs = courses_ref.stream()

	courses_list = []
	# Parse each course
	for doc in docs:
		doc_dict = doc.to_dict()
		courses_list.append(
			(
				doc.id, # CSCE 110
				doc_dict['Course Name'], # Programming I
				doc_dict['Course Credit Hours (l)'], # 4
				doc_dict['Course Description']
			)
		)

	# [(ID, Name, Credit Hours, Description), ... ]
	return courses_list

def to_title(course_name: str, course_id: int):
	return f'{course_name.upper()} {course_id}'