import { fetchSingleProduct } from "@/utils/actions";
import BreadCrumbs from "./BreadCrumbs";
import ProductRating from "./ProductRating";
import Image from "next/image";
import { formatCurrency } from "@/utils/format";
import { Separator } from "../ui/separator";
import FavoriteToggleBtn from "../products/FavoriteToggleBtn";
import AddToCart from "./AddToCart";
interface Props {
  id: string;
}
async function SingleProduct({ id }: Props) {
  const product = await fetchSingleProduct(id);
  if (!product) return <div>not found</div>;
  return (
    <div className="">
      <div className="mb-4">
        <BreadCrumbs child={product.name} parent="products" />
      </div>
      <Separator />
      <section className="flex flex-col md:flex-row  mx-auto md:space-x-10 mt-4">
        <div className="w-full md:w-2/4 md:h-48 h-full lg:block">
          <Image
            src={product.image}
            width={500}
            height={350}
            alt="product img"
            className="w-full max-h-[350px] object-cover rounded-sm"
          />
        </div>
        <div className="w-full md:w-2/4 md:h-[350px] flex flex-col justify-between text-sm md:text-base h-full sm:mt-4 md:mt-0">
          <div className="flex items-center -mt-2">
            <p className="font-semi-bold tracking-[1px] text-xl uppercase">
              {product.name}
            </p>
            <FavoriteToggleBtn productId={product.id} className="" />
          </div>
          <ProductRating productId={product.id} />
          <p className="text-lg font-semibold">{product.company}</p>
          <p className="my-4">{formatCurrency(product.price)}</p>
          <p className="text-justify text-muted-foreground overflow-hidden">
            {product.description}
          </p>
          <AddToCart className="mt-4 self-start items-end" />
        </div>
      </section>
    </div>
  );
}

export default SingleProduct;
