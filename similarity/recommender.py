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
import gensim.downloader

### Constants ###
MAX_WORDS = 50
COURSES = get_courses()
WV = gensim.downloader.load('glove-wiki-gigaword-50') 

TAG_JAC_WEIGHT = 0.5
TAG_TITLE_WEIGHT = 0.5
TARGET_JAC_WEIGHT = 0.2
TARGET_TITLE_WEIGHT = 0.5
TARGET_WEIGHT = 0.5
TAG_WEIGHT = 0.5
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

	jac_scores = _get_jaccard_scores(corpus, pool, _augmented_tags)
	jac_min, jac_max = min(jac_scores, key=lambda x: x[1])[1], max(jac_scores, key=lambda x: x[1])[1]

	title_scores = _get_title_scores(pool, _augmented_tags)
	title_min, title_max = min(title_scores, key=lambda x: x[1])[1], max(title_scores, key=lambda x: x[1])[1]

	combined_scores = defaultdict(float)
	for c, score in jac_scores:
		combined_scores[c] += TAG_JAC_WEIGHT*(score - jac_min)/(jac_max - jac_min)
	for c, score in title_scores:
		combined_scores[c] += TAG_TITLE_WEIGHT*(score - title_min)/(title_max - title_min)

	recs = sorted(combined_scores.items(), key=lambda x: x[1], reverse=True)
	return [(c, score) for c, score in recs if all(p in _done for p in c.pre)]

def rec_by_courses(target_courses: List[Course], pos: List[Course] = None, neg: List[Course] = None, done: List[Course] = None):
	other_courses = [c for c in COURSES if c != target_courses]

	_neg = [] if neg is None else neg
	_pos = [] if pos is None else pos
	_done = [] if done is None else done

	corpus = _filter_corpus(COURSES, _neg)
	pool = _filter_pool(other_courses, _pos+_neg+_done)

	target_items = list(set(chain.from_iterable([preprocess_text(c.desc) for c in target_courses])))
	augmented_items = _augment_targets(target_items, _pos)

	titles = [c.title for c in pos+target_courses] 

	jac_scores = _get_jaccard_scores(corpus, pool, augmented_items)
	jac_min, jac_max = min(jac_scores, key=lambda x: x[1])[1], max(jac_scores, key=lambda x: x[1])[1]
	title_scores = _get_title_scores(pool, titles)
	title_min, title_max = min(title_scores, key=lambda x: x[1])[1], max(title_scores, key=lambda x: x[1])[1]

	combined_scores = defaultdict(float)
	for c, score in jac_scores:
		combined_scores[c] += TARGET_JAC_WEIGHT*(score - jac_min)/(jac_max - jac_min)
	for c, score in title_scores:
		combined_scores[c] += TARGET_TITLE_WEIGHT*(score - title_min)/(title_max - title_min)

	recs = sorted(combined_scores.items(), key=lambda x: x[1], reverse=True)
	return [(c, score) for c, score in recs if all(p in _done for p in c.pre)]

def rec_by_names_and_tags(target_names: List[str], target_tags: List[str], pos: List[str] = None, neg: List[str] = None, done: List[str] = None):
	target_courses = _resolve_names(target_names)

	_pos = _resolve_names(pos)
	_neg = _resolve_names(neg)
	_done = _resolve_names(done)

	tag_recs = rec_by_tags(target_tags, pos, neg, done)
	tag_min, tag_max = min(tag_recs, key=lambda x:x[1])[1], max(tag_recs, key=lambda x:x[1])[1]

	target_recs = rec_by_courses(target_courses, _pos, _neg, _done)
	target_min, target_max = min(target_recs, key=lambda x:x[1])[1], max(target_recs, key=lambda x:x[1])[1]

	combined_scores = defaultdict(float)
	for c, score in tag_recs:
		combined_scores[c] += TAG_WEIGHT*(score - tag_min)/(tag_max - tag_min)
	for c, score in target_recs:
		combined_scores[c] += TARGET_WEIGHT*(score - target_min)/(target_max - target_min)

	recs = sorted(combined_scores.items(), key=lambda x: x[1], reverse=True)
	print('===========================')
	for c, score in recs:

		print(c)
		print(c.desc)
		print(score)
		print('')
	return [(c, score) for c, score in recs if all(p in _done for p in c.pre)]


def _get_jaccard_scores(corpus: List[Course], pool: List[Course], target_items: list):
	### Get top MAX_WORDS words ###
	top_set = set(get_top_words([preprocess_text(c.desc) for c in corpus])[:MAX_WORDS])
	top_words = list(top_set)
	_target_items = list(filter(lambda x: x in top_set, target_items))
	### Compute jaccard with rest of courses ###
	jacs = [(c, similarity.jaccard(_target_items, [w for w in preprocess_text(c.desc) if w in top_set])) for c in pool]
	return sorted(jacs, key=lambda x: x[1], reverse=True)

def _get_title_scores(pool: List[Course], target_items: list):
	class_scores = []
	for c in pool:
		title_words = preprocess_text(c.title)
		outer_scores = []
		for w1 in title_words:
			inner_scores = []	
			for token in target_items:
				w2_words = preprocess_text(token)
				score = sum(WV.similarity(w1, w2) for w2 in w2_words)
				inner_scores.append(score)


			outer_scores.append(sum(inner_scores)/len(inner_scores))

		if len(outer_scores) > 0:
			class_scores.append((c, (sum(outer_scores)/len(outer_scores))))
		else:
			class_scores.append((c, 0))

	return sorted(class_scores, key=lambda x: x[1], reverse=True)