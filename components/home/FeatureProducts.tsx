import { fetchFeaturedProducts } from "@/utils/actions";
import ProductsGrid from "../products/ProductsGrid";
import EmptyList from "../global/EmptyList";
import SectionTitle from "../global/SectionTitle";
async function FeatureProducts() {
  const products = await fetchFeaturedProducts();
  if (products.length === 0) return <EmptyList />;
  return (
    <section className="pt-24">
      <SectionTitle text="featured products" />
      <ProductsGrid products={products} />
    </section>
  );
}

export default FeatureProducts;
