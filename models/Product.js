const { required } = require("joi");
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    },
    description: {
        type: String,
        trim: true,
        required: true,
    },

    price: {
        type: Number,
        required: true,
    },

    mainImage: {
        type: String, 
    },

    imagesByColor: [
        {
            color: { type: String },
            images: [{ type: String }],
        },
    ],

    category: {
        type: String,
        required: true,
        enum: ["Casual", "Formal", "Party", "Gym"],
    },

    brand: {
        type: String,
    },

    colors: {
        type: [String],
        required: true,
    },

    sizes: {
        type: [String],
        required: true,
    },

    stock: {
        type: Number,
        required: true,
    },

    isTrending: { 
        type: Boolean,
        default: false,
    },

    isNewArrival: {
        type: Boolean,
        default: true,
    },

    discount: {
        type: Number,
        default: 0,
    },

    material: {
        type: String,
        required: true,
    },
    dimensionsWidth: {
        type: String,
        required: true,
    },

    dimensionsHeight: {
        type: String,
        required: true,
    },
    releaseDate: {
        type: Date,
        required: true,
    },    

    priceAfterDiscount: {
        type: Number,
    },

    salesCount: { 
        type: Number,
        default: 0,
    },

    ratings: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            rating: { type: Number, required: true },
            comment: { type: String, trim: true },
        },
    ],

    averageRating: {
        type: Number, 
        default: 0,
    },

    typeOfProduct : {
        type : String,
        required : true,
        enum : ["Shirts" , "Jeans" , "Pants" , "Hoodies" , "Jackets"]
    }
});

productSchema.pre("save", function (next) {
    this.priceAfterDiscount = this.price - (this.price * this.discount / 100);
    next();
});

productSchema.methods.calculateAverageRating = function () {
    if (this.ratings.length === 0) {
        this.averageRating = 0;
    } else {
        const total = this.ratings.reduce((sum, rating) => sum + rating.rating, 0);
        this.averageRating = total / this.ratings.length;
    }
    return this.averageRating;
};

productSchema.methods.addRating = async function (userId, ratingValue, comment) {
    const existingRating = this.ratings.find(rating => rating.user.toString() === userId.toString());
    if (existingRating) {
        existingRating.rating = ratingValue;
        existingRating.comment = comment || existingRating.comment;
    } else {
        this.ratings.push({ user: userId, rating: ratingValue, comment });
    }
    this.calculateAverageRating();
    await this.save();
};

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
