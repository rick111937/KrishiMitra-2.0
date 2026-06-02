import sys
try:
    with open('backend/backend-log.txt', 'r', encoding='utf-16le') as f:
        print(f.read())
except Exception as e1:
    try:
        with open('backend/backend-log.txt', 'r', encoding='utf-8') as f:
            print(f.read())
    except Exception as e2:
        print("Error reading log:", str(e1), str(e2))
