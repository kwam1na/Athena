import { useStoreContext } from "@/contexts/StoreContext";
import { useShoppingBag } from "@/hooks/useShoppingBag";
import { getProductName } from "@/lib/productUtils";
import { ProductSku } from "@athena/webapp";
import { useCheckout } from "./CheckoutProvider";
import { Link } from "@tanstack/react-router";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import placeholder from "@/assets/placeholder.png";
import { motion } from "framer-motion";
import { Tag } from "lucide-react";
import InputWithEndButton from "../ui/input-with-end-button";
import { useMutation } from "@tanstack/react-query";
import { redeemPromoCode } from "@/api/promoCodes";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { getDiscountValue } from "./utils";

function SummaryItem({
  item,
  formatter,
}: {
  item: any;
  formatter: Intl.NumberFormat;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="h-12 w-12 rounded-lg overflow-hidden">
          <img
            src={item.productImage || placeholder}
            alt={item.productName || "product image"}
            className="aspect-square object-cover rounded-lg"
          />
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium">{getProductName(item)}</p>
          <p className="text-xs text-muted-foreground">
            {formatter.format(item.price * item.quantity)}
          </p>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">{`x ${item.quantity}`}</p>
    </div>
  );
}

export function BagSummaryItems({ items }: { items: ProductSku[] }) {
  const { formatter } = useStoreContext();

  if (!items) return null;

  return (
    <div className="space-y-12 w-full">
      {items?.map((item: ProductSku, index: number) => (
        <SummaryItem formatter={formatter} item={item} key={index} />
      ))}
    </div>
  );
}

function BagSummary() {
  const { formatter } = useStoreContext();
  const { bagSubtotal } = useShoppingBag();
  const { checkoutState, updateState } = useCheckout();
  const { store } = useStoreContext();
  const { userId, guestId } = useAuth();
  const [code, setCode] = useState("");
  const [invalidMessage, setInvalidMessage] = useState("");

  const discountValue = getDiscountValue(bagSubtotal, checkoutState.discount);

  const total = (checkoutState.deliveryFee ?? 0) + bagSubtotal - discountValue;

  const discountText =
    checkoutState.discount?.type === "percentage"
      ? `${checkoutState.discount.value}%`
      : `${formatter.format(discountValue)}`;

  const redeemPromoCodeMutation = useMutation({
    mutationFn: redeemPromoCode,
    onSuccess: (data: any) => {
      if (data.promoCode) {
        updateState({
          discount: {
            id: data.promoCode._id,
            code: data.promoCode.code,
            value: data.promoCode.discountValue,
            type: data.promoCode.discountType,
          },
        });
      } else {
        setInvalidMessage(data.message);
      }
    },
  });

  const handleRedeemPromoCode = () => {
    const storeFrontUserId = userId || guestId;

    setInvalidMessage("");

    if (!storeFrontUserId || !store) return;

    redeemPromoCodeMutation.mutate(code);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && code.trim()) {
      handleRedeemPromoCode();
    }
  };

  return (
    <motion.div className="py-6 bg-background shadow-sm rounded-lg w-[80vw] lg:w-[30vw] space-y-12">
      <div className="flex items-center px-6 w-full">
        <p>Order summary</p>
        <div className="ml-auto">
          <Link to="/shop/bag">
            <Button variant={"clear"}>
              <p>Update bag</p>
            </Button>
          </Link>
        </div>
      </div>

      <div className="px-8">
        <BagSummaryItems items={checkoutState?.bag?.items} />
      </div>

      {/* Promo Code */}
      <div className="px-8 space-y-2">
        <div className="space-y-6">
          <div className="space-y-4">
            <InputWithEndButton
              isLoading={redeemPromoCodeMutation.isPending}
              value={code}
              onInputChange={(value) => setCode(value.toUpperCase())}
              placeholder="Enter promo code"
              buttonText="Apply"
              onButtonClick={handleRedeemPromoCode}
              onKeyDown={handleKeyDown}
            />
            {invalidMessage && (
              <p className="px-2 text-xs text-destructive">{invalidMessage}</p>
            )}
          </div>
          {checkoutState.discount && (
            <div className="flex items-center px-4">
              <Tag className="w-3.5 h-3.5 mr-2" />
              <p className="text-sm font-medium">
                {checkoutState.discount?.code} -{" "}
                <strong>{discountText} off entire order</strong>
              </p>
            </div>
          )}
        </div>
      </div>

      <Separator className="bg-accent5" />

      {/* Summary */}
      <div className="px-8 space-y-8 pt-4 mt-4">
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
        {Boolean(discountValue) && (
          <div className="flex justify-between">
            <p className="text-sm">Discounts</p>
            <p className="text-sm">- {formatter.format(discountValue)}</p>
          </div>
        )}
        <div className="flex justify-between font-medium">
          <p className="text-lg">Total</p>
          <p className="text-lg">{formatter.format(total)}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default BagSummary;
