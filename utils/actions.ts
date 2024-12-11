"use server";
import db from "@/utils/db";
import { currentUser, auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  imageSchema,
  productSchema,
  reviewSchema,
  validateWithZodSchema,
} from "./schemas";
import { deleteImage, uploadImage } from "./supabase";
import { revalidatePath } from "next/cache";
import { Cart } from "@prisma/client";

export const fetchFeaturedProducts = async () => {
  const products = await db.product.findMany({ where: { featured: true } });
  return products;
};

export const fetchAllProdcuts = async (search: string) => {
  const allProducts = await db.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { company: { contains: search, mode: "insensitive" } },
      ],
    },
  });
  return allProducts;
};

export const fetchSingleProduct = async (id: string) => {
  const product = await db.product.findUnique({
    where: { id: id },
  });
  if (!product) {
    redirect("/products");
  }
  return product;
};

//helper function to get current user
const getAuthUser = async () => {
  const user = await currentUser();
  if (!user) redirect("/");
  return user;
};

//helper function handle catch and return error
const renderError = (error: unknown): { message: string } => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //======================== my code
  // const errorArray = JSON.parse(error.message) as Array<any>;
  // const message = errorArray.reduce((acc, currentValue) => {
  //   acc = acc + currentValue.path + " " + currentValue.message + " ";
  //   return acc;
  // }, "");
  // console.log(message);
  return {
    message: error instanceof Error ? error.message : "An error occurred",
  };
  // [
  //   {
  //     "code": "too_small",
  //     "minimum": 4,
  //     "type": "string",
  //     "inclusive": true,
  //     "exact": false,
  //     "message": "String must contain at least 4 character(s)",    "path": [
  //       "name"
  //     ]
  //   },
  //    {},...
  // ]
  //
  // error do zod throw hơi khác. Cũng là 1 đống thông tin
  // cái ở trên là error.message => nên phải get message bằng cách khac
};

export const createProductsAction = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prevState: any,
  formData: FormData
): Promise<{ message: string }> => {
  const user = await getAuthUser();
  try {
    const productObj = Object.fromEntries(formData);
    const file = formData.get("image") as File;
    const validatedFile = validateWithZodSchema(imageSchema, { image: file });
    const fullPath = await uploadImage(validatedFile.image);
    const validateFields = validateWithZodSchema(productSchema, productObj);
    await db.product.create({
      data: {
        ...validateFields,
        image: fullPath,
        clerkId: user.id,
      },
    });
  } catch (error) {
    return renderError(error);
  }
  redirect("/admin/products");
};

const getAdminUser = async () => {
  const user = await getAuthUser();
  if (user.id !== process.env.ADMIN_ID) redirect("/");
  return user;
};

export const fetchAdminProducts = async () => {
  await getAdminUser();
  const products = db.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return products;
};

export const deleteProductAction = async (prevState: { productId: string }) => {
  await getAdminUser();
  const productId = prevState.productId;
  try {
    const product = await db.product.delete({
      where: {
        id: productId,
      },
    });
    await deleteImage(product.image);
    revalidatePath("/admin/products");
    return { message: "product deleted" };
  } catch (error) {
    return renderError(error);
  }
};

export const fetchAdminProductDetails = async (productId: string) => {
  await getAdminUser();
  const product = await db.product.findUnique({
    where: {
      id: productId,
    },
  });
  if (!product) redirect("/admin/products");
  return product;
};

export const updateProductAction = async (
  prevState: any,
  formData: FormData
) => {
  await getAdminUser();
  try {
    const productID = formData.get("id") as string;
    const rawData = Object.fromEntries(formData);
    const validatedData = validateWithZodSchema(productSchema, rawData);
    await db.product.update({
      where: {
        id: productID,
      },
      data: {
        ...validatedData,
      },
    });
    revalidatePath(`/admin/products/${productID}/edit`);
    return { message: "Product updated successfully" };
  } catch (error) {
    return renderError(error);
  }
};

export const updateProductImageAction = async (
  preState: any,
  formData: FormData
): Promise<{ message: string }> => {
  await getAdminUser();
  try {
    const image = formData.get("image") as File;
    const productId = formData.get("id") as string;
    const oldImageUrl = formData.get("url") as string;
    const validateFile = validateWithZodSchema(imageSchema, { image });
    const fullPath = await uploadImage(validateFile.image);
    await deleteImage(oldImageUrl);
    await db.product.update({
      where: { id: productId },
      data: {
        image: fullPath,
      },
    });
    revalidatePath(`/admin/products/${productId}/edit`);
    return { message: "Product image updated successfully" };
  } catch (error) {
    return renderError(error);
  }
};

export const fetchFavoriteId = async ({ productId }: { productId: string }) => {
  const user = await getAuthUser();
  const favorite = await db.favorite.findFirst({
    where: {
      productId,
      clerkId: user.id,
    },
    select: {
      id: true,
    },
  });
  return favorite?.id || null;
};

export const toggleFavoriteAction = async (prevState: {
  productId: string;
  favoriteId: string | null;
  pathname: string;
  //pathname for revalidating to a specific path.
  //because toggleFavoriteBtn appear in multiple places in this app
}) => {
  const user = await getAuthUser();
  const { productId, favoriteId, pathname } = prevState;

  try {
    if (favoriteId) {
      await db.favorite.delete({
        where: {
          id: favoriteId,
        },
      });
    } else {
      await db.favorite.create({
        data: {
          productId,
          clerkId: user.id,
        },
      });
    }

    revalidatePath(`/${pathname}`);
    return {
      message: favoriteId ? "Removed from favorite" : "added to favorite",
    };
  } catch (error) {
    return renderError(error);
  }
};

export const fetchUserFavorite = async () => {
  const user = await getAuthUser();
  const favorites = await db.favorite.findMany({
    where: {
      clerkId: user.id,
    },
    include: {
      product: true,
    },
  });

  return favorites;
};

export const createReviewAction = async (
  prevState: any,
  formData: FormData
) => {
  const user = await getAuthUser();
  try {
    const rawData = Object.fromEntries(formData);
    const validatedData = validateWithZodSchema(reviewSchema, rawData);
    await db.review.create({
      data: {
        ...validatedData,
        clerkId: user.id,
      },
    });
    revalidatePath(`/products/${validatedData.productId}`);
    return { message: "review submitted successfully" };
  } catch (error) {
    return renderError(error);
  }
};

export const fetchProductReviews = async (productId: string) => {
  const reviews = await db.review.findMany({
    where: {
      productId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return reviews;
};
// export const fetchProductReviewsByUser = async () => {};
export const deleteReviewAction = async (prevState: { reviewId: string }) => {
  const { reviewId } = prevState;
  const user = await getAuthUser();
  try {
    await db.review.delete({
      where: {
        id: reviewId,
        clerkId: user.id,
      },
    });
    revalidatePath("/reviews");
    return { message: "review deleted" };
  } catch (error) {
    return renderError(error);
  }
};

export const fetchProductReviewsByUser = async () => {
  const user = await getAuthUser();
  const userId = user.id;
  const reviewsByUser = await db.review.findMany({
    where: {
      clerkId: userId,
    },
    select: {
      id: true,
      comment: true,
      rating: true,
      product: {
        select: {
          image: true,
          name: true,
          price: true,
        },
      },
    },
  });
  return reviewsByUser;
};
export const fetchProductRating = async (productId: string) => {
  const result = await db.review.groupBy({
    by: ["productId"],
    _avg: {
      rating: true,
    },
    _count: {
      rating: true,
    },
    where: { productId },
  });
  return result;
};

export const findExistingReview = async (userId: string, productId: string) => {
  return db.review.findFirst({ where: { clerkId: userId, productId } });
};

//cart
//find cart by user id, if there items in cart => update cart number in client
//if there are no cart items => give the cart the number of zero
export const fetchCartItems = async () => {
  const { userId } = auth();
  const cart = await db.cart.findFirst({
    where: {
      clerkId: userId ?? "",
    },
    select: {
      numItemsInCart: true,
    },
  });
  return cart?.numItemsInCart || 0;
};

//helper function fetchProduct => check if the product is existing or not before adding to the cart
//if not => throw an error
const fetchProduct = async (productId: string) => {
  const product = await db.product.findUnique({
    where: {
      id: productId,
    },
  });
  if (!product) throw new Error("This product has been removed");
  return product;
};

//helper function fetchOrCreateCart => check if this cart instance by current user is existing or not
// if yes => add to cart. If not => create a new cart or throw an error if user is trying to delete the cart
const inCLudeProductClause = {
  cartItems: {
    include: {
      product: true,
    },
  },
};
export const fetchOrCreateCart = async ({
  userId,
  errorOnFailure = false,
}: {
  userId: string;
  errorOnFailure?: boolean;
}) => {
  let cart = await db.cart.findFirst({
    where: {
      clerkId: userId,
    },
    include: inCLudeProductClause,
  });
  if (!cart && errorOnFailure) {
    throw new Error("Cart not found");
  }
  if (!cart) {
    cart = await db.cart.create({
      data: {
        clerkId: userId,
      },
      include: inCLudeProductClause,
    });
  }
  return cart;
};

//another helper function updateOrCreateCartItem, the name says everything
interface UpdateOrCrateCartProps {
  productId: string;
  cartId: string;
  amount: number;
}
const updateOrCreateCartItem = async ({
  productId,
  cartId,
  amount,
}: UpdateOrCrateCartProps) => {
  let cartItem = await db.cartItem.findFirst({
    where: {
      productId,
      cartId,
    },
  });
  if (cartItem) {
    cartItem = await db.cartItem.update({
      where: { id: cartItem.id },
      data: {
        amount: cartItem.amount + amount,
      },
    });
  } else {
    cartItem = await db.cartItem.create({
      data: {
        amount,
        productId,
        cartId,
      },
    });
  }
};

//update cart api
export const updateCart = async (cart: Cart) => {
  const cartItems = await db.cartItem.findMany({
    where: {
      cartId: cart.id,
    },
    include: {
      product: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
  let numItemsInCart = 0;
  let cartTotal = 0;

  for (const item of cartItems) {
    numItemsInCart += item.amount;
    cartTotal += item.amount * item.product.price;
  }
  const tax = cart.taxRate * cartTotal;
  const shipping = cartTotal ? cart.shipping : 0;
  const orderTotal = cartTotal + tax + shipping;

  const currentCart = await db.cart.update({
    where: {
      id: cart.id,
    },
    data: {
      numItemsInCart,
      cartTotal,
      tax,
      orderTotal,
    },
    include: inCLudeProductClause,
  });
  return { cartItems, currentCart };
};

//add an item to the cart by userid
export const addToCartAction = async (preState: any, formData: FormData) => {
  const user = await getAuthUser();
  try {
    const productId = formData.get("productId") as string;
    const amount = Number(formData.get("amount"));
    //check for product
    await fetchProduct(productId);
    const cart = await fetchOrCreateCart({ userId: user.id });
    await updateOrCreateCartItem({ productId, cartId: cart.id, amount });
    await updateCart(cart);
  } catch (error) {
    return renderError(error);
  }
  redirect("/cart");
};

// remove cart item
export const removeCartItemAction = async (
  prevState: any,
  formData: FormData
) => {
  const user = await getAuthUser();
  try {
    const cartItemId = formData.get("id") as string;
    const cart = await fetchOrCreateCart({
      userId: user.id,
      errorOnFailure: true,
    });
    await db.cartItem.delete({
      where: {
        id: cartItemId,
        cartId: cart.id,
      },
    });
    await updateCart(cart);
    revalidatePath("cart");
    return { message: "Item removed from cart" };
  } catch (error) {
    return renderError(error);
  }
};

//change amount cart actioon
export const updateCartItemAction = async ({
  amount,
  cartItemId,
}: {
  amount: number;
  cartItemId: string;
}) => {
  const user = await getAuthUser();
  try {
    const cart = await fetchOrCreateCart({
      userId: user.id,
      errorOnFailure: true,
    });
    await db.cartItem.update({
      where: {
        cartId: cart.id,
        id: cartItemId,
      },
      data: { amount },
    });
    revalidatePath("/cart");
    return { message: "updated the amount of this product" };
  } catch (error) {
    return renderError(error);
  }
};

//order
export const createOrderAction = async (preState: any, formData: FormData) => {
  return { message: "created order" };
};
