import os
source = 'backend/backend-log-3.txt'
dest = 'C:/Users/91850/.gemini/antigravity/brain/f27c3ac6-bea9-4ac2-95fb-7e7722346ec3/backend-log-3.txt'

try:
    with open(source, 'r', encoding='utf-16le') as f:
        content = f.read()
    with open(dest, 'w', encoding='utf-8') as f:
        f.write(content)
except Exception:
    try:
        with open(source, 'r', encoding='utf-8') as f:
            content = f.read()
        with open(dest, 'w', encoding='utf-8') as f:
            f.write(content)
    except Exception as e:
        with open(dest, 'w', encoding='utf-8') as f:
            f.write("Error copying log: " + str(e))
print("Copied to", dest)
