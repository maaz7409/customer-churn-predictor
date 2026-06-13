## E-commerce Customer Churn Prediction

<!-- ### Need for ML -->

### Method

Below is Full pipeline i used for the whole process : 

```mermaid

flowchart TD
    A[(Data)] --> B[Stratified Sampling]
    B --> C1[(Train set)]
    B --> C2[(Test set)]
    
    C1 ==> D[OneHotEncoding]
    C2 -.-> D
    subgraph SG1 ["Transformation Pipeline"];
        D ==> E[Winsorization]
        E ==> F[KNN Imputation]
        F ==> G[Scaling]
        G ==> H[SMOTE]
 
        D -.-> E
        E -.-> F
        F -.-> G
    end
    G -..->|Testing Models| I1((" "))

    H ==>|Training models| I2((" "))

    I2 ==> J1
    I2 ==> J2
    I2 ==> J3
    I2 ==> J4

    I1 -.-> J1([KNN])
    I1 -.-> J2([SVM])
    I1 -.-> J3([Random Forest])
    I1 -.-> J4([XGBoost])

    J1 -.-> K[\Meta Classifier/]
    J2 -.-> K
    J3 -.-> K
    J4 -.-> K

    K -.-> L([Logistic Regression])

    L -.->|Final Prediction| M((" "))

    style M fill:None, color:None, stroke:None ;





```

(Diagrams are made (programmed) in mermaid, hence a bit distorted ...)

bold lines - training set workflow

dashed lines - test set workflow 


### Reproducing the work

#### If you wanna connect api to your frontend

Run

```
docker pull maaz7409/churn_backend 
```

then run 

```
docker run -e ALLOWED_ORIGIN="your frontend url here" maaz7409/churn_backend
```

#### If you wanna run this locally and experiment with it

clone this repository 

```
git clone https://github.com/maaz7409/customer-churn-predictor.git
```




 and change ``` .env.example ``` to ``` .env ``` and add frontend and backend url to path variables as 

```
# In ./frontend/.env
VITE_BACKEND_URL='http://127.0.0.1:8000'
```

```
# In ./backend/.env
ALLOWED_ORIGIN='http://localhost:5173'
```

then, run 

```
docker compose --env-file ./frontend/.env --env-file ./backend/.env up --build
```