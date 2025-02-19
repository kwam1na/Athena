import { Button } from "@/components/ui/button";
import { useStoreContext } from "@/contexts/StoreContext";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import placeholder from "@/assets/placeholder.png";
import { EmptyState } from "@/components/states/empty/empty-state";
import { motion } from "framer-motion";
import { capitalizeFirstLetter, slugToWords } from "@/lib/utils";
import { getDiscountValue, getOrderAmount } from "@/components/checkout/utils";
import ImageWithFallback from "@/components/ui/image-with-fallback";
import { onlineOrderQueries } from "@/lib/queries/onlineOrder";

export const Route = createFileRoute("/_layout/_ordersLayout/shop/orders/")({
  component: () => <Purchases />,
});

const OrderItem = ({
  order,
  formatter,
}: {
  order: any;
  formatter: Intl.NumberFormat;
}) => {
  const subtotal = order.amount / 100 - (order?.deliveryFee || 0);

  const amount = getOrderAmount({
    discount: order?.discount,
    deliveryFee: order?.deliveryFee,
    subtotal: order.amount / 100,
  });

  const isOrderOpen = order.status == "open";

  return (
    <div className="space-y-8 text-sm">
      <div className="space-y-4">
        {isOrderOpen ? (
          <strong>Processing</strong>
        ) : (
          <strong>{capitalizeFirstLetter(slugToWords(order.status))}</strong>
        )}
        <p>{new Date(order._creationTime).toDateString()}</p>
      </div>

      <div className="flex items-center gap-4">
        <p>{formatter.format(amount)}</p>
        <Link to="/shop/orders/$orderId" params={{ orderId: order._id }}>
          <Button variant={"link"}>View</Button>
        </Link>
      </div>

      <div className="hidden md:flex gap-4">
        {order?.items.slice(0, 3).map((item: any, idx: number) => (
          <div key={idx} className="h-32 w-32">
            <ImageWithFallback
              src={item.productImage || placeholder}
              alt={"product image"}
              className="aspect-square object-cover rounded-sm"
            />
          </div>
        ))}
        {order?.items.length > 3 && (
          <div className="h-32 w-32 bg-accent2/40 rounded-sm flex items-center justify-center">
            <span className="text-gray-600">+{order.items.length - 3}</span>
          </div>
        )}
      </div>

      <div className="block md:hidden grid grid-cols-3 gap-4">
        {order?.items.slice(0, 2).map((item: any, idx: number) => (
          <div key={idx} className="h-32 w-32">
            <ImageWithFallback
              src={item.productImage || placeholder}
              alt={"product image"}
              className="aspect-square object-cover rounded-sm"
            />
          </div>
        ))}
        {order?.items.length > 2 && (
          <div className="h-32 w-32 bg-accent2/40 rounded-sm flex items-center justify-center">
            <span className="text-gray-600">+{order.items.length - 2}</span>
          </div>
        )}
      </div>
    </div>
  );
};

const Orders = () => {
  const { formatter } = useStoreContext();

  const { data, isLoading } = useQuery(onlineOrderQueries.list());

  if (isLoading) return <div className="h-screen"></div>;

  if (data?.length === 0) {
    return <EmptyState message="You haven't placed any orders." />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: { ease: "easeOut", duration: 0.2 },
      }}
      className="space-y-24 lg:space-y-32"
    >
      {data?.map((order: any) => (
        <OrderItem key={order._id} order={order} formatter={formatter} />
      ))}
    </motion.div>
  );
};

const Purchases = () => {
  const { data, isLoading } = useQuery(onlineOrderQueries.list());

  if (isLoading) return <div className="h-screen"></div>;

  return (
    <div className="pb-56 space-y-8 lg:space-y-24 py-8">
      {data?.length != 0 && <h1 className="text-lg">Orders</h1>}

      <Orders />
    </div>
  );
};
