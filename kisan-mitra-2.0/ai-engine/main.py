from fastapi import FastAPI
from routers import prediction, risk, recommendation

app = FastAPI(title="Kisan-Mitra AI Engine", version="0.1.0")

@app.get("/health")
def health():
    return {"status": "ok", "service": "kisan-mitra-ai-engine"}

app.include_router(prediction.router, prefix="/prediction", tags=["Prediction"])
app.include_router(risk.router, prefix="/risk", tags=["Risk"])
app.include_router(recommendation.router, prefix="/recommendation", tags=["Recommendation"])
