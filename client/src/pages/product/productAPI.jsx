import { axiosInstance } from "../auth/authApi";

export const fetchProductById = async (id) => {
  const response = await axiosInstance.get(`/products/${id}`);
  return response;
};

export function fetchCategories() {
  return new Promise(async (resolve) => {
    const response = await fetch("/categories");
    const data = await response.json();
    resolve({ data });
  });
}

export function fetchBrands() {
  return new Promise(async (resolve) => {
    const response = await fetch("/brands");
    const data = await response.json();
    resolve({ data });
  });
}
export function fetchProductsByFilters(
  filter,
  sort,
  pagination,
  search,
  selectedPriceRange,
  admin
) {
  let queryString = "";
  for (let key in filter) {
    const categoryValues = filter[key];
    if (categoryValues.length) {
      queryString += `${key}=${categoryValues}&`;
    }
  }
  for (let key in sort) {
    queryString += `${key}=${sort[key]}&`;
  }

  for (let key in pagination) {
    queryString += `${key}=${pagination[key]}&`;
  }

  // // Handle search
  if (search) {
    queryString += `title=${search}&`;
  }

  // Add price range parameters
   if (selectedPriceRange) {
    if (selectedPriceRange.minPrice !== undefined) {
      queryString += `minPrice=${selectedPriceRange.minPrice}&`;
    }
    if (selectedPriceRange.maxPrice !== undefined) {
      queryString += `maxPrice=${selectedPriceRange.maxPrice}&`;
    }
  }

  if (admin) {
    queryString += `admin=true`;
  }

  // Remove the trailing '&' if it exists
  if (queryString.endsWith("&")) {
    queryString = queryString.slice(0, -1);
  }

  // queryString = queryString.slice(0, -1);

  return new Promise(async (resolve) => {
    //TODO: we will not hard-code server URL here
    const response = await fetch(
      "/products?" + queryString
    );
    const data = await response.json();
    const totalItems = await response.headers.get("X-Total-Count");
    resolve({ data: { products: data.docs, totalItems: data.totalDocs } });
  });
}

export function createProduct(product) {
  return new Promise(async (resolve) => {
    const response = await fetch("/products/", {
      method: "POST",
      body: JSON.stringify(product),
      headers: { "content-type": "application/json" },
    });
    const data = await response.json();
    resolve({ data });
  });
}

export function updateProduct(update) {
  return new Promise(async (resolve) => {
    const response = await fetch(
      "/products/" + update.id,
      {
        method: "PATCH",
        body: JSON.stringify(update),
        headers: { "content-type": "application/json" },
      }
    );
    const data = await response.json();
    // TODO: on server it will only return some info of user (not password)
    resolve({ data });
  });
}
