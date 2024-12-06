import { formatCurrency } from "@/utils/format";
import { Product } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "../ui/card";
import FavoriteToggleBtn from "./FavoriteToggleBtn";
interface Props {
  products: Product[];
}
function ProductsGrid({ products }: Props) {
  return (
    <div className="pt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {products.map((product: Product) => {
        const { name, price, image } = product;
        // console.log(name, price, image);
        const formatedPrice = formatCurrency(price);
        return (
          <article key={product.id} className="relative">
            <Link href={`/products/${product.id}`} className="group relative">
              <Card className="transform group-hover:shadow-xl transition-shadow duration-500">
                <CardContent className="p-4">
                  <div className="relative h-64 md:h-48 rounded overflow-hidden">
                    <Image
                      src={image}
                      alt={name}
                      fill
                      sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 30vw"
                      priority
                      className="rounded w-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="mt-4 text-center flex justify-between items-center px-1">
                    <span className="text-lg capitalize">{name}</span>
                    <span className="text-muted-foreground mt-2">
                      {formatedPrice}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
            <div className="absolute top-5 right-5">
              <FavoriteToggleBtn productId={product.id} />
            </div>
          </article>
        );
      })}
    </div>
  );
}

export default ProductsGrid;
