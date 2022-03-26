from textblob import TextBlob

class Course(object):
	def __init__(self, title: str, desc: str, cap: int, enroll: int):
		self.title = title 
		self.desc = desc
		self.cap = cap
		self.enroll = enroll

		major, number = self.title.split(' ')
		self.number = int(number)
		self.rank = int(self.number//100)

		self.set_grams(self.desc)

	def set_grams(desc):
		self._blob = TextBlob(self.desc)

		self.unigrams = self._blob.ngrams(n=1)
		self.bigrams = self._blob.ngrams(n=2)
		self.trigrams = self._blob.ngrams(n=3)