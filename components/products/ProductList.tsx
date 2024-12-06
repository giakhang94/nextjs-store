import { formatCurrency } from "@/utils/format";
import { Product } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "../ui/card";
import FavoriteToggleBtn from "./FavoriteToggleBtn";
interface Props {
  products: Product[];
}
function ProductsList({ products }: Props) {
  return (
    <div className="pt-12 flex flex-col gap-4">
      {products.map((product: Product) => {
        const { name, price, image, company } = product;
        // console.log(name, price, image);
        const formatedPrice = formatCurrency(price);
        return (
          <article key={product.id} className="relative">
            <Link href={`/products/${product.id}`} className="group relative">
              <Card className="transform group-hover:shadow-xl transition-shadow duration-500">
                <CardContent className="p-4 flex">
                  <div className="relative h-[80px] md:h-[200px] rounded md:w-[240px] w-[100px]">
                    <Image
                      src={image}
                      alt={name}
                      //   fill
                      sizes="25vw"
                      width={360}
                      height={48}
                      priority
                      className="rounded w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="ml-5  text-center flex flex-col justify-between px-1 w-auto items-start">
                    <div>
                      <span className="text-lg capitalize  font-semibold block">
                        {name}
                      </span>
                      <span className="text-lg capitalize block text-left">
                        {company}
                      </span>
                    </div>
                    <span className="text-muted-foreground mt-2">
                      {formatedPrice}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
            <div className="absolute top-1 right-1">
              <FavoriteToggleBtn productId={product.id} />
            </div>
          </article>
        );
      })}
    </div>
  );
}

export default ProductsList;
