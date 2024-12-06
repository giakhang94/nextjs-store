import db from "@/utils/db";
import { redirect } from "next/navigation";
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
  const product = await db.product.findUnique({ where: { id: id } });
  if (!product) {
    redirect("/products");
  }
  return product;
};
