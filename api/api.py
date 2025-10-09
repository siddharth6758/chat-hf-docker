import logging
from fastapi import FastAPI
from pydantic import BaseModel
from gradio_client import Client

app = FastAPI()

log = logging.getLogger(__name__)
log.info("Starting API server...")

client = Client("siddharth6758/ChatModel")

class ChatRequest(BaseModel):
    message: str

def chat_response(message: str):
    try:
        client = Client("siddharth6758/ChatModel")
        result = client.predict(
            chat=message,
            api_name="/chat"
        )
        return result
    except Exception as e:
        log.error(f"Error in chat response: {e}")
        return "Sorry, I couldn't process your request at the moment."

@app.post("/chat")
def chat_endpoint(message: ChatRequest):
    return {'response': chat_response(message.message)}