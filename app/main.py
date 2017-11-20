import requests
import sys
words = {}

try:
    while True:
        resp = requests.get("http://burgundy.io:8080/")
        words[resp.content.decode('utf-8')] = 1
        sys.stdout.write(".")
        sys.stdout.flush()
except KeyboardInterrupt as e:
    print(words.keys())
