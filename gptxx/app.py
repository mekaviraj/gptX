import os
import textwrap
import google.generativeai as genai
from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

app = Flask(__name__)

# Configure Google Generative AI with your API key
genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))

# Optional: Print available models that support generateContent
# print("\n--- Available Gemini Models ---")
# for m in genai.list_models():
#     if "generateContent" in m.supported_generation_methods:
#         print(f"Model Name: {m.name}, Display Name: {m.display_name}")
# print("-----------------------------\n")

# Use a currently supported model name
model = genai.GenerativeModel('gemini-2.0-flash')  # Or 'gemini-1.5-pro', 'gemini-2.0-flash', etc.

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    main_prompt = data.get('mainPrompt', '')
    expanded_fields = data.get('expandedFields', {})

    # Construct the final prompt
    full_prompt_parts = []
    if main_prompt:
        full_prompt_parts.append(f"Task: {main_prompt}")

    # Define the order of expanded fields
    field_order = [
        'topic', 'context', 'tone', 'targetAudience', 'format',
        'role', 'keywords', 'positiveKeywords', 'negativeConstraints', 'length'
    ]

    for field_name in field_order:
        label = ''
        # Map camelCase keys to human-readable labels for the prompt
        if field_name == 'topic': label = 'Topic'
        elif field_name == 'context': label = 'Context/Examples'
        elif field_name == 'tone': label = 'Tone/Style'
        elif field_name == 'targetAudience': label = 'Target Audience'
        elif field_name == 'format': label = 'Format'
        elif field_name == 'role': label = 'Role'
        elif field_name == 'keywords': label = 'Keywords'
        elif field_name == 'positiveKeywords': label = 'Positive/Key Words'
        elif field_name == 'negativeConstraints': label = 'Negative/Constraints'
        elif field_name == 'length': label = 'Length'

        value = expanded_fields.get(field_name)
        if value:
            full_prompt_parts.append(f"• {label}: {value}")

    final_prompt = " ".join(full_prompt_parts).strip()

    if not final_prompt:
        return jsonify({'response': 'Please enter a prompt or fill in some fields.'})

    try:
        # Generate content using the Gemini model
        # You might want to add error handling or adjust generation parameters here
        response = model.generate_content(final_prompt)
        # Access the text from the response object
        generated_text = response.text
        return jsonify({'response': generated_text})
    except Exception as e:
        print(f"Error generating content: {e}")
        return jsonify({'response': 'An error occurred while generating the response. Please try again.'}), 500

if __name__ == '__main__':
    app.run(debug=True) # debug=True allows for automatic reloading on code changes