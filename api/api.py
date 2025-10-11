import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from gradio_client import Client
from pydantic import BaseModel

app = FastAPI()

log = logging.getLogger(__name__)
log.info("Starting API server...")

client = Client("siddharth6758/ChatModel")

class ChatRequest(BaseModel):
    message: str

origins = [
    "http://localhost:5173",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def chat_response(message: str, client: Client):
    try:
        result = client.predict(
            chat=message,
            api_name="/chat"
        )
        return result
    except Exception as e:
        log.error(f"Error in chat response: {e}")
        return "Sorry, I couldn't process your request at the moment."

@app.post("/chat")
async def chat_endpoint(message: ChatRequest):
    return {'response': chat_response(message.message, client)}