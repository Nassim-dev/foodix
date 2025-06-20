from fastapi import FastAPI, Query
import httpx
import logging
import pandas as pd
from scipy import sparse
import pickle
from sklearn.metrics.pairwise import cosine_similarity

with open('./model/vectorizer.pkl', 'rb') as f:
    vectorizer = pickle.load(f)

green_df = pd.read_csv('./model/green_df.csv')
green_vectors = sparse.load_npz('./model/green_vectors.npz')

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s"
)

app = FastAPI()

@app.get("/product/{barcode}")
async def get_product_info(
    barcode: str,
    essential: bool = Query(False),
    with_reco: bool = Query(False)
):
    url = f"https://world.openfoodfacts.net/api/v2/product/{barcode}.json"

    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        response.raise_for_status()
        data = response.json()

        product = data.get("product", {})

        if essential:
            nutriments = product.get("nutriments", {})
            allergens = product.get("allergens_tags", [])
            additives = product.get("additives_tags", [])
            ingredients_analysis = product.get("ingredients_analysis_tags", [])
            categories = product.get("categories_tags", ["unknown"])

            main_category = categories[0].replace("en:", "") if categories else "unknown"

            result = {
                "product_name": product.get("product_name", "N/A"),
                "image_url": product.get("image_url"),
                "category": main_category, 
                "nutriscore": {
                    "grade": product.get("nutriscore_grade", "N/A"),
                    "score": product.get("nutriscore_score", "N/A"),
                },
                "ecoscore": {
                    "grade": product.get("ecoscore_grade", "N/A"),
                    "score": product.get("ecoscore_score", "N/A"),
                },
                "nova_group": product.get("nova_group", "N/A"),
                "health_risks": {
                    "fat": nutriments.get("fat", "N/A"),
                    "saturated_fat": nutriments.get("saturated-fat", "N/A"),
                    "sugars": nutriments.get("sugars", "N/A"),
                    "salt": nutriments.get("salt", "N/A"),
                    "palm_oil": "en:palm-oil" in ingredients_analysis,
                    "additives": additives,
                    "allergens": allergens,
                }
            }

            if with_reco and result["product_name"] != "N/A":
                try:
                    query_text = f"{result['product_name']} {main_category}"
                    query_vec = vectorizer.transform([query_text])
                    sims = cosine_similarity(query_vec, green_vectors).flatten()
                    best_idx = int(sims.argmax())
                    best_item = green_df.iloc[best_idx].to_dict()
                    score = float(sims[best_idx])

                    result["recommendation"] = {
                        "item": best_item,
                        "similarity": score
                    }
                except Exception as e:
                    logging.error(f"Erreur lors de la recommandation : {e}")
                    result["recommendation"] = {
                        "item": None,
                        "similarity": 0.0
                    }

            return result

        return data
