import { useStoreContext } from "@/contexts/StoreContext";
import { Product } from "../../../athena-webapp";
import { Link } from "@tanstack/react-router";

function ProductCard({
  product,
  currencyFormatter,
}: {
  product: Product;
  currencyFormatter: Intl.NumberFormat;
}) {
  return (
    <div className="flex flex-col mb-24">
      <div className="mb-2">
        <img
          alt={`${product.name} image`}
          className="aspect-square object-cover"
          src={product.skus[0].images[0]}
        />
      </div>
      <div className="flex flex-col items-start gap-4">
        <p className="font-medium">{product.name}</p>
        <p className="text-gray-500">
          {currencyFormatter.format(product.skus[0].price)}
        </p>
      </div>
    </div>
  );
}

export default function ProductsPage({ products }: { products: Product[] }) {
  const { formatter } = useStoreContext();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 px-8">
      {products?.map((product, index) => (
        <Link
          to="/shop/product/$productSlug"
          key={index}
          params={(params) => ({
            ...params,
            productSlug: product._id,
          })}
          search={{ variant: product.skus[0].sku }}
          className="block"
        >
          <ProductCard
            key={product.id}
            product={product}
            currencyFormatter={formatter}
          />
        </Link>
      ))}
    </div>
  );
}
