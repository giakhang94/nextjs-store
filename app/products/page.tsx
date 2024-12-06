import ProductsContainer from "@/components/products/ProductsContainer";

interface Props {
  searchParams: { layout?: string; search?: string };
}
function ProductsPage({ searchParams }: Props) {
  const layout = searchParams.layout || "grid";
  const search = searchParams.search || "";
  // console.log(searchParams);
  return <ProductsContainer layout={layout} search={search} />;
}

export default ProductsPage;
