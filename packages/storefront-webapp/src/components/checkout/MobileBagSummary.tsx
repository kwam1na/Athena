import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Link } from "@tanstack/react-router";
import { useStoreContext } from "@/contexts/StoreContext";
import { useShoppingBag } from "@/hooks/useShoppingBag";
import { useCheckout } from "./CheckoutProvider";
import { BagSummaryItems } from "./BagSummary";
import { Button } from "../ui/button";

export default function MobileBagSummary() {
  const { formatter } = useStoreContext();
  const { bagSubtotal } = useShoppingBag();
  const { checkoutState } = useCheckout();

  const total = (checkoutState.deliveryFee ?? 0) + bagSubtotal;

  return (
    <div>
      <Accordion type="single" collapsible className="w-full space-y-4">
        <AccordionItem value="orderSummary" className="border-none">
          <AccordionTrigger className="flex w-full">
            <div className="flex items-center justify-between w-full pr-4">
              <p className="text-sm">Order summary</p>
              <p className="text-sm font-medium">{formatter.format(total)}</p>
            </div>
          </AccordionTrigger>

          <AccordionContent className="flex flex-col gap-4 py-4 pr-4 ">
            <div className="ml-auto">
              <Link to="/shop/bag">
                <Button className="p-0" variant={"clear"}>
                  <p>Update bag</p>
                </Button>
              </Link>
            </div>
            <BagSummaryItems items={checkoutState?.bag?.items} />

            <div className="space-y-8 pt-4 mt-4">
              <div className="flex justify-between">
                <p className="text-sm">Subtotal</p>
                <p className="text-sm">{formatter.format(bagSubtotal)}</p>
              </div>
              {checkoutState.deliveryFee && (
                <div className="flex justify-between">
                  <p className="text-sm">Shipping</p>
                  <p className="text-sm">
                    {formatter.format(checkoutState.deliveryFee)}
                  </p>
                </div>
              )}
              <div className="flex justify-between font-medium">
                <p className="text-sm">Total</p>
                <p className="text-sm">{formatter.format(total)}</p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
