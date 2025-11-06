import Menu from "../models/menuModel.js";
export class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  filter() {
    const queryObj = { ...this.queryStr };
    const excludeFields = ["page", "limit", "sort"];
    excludeFields.forEach((field) => delete queryObj[field]);
    const filter = {};
    // Price filtering
    if (queryObj.price) {
      filter.price = Number(queryObj.price);
    } else if (queryObj.priceMin || queryObj.priceMax) {
      filter.price = {};
      if (queryObj.priceMin) filter.price.$gte = Number(queryObj.priceMin);
      if (queryObj.priceMax) filter.price.$lte = Number(queryObj.priceMax);
    }
    // Type
    if (queryObj.type) {
      filter.type = queryObj.type;
    }
    //country
    if (queryObj.country) {
      filter.country = { $regex: queryObj.country, $options: "i" };
    }
    // Name (partial match)
    if (queryObj.name) {
      filter.name = { $regex: queryObj.name, $options: "i" };
    }
    // Rating
    if (queryObj.rating) {
      filter.rating = Number(queryObj.rating);
    }
    // offer
    if (queryObj.offer) {
      filter.offer = Number(queryObj.offer);
    }
    // Category
    if (queryObj.category) {
      filter.category = queryObj.category.toLowerCase();
    }
    this.query = this.query.find(filter);
    return this;
  }

  paginate() {
    const page = parseInt(this.queryStr.page) || 1;
    const limit = parseInt(this.queryStr.limit) || 9;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }

  sort() {
    if (this.queryStr.sort) {
      const sortBy = this.queryStr.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }
}

// export const filterData = async (req, res, next) => {
//   try {
//     const { priceMin, priceMax, type, name, category } = req.query;
//     const filter = {};

//     if (priceMin || priceMax) {
//       filter.price = {};
//       if (priceMin) filter.price.$gte = Number(priceMin);
//       if (priceMax) filter.price.$lte = Number(priceMax);
//     }
//     if (type) {
//       filter.type = type;
//     }
//     // ✅ Filter by name
//     if (name) {
//       filter.name = { $regex: name, $options: "i" };
//     }
//     // ✅ Filter by category (veg/nonveg)
//     if (category) {
//       filter.category = category.toLowerCase();
//     }
//     const menuItems = await Menu.find(filter).lean();
//     res.json({
//       success: true,
//       message: "Filtered menu items fetched successfully!",
//       data: menuItems,
//       error: [],
//     });
//   } catch (error) {
//     console.error("Error filtering menu items:", error);
//     res.status(500).json({
//       success: false,
//       message: "Error filtering menu items.",
//       data: [],
//       error: error.message,
//     });
//   }
// };
