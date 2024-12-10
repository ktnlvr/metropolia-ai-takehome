# Metropolia AI Translator

a takehome for the "Student assistants for Metropolia AI project."

## Installation

## Q & A

### How does it work?

### Does it save my queries?

The queries are saved locally in local storage and loaded every time the page is opened again.

### Does it use a GPU?

If a GPU is available, it will use it.

### Why this design?

The design is done in accordance with [Metropolia's Brand and Visual Guidelines](https://www.metropolia.fi/en/metropolias-brand-and-visual-guidelines).

### How about multiple sentences?

The model poorly handles multiple sentences, so I split them by punctuation and handle separately.

Input:

```
Wow, this is so nice and considerate. I wonder how many hedgehogs does it take? When the quick brown fox jumped over the lazy dog I was so amazed, standing in awe with my family. Such nice weather today
```

Output without splitting:

```
Kuinkahan monta siiliä siihen tarvitaan? Kun nopea kettu hyppäsi laiskan koiran yli, olin niin hämmästynyt, kun seisoin kunnioittavasti perheeni kanssa.
```

Output with splitting:

```
Vau, tämä on niin kilttiä ja huomaavaista. Kuinkahan monta siiliä se vaatii? Kun nopea ruskea kettu hyppäsi laiskan koiran yli, olin niin hämmästynyt, kun seisoin kunnioittavasti perheeni luona. Niin kaunis sää tänään 
```

Evidently, the output is much better. One consequence is that some context can be lost since the sentences are processes independently. However not processing a sentence entirely loses even more context.
