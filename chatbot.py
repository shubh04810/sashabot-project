import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

API_KEY = os.getenv("GROQ_API_KEY")

if not API_KEY:
    raise ValueError("GROQ_API_KEY not found! Please set it in your .env file.")

client = Groq(api_key=API_KEY)

chat_sessions = {}


def get_bot_response(user_message, user_name="Guest"):
    try:
        if user_name not in chat_sessions:
            chat_sessions[user_name] = [
                {
                    "role": "system",
                    "content": (
                        "You are Sasha AI, a friendly and helpful AI assistant "
                        "created by Shubham using Python Flask. "
                        "Keep your replies concise, warm, and conversational. "
                        f"You are currently talking to {user_name}."
                    )
                }
            ]

        chat_sessions[user_name].append({"role": "user", "content": user_message})

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=chat_sessions[user_name],
            temperature=0.7,
            max_tokens=300
        )

        bot_reply = response.choices[0].message.content.strip()
        chat_sessions[user_name].append({"role": "assistant", "content": bot_reply})

        return bot_reply

    except Exception as e:
        print(f"Error in get_bot_response: {e}")
        return "⚠️ Sorry, I'm having trouble responding right now. Please try again."


def clear_user_session(user_name):
    if user_name in chat_sessions:
        del chat_sessions[user_name]