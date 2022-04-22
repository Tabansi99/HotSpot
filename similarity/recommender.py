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

# Sum to 1
TAG_JAC_WEIGHT = 0.3
TAG_TITLE_WEIGHT = 0.7

# Sum to 1
TARGET_JAC_WEIGHT = 0.2
TARGET_TITLE_WEIGHT = 0.8

# Sum to 1
TARGET_WEIGHT = 0.7
TAG_WEIGHT = 0.3
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

def _add_desc_targets(targets: List[str], pos: List[Course]):
	extra_targets = list(set(chain.from_iterable([preprocess_text(c.desc) for c in pos])))
	return targets + extra_targets 

def _add_title_targets(targets: List[str], pos: List[Course]):
	extra_targets = list(set(chain.from_iterable([preprocess_text(c.title) for c in pos])))
	return targets + extra_targets 

def _filter_corpus(corpus: List[Course], neg: List[Course]):
	return [c for c in corpus if (c not in neg)]

def _filter_pool(pool: List[Course], ignored: List[Course], done: List[Course]):
	return [c for c in pool if ((c not in ignored) and all(p in done for p in c.pre))]

def rec_by_names(target_names: List[str], pos: List[str] = None, neg: List[str] = None, done: List[str] = None):
	# Lookup everything by name, then pass to rec_by_courses
	target_courses = _resolve_names(target_names)

	pos_res = _resolve_names(pos)
	neg_res = _resolve_names(neg)
	done_res = _resolve_names(done)

	return rec_by_courses(target_courses, pos_res, neg_res, done_res)

def rec_by_tags(target_tags: List[str], pos: List[str] = None, neg: List[str] = None, done: List[str] = None):
	# Clean tags
	clean_target_tags = [t.lower() for t in target_tags]

	# Lookup courses by name
	pos_res = _resolve_names(pos)
	neg_res = _resolve_names(neg)
	done_res = _resolve_names(done)

	# Add pos desc to tags
	tags_with_desc = _add_desc_targets(clean_target_tags, pos_res)

	# Add pos title to tags
	tags_with_title = _add_title_targets(clean_target_tags, pos_res)

	# Remove negative courses from corpus
	corpus = _filter_corpus(COURSES, neg_res)

	# Remove positive courses, negative courses, and completed courses from result pool
	# Also removes prerequisites
	pool = _filter_pool(COURSES, pos_res+neg_res+done_res, done_res)

	# Get description scores
	jac_scores = _get_jaccard_scores(corpus, pool, tags_with_desc)
	jac_min, jac_max = min(jac_scores, key=lambda x: x[1])[1], max(jac_scores, key=lambda x: x[1])[1]

	# Get title scores
	title_scores = _get_title_scores(pool, tags_with_title)
	title_min, title_max = min(title_scores, key=lambda x: x[1])[1], max(title_scores, key=lambda x: x[1])[1]

	# Combine scores
	combined_scores = defaultdict(float)
	for c, score in jac_scores:
		if jac_max - jac_min > 0:
			combined_scores[c] += TAG_JAC_WEIGHT*(score - jac_min)/(jac_max - jac_min)
	for c, score in title_scores:
		if title_max - title_min > 0:
			combined_scores[c] += TAG_TITLE_WEIGHT*(score - title_min)/(title_max - title_min)

	# Sort final score dictionary
	recs = sorted(combined_scores.items(), key=lambda x: x[1], reverse=True)

	return recs

def rec_by_courses(target_courses: List[Course], pos: List[Course] = None, neg: List[Course] = None, done: List[Course] = None):
	# Cleanup inputs
	neg_res = [] if neg is None else neg
	pos_res = [] if pos is None else pos
	done_res = [] if done is None else done

	# Remove negative courses from corpus
	corpus = _filter_corpus(COURSES, neg_res)

	# Combine pos and target_courses
	combined_courses = list(set(target_courses+pos_res))

	# Remove pos, neg, and done courses from selection pool
	# and filter prereqs
	pool = _filter_pool(COURSES, pos_res+neg_res+done_res+target_courses, done_res)

	# Add pos desc to target desc
	target_items = list(set(chain.from_iterable([preprocess_text(c.desc) for c in combined_courses])))

	# Add pos title to target titles
	target_titles = [c.title for c in combined_courses] 

	# Get desc scores
	jac_scores = _get_jaccard_scores(corpus, pool, target_items)
	jac_min, jac_max = min(jac_scores, key=lambda x: x[1])[1], max(jac_scores, key=lambda x: x[1])[1]
	
	# Get title scores
	title_scores = _get_title_scores(pool, target_titles)
	title_min, title_max = min(title_scores, key=lambda x: x[1])[1], max(title_scores, key=lambda x: x[1])[1]

	# Combine scores
	combined_scores = defaultdict(float)
	for c, score in jac_scores:
		if jac_max - jac_min > 0:
			combined_scores[c] += TARGET_JAC_WEIGHT*(score - jac_min)/(jac_max - jac_min)
	for c, score in title_scores:
		if title_max - title_min:
			combined_scores[c] += TARGET_TITLE_WEIGHT*(score - title_min)/(title_max - title_min)

	# Sort final score dictionary
	recs = sorted(combined_scores.items(), key=lambda x: x[1], reverse=True)
	
	return recs

def rec_by_names_and_tags(target_names: List[str], target_tags: List[str], pos: List[str] = None, neg: List[str] = None, done: List[str] = None):

	# Get tag scores 
	tag_recs = rec_by_tags(target_tags, pos, neg, done)
	tag_min, tag_max = min(tag_recs, key=lambda x:x[1])[1], max(tag_recs, key=lambda x:x[1])[1]

	# Get target scores
	target_recs = rec_by_names(target_names, pos, neg, done)
	target_min, target_max = min(target_recs, key=lambda x:x[1])[1], max(target_recs, key=lambda x:x[1])[1]

	# Combine tag and target scores
	combined_scores = defaultdict(float)
	for c, score in tag_recs:
		if tag_max - tag_min > 0:
			combined_scores[c] += TAG_WEIGHT*(score - tag_min)/(tag_max - tag_min)
	for c, score in target_recs:
		if target_max - target_min > 0:
			combined_scores[c] += TARGET_WEIGHT*(score - target_min)/(target_max - target_min)

	recs = sorted(combined_scores.items(), key=lambda x: x[1], reverse=True)
	
	return recs


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

			if len(inner_scores) > 0:
				outer_scores.append(sum(inner_scores)/len(inner_scores))

		if len(outer_scores) > 0:
			class_scores.append((c, (sum(outer_scores)/len(outer_scores))))
		else:
			class_scores.append((c, 0))

	return sorted(class_scores, key=lambda x: x[1], reverse=True)