import os
from flask import Flask, render_template, request, jsonify
from chatbot import get_bot_response, clear_user_session

app = Flask(__name__)


# ===================== HOME ROUTE =====================
@app.route('/')
def home():
    """Renders the main index.html (Landing + Login + Chat pages)."""
    return render_template('index.html')


# ===================== CHAT ROUTE =====================
@app.route('/chat', methods=['POST'])
def chat():
    """
    Receives user message from script.js (fetch POST to /chat),
    sends it to Gemini via chatbot.py, and returns the reply as JSON.
    """
    try:
        data = request.get_json()

        user_message = data.get('message', '').strip()
        user_name = data.get('user', 'Guest').strip() or 'Guest'

        if not user_message:
            return jsonify({'reply': "Please type something so I can help you! 😊"})

        # Get response from Gemini via chatbot.py
        bot_reply = get_bot_response(user_message, user_name)

        return jsonify({'reply': bot_reply})

    except Exception as e:
        print(f"Error in /chat route: {e}")
        return jsonify({'reply': "⚠️ Something went wrong on the server. Please try again."}), 500


# ===================== CLEAR CHAT ROUTE (optional, server-side session clear) =====================
@app.route('/clear', methods=['POST'])
def clear():
    """Clears server-side Gemini chat history for a user (called on logout/clear chat)."""
    try:
        data = request.get_json()
        user_name = data.get('user', 'Guest').strip() or 'Guest'

        clear_user_session(user_name)
        return jsonify({'status': 'success'})

    except Exception as e:
        print(f"Error in /clear route: {e}")
        return jsonify({'status': 'error'}), 500


# ===================== RUN APP =====================
if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
