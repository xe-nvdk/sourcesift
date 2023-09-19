# Sourcesift

![sourcesift](https://github.com/xe-nvdk/sourcesift/assets/64545348/0083cd2e-2cb8-43bf-a93b-2ad7d37aea18)

Sourcesift is a web-based application designed to streamline and centralize the experience of reading news and listening to podcasts. Leveraging the power of RSS, this application fetches and displays content from various sources, organized into a visually appealing and responsive layout.

## Key Features:

* No tracking: This App and eventually the hosted one is not going to contain anything to track users, preferences, etc. As a "Developer," I don't care about what you read using SourceSift. 
* Dynamic Content Aggregation: Seamlessly fetches and aggregates content from multiple RSS sources, ensuring users always have fresh content to consume.
* Responsive Layout: Designed to work beautifully across a range of devices, from desktop to mobile.
* Podcast Integration: Not just for written content, NewsFeed also caters to audio enthusiasts by embedding playable podcast episodes directly within the interface.
* Interactive UI: News articles and podcasts are displayed in card-like components that can be expanded for more details, ensuring a clutter-free experience.
* Customizability: Comes with functionalities that can be extended to add new sources or customize the display preferences.
* Whether you're a news junkie or a casual reader, NewsFeed provides a unified space to stay informed and entertained.

## How to run

First, you need to keep in mind that this is an ongoing project. Right now, you can find two/three parts. The frontend is written in React, the Backend in Python using FastAPI, and a Postgresql database that right now is not in use.

### Run the frontend:

Clone the project:

```
git clone git@github.com:xe-nvdk/sourcesift.git
```

Browse the frontend folder

```
cd frontend
```

Run...

```
npm install
```

Then...

```
npm start
```

### Run the backend

Browse the backend folder. 

```
cd backend
```

The backend is built using Python and FastAPI, you will find the requirements.txt.

```
pip3 install -r requirements.txt
```

Connect to the database, right now is not doing against the database but the connection is required, you can run PostgreSQL in a container. 

```bash
docker run --hostname=sourcesift --env=POSTGRES_USER=sourcesift --env=POSTGRES_PASSWORD=sourcesift --env=POSTGRES_HOST_AUTH_METHOD=trust --env=POSTGRES_DB=sourcesift --env=PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/lib/postgresql/15/bin --env=GOSU_VERSION=1.14 --env=LANG=en_US.utf8 --env=PG_MAJOR=15 --env=PG_VERSION=15.1-1.pgdg110+1 --env=PGDATA=/var/lib/postgresql/data --volume=/var/lib/postgresql/data -p 5432:5432 --restart=no --runtime=runc -d postgres
```

Configure the config.ini file, make sure that has the same value that you are setting in the database. 

```
python3 main.py
```

## Start to using it

Go to http://localhost:3000 and you will see the app running. 

## Feedback and contributions

You are more than welcome to contribute, fork, do your thing, and create a pull request. If you want to provide feedback or talk about this project, you can reach me here ignacio[at]vandroogenbroeck[dot]net
