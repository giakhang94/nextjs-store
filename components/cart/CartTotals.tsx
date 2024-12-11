import { formatCurrency } from "@/utils/format";
import { Cart } from "@prisma/client";
import { Separator } from "../ui/separator";
import { Card, CardTitle } from "../ui/card";
import FormContainer from "../form/FormContainer";
import { createOrderAction } from "@/utils/actions";
import { SubmitButton } from "../form/Buttons";

function CartTotals({ cart }: { cart: Cart }) {
  const { cartTotal, shipping, tax, orderTotal } = cart;
  return (
    <div>
      <Card className="p-8">
        <CartTotalRow label="Subtotal" amount={cartTotal} />
        <CartTotalRow label="Shipping" amount={shipping} />
        <CartTotalRow label="Tax" amount={tax} />
        <CardTitle className="mt-8">
          <CartTotalRow
            label="Order Total"
            amount={orderTotal}
            lastRow={true}
          />
        </CardTitle>
      </Card>
      <FormContainer action={createOrderAction}>
        <SubmitButton text="Place Order" className="w-full mt-8" />
      </FormContainer>
    </div>
  );
}

interface CartTotalRowProps {
  label: string;
  amount: number;
  lastRow?: boolean;
}
function CartTotalRow({ label, amount, lastRow }: CartTotalRowProps) {
  return (
    <>
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span>{formatCurrency(amount)}</span>
      </div>
      {lastRow ? null : <Separator className="my-2 h-[1px] bg-gray-300" />}
    </>
  );
}

export default CartTotals;
