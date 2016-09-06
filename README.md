#AudioBoard

AudioBoard is an application written using Flask that takes live audio input (speech ideally) and creates a real time visualization of the input, utilizing google images and keyword detection to bring your words to life.

**Development Guide:**

1. Install Pip. You'll need this if you ever use Python. https://pip.pypa.io/en/stable/installing/
2. Run pip install -r requirements.txt
//also install textblob
3. Run python runserver.py
4. Navigate to http://127.0.0.1:9001/

Everything else should get setup automatically!

API Guide:
```
/api/getnoun/<input_phrase>
``` 
does stuff with the input phrase

