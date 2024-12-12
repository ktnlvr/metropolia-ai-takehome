# Metropolia AI Translator

a takehome for the "Student assistants for Metropolia AI project."

## Installation

1. `git clone https://github.com/ktnlvr/metropolia-ai.git`.
2. Create a using `python -m venv` and activate it.
3. Follow the [Official PyTorch Installation Tutorial](https://pytorch.org/get-started/locally/).
4. Install the required packages using `pip install -r requirements.txt`.
5. Run the server with `python main.py`!
6. During first initialization it will download the model locally, give it some time.
7. Run and test!

## Q & A

### How does it work?

Every input is sent to the backend, preprocessed, passed to the translation engine and reported back to the frontend. There it is displayed to the screen and saved into the local history.

### How does it save my queries?

The queries are saved locally in local storage and loaded every time the page is opened again.

### Why this design?

The modern users of Language-Oriented Machine Learning Models are mostly familiar with chat-based interfaces that are ubiquitous when interacting with LLMs. Thus, more of the users are familiar with how to interact with the translator. It also allows for a very intuitive way to store history.

The font choice mirrors the fonts used on the official Metropolia website, a more fledged out product with a broader scope would offer more interesting opportunities for branding.

### How about long texts?

The model poorly handles multiple sentences, so I split them by punctuation and handle separately.

### Input

```
Wow, this is so nice and considerate. I wonder how many hedgehogs does it take? When the quick brown fox jumped over the lazy dog I was so amazed, standing in awe with my family. Such nice weather today
```

### Output Without Splitting

```
Kuinkahan monta siiliä siihen tarvitaan? Kun nopea kettu hyppäsi laiskan koiran yli, olin niin hämmästynyt, kun seisoin kunnioittavasti perheeni kanssa.
```

### Output With Splitting

```
Vau, tämä on niin kilttiä ja huomaavaista. Kuinkahan monta siiliä se vaatii? Kun nopea ruskea kettu hyppäsi laiskan koiran yli, olin niin hämmästynyt, kun seisoin kunnioittavasti perheeni luona. Niin kaunis sää tänään 
```

Evidently, the output is much better. One consequence is that some context can be lost since the sentences are processes independently. However not processing a sentence entirely loses even more context.

Optionally, this can be turned off by unticking the "Improve" checkbox.

### Does it use a GPU?

If a GPU is available, it will use it. If enabled with the "Improve" checkbox, multi-sentence requests are also batched to use the GPU to it's fullest potential. 

### Any speedups?

The queries for the same texts are cached on the server. Since translation is idempotent and stateless a simple hashtable is sufficient.

### What can be improved?

* The current implementation does not take advantage of concurrency and processes all the requests sequentially, causing significant slowdowns with multiple sequantial queries.
* Can be scaled up with a load balancer and a better hashing solution.
* LRU is probably not the best caching solution, since phrases like "Hello" and "What time is it?" will be requested more often, so any time-based cache policy is apt.
