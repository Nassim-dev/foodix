from fastapi import FastAPI, Query
import httpx
import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s"
)

app = FastAPI()

@app.get("/product/{barcode}")
async def get_product_info(barcode: str, essential: bool = Query(False)):
    url = f"https://world.openfoodfacts.net/api/v2/product/{barcode}.json"
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        response.raise_for_status()
        data = response.json()

        if essential:
            product = data.get("product", {})
            nutriments = product.get("nutriments", {})
            allergens = product.get("allergens_tags", [])
            additives = product.get("additives_tags", [])
            ingredients_analysis = product.get("ingredients_analysis_tags", [])
            return {
                "product_name": product.get("product_name", "N/A"),
                "image_url": product.get("image_url"),
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
        return data
