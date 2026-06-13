
import joblib
import pandas as pd

model = joblib.load(r'models/transformation_pipeline_and_stacking_ensemble.joblib')

from schemas.userinput import UserInput

def model_predict(userinput : UserInput) :
    return model.predict_proba(pd.DataFrame([userinput.model_dump()]))