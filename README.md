# AMDAG - Abstract Memory Directed Acyclic Graph

## Motivation

AMDAG is a little project I put together to act as a nerdy note taking website. In most note taking software and in physical journals, notes are written linearly where each note lies in a sequence. This works well for chronological note taking, but for anything else notes quickly get disorganised. Tagging systems alleviate this but aren't nice to visualise and quickly become cumbersome.

AMDAG aims to solve this by representing the notes as a network, where arrows between notes mean one note is on a topic more abstract than the one below.

## Setup

After pulling this repo there are a couple steps you'll need to follow. Open one terminal and run the following line.

```
npm run start-api
```

Then open a second terminal and run the following:

```
npm start
```

## Bonus Setup

If at some later date you wish to create a new database, then you'll need to go to the `api` folder and open up a python terminal and run the following lines:

```python
from api import *
db.create_all()
```