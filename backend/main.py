from fastapi import FastAPI,Path,Query
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from schemas.userinput import UserInput
from models.prediction import model_predict

import os


app = FastAPI()

ALLOWED_ORIGIN = os.getenv("FRONTEND_URL","http://localhost:5173")

origins = [
    ALLOWED_ORIGIN
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods = ["*"],
    allow_headers = ["*"]
)



@app.get("/")
def hello() :
    return {"message" : "Welcome to E-Commerce Customer churn Predictor"}


@app.post("/predict")
def predict(input_data : UserInput) :
    prediction = model_predict(input_data)

    return JSONResponse(status_code=200, content= {"predicted probablity that customer churns" : round(prediction[0,1]*100 , 2) })



