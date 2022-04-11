from course import Course
from data import get_courses
from collections import Counter, defaultdict
from text_utils import preprocess_text
import pandas as pd
import numpy as np
from scipy import spatial

### Constants ###
MAX_WORDS = 50
#################

### Get data and create objects ###
course_list = get_courses()
courses = [Course(title, name, hours, desc) for title, name, hours, desc in course_list]

### Get word frequencies ###
freq = defaultdict(int)
for c in courses:
	words = preprocess_text(c.desc)
	counts = Counter(words)
	for k in counts.keys():
		freq[k] += 1

### Get top MAX_WORDS words ###
top_words = [w for w, _ in sorted(freq.items(), key=lambda x: x[1], reverse=True)][:MAX_WORDS]
top_set = set(top_words)

### Map words to unique index for vectors ###
w2i = {w:i for i, w in enumerate(top_words)} # word -> index

### Create empty course matrix ###
base_df = pd.DataFrame(
	np.zeros((len(courses), len(courses))), 
	columns=[str(c) for c in courses], 
	index=[str(c) for c in courses]
)

### Jaccard similarity ###
j_df = base_df.copy(deep=True)

for c1 in courses:
	c1_set = set([w for w in preprocess_text(c1.desc) if w in top_set])
	for c2 in courses:
		if c1 != c2:
			c2_set = set([w for w in preprocess_text(c2.desc) if w in top_set])

			j_df[str(c1)][str(c2)] = len(c1_set.intersection(c2_set))/len(c1_set.union(c2_set))
			
with pd.option_context('display.max_rows', None, 'display.max_columns', None):  # more options can be specified also
	print('Most similar based on Jaccard distance:')
	print(j_df.idxmax(axis=1))

print('\n===============================\n')
### Cosine similarity ###
c_df = base_df.copy(deep=True)

for c1 in courses:
	c1_vec = np.zeros(MAX_WORDS)
	c1_words = [w for w in preprocess_text(c1.desc) if w in top_set]
	for w in c1_words:
		c1_vec[w2i[w]] = 1

	for c2 in courses:
		if c1 != c2:
			c2_vec = np.zeros(MAX_WORDS)
			c2_words = [w for w in preprocess_text(c2.desc) if w in top_set]
			for w in c2_words:
				c2_vec[w2i[w]] = 1

			c_df[str(c1)][str(c2)] = 1 - spatial.distance.cosine(c1_vec, c2_vec)

with pd.option_context('display.max_rows', None, 'display.max_columns', None):  # more options can be specified also
	print('Most similar based on Cosine similarity:')
	print(c_df.idxmax(axis=1))

print('\n===============================\n')
