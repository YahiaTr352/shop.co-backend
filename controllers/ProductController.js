const axios = require("axios");
const ContactMessage = require("../models/ContactMessage");
const Product = require("../models/Product");
const { validateAddProduct } = require("../utils/validation");


const AddProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      colors,
      sizes,
      stock,
      isTrending,
      isNewArrival,
      brand,
      discount,
      typeOfProduct,
      salesCount,
      material,
      dimensionsWidth,
      dimensionsHeight,
      releaseDate,
    } = req.body;

    const mainImage = req.files["mainImage"]
      ? req.files["mainImage"][0].filename
      : null;

    const imagesByColor = [];

    if (colors && req.files) {
      const colorArray = colors.split(",").map(color => color.trim());
      colorArray.forEach((color, index) => {
        const colorImages = (req.files[`images-${index}`] || []).map(file => file.filename);

        imagesByColor.push({
          color: color,
          images: colorImages,
        });
      });
    }

    const errors = validateAddProduct({ name, description, price, category, colors, sizes, stock, brand, typeOfProduct, material, dimensionsWidth, dimensionsHeight, releaseDate });

    if (Object.keys(errors).length > 0) {
      return res.status(400).json(errors);
    }

    const newProduct = new Product({
      name,
      description,
      typeOfProduct,
      price,
      mainImage,
      imagesByColor,
      category,
      colors: colors.split(",").map((c) => c.trim()),
      sizes: sizes.split(",").map((s) => s.trim()),
      stock,
      isTrending: isTrending === "true",
      isNewArrival: isNewArrival === "true",
      brand,
      discount,
      salesCount: salesCount || 0,
      material,
      dimensionsWidth,
      dimensionsHeight,
      releaseDate,
    });

    await newProduct.save();

    res.status(200).json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong", error });
  }
};

const PurchaseProduct = async (req, res) => {
  const { quantity } = req.body;

  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: "Not enough stock available" });
    }

    product.stock -= quantity;
    product.salesCount += quantity;

    await product.save();

    res.status(200).json({ message: "Purchase successful", product });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};


const DeleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(400).json({ message: "product is not found" });
    }

    await Product.deleteOne();
    res.status(200).json("product deleted successfully");
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "something went wrong while deleting the product" });
  }
}

const EditProduct = async (req, res) => {
  const { name, description, price, discount, category, colors, sizes, stock, isTrending, typeOfProuct } = req.body;
  const updatedData = {};
  const image = req.file ? req.file.filename : null;

  if (name) updatedData.name = name;
  if (description) updatedData.description = description;
  if (price) updatedData.price = price;
  if (discount) updatedData.discount = discount;
  if (image) updatedData.image = image;
  if (typeOfProuct) updatedData.typeOfProuct = typeOfProuct;
  if (category) updatedData.category = category;
  if (colors) updatedData.colors = colors;
  if (sizes) updatedData.sizes = sizes;
  if (stock) updatedData.stock = stock;
  if (isTrending) updatedData.isTrending = isTrending;

  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(400).json({ message: "Product is not found" });
    }

    if (price || discount) {
      const finalPrice = updatedData.price || product.price;
      const finalDiscount = updatedData.discount || product.discount;
      updatedData.priceAfterDiscount = finalPrice - (finalPrice * finalDiscount / 100);
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong while updating the product" });
  }
};



const GetProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("ratings.user", "name");;

    if (!product) {
      return res.status(400).json({ message: "product is not found" });
    }

    res.status(200).json(product);

  } catch (error) {
    res.status(400).json({ message: "something went wrong." });
  }
}

const GetTrendingProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const skip = (page - 1) * limit;

    const trendingProducts = await Product.find({ isTrending: true }).skip(skip).limit(limit);
    const totalProducts = await Product.countDocuments({ isTrending: true });
    const totalPages = Math.ceil(totalProducts / limit);

    res.status(200).json({ products: trendingProducts, totalPages });
  } catch (error) {
    res.status(400).json({ message: "Something went wrong." });
  }
};

const GetNewArrivals = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const skip = (page - 1) * limit;

    const newArrivals = await Product.find({ isNewArrival: true }).skip(skip).limit(limit);
    const totalProducts = await Product.countDocuments({ isNewArrival: true });
    const totalPages = Math.ceil(totalProducts / limit);

    res.status(200).json({ products: newArrivals, totalPages });
  } catch (error) {
    res.status(400).json({ message: "Something went wrong." });
  }
};

const GetTopSellingProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const skip = (page - 1) * limit;

    const topSellingProducts = await Product.find()
      .sort({ salesCount: -1 })
      .skip(skip)
      .limit(limit);
    const totalProducts = await Product.countDocuments();
    const totalPages = Math.ceil(totalProducts / limit);

    res.status(200).json({ products: topSellingProducts, totalPages });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong.", error });
  }
};

const GetProductsByCategory = async (req, res) => {
  try {
    const category = req.query.category;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const skip = (page - 1) * limit;

    const products = await Product.find({ category })
      .skip(skip)
      .limit(limit);

    const totalProducts = await Product.countDocuments({ category });
    const totalPages = Math.ceil(totalProducts / limit);

    res.status(200).json({ products, totalPages });
  } catch (error) {
    res.status(500).json({ message: "Failed to get products by category", error });
  }
};


const GetProductsByType = async (req, res) => {
  try {
    const type = req.params.type;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const skip = (page - 1) * limit;

    const products = await Product.find({ typeOfProduct: type })
      .skip(skip)
      .limit(limit);

    const totalProducts = await Product.countDocuments({ typeOfProduct: type });
    const totalPages = Math.ceil(totalProducts / limit);

    res.status(200).json({ products, totalPages });
  } catch (error) {
    res.status(500).json({ message: "Failed to get products by type", error });
  }
};

const GetOnSaleProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const skip = (page - 1) * limit;

    const onSaleProducts = await Product.find({ discount: { $gt: 0 } })
      .skip(skip)
      .limit(limit);

    const totalProducts = await Product.countDocuments({ discount: { $gt: 0 } });
    const totalPages = Math.ceil(totalProducts / limit);

    res.status(200).json({ products: onSaleProducts, totalPages });
  } catch (error) {
    res.status(400).json({ message: "Something went wrong." });
  }
};

const GetForBrand = async (req, res) => {
  const { brand } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 8;
  const skip = (page - 1) * limit;

  try {
    const products = await Product.find({
      brand: { $regex: new RegExp(brand, "i") },
    })
      .skip(skip)
      .limit(limit);

    const totalProducts = await Product.countDocuments({
      brand: { $regex: new RegExp(brand, "i") },
    });

    const totalPages = Math.ceil(totalProducts / limit);

    res.status(200).json({ products, totalPages });
  } catch (error) {
    res.status(400).json({ message: "Something went wrong while getting products" });
  }
};

const GetAllProducts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 8;
  const skip = (page - 1) * limit;

  try {
    const products = await Product.find()
      .skip(skip)
      .limit(limit);

    const totalProducts = await Product.countDocuments();
    const totalPages = Math.ceil(totalProducts / limit);

    res.status(200).json({ products, totalPages });
  } catch (error) {
    res.status(400).json({ message: "Something went wrong while getting all products" });
  }
};

const AddRating = async (req, res) => {
  const { rating, comment } = req.body;
  const { userId, productId } = req.query;

  try {
    const product = await Product.findById(productId.trim());
    if (!product) return res.status(404).json({ message: "product not found" });

    const newRating = await product.addRating(userId, rating, comment);
    res.json({ message: "rating added successfully", rating: newRating });
  } catch (error) {
    console.error(error);  
    res.status(500).json({ message: "something went wrong.", error: error.message });
  }
};


const GetAllReviews = async (req, res) => {
  try {

    const product = await Product.findById(req.params.id).populate("ratings.user", "name");

    if (!product) {
      return res.status(404).json({ message: "product not found" });
    }

    const reviews = product.ratings.map(review => ({
      userName: review.user.name,
      rating: review.rating,
      comment: review.comment,
      postedAt: review._id.getTimestamp()
    }));

    res.status(200).json({ reviews });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "something went wrong." });
  }
};

const FilterProduct = async (req, res) => {
  try {
    const {
      category,
      brand,
      minPrice,
      maxPrice,
      colors,
      sizes,
      isTrending,
      isNewArrival,
      typeOfProuct,
      page = 1,
      limit = 8
    } = req.query;

    const filters = {};

    if (category && category !== '') filters.category = category;
    if (brand && brand !== '') filters.brand = brand;
    if (typeOfProuct && typeOfProuct !== '') filters.typeOfProuct = typeOfProuct;

    if (minPrice !== undefined || maxPrice !== undefined) {
      filters.price = {};
      if (minPrice !== '' && minPrice !== undefined) filters.price.$gte = parseFloat(minPrice);
      if (maxPrice !== '' && maxPrice !== undefined) filters.price.$lte = parseFloat(maxPrice);
      if (Object.keys(filters.price).length === 0) delete filters.price;
    }

    if (colors && colors !== '') {
      filters.colors = { $in: colors.split(",").filter((c) => c !== '') };
    }

    if (sizes && sizes !== '') {
      filters.sizes = { $in: sizes.split(",").filter((s) => s !== '') };
    }

    if (isTrending === "true" || isTrending === "false") {
      filters.isTrending = isTrending === "true";
    }

    if (isNewArrival === "true" || isNewArrival === "false") {
      filters.isNewArrival = isNewArrival === "true";
    }

    const pageNumber = parseInt(page);
    const itemsPerPage = parseInt(limit);
    const skip = (pageNumber - 1) * itemsPerPage;

    const products = await Product.find(filters).skip(skip).limit(itemsPerPage);
    const totalProducts = await Product.countDocuments(filters);
    const totalPages = Math.ceil(totalProducts / itemsPerPage);

    res.status(200).json({ products, totalPages });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong while filtering the product", error });
  }
};

const getRelatedProducts = async (req, res) => {
  const { brand, type, id } = req.query;

  try {
    const relatedProducts = await Product.find({
      _id: { $ne: id },
      brand,
      typeOfProduct: type,
    })
      .limit(4);

    res.json({ related: relatedProducts });
  } catch (error) {
    console.error("Error fetching related products:", error);
    res.status(500).json({ message: "Something went wrong." });
  }
};

const searchProducts = async (req, res) => {
  const { query } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 8;
  const skip = (page - 1) * limit;

  if (!query) {
    return res.status(400).json({ message: "Search query is required." });
  }

  try {
    const searchFilter = {
      $or: [
        { name: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } }
      ]
    };

    const totalResults = await Product.countDocuments(searchFilter);
    const totalPages = Math.ceil(totalResults / limit);

    const results = await Product.find(searchFilter)
      .skip(skip)
      .limit(limit);

    res.status(200).json({ results, totalPages });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong." });
  }
};

module.exports = {
  AddProduct,
  PurchaseProduct,
  EditProduct,
  GetProduct,
  GetTrendingProducts,
  GetNewArrivals,
  GetProductsByCategory,
  GetProductsByType,
  GetForBrand,
  GetOnSaleProducts,
  GetTopSellingProducts,
  GetAllProducts,
  FilterProduct,
  DeleteProduct,
  AddRating,
  GetAllReviews,
  getRelatedProducts,
  searchProducts
}
