from course import Course, format_name, parse_name
from data import get_courses, lookup_by_name
from collections import Counter, defaultdict
from text_utils import preprocess_text, get_word_freqs, get_top_words
import pandas as pd
import numpy as np
from scipy import spatial
import functools
import similarity
from typing import List

### Constants ###
MAX_WORDS = 50
COURSES = get_courses()
#################

def _resolve_fb(fb: List[str]):
	if fb is not None:
		_fb = []
		for c in fb:
			c_lookup = lookup_by_name(c)
			if c_lookup is None:
				raise RuntimeWarning(f'Feedback course {c} not found in dataset.')
			else:
				_fb.append(c_lookup)
	else:
		_fb = None 
	return _fb

def _augment_corpus(corpus: List[Course], pos: List[Course], neg: List[Course]):
	return [c for c in corpus if c not in neg] + pos

def _filter_pool(pool: List[Course], pos: List[Course], neg: List[Course]):
	return [c for c in pool if (c not in pos) and (c not in _neg)]

def rec_by_name(target_name: str, pos: List[str] = None, neg: List[str] = None):
	### Search for target course in dataset ###
	target_course = lookup_by_name(target_name)
	if target_course is None:
		raise RuntimeWarning(f'Target name {target_name} not found in dataset. Returning empty recommendations.')
		return []

	_pos = _resolve_fb(pos)
	_neg = _resolve_fb(neg)

	return rec_by_course(target_course, _pos, _neg)

def rec_by_tags(target_tags: List[str], pos: List[str] = None, neg: List[str] = None):
	### Clean tags ###
	_target_tags = [t.lower() for t in target_tags]

	_pos = _resolve_fb(pos)
	_neg = _resolve_fb(neg)

	corpus = _augment_corpus(COURSES, _pos, _neg)
	pool = _filter_pool(COURSES, _pos, _neg)

	return _rec(corpus, pool, _target_tags)

def rec_by_course(target_course: Course, pos: List[Course] = None, neg: List[Course] = None):
	other_courses = [c for c in COURSES if c != target_course]

	_neg = set() if neg is None else set(neg)
	_pos = [] if pos is None else pos

	corpus = _augment_corpus(COURSES, _pos, _neg)
	pool = _filter_pool(other_courses, _pos, _neg)

	return _rec(corpus, pool, preprocess_text(target_course.desc))

def _rec(corpus: List[Course], pool: List[Course], target_items: list):
	### Get top MAX_WORDS words ###
	top_set = set(get_top_words([preprocess_text(c.desc) for c in corpus])[:MAX_WORDS])
	top_words = list(top_set)
	_target_items = list(filter(lambda x: x in top_set, target_items))
	### Compute jaccard with rest of courses ###
	recs = [(repr(c), similarity.jaccard(_target_items, [w for w in preprocess_text(c.desc) if w in top_set])) for c in pool]
	return [c_str for c_str, _ in sorted(recs, key=lambda x: x[1], reverse=True)]
