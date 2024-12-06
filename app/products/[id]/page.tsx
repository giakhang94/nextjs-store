import SingleProduct from "@/components/single-product/SingleProduct";

interface Props {
  params: { id: string };
}
export default function SingleProductPage({ params }: Props) {
  return <SingleProduct id={params.id} />;
}
