cd backend
pip install -r requirements.txt
python3 -m uvicorn app.main:app --reload --port 8000

cd frontend
npm i 
npm run dev
