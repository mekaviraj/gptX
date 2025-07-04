from flask import Flask, request, send_file
from io import BytesIO
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

app = Flask(__name__)

@app.route('/export', methods=['POST'])
def export_pdf():
    chat = request.get_json()
    buffer = BytesIO()
    c = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter
    y = height - 40
    for msg in chat:
        if msg['role'] == 'user':
            c.setFont("Helvetica-Bold", 10)
            c.drawString(40, y, "Prompt:")
            c.setFont("Helvetica", 10)
            c.drawString(100, y, msg['content'])
        else:
            c.setFont("Helvetica-Bold", 10)
            c.drawString(40, y, "AI:")
            c.setFont("Helvetica", 10)
            c.drawString(100, y, msg['content'])
        y -= 40
        if y < 60:
            c.showPage()
            y = height - 40
    c.save()
    buffer.seek(0)
    return send_file(buffer, as_attachment=True, download_name="chatlog.pdf", mimetype='application/pdf')

if __name__ == '__main__':
    app.run(debug=True)
