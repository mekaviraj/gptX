import os
import mysql.connector
from flask import Flask, request, jsonify
from dotenv import load_dotenv
import google.generativeai as genai
# from datetime import datetime

load_dotenv()

app = Flask(__name__)

# Database configuration
db_config = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'user': os.getenv('DB_USER', 'root'),
    'password': os.getenv('DB_PASSWORD', ''),
    'database': os.getenv('DB_NAME', 'prompt_engineer')
}

# Initialize Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-pro')

def get_db_connection():
    return mysql.connector.connect(**db_config)

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS chat_history (
            id INT AUTO_INCREMENT PRIMARY KEY,
            role ENUM('user', 'assistant') NOT NULL,
            content TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            prompt_fields JSON
        )
    ''')
    conn.commit()
    cursor.close()
    conn.close()

init_db()

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/history')
def get_history():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute('SELECT role, content FROM chat_history ORDER BY created_at ASC')
    history = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(history)

@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    main_prompt = data.get('mainPrompt', '')
    expanded_fields = data.get('expandedFields', {})

    # Construct the final prompt
    prompt_parts = []
    if main_prompt:
        prompt_parts.append(f"Main Prompt: {main_prompt}")
    
    for field, value in expanded_fields.items():
        if value:
            prompt_parts.append(f"{field}: {value}")
    
    final_prompt = "\n".join(prompt_parts)

    if not final_prompt:
        return jsonify({'response': 'Please provide a prompt'}), 400

    # Save user message to DB
    import json
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        'INSERT INTO chat_history (role, content, prompt_fields) VALUES (%s, %s, %s)',
        ('user', final_prompt, json.dumps(expanded_fields))
    )
    conn.commit()

    try:
        # Get Gemini response
        response = model.generate_content(final_prompt)
        bot_response = response.text if hasattr(response, 'text') else str(response)
        # Save bot response to DB
        cursor.execute(
            'INSERT INTO chat_history (role, content, prompt_fields) VALUES (%s, %s, %s)',
            ('assistant', bot_response, None)
        )
        conn.commit()

        cursor.close()
        conn.close()
        
        return jsonify({'response': bot_response})
    except Exception as e:
        cursor.close()
        conn.close()
        return jsonify({'response': f'Error: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True)
