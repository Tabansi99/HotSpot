def jaccard(listA: list, listB: list):
	setA, setB = set(listA), set(listB)
	return len(setA.intersection(setB))/len(setA.union(setB))