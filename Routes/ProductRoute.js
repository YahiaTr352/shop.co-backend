const express = require("express");
const {uploadFields} = require("../middlewares/UploadMiddleware");
const router = express.Router();
const {AddProduct , DeleteProduct, EditProduct , GetProduct , GetAllProducts , FilterProduct, GetTrendingProducts, GetNewArrivals, GetForBrand, PurchaseProduct, GetTopSellingProducts, AddRating, GetAllReviews, GetProductsByCategory, GetProductsByType, potato, tomato, GetOnSaleProducts, getRelatedProducts, searchProducts} = require("../controllers/ProductController");
const VerifyTokenAndRole = require("../middlewares/AuthMiddleWare");

router.post("/add-product" ,VerifyTokenAndRole(["Admin"]) , uploadFields, AddProduct);
router.post("/:id/purchase-product" , VerifyTokenAndRole(["User"]) , PurchaseProduct);
router.post("/add-rating" , VerifyTokenAndRole(["User"]) , AddRating);
router.put("/update-product/:id" ,VerifyTokenAndRole(["Admin"]) , uploadFields, EditProduct);
router.get("/get-product/:id" ,VerifyTokenAndRole(["Admin" , "User"]),  GetProduct);
router.get("/trending-products" , VerifyTokenAndRole(["User"]) , GetTrendingProducts);
router.get("/newArrivals-products" , VerifyTokenAndRole(["User", "Admin"]), GetNewArrivals);
router.get("/brand-products" , VerifyTokenAndRole(["User"]) , GetForBrand);
router.get("/onSale-products" , VerifyTokenAndRole(["User"]) , GetOnSaleProducts);
router.get("/topSelling-products" , VerifyTokenAndRole(["User" , "Admin"]) , GetTopSellingProducts);
router.get("/category" , VerifyTokenAndRole(["User", "Admin"]) , GetProductsByCategory);
router.get("/type/:type" , VerifyTokenAndRole(["User", "Admin"]) , GetProductsByType);
router.get("/get-products" ,VerifyTokenAndRole(["Admin" , "User"]),  GetAllProducts);
router.post("/filter-products", FilterProduct);
router.get("/reviews/:id" , VerifyTokenAndRole(["User"]) , GetAllReviews);
router.delete("/delete-product/:id" , VerifyTokenAndRole(["Admin"]) , DeleteProduct);
router.get("/related-products" , VerifyTokenAndRole(["User"]) , getRelatedProducts);
router.get("/search-products" , searchProducts);

module.exports = router;

 