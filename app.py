#made by Angad Singh
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import nltk
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.svm import SVC
import string
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

df = pd.read_csv(r'backend\as.csv') 

def pre(text):
    words = nltk.word_tokenize(text.lower())
    return ' '.join(words)

def preprocess(text):
    text = text.lower()
    words = nltk.word_tokenize(text)
    words = [word for word in words if word not in string.punctuation]
    stop_words = set(stopwords.words('english'))
    exception_words = ["you","u","your","he","his","he","him"]
    filtered_words = []
    for word in words:
        if word not in stop_words or word in exception_words:
            filtered_words.append(word)
    words = filtered_words
    lemmatizer = WordNetLemmatizer()
    words = [lemmatizer.lemmatize(word) for word in words]
    return words

def check(text):
    def word(text):
        word=nltk.word_tokenize(text.lower())
        return word
    
    input_string = word(text)
    ques = df['questions'].apply(preprocess).sum()
    input_token = preprocess(text)
    count = 0
    for item in input_token:
        if item in ques:
            count += 1
    result = count >= 1
    return result

df['Processed'] = df['questions'].apply(pre)
vectorizer = TfidfVectorizer()
X = vectorizer.fit_transform(df['Processed'])
y = df['answers']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.01, random_state=42)
classifier = SVC(kernel='linear')
classifier.fit(X_train, y_train)

app = Flask(__name__)
CORS(app)

@app.route('/chat', methods=['POST'])
def chatbot():
    try:
        data = request.json
        user_input = data.get('message', '')

        if not user_input:
            return jsonify({"response": "Please type something!"}), 400
        processed_input = pre(user_input)
        if check(processed_input):
            input_vector = vectorizer.transform([processed_input])
            response = classifier.predict(input_vector)[0]
            return jsonify({"response": response})
        else:
            return jsonify({"response": "I am not really sure how to respond to this, kindly contact Mr. Singh to scheduke a meeting and talkl freely."}), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"response": "I am not really sure how to respond to this, kindly contact Mr. Singh to scheduke a meeting and talk freely."}), 500

if __name__ == '__main__':
    app.run(debug=True)