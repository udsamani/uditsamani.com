---
date: 2019-01-04
title: 'Cross Language Information Retrieval'
template: portfolio
thumbnail: '../thumbnails/clir.png'
slug: 'cross-language-information-retrieval'
---

The aim of this project is to build a cross language information retrieval system (CLIR) which, given a query in German, will be capable of searching text documents written in English and displaying the results in German.

We're going to use machine translation, information retrieval using a vector space model, and then assess the performance of the system using IR evaluation techniques.

Parts of the project are explained as we progress.

#### Data Used

- bitext.(en,de): A sentence aligned, parallel German-English corpus, sourced from the Europarl corpus (which is a collection of debates held in the EU parliament over a number of years). We'll use this to develop word-alignment tools, and build a translation probability table.

- newstest.(en,de): A separate, smaller parallel corpus for evaulation of the translation system.

- devel.(docs,queries,qrel): A set of documents in English (sourced from Wikipedia), queries in German, and relevance judgement scores for each query-document pair.

The files are available to check out in the data/clir directory of the repo.

## Housekeeping: File encodings and tokenisation

Since the data files we use is utf-8 encoded text, we need to convert the strings into ASCII by escaping the special symbols. We also import some libraries in this step as well.


```python
from nltk.tokenize import word_tokenize
from __future__ import division #To properly handle floating point divisions.
import math

#Function to tokenise string/sentences.
def tokenize(line, tokenizer=word_tokenize):
    utf_line = line.decode('utf-8').lower()
    return [token.encode('ascii', 'backslashreplace') for token in tokenizer(utf_line)]
```

Now we can test out our tokenize function. Notice how it converts the word Über.


```python
tokenize("Seit damals ist er auf über 10.000 Punkte gestiegen.")
```




    ['seit',
     'damals',
     'ist',
     'er',
     'auf',
     '\\xfcber',
     '10.000',
     'punkte',
     'gestiegen',
     '.']



Let's store the path of the data files as easily identifiable variables for future access.


```python
DEVELOPMENT_DOCS = 'data/clir/devel.docs' #Data file for IR engine development

DEVELOPMENT_QUERIES = 'data/clir/devel.queries' #Data file containing queries in German

DEVELOPMENT_QREL = 'data/clir/devel.qrel' #Data file containing a relevance score or query-doc pairs

BITEXT_ENG = 'data/clir/bitext.en' #Bitext data file in English for translation engine and language model development

BITEXT_DE = 'data/clir/bitext.de' #Bitext data file in German

NEWSTEST_ENG = 'data/clir/newstest.en' #File for testing language model
```

With that out of the way, lets get to the meat of the project.

As mentioned earlier, we're going to build a CLIR engine consisting of information retrieval and translation components, and then evaluate its accuracy.

The CLIR system will:
- **translate queries** from German into English (because our searcheable corpus is in English), using word-based translation, a rather simplistic approach as opposed to the sophistication you might see in, say, *Google Translate*.
- **search over the document corpus** using the Okapi BM25 IR ranking model, a variation of the traditional TF-IDF model.
- **evaluate the quality** of ranked retrieval results using the query relevance judgements.

## Information Retrieval using [Okapi BM25](https://en.wikipedia.org/wiki/Okapi_BM25)

We'll start by building an IR system, and give it a test run with some English queries.

Here's an overview of the tasks involved:
- Loading the data files, and tokenizing the input.
- Preprocessing the lexicon by stemming, removing stopwords.
- Calculating the TF/IDF representation for all documents in our wikipedia corpus.
- Storing an inverted index to efficiently documents, given a query term.
- Implementing querying with BM25.
- Test runs.

So for our first task, we'll load the devel.docs file, extract and tokenize the terms, and store them in a python dictionary with the document ids as keys.


```python
import nltk
import re

stopwords = set(nltk.corpus.stopwords.words('english')) #converting stopwords to a set for faster processing in the future.
stemmer = nltk.stem.PorterStemmer()

#Function to extract and tokenize terms from a document
def extract_and_tokenize_terms(doc):
    terms = []
    for token in tokenize(doc):
        if token not in stopwords: # 'in' and 'not in' operations are faster over sets than lists
            if not re.search(r'\d',token) and not re.search(r'[^A-Za-z-]',token): #Removing numbers and punctuations
                #(excluding hyphenated words)
                terms.append(stemmer.stem(token.lower()))
    return terms

documents = {} #Dictionary to store documents with ids as keys.
```


```python
#Reading each line in the file and storing it documents dictionary
f = open(DEVELOPMENT_DOCS)

for line in f:
    doc = line.split("\t")
    terms = extract_and_tokenize_terms(doc[1])
    documents[doc[0]] = terms
f.close()
```

To check if everything is working till now, let's access a document from the dictionary, with the id '290'.


```python
documents['290'][:20] #To keep things short, we're only going to check out 20 tokens.
```




    [u'name',
     u'plural',
     u'ae',
     u'first',
     u'letter',
     u'vowel',
     u'iso',
     u'basic',
     u'latin',
     u'alphabet',
     u'similar',
     u'ancient',
     u'greek',
     u'letter',
     u'alpha',
     u'deriv',
     u'upper',
     u'case',
     u'version',
     u'consist']



Now we'll build an inverted index for the documents, so that we can quickly access documents for the terms we need.


```python
#Building an inverted index for the documents

from collections import defaultdict

inverted_index = defaultdict(set)

for docid, terms in documents.items():
    for term in terms:
        inverted_index[term].add(docid)
```

To test it out, the list of documents containing the word 'pizza':


```python
inverted_index['pizza']
```




    {'121569',
     '16553',
     '212541',
     '228211',
     '261023',
     '265975',
     '276433',
     '64083',
     '69930',
     '72701',
     '73441',
     '74323'}



On to the BM25 TF-IDF representation, we'll create the td-idf matrix for terms-documents, first without the query component.

The query component is dependent on the terms in our query. So we'll just calculate that, and multiply it with the overall score when we want to retreive documents for a particular query.


```python
#Building a TF-IDF representation using BM25

NO_DOCS = len(documents) #Number of documents

AVG_LEN_DOC = sum([len(doc) for doc in documents.values()])/len(documents) #Average length of documents

#The function below takes the documentid, and the term, to calculate scores for the tf and idf
#components, and multiplies them together.
def tf_idf_score(k1,b,term,docid):

    ft = len(inverted_index[term])
    term = stemmer.stem(term.lower())
    fdt =  documents[docid].count(term)

    idf_comp = math.log((NO_DOCS - ft + 0.5)/(ft+0.5))

    tf_comp = ((k1 + 1)*fdt)/(k1*((1-b) + b*(len(documents[docid])/AVG_LEN_DOC))+fdt)

    return idf_comp * tf_comp

#Function to create tf_idf matrix without the query component
def create_tf_idf(k1,b):
    tf_idf = defaultdict(dict)
    for term in set(inverted_index.keys()):
        for docid in inverted_index[term]:
            tf_idf[term][docid] = tf_idf_score(k1,b,term,docid)
    return tf_idf
```


```python
#Creating tf_idf matrix with said parameter values: k1 and b for all documents.
tf_idf = create_tf_idf(1.5,0.5)
```

We took the default values for k1 and b (1.5 and 0.5), which seemed to give good results. Although these parameters may be altered depending on the type of data being dealth with.

Now we create a method to retrieve the query component, and another method that will use the previous ones and retrieve the relevant documents for a query, sorted on the basis of their ranks.


```python
#Function to retrieve query component
def get_qtf_comp(k3,term,fqt):
    return ((k3+1)*fqt[term])/(k3 + fqt[term])


#Function to retrieve documents || Returns a set of documents and their relevance scores.
def retr_docs(query,result_count):
    q_terms = [stemmer.stem(term.lower()) for term in query.split() if term not in stopwords] #Removing stopwords from queries
    fqt = {}
    for term in q_terms:
        fqt[term] = fqt.get(term,0) + 1

    scores = {}

    for word in fqt.keys():
        #print word + ': '+ str(inverted_index[word])
        for document in inverted_index[word]:
            scores[document] = scores.get(document,0) + (tf_idf[word][document]*get_qtf_comp(0,word,fqt)) #k3 chosen as 0 (default)

    return sorted(scores.items(),key = lambda x : x[1] , reverse=True)[:result_count]
```

Let's try and retrieve a document for a query.


```python
retr_docs("Manchester United",5)
```




    [('19961', 12.570721363284687),
     ('83266', 12.500367334396838),
     ('266959', 12.46418348068098),
     ('20206', 12.324327863972716),
     ('253314', 12.008548114449386)]



Checking out the terms in the top ranked document..


```python
documents['19961'][:30]
```




    [u'manchest',
     u'unit',
     u'manchest',
     u'unit',
     u'footbal',
     u'club',
     u'english',
     u'profession',
     u'footbal',
     u'club',
     u'base',
     u'old',
     u'trafford',
     u'greater',
     u'manchest',
     u'play',
     u'premier',
     u'leagu',
     u'found',
     u'newton',
     u'heath',
     u'lyr',
     u'footbal',
     u'club',
     u'club',
     u'chang',
     u'name',
     u'manchest',
     u'unit',
     u'move']



The information retrieval engine has worked quite well in this case. The top ranked document for the query is a snippet of the wikipedia article for Manchester United Football Club.

On further inspection, we can see that the documents ranked lower are, for example, for The University of Manchester, or even just articles with the words 'Manchester' or 'United' in them.

Now we can begin translating the German queries to English.

## Query Translation:

For translation, we'll implement a simple word-based translation model in a noisy channel setting. This means that we'll use both a language model over English, and a translation model.

We'll use a unigram language model for decoding/translation, but also create a model with trigram to test the improvement in performace).

Our aim is to find the string, $\vec{e}$ which maximises $p(\vec{e}) p(\vec{g} | \vec{e})$, given English output string $\vec{e}$ and German input string $\vec{g}$.

### Language Model:

[From Wikipedia](https://en.wikipedia.org/wiki/Language_model): A statistical language model is a probability distribution over sequences of words. Given such a sequence, say of length m, it assigns a probability P(w1,....,wm) to the whole sequence.

The models will be trained on the 'bitext.en' file, and tested on 'newstest.en'.

As we'll train the model on different files, it's obvious that we'll run into words (unigrams) and trigrams what we hadn't seen in the file we trained the model on. To account for these unknown information, we'll use add-k or [laplace smoothing](https://en.wikipedia.org/wiki/Additive_smoothing) for the unigram and [Katz-Backoff smoothing](https://en.wikipedia.org/wiki/Katz%27s_back-off_model) for the trigram model.

Let's start with calculating the unigram, bigram and trigram counts (we need the bigram counts for trigram smoothing). The sentences are also converted appropriately by adding sentinels at the start and end of sentences.


```python
#Calculating the unigram, bigram and trigram counts.

f = open(BITEXT_ENG)

train_sentences = []

for line in f:
    train_sentences.append(tokenize(line))

f.close()

#Function to mark the first occurence of words as unknown, for training.
def check_for_unk_train(word,unigram_counts):
    if word in unigram_counts:
        return word
    else:
        unigram_counts[word] = 0
        return "UNK"

#Function to convert sentences for training the language model.
def convert_sentence_train(sentence,unigram_counts):
    #<s1> and <s2> are sentinel tokens added to the start and end, for handling tri/bigrams at the start of a sentence.
    return ["<s1>"] + ["<s2>"] + [check_for_unk_train(token.lower(),unigram_counts) for token in sentence] + ["</s2>"]+ ["</s1>"]

#Function to obtain unigram, bigram and trigram counts.
def get_counts(sentences):
    trigram_counts = defaultdict(lambda: defaultdict(dict))
    bigram_counts = defaultdict(dict)
    unigram_counts = {}
    for sentence in sentences:
        sentence = convert_sentence_train(sentence, unigram_counts)
        for i in range(len(sentence) - 2):
            trigram_counts[sentence[i]][sentence[i+1]][sentence[i+2]] = trigram_counts[sentence[i]][sentence[i+1]].get(sentence[i+2],0) + 1
            bigram_counts[sentence[i]][sentence[i+1]] = bigram_counts[sentence[i]].get(sentence[i+1],0) + 1
            unigram_counts[sentence[i]] = unigram_counts.get(sentence[i],0) + 1
    unigram_counts["</s1>"] = unigram_counts["<s1>"]
    unigram_counts["</s2>"] = unigram_counts["<s2>"]
    bigram_counts["</s2>"]["</s1>"] = bigram_counts["<s1>"]["<s2>"]
    return unigram_counts, bigram_counts, trigram_counts
```


```python
unigram_counts, bigram_counts,trigram_counts = get_counts(train_sentences)
```

We can calculate the [perplexity](https://en.wikipedia.org/wiki/Perplexity) of our language models to see how well they predict a sentence.


```python
#Constructing unigram model with 'add-k' smoothing
token_count = sum(unigram_counts.values())

#Function to convert unknown words for testing.
#Words that don't appear in the training corpus (even if they are in the test corpus) are marked as UNK.
def check_for_unk_test(word,unigram_counts):
    if word in unigram_counts and unigram_counts[word] > 0:
        return word
    else:
        return "UNK"


def convert_sentence_test(sentence,unigram_counts):
    return ["<s1>"] + ["<s2>"] + [check_for_unk_test(word.lower(),unigram_counts) for word in sentence] + ["</s2>"]  + ["</s1>"]

#Returns the log probability of a unigram, with add-k smoothing. We're taking logs to avoid probability underflow.
def get_log_prob_addk(word,unigram_counts,k):
    return math.log((unigram_counts[word] + k)/ \
                    (token_count + k*len(unigram_counts)))

#Returns the log probability of a sentence.
def get_sent_log_prob_addk(sentence, unigram_counts,k):
    sentence = convert_sentence_test(sentence, unigram_counts)
    return sum([get_log_prob_addk(word, unigram_counts,k) for word in sentence])


def calculate_perplexity_uni(sentences,unigram_counts, token_count, k):
    total_log_prob = 0
    test_token_count = 0
    for sentence in sentences:
        test_token_count += len(sentence) + 2 # have to consider the end token
        total_log_prob += get_sent_log_prob_addk(sentence,unigram_counts,k)
    return math.exp(-total_log_prob/test_token_count)


f = open(NEWSTEST_ENG)

test_sents = []
for line in f:
    test_sents.append(tokenize(line))
f.close()
```

Now we'll calculate the [perplexity](https://en.wikipedia.org/wiki/Perplexity) for the model, as a measure of performance i.e. how well they predict a sentence. To find the optimum value of k, we can just calculate the perplexity multiple times with different k(s).


```python
#Calculating the perplexity for different ks
ks = [0.0001,0.01,0.1,1,10]

for k in ks:
    print str(k) +": " + str(calculate_perplexity_uni(test_sents,unigram_counts,token_count,k))

```

    0.0001: 613.918691403
    0.01: 614.027477551
    0.1: 615.06903252
    1: 628.823994251
    10: 823.302441447


Using add-k smoothing, perplexity for the unigram model increases with the increase in k. So 0.0001 is the best choice for k.

Moving on to tri-grams.


```python
#Calculating the N1/N paramaters for Trigrams/Bigrams/Unigrams in Katz-Backoff Smoothing

TRI_ONES = 0 #N1 for Trigrams
TRI_TOTAL = 0 #N for Trigrams

for twod in trigram_counts.values():
    for oned in twod.values():
        for val in oned.values():
            if val==1:
                TRI_ONES+=1 #Count of trigram seen once
            TRI_TOTAL += 1 #Count of all trigrams seen

BI_ONES = 0 #N1 for Bigrams
BI_TOTAL = 0 #N for Bigrams

for oned in bigram_counts.values():
    for val in oned.values():
        if val==1:
            BI_ONES += 1 #Count of bigram seen once
        BI_TOTAL += 1 #Count of all bigrams seen

UNI_ONES = unigram_counts.values().count(1)
UNI_TOTAL = len(unigram_counts)
```


```python
#Constructing trigram model with backoff smoothing

TRI_ALPHA = TRI_ONES/TRI_TOTAL #Alpha parameter for trigram counts

BI_ALPHA = BI_ONES/BI_TOTAL #Alpha parameter for bigram counts

UNI_ALPHA = UNI_ONES/UNI_TOTAL

def get_log_prob_back(sentence,i,unigram_counts,bigram_counts,trigram_counts,token_count):
    if trigram_counts[sentence[i-2]][sentence[i-1]].get(sentence[i],0) > 0:
        return math.log((1-TRI_ALPHA)*trigram_counts[sentence[i-2]][sentence[i-1]].get(sentence[i])/bigram_counts[sentence[i-2]][sentence[i-1]])
    else:
        if bigram_counts[sentence[i-1]].get(sentence[i],0)>0:
            return math.log(TRI_ALPHA*((1-BI_ALPHA)*bigram_counts[sentence[i-1]][sentence[i]]/unigram_counts[sentence[i-1]]))
        else:
            return math.log(TRI_ALPHA*BI_ALPHA*(1-UNI_ALPHA)*((unigram_counts[sentence[i]]+0.0001)/(token_count+(0.0001)*len(unigram_counts))))


def get_sent_log_prob_back(sentence, unigram_counts, bigram_counts,trigram_counts, token_count):
    sentence = convert_sentence_test(sentence, unigram_counts)
    return sum([get_log_prob_back(sentence,i, unigram_counts,bigram_counts,trigram_counts,token_count) for i in range(2,len(sentence))])


def calculate_perplexity_tri(sentences,unigram_counts,bigram_counts,trigram_counts, token_count):
    total_log_prob = 0
    test_token_count = 0
    for sentence in sentences:
        test_token_count += len(sentence) + 2 # have to consider the end token
        total_log_prob += get_sent_log_prob_back(sentence,unigram_counts,bigram_counts,trigram_counts,token_count)
    return math.exp(-total_log_prob/test_token_count)
```


```python
#Calculating the perplexity
calculate_perplexity_tri(test_sents,unigram_counts,bigram_counts,trigram_counts,token_count)
```




    461.64686176451505



For unigram language model, the perplexity for different values of k were as follow:
<table>
<tr>
<th>k</th>
<th>Perplexity</th>
</tr>
<tr>
<td>0.0001</td>
<td>613.92</td>
</tr>
<tr>
<tr>
<td>0.01</td>
<td>614.03</td>
</tr>
<tr>
<td>0.1</td>
<td>628.82</td>
</tr>
<tr>
<td>1</td>
<td>823.302</td>
</tr>
</table>

For tri-gram model, Katz-Backoff smoothing was chosen as it takes a discounted probability for things only seen once, and backs off to a lower level n-gram for unencountered n-grams.

Compared with the trigram model, the perplexity was as follows:
<table>
<tr>
<th>Model</th>
<th>Perplexity</th>
</tr>
<tr>
<td>Unigram (Best K)</td>
<td>613.92</td>
</tr>
<tr>
<td>Trigram (Katz Backoff)</td>
<td>461.65</td>
</tr>
</table>

As can be seen, the trigram model with 'Katz Backoff' smoothing seems to perform better than the best unigram model (with k = 0.0001). Thus we can say that this model is better for predicting the sequence of a sentence than unigram, which should is obvious if you think about it.

### Translation model

Next, we'll estimate translation model probabilities. For this, we'll use IBM1 from the NLTK library. IBM1 learns word based translation probabilities using expectation maximisation.

We'll use both 'bitext.de' and 'bitext.en' files for this purpose; extract the sentences from each, and then use IBM1 to build the translation tables.


```python
#Creating lists of English and German sentences from bitext.

from nltk.translate import IBMModel1
from nltk.translate import AlignedSent, Alignment

eng_sents = []
de_sents = []

f = open(BITEXT_ENG)
for line in f:
    terms = tokenize(line)
    eng_sents.append(terms)
f.close()

f = open(BITEXT_DE)
for line in f:
    terms = tokenize(line)
    de_sents.append(terms)
f.close()
```


```python
#Zipping together the bitexts for easier access
paral_sents = zip(eng_sents,de_sents)
```


```python
#Building English to German translation table for words (Backward alignment)
eng_de_bt = [AlignedSent(E,G) for E,G in paral_sents]
eng_de_m = IBMModel1(eng_de_bt, 5)
```


```python
#Building German to English translation table for words (Backward alignment)
de_eng_bt = [AlignedSent(G,E) for E,G in paral_sents]
de_eng_m = IBMModel1(de_eng_bt, 5)
```

We can take the intersection of the dual alignments to obtain a combined alignment for each sentence in the bitext.


```python
#Script below to combine alignments using set intersections
combined_align = []

for i in range(len(eng_de_bt)):

    forward = {x for x in eng_de_bt[i].alignment}
    back_reversed = {x[::-1] for x in de_eng_bt[i].alignment}

    combined_align.append(forward.intersection(back_reversed))
```

Now we can create translation dictionaries in both English to German, and German to English directions.

Creating dictionaries for occurence counts first.


```python
#Creating German to English dictionary with occurence count of word pairs
de_eng_count = defaultdict(dict)

for i in range(len(de_eng_bt)):
    for item in combined_align[i]:
        de_eng_count[de_eng_bt[i].words[item[1]]][de_eng_bt[i].mots[item[0]]] =  de_eng_count[de_eng_bt[i].words[item[1]]].get(de_eng_bt[i].mots[item[0]],0) + 1
```


```python
#Creating a English to German dict with occ count of word pais
eng_de_count = defaultdict(dict)

for i in range(len(eng_de_bt)):
    for item in combined_align[i]:
        eng_de_count[eng_de_bt[i].words[item[0]]][eng_de_bt[i].mots[item[1]]] =  eng_de_count[eng_de_bt[i].words[item[0]]].get(eng_de_bt[i].mots[item[1]],0) + 1
```

Creating dictionaries for translation probabilities.


```python
#Creating German to English table with word translation probabilities
de_eng_prob = defaultdict(dict)

for de in de_eng_count.keys():
    for eng in de_eng_count[de].keys():
        de_eng_prob[de][eng] = de_eng_count[de][eng]/sum(de_eng_count[de].values())
```


```python
#Creating English to German dict with word translation probabilities
eng_de_prob = defaultdict(dict)

for eng in eng_de_count.keys():
    for de in eng_de_count[eng].keys():
        eng_de_prob[eng][de] = eng_de_count[eng][de]/sum(eng_de_count[eng].values())
```

Let's look at some examples of translating individual words from German to English.


```python
#Examples of translating individual words from German to English
print de_eng_prob['frage']

print de_eng_prob['handlung']

print de_eng_prob['haus']

```

    {'question': 0.970873786407767, 'issue': 0.019417475728155338, 'matter': 0.009708737864077669}
    {'rush': 1.0}
    {'begins': 0.058823529411764705, 'house': 0.9411764705882353}


Building the noisy channel translation model, which uses the english to german translation dictionary and the unigram language model to add "noise".


```python
#Building noisy channel translation model
def de_eng_noisy(german):
    noisy={}
    for eng in de_eng_prob[german].keys():
        noisy[eng] = eng_de_prob[eng][german]+ get_log_prob_addk(eng,unigram_counts,0.0001)
    return noisy
```

Let's check out the translation using the noise channel approach.


```python
#Test block to check alignments
print de_eng_noisy('vater')
print de_eng_noisy('haus')
print de_eng_noisy('das')
print de_eng_noisy('entschuldigung')
```

    {'father': -8.798834996562721}
    {'begins': -10.2208672198799, 'house': -8.163007778647888}
    {'this': -5.214590799418497, 'the': -3.071527829335362, 'that': -4.664995720177421}
    {'excuse': -11.870404868087332, 'apology': -12.39683538573032, 'comprehend': -11.89683538573032}


Translations for 'vater', 'hause', 'das' seem to be pretty good, with the max score going to the best translation.
For the word 'entschuldigung', the best possible translation is 'excuse', while 'comprehend' being close. But in real world use, the most common translation for 'entschuldigung' is 'sorry'.

Checking the reverse translation for 'sorry',


```python
eng_de_prob['sorry']
```




    {'bereue': 1.0}



The word 'bereue', which Google translates as 'regret'. This is one example of a 'bad' alignment.

Let's try tanslating some queries now.


```python
#Translating first 5 queries into English

#Function for direct translation
def de_eng_direct(query):
    query_english = []
    query_tokens = tokenize(query)

    for token in query_tokens:
        try:
            query_english.append(max(de_eng_prob[token], key=de_eng_prob[token].get))
        except:
            query_english.append(token) #Returning the token itself when it cannot be found in the translation table.
            #query_english.append("NA")

    return " ".join(query_english)

#Function for noisy channel translation
def de_eng_noisy_translate(query):
    query_english = []
    query_tokens = tokenize(query)

    for token in query_tokens:
        try:
            query_english.append(max(de_eng_noisy(token), key=de_eng_noisy(token).get))
        except:
            query_english.append(token) #Returning the token itself when it cannot be found in the translation table.
            #query_english.append("NA")

    return " ".join(query_english)

f = open(DEVELOPMENT_QUERIES)

lno = 0
plno = 0

#Also building a dictionary of query ids and query content (only for the first 100s)
german_qs = {}

test_query_trans_sents = [] #Building a list for perplexity checks.

for line in f:
    lno+=1
    query_id = line.split('\t')[0]
    query_german = line.split('\t')[1]

    german_qs[query_id] = query_german.strip()

    translation = str(de_eng_noisy_translate(query_german))

    if plno<5:
        print query_id + "\n" + "German: " + str(query_german) + "\n" + "English: " + translation +"\n\n"
        plno+=1
    test_query_trans_sents.append(translation)
    if lno==100:
        break

f.close()
```

    82
    German: der ( von engl . action : tat , handlung , bewegung ) ist ein filmgenre des unterhaltungskinos , in welchem der fortgang der äußeren handlung von zumeist spektakulär inszenierten kampf - und gewaltszenen vorangetrieben und illustriert wird .

    English: the ( , guises . action : indeed , rush , movement ) is a filmgenre the unterhaltungskinos , in much the fortgang the external rush , zumeist spektakul\xe4r inszenierten fight - and gewaltszenen pushed and illustriert will .


    116
    German: die ( einheitenzeichen : u für unified atomic mass unit , veraltet amu für atomic mass unit ) ist eine maßeinheit der masse .

    English: the ( einheitenzeichen : u for unified atomic mass unit , obsolete amu for atomic mass unit ) is a befuddled the mass .


    240
    German: der von lateinisch actualis , " wirklich " , auch aktualitätsprinzip , uniformitäts - oder gleichförmigkeitsprinzip , englisch uniformitarianism , ist die grundlegende wissenschaftliche methode in der .

    English: the , lateinisch actualis , `` really `` , , aktualit\xe4tsprinzip , uniformit\xe4ts - or gleichf\xf6rmigkeitsprinzip , english uniformitarianism , is the fundamental scientific method in the .


    320
    German: die ( griechisch el , von altgriechisch grc , - " zusammen - " , " anbinden " , gemeint ist " die herzbeutel angehängte " ) , ist ein blutgefäß , welches das blut vom herz wegführt .

    English: the ( griechisch el , , altgriechisch grc , - `` together - `` , `` anbinden `` , meant is `` the herzbeutel angeh\xe4ngte `` ) , is a blutgef\xe4\xdf , welches the blood vom heart wegf\xfchrt .


    540
    German: unter der bezeichnung fasst man die drei im nördlichen alpenvorland liegenden gewässereinheiten obersee , untersee und seerhein zusammen .

    English: under the bezeichnung summarizes one the three , northern alpenvorland liegenden gew\xe4ssereinheiten obersee , untersee and seerhein together .




The translations of the first 5 queries according to Google translate are as follows:

82 of ( . Of eng action : act, action , movement, ) is a film genre of entertainment cinema , in which the continued transition of the external action of mostly spectacularly staged battle - and violent scenes is advanced and illustrated .

116 ( unit sign : u for unified atomic mass unit , amu outdated for atomic mass unit ) is a unit of measure of mass .

240 of actualis from Latin , "real" , even actuality principle , uniformity - or gleichförmigkeitsprinzip , English uniformitarianism , is the basic scientific method in .

320 (Greek el , from Ancient Greek grc , - " together - " , " tie " , is meant " the heart bag attached" ) is a blood vessel that leads away the blood from the heart .

540 under the designation one summarizes the three lying in the northern waters alpenvorland units obersee , subsea and Seerhein together .

---


Translations obtained through Google Translate are obviously better. It's interesting to note that our own translation engine works well if a 'word-word' translation is considered, and if the word-pair has been encountered enough times in the bi-lingual corpora.

Google Translate also seems to perform better as it's considering phrase based translation, which is more sophisticated and accurate than word-word translation.

Our engine also seems to work better for function words rather than content words as those would have been the one encountered a lot in the bi-corpora and are better aligned.


The alignments were combined by taking the intersection of the forward and reverse alignments in this case. Combining the two alignments improved things in the sense that the intersection got rid of all the extra 'noise' in the alignments, so that the most likely ones remained (that existed both in the forward and reverse direction).

### Combining, and Evaluation

For the final bit, we'll create a function that translates a query, and retrieves the relevant documents for it.

Then, to evaluate the results of our CLIR engine, we'll use the [Mean Average Precision](https://www.youtube.com/watch?v=pM6DJ0ZZee0) to judge the performance of the CLIR system. MAP is a standard evaluation metric used in IR.


```python
#Building a dictionary for queryids and relevant document ids
qrel = defaultdict(list)

f = open(DEVELOPMENT_QREL)

for line in f:
    item = line.split('\t')
    qrel[item[0]].append(item[2])

f.close()
```


```python
#Single function to retreive documents for a German query
def trans_retr_docs(german_query,no_of_results,translation_function):

    trans_query = " ".join(extract_and_tokenize_terms(translation_function(german_query)))
    return [item[0] for item in retr_docs(trans_query,no_of_results)] #Retriving 100 documents

#Calculating the map score
def calc_map(no_of_results,translation_function):

    average_precision = []

    for gq in german_qs.keys():

        relevant_docs = qrel[gq]
        incremental_precision = []
        resulting_docs = trans_retr_docs(german_qs[gq],no_of_results,translation_function)

        total_counter = 0
        true_positive_counter = 0

        for doc in resulting_docs:
            total_counter+=1
            if doc in relevant_docs:
                true_positive_counter += 1
                incremental_precision.append(true_positive_counter/total_counter)

        #For no relevant retreivals, the average precision will be considered 0.
        try:
            average_precision.append(sum(incremental_precision)/len(incremental_precision))
        except:
            average_precision.append(0)

    return (sum(average_precision)/len(average_precision))
```

To keep runtime at a minimum, we'll only consider the top 100 returned results (documents) when


```python
#Printing the map score for direct translations
print calc_map(100,de_eng_direct)
```

    0.356571675599



```python
#Printing the map score for noisy channel translations
print calc_map(100,de_eng_noisy_translate)
```

    0.364795198505


With that, our basic CLIR system is complete. Improvements could be made, expecially in the translation component by using a phrase based model. Or we could use Google to translate the queries for us, and see how well the IR system performs. But that's another area of exploration.
