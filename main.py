from collections import OrderedDict

from flask import Flask, render_template, request
from transformers import pipeline
from torch.cuda import is_available as has_cuda

print("Setting up, the model takes some time to startup")

app = Flask(__name__, template_folder=".")

model_checkpoint = "Helsinki-NLP/opus-mt-en-fi"
translator = pipeline(
    "translation", model=model_checkpoint, device="cuda" if has_cuda() else "cpu"
)


def splitby(string: str, by: list[str]):
    i = 0
    while i < len(string):
        for sep in by:
            if string[i:].startswith(sep):
                ret = string[:i]
                yield ret, sep
                string = string[i + len(sep) :]
        i += 1
    if string:
        yield string, ""


CACHE = OrderedDict()
CACHE_CAPACITY = 512


def translate(text: str, *, improve: bool) -> str:
    if improve:
        # I noticed that the translation engine doesn't do too well with
        # multiple sentences, so split by punctuation
        output = ""
        splits = list(splitby(text, [".", "!", "?"]))

        def cleanup(string: str) -> str:
            return string.removesuffix('.').removesuffix('!').removesuffix('?')

        # Batch the sentences
        sentences = [cleanup(sentence) for sentence, _ in splits]
        puncts = [punct for _, punct in splits]

        translated = map(
            lambda res: cleanup(res["translation_text"]), translator(sentences)
        )
        for sentence, punct in zip(translated, puncts):
            output += sentence + punct + " "
    else:
        output = translator(text)[0]["translation_text"]
    return output


@app.route("/translate", methods=["POST"])
def post():
    body = request.get_json(force=True)

    improve = body.get("improve") or False
    text = body["text"].strip()
    cache_item = (text, improve)

    # hand-rolled Least Recently Used cache
    output = None
    if cache_item in CACHE:
        CACHE.move_to_end(cache_item)
        output = CACHE[cache_item]
    else:
        CACHE[cache_item] = translate(text, improve=improve)
        CACHE.move_to_end(cache_item)
        if len(CACHE) > CACHE_CAPACITY:
            CACHE.popitem(last=False)
        output = CACHE[cache_item]

    return {"translated": output}


js = None
with open("./index.js", "r") as file:
    js = file.read()


@app.route("/index.js")
def script():
    return js


@app.route("/")
def index():
    return render_template("index.html")


if __name__ == "__main__":
    app.run()
