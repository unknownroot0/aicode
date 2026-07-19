import { ProductsHero } from "./ProductsHero";
import { LatestProduct } from "./LatestProduct";
import { AllProducts } from "./AllProducts";

export default function ProductsPage() {
  return (
    <>
      <ProductsHero />
      <LatestProduct />
      <AllProducts />
    </>
  );
}
