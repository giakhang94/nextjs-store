import { fetchAllProdcuts } from "@/utils/actions";
import ProductsGrid from "./ProductsGrid";
import { LuLayoutGrid, LuList } from "react-icons/lu";
import { Button } from "../ui/button";
import ProductsList from "./ProductList";
import Link from "next/link";
async function ProductsContainer({
  layout,
  search,
}: {
  layout: string;
  search: string;
}) {
  const products = await fetchAllProdcuts(search);
  const totalProducts = products.length;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const searchTerm = search ? `&search=${search}` : "";

  return (
    <>
      {/* Header */}
      <section className="flex justify-between items-center">
        <div>
          {totalProducts !== 0 ? (
            <p className="font-semibold">{`Total ${
              totalProducts > 1 ? totalProducts + " products" : "1 product"
            }`}</p>
          ) : (
            "No Products to display"
          )}
        </div>
        <div className="flex items-center md:space-x-2 lg:space-x-5 ">
          <Button
            asChild
            size="icon"
            variant="outline"
            className="cursor-pointer"
          >
            <Link href={`/products?layout=grid${searchTerm}`}>
              <LuLayoutGrid
                size={25}
                className={`${layout === "grid" ? "text-blue-600" : ""}`}
              />
            </Link>
          </Button>
          <Button
            asChild
            size="icon"
            variant="outline"
            className="cursor-pointer"
          >
            <Link href={`/products?layout=list${searchTerm}`}>
              <LuList
                size={25}
                className={`${layout === "list" ? "text-blue-600" : ""}`}
              />
            </Link>
          </Button>
        </div>
      </section>
      {/* products */}
      <section>
        {layout === "grid" ? (
          <ProductsGrid products={products} />
        ) : (
          <ProductsList products={products} />
        )}
      </section>
    </>
  );
}

export default ProductsContainer;
