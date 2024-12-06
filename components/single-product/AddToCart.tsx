import { Button } from "../ui/button";
interface Props {
  className?: string;
}
function AddToCart({ className }: Props) {
  return (
    <Button variant="default" size="default" className={`${className}`}>
      Add To Cart
    </Button>
  );
}

export default AddToCart;
