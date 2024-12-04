from flask import Flask, render_template, request
from transformers import pipeline
from torch.cuda import is_available as has_cuda

app = Flask(__name__, template_folder=".")

model_checkpoint = "Helsinki-NLP/opus-mt-en-fi"
translator = pipeline(
    "translation", model=model_checkpoint, device="cuda" if has_cuda() else "cpu"
)


@app.route("/translate", methods=["POST"])
def post():
    text = request.get_data(as_text=True)
    return str(translator(text)[0]["translation_text"])


@app.route("/")
def index():
    return render_template("index.html")


if __name__ == "__main__":
    app.run()
