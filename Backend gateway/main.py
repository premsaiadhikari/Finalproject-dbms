from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from controllers import AuthenticationRouter
from config import config
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title=config.Settings.title,
    description=config.Settings.description,
    version=config.Settings.version
)

origins = config.CORS_ORIGINS

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(AuthenticationRouter)

@app.get("/")
def home():
    return {"status": "started", "message": "DBMS Final Project API is running"}