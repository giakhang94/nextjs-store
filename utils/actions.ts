"use server";

import db from "@/utils/db";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  imageSchema,
  productSchema,
  reviewSchema,
  validateWithZodSchema,
} from "./schemas";
import { deleteImage, uploadImage } from "./supabase";
import { revalidatePath } from "next/cache";
import { actionFunction } from "./types";

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
  const user = getAuthUser();
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
