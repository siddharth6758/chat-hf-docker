from transformers import AutoModelForCausalLM, AutoTokenizer
import gradio as gr
import logging

log = logging.getLogger(__name__)

log.info("Initializing DialoGPT-medium model from HuggingFace Space...")
try:
    tokenizer = AutoTokenizer.from_pretrained("microsoft/DialoGPT-medium")
    model = AutoModelForCausalLM.from_pretrained("microsoft/DialoGPT-medium")
    log.info("DialoGPT-medium model loaded successfully.")
except Exception as e:
    log.error(f"Error loading model: {e}")
    model_pipeline = None

def chat_response(chat, history):
    try:
        new_user_input_ids = tokenizer.encode(chat + tokenizer.eos_token, return_tensors='pt')
        if len(history) > 0:
            full_conversation = ''
            for user_input, bot_response in history:
                full_conversation += user_input + tokenizer.eos_token + bot_response + tokenizer.eos_token
            full_conversation += chat + tokenizer.eos_token
            bot_input_ids = tokenizer.encode(full_conversation, return_tensors='pt')
        else:
            bot_input_ids = new_user_input_ids
        chat_history_ids = model.generate(
            bot_input_ids,
            max_length=1000,
            pad_token_id=tokenizer.eos_token_id,
            do_sample=True,
            temperature=0.7,
            top_p=0.9
        )
        response_msg = tokenizer.decode(chat_history_ids[:, bot_input_ids.shape[-1]:][0], skip_special_tokens=True)
        return response_msg
    except Exception as e:
        log.error(f"Error generating response: {e}")
        return "Sorry, I couldn't process your request at the moment."

model_instance = gr.ChatInterface(
    fn=chat_response,
    title="My Chatbot (DialoGPT-medium)",
    description="Ask me anything! I'm running on a free Hugging Face Space.",
    examples=["Hello, how are you?", "What's your favorite color?", "Tell me a joke!"]
)

model_instance.launch(share=True)