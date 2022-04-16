from course import Course, GradedCourse

class User(object):
	def __init__(self, pos: List[Course] = None, neg: List[Course] = None, done: List[Course] = None):
		 

	@property
	def pos(self):
		return self._pos
	
	@property
	def neg(self):
		return self._neg

	@property
	def done(self):
		return self._done
	