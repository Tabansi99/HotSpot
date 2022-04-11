
class Course(object):
	def __init__(self, title: str, name: str, hours: int, desc: str):
		self.title = title
		self.name = name
		self.full = f'{self.title}: {self.name}' 
		self.hours = hours
		self.desc = desc

		self.major, self.number = self._parse_title(title)
		self.rank = int(self.number//100)

	def _parse_title(self, title):
		major, number = title.split(' ')
		return major, int(number)

	def __str__(self):
		return self.full

	def __eq__(self, other):
		if isinstance(other, Course):
			return self.title == other.title
		return False