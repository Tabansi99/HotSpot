from course import Course, format_name, parse_name
from dataset import get_courses, lookup_by_name
from collections import Counter, defaultdict
from text_utils import preprocess_text, get_word_freqs, get_top_words
import pandas as pd
import numpy as np
from scipy import spatial
import functools
import similarity
from typing import List
from itertools import chain

### Constants ###
MAX_WORDS = 50
COURSES = get_courses()
#################

def _resolve_names(names: List[str]):
	if names is not None:
		_names = []
		for c in names:
			c_lookup = lookup_by_name(c)
			if c_lookup is None:
				raise RuntimeWarning(f'Named course {c} not found in dataset.')
			else:
				_names.append(c_lookup)
	else:
		_names = None 
	return _names


def _augment_targets(targets: List[str], pos: List[Course]):
	extra_targets = list(set(chain.from_iterable([preprocess_text(c.desc) for c in pos])))
	return targets + extra_targets 

def _filter_corpus(corpus: List[Course], neg: List[Course]):
	return [c for c in corpus if c not in neg]

def _filter_pool(pool: List[Course], ignored: List[Course]):
	return [c for c in pool if (c not in ignored)]

def _filter_pre(recs: List[Course], done: List[Course]):
	return [c for c in recs if all(p in done for p in c.pre)]

def rec_by_names(target_names: List[str], pos: List[str] = None, neg: List[str] = None, done: List[str] = None):
	### Search for target course in dataset ###
	target_courses = _resolve_names(target_names)

	_pos = _resolve_names(pos)
	_neg = _resolve_names(neg)
	_done = _resolve_names(done)

	return rec_by_courses(target_courses, _pos, _neg, _done)

def rec_by_tags(target_tags: List[str], pos: List[str] = None, neg: List[str] = None, done: List[str] = None):
	### Clean tags ###
	_target_tags = [t.lower() for t in target_tags]

	_pos = _resolve_names(pos)
	_neg = _resolve_names(neg)
	_done = _resolve_names(done)

	_augmented_tags = _augment_targets(_target_tags, _pos)
	corpus = _filter_corpus(COURSES, _neg)
	pool = _filter_pool(COURSES, _pos+_neg+_done)

	return _filter_pre(_rec(corpus, pool, _augmented_tags), _done)

def rec_by_courses(target_courses: List[Course], pos: List[Course] = None, neg: List[Course] = None, done: List[Course] = None):
	other_courses = [c for c in COURSES if c != target_courses]

	_neg = [] if neg is None else neg
	_pos = [] if pos is None else pos
	_done = [] if done is None else done

	corpus = _filter_corpus(COURSES, _neg)
	pool = _filter_pool(other_courses, _pos+_neg+_done)

	target_items = list(set(chain.from_iterable([preprocess_text(c.desc) for c in target_courses])))
	augmented_items = _augment_targets(target_items, _pos)

	return _filter_pre(_rec(corpus, pool, augmented_items), _done)

def _rec(corpus: List[Course], pool: List[Course], target_items: list):
	### Get top MAX_WORDS words ###
	top_set = set(get_top_words([preprocess_text(c.desc) for c in corpus])[:MAX_WORDS])
	top_words = list(top_set)
	_target_items = list(filter(lambda x: x in top_set, target_items))
	### Compute jaccard with rest of courses ###
	recs = [(c, similarity.jaccard(_target_items, [w for w in preprocess_text(c.desc) if w in top_set])) for c in pool]
	return [c for c, _ in sorted(recs, key=lambda x: x[1], reverse=True)]