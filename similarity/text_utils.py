from textblob import TextBlob
import string
import re
from typing import List
import nltk
from nltk.stem import WordNetLemmatizer 
import functools
from collections import Counter

STOP_WORDS = nltk.corpus.stopwords.words('english')
LEM = WordNetLemmatizer()
NOISE_WORDS = set([
	'csce',
	'prerequisite',
	'approval',
	'instructor',
	'classification',
	'grade',
	'better',
	'senior',
	'350ecen',
	'junior',
	'cross',
	'listing',
	'including',
	'includes',
	'enrollment',
	'350csce',
	'course',
	'student',
	'ecen',
	'vist',
])

def get_ngrams(text: str, n: int = 1):
	blob = TextBlob(text)
	return blob.ngrams(n=n) 

def preprocess_text(text: str):
	return filter_words(
		   		lemmatize(
					filter_stop(
						filter_ints(
							tokenize(
								strip_punc(
									replace_special(
										lowercase(text)
			)))))))

def lowercase(text: str):
	return text.lower()

def replace_special(text: str):
	return text.replace('-', ' ')

def strip_punc(text: str):
    return ''.join([c for c in text if c not in string.punctuation])

def tokenize(text: str):
    return text.split()

def filter_stop(tokens: List[str]):
	return [x for x in tokens if x not in STOP_WORDS]

def filter_words(tokens: List[str]):
	return [x for x in tokens if x not in NOISE_WORDS]

def filter_ints(tokens: List[str]):
	return [x for x in tokens if not x.isdigit()]

def lemmatize(tokens: List[str]):
	return [LEM.lemmatize(x) for x in tokens]

def get_top_words(corpus: List[List[str]]):
	word_freq = get_word_freqs(corpus)
	return [w for w, _ in sorted(word_freq.items(), key=lambda x: x[1], reverse=True)]

def get_word_freqs(corpus: List[List[str]]):
	return functools.reduce(lambda d1, d2: d1+d2, [Counter(c) for c in corpus])

