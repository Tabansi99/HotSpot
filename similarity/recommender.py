from course import Course
from data import get_courses, to_title
from collections import Counter, defaultdict
from text_utils import preprocess_text
import pandas as pd
import numpy as np
from scipy import spatial

### Constants ###
MAX_WORDS = 50
#################

def recommend(course_name: str, course_id: int, n_recs=1):
	### Get data and create objects ###
	target_course = to_title(course_name, course_id)
	course_list = get_courses(course_name)
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
		columns=[repr(c) for c in courses], 
		index=[repr(c) for c in courses]
	)

	### Jaccard similarity ###
	j_df = base_df.copy(deep=True)

	for c1 in courses:
		c1_set = set([w for w in preprocess_text(c1.desc) if w in top_set])
		for c2 in courses:
			if c1 != c2:
				c2_set = set([w for w in preprocess_text(c2.desc) if w in top_set])

				j_df[repr(c1)][repr(c2)] = len(c1_set.intersection(c2_set))/len(c1_set.union(c2_set))

	if target_course not in j_df.columns:
		return []

	return j_df[target_course].sort_values(ascending=False).index[:n_recs].to_list()
