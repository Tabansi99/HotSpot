
class Course(object):
	def __init__(self, name: str, title: str = '', hours: int = 0, desc: str = ''):
		self.name = name # CSCE 121
		self.title = title # Introduction to Programming
		self.full = f'{self.name}: {self.title}' # CSCE 121: Introduction to Programming
		self.hours = hours # 3
		self.desc = desc # This class is the introduction to C programming.

		self.major, self.number = parse_name(name) # ("CSCE", 121)
		self.rank = int(self.number//100) # 1

	def __repr__(self):
		return self.name

	def __str__(self):
		return self.full

	def __hash__(self):
		return hash(self.name)

	def __eq__(self, other):
		if isinstance(other, Course):
			return self.name == other.name
		return False

def format_name(course_major: str, course_id: int):
	return f'{course_major.upper()} {course_id}'

def parse_name(course_name: str):
	course_major, course_id = course_name.split(' ')
	return course_major, int(course_id)
	