import firebase_admin
from firebase_admin import credentials, firestore
from course import Course
from collections import defaultdict

# Use a service account
cred = credentials.Certificate("secret.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

IGNORED_COURSES = [
	'CSCE 291',
	'CSCE 491',
	'CSCE 285',
	'CSCE 485',
	'CSCE 289',
	'CSCE 489',
]

def _pull_courses():
	# Read data
	courses_ref = db.collection(u'Courses')
	docs = courses_ref.stream()

	course_list = []
	pre_chain = defaultdict(None)
	# Parse each course
	for doc in docs:
		if doc.id in IGNORED_COURSES: continue

		doc_dict = doc.to_dict()

		course_list.append(
			(
				doc.id, # CSCE 110
				doc_dict['Course Name'], # Programming I
				doc_dict['Course Credit Hours (l)'], # 4
				doc_dict['Course Description'],
			)
		)

		pre_lookup = doc_dict['Prerequisites']
		pre = pre_lookup if (pre_lookup not in ['non-course related', 'N/A']) and ('CSCE' in pre_lookup) else None
		pre_chain[doc.id] = pre

	pre_store = defaultdict(list)
	for _name, _, _, _ in course_list:
		name = _name
		while pre_chain[name] != None:
			next_name = pre_chain[name]
			if name == next_name:
				break
			pre_store[_name].append(next_name)
			name = next_name
			if name not in pre_chain:
				break

	# [(ID, Name, Credit Hours, Description), ... ]
	return [Course(name, title, hours, desc, pre_store[name]) for name, title, hours, desc in course_list]

_courses = _pull_courses()
_courses_set = set(_courses)

def lookup_by_name(course_name: str):
	target_course = Course(course_name)
	if target_course in _courses_set:
		return _courses[_courses.index(target_course)]
	return None

def get_courses():
	return _courses
