import pickle
import numpy as np
import re
import sys

from tensorflow import keras
from nltk.tokenize import word_tokenize
from nltk.stem.wordnet import WordNetLemmatizer
from nltk.corpus import stopwords
from labels import original_labels, encoded_labels

model = keras.models.load_model('course-classifier-nce.h5')
vectorizer = pickle.load(open("course_outline_vectorizer.pickel", "rb"))
lemmatizer: WordNetLemmatizer = WordNetLemmatizer()
sw_nltk = set(stopwords.words("english"))
custom_stop_words: set = ("part", "class", "course", "one", "two", "three", "four", "discussion", "lecture", "hour", "day","month","semester","week","sophomore","junior",
"senior","fresh","seminar","exam","required","summer","winter","student","pre","requisite","prerequisite","lecture","introduction","introduces","essay","notes","textbook",
"etc","covering","sp","credit","pr","fsp","info","session","read","basic","hard","emphasis","form","primary","understand","learn","discus","learning","general","concept","study",
"overciew","focus","emphasize","presented","learning","seminar","proseminar","topic","major","year","distinguished", "presentation",
"hour", "concept","hours", "per", "week", "weeks","year", "years", "month", "day", "days", "definition", "define", "elaborate", "fwsp")


test_case_one = sys.argv[1]

text = str(test_case_one).lower()
text = re.sub('(\\d|\\W)+',' ',text)
text = re.sub('[\(\)]', ' ', text)
text = re.sub('[^a-zA-Z]', ' ', text)
text = word_tokenize(text)
text = [word for word in text if not word in sw_nltk]
text = [word for word in text if not word in custom_stop_words]
text = [lemmatizer.lemmatize(word) for word in text]
text = (' ').join(text)

vectorized_test_case = vectorizer.transform([text])
predicted_class = model.predict(vectorized_test_case)
classes_x = np.argmax(predicted_class,axis=1)
# classes_y = np.argmin(predicted_class, axis=1)

# print(classes_x)
# print(predicted_class[0])

# for i in range(len(encoded_labels)):
#   if encoded_labels[i] == classes_x[0]:
#     print(f'\n\nThe classified class = {original_labels[i]}')
#     prediction = original_labels[i]
#     break

# for i in range(len(encoded_labels)):
#   if encoded_labels[i] == classes_y[0]:
#     print(f'\n\nThe classified class = {original_labels[i]}')
#     prediction = original_labels[i]
#     break

# for i in range(90):
#   if(predicted_class[0][i] > 2.0367419e-38):
#     for j in range(len(encoded_labels)):
#       if encoded_labels[j] == i:
#         print(f'\n\nThe classified class = {original_labels[j]}')
#         prediction = original_labels[j]
#         break

ind = np.argpartition(predicted_class[0], -4)[-4:]

string = "{ \"classes\":["

for i in range(len(ind)):
  for j in range(len(encoded_labels)):
    if encoded_labels[j] == ind[i]:
      if i == 3:
        string = string + "\"" + original_labels[j] + "\""
      else:     
        string = string + "\"" + original_labels[j] + "\","
      prediction = original_labels[j]
      break

string = string + "], \"values\": [ \"" + str(predicted_class[0][ind[0]]) + "\",\"" + str(predicted_class[0][ind[1]]) + "\",\"" + str(predicted_class[0][ind[2]]) + "\",\"" + str(predicted_class[0][ind[3]]) + "\"],"

for i in range(len(encoded_labels)):
  if encoded_labels[i] == classes_x[0]:
    string = string + "\"max\": \"" + original_labels[i] + "\""
    prediction = original_labels[i]
    break

string = string + "}"

print(string)