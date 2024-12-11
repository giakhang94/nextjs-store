import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { fetchOrCreateCart, updateCart } from "@/utils/actions";
import SectionTitle from "@/components/global/SectionTitle";
import CartItemsList from "@/components/cart/CartItemsList";
import CartTotals from "@/components/cart/CartTotals";

async function CartPage() {
  const { userId } = auth();
  if (!userId) redirect("/");
  const previousCart = await fetchOrCreateCart({ userId });
  const cart = await updateCart(previousCart);
  if (cart.numItemsInCart === 0) return <SectionTitle text="Empty Cart" />;
  return (
    <>
      <SectionTitle text="Shopping Cart" />
      <div className="mt-8 grid gap-4 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <CartItemsList cartItems={cart.cartItems} />
        </div>
        <div className="lg:col-span-4">
          <CartTotals cart={cart} />
        </div>
      </div>
    </>
  );
}

export default CartPage;
