import firebase_admin
from firebase_admin import credentials, firestore
from course import Course

# Use a service account
cred = credentials.Certificate("secret.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

def get_courses():
	# Read data
	courses_ref = db.collection(u'Courses')
	docs = courses_ref.stream()

	course_list = []
	# Parse each course
	for doc in docs:
		doc_dict = doc.to_dict()
		course_list.append(
			(
				doc.id, # CSCE 110
				doc_dict['Course Name'], # Programming I
				doc_dict['Course Credit Hours (l)'], # 4
				doc_dict['Course Description']
			)
		)

	# [(ID, Name, Credit Hours, Description), ... ]
	return [Course(name, title, hours, desc) for name, title, hours, desc in course_list]

def lookup_by_name(course_name: str):
	target_course = Course(course_name)
	if target_course in _courses_set:
		return _courses[_courses.index(target_course)]
	return None

_courses = get_courses()
_courses_set = set(_courses)
