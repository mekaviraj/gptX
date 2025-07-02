import os
from fastapi import FastAPI, Request, Form
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from models import MsgPayload
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables
load_dotenv()

app = FastAPI()
messages_list: dict[int, dict] = {}

# Set up templates directory
templates = Jinja2Templates(directory="templates")

# Google Gemini config
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel("models/gemini-2.0-flash")


@app.get("/", response_class=HTMLResponse)
def root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request, "messages": messages_list})


@app.post("/messages/send/")
def send_message(msg_name: str = Form(...)):
    msg_id = max(messages_list.keys()) + 1 if messages_list else 0
    # Call Google Gemini to get a response
    ai_response = ""
    try:
        response = model.generate_content(msg_name)
        ai_response = response.text
    except Exception as e:
        ai_response = f"Error: {e}"

    messages_list[msg_id] = {
        "msg_id": msg_id,
        "msg_name": msg_name,
        "ai_response": ai_response
    }
    return RedirectResponse("/", status_code=303)


# About page route
@app.get("/about")
def about() -> dict[str, str]:
    return {"message": "This is the about page."}


# Route to add a message
@app.post("/messages/{msg_name}/")
def add_msg(msg_name: str) -> dict[str, MsgPayload]:
    # Generate an ID for the item based on the highest ID in the messages_list
    msg_id = max(messages_list.keys()) + 1 if messages_list else 0
    messages_list[msg_id] = MsgPayload(msg_id=msg_id, msg_name=msg_name)

    return {"message": messages_list[msg_id]}


# Route to list all messages
@app.get("/messages")
def message_items() -> dict[str, dict[int, MsgPayload]]:
    return {"messages:": messages_list}
