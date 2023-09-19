from fastapi import FastAPI, Body, HTTPException # type: ignore
from fastapi.middleware.cors import CORSMiddleware # type: ignore
from fastapi import HTTPException
from pydantic import BaseModel
from db_ops import (register_user, init_db_pool, close_db_pool, login_user, add_news_source, add_user_source, remove_user_source)
from time import sleep
from asyncio import sleep as async_sleep
import requests # type: ignore
from starlette.responses import RedirectResponse
from datetime import datetime
import re
import requests
from fastapi import Response, Request, Header, FastAPI
from starlette.status import HTTP_404_NOT_FOUND, HTTP_401_UNAUTHORIZED
from pydantic import BaseModel
import feedparser

class UserRegistration(BaseModel):
    email: str
    password: str
    full_name: str

class UserLogin(BaseModel):
    email: str
    password: str

class NewsSource(BaseModel):
    name: str
    rss_url: str
    logo_url: str = None

class UserSource(BaseModel):
    user_id: int
    source_id: int
    display_order: int

sourcesift = FastAPI(title="Project X API" ,description="Project X API is a RESTful API for creating, resizing, terminating and listing services in the Voltmetrix platform. It also allows you to register and login to your account.", version="1.0")

origins = [
    "http://localhost",
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:4200",
    "http://localhost:4200",
]

sourcesift.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@sourcesift.on_event("startup")
async def startup_event():
    await init_db_pool()

@sourcesift.on_event("shutdown")
async def shutdown_event():
    await close_db_pool()

@sourcesift.post("/register")
async def register(user: UserRegistration):
    result = await register_user(user.email, user.password, user.full_name)
    if result["status"] == "error":
        raise HTTPException(status_code=400, detail=result["detail"])
    return result

@sourcesift.post("/login/")
async def login(user: UserLogin):
    result = await login_user(user.email, user.password)
    if result["status"] == "success":
        return result
    raise HTTPException(status_code=400, detail=result["detail"])

@sourcesift.post("/add_source/")
async def add_source(source: NewsSource):
    result = await add_news_source(source.name, source.rss_url, source.logo_url)
    if result["status"] == "success":
        return result
    raise HTTPException(status_code=400, detail=result["detail"])

@sourcesift.post("/user/add_source/")
async def user_add_source(user_source: UserSource):
    result = await add_user_source(user_source.user_id, user_source.source_id, user_source.display_order)
    if result["status"] == "success":
        return result
    raise HTTPException(status_code=400, detail=result["detail"])

@sourcesift.delete("/user/{user_id}/remove_source/{source_id}")
async def user_remove_source(user_id: int, source_id: int):
    result = await remove_user_source(user_id, source_id)
    if result["status"] == "success":
        return result
    raise HTTPException(status_code=400, detail=result["detail"])

def extract_enclosure(entry_links):
    for link in entry_links:
        if link.get('rel') == 'enclosure':
            return link
    return None

def extract_image(entry):
    # First, try fetching 'itunes:image'
    itunes_image = entry.get('image', {}).get('href', None) if entry.get('image') else None
    if itunes_image:
        return itunes_image
    
    # If 'itunes:image' is not found, check 'media:content'
    if 'media_content' in entry:
        for media in entry['media_content']:
            if media.get('type', '').startswith('image/'):
                return media.get('url')
    
    return None

@sourcesift.get("/fetch_rss/")
async def fetch_rss(url: str):
    data = feedparser.parse(url)
    if data.bozo:
        return {"status": "error", "detail": "Failed to fetch or parse the RSS"}

    news_items = []
    for entry in data.entries[:10]:
        news_items.append({
        'title': entry.title,
        'link': entry.link,
        'description': getattr(entry, 'summary', None),
        'published': getattr(entry, 'published', None),
        'published_parsed': getattr(entry, 'published_parsed', None),
        'source': None,  # Adjust this if you find the source in the keys
        'author': getattr(entry, 'author', None),
        'tags': [],  # Adjust this if you find tags in the keys
        'itunes:image': extract_image(entry),  # Use the new function here
        'enclosure': extract_enclosure(entry.get('links', []))
    })

    return {"status": "success", "data": news_items}
