import { useStoreContext } from "@/contexts/StoreContext";
import { Product } from "../../../athena-webapp";
import { Link } from "@tanstack/react-router";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { ProductCard, ProductSkuCard } from "./ProductCard";
import { useGetProductFilters } from "@/hooks/useGetProductFilters";

function ProductCardLoadingSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="w-64 h-64 bg-zinc-100 rounded-md"></Skeleton>
      <div className="space-y-2">
        <Skeleton className="w-[180px] h-[16px] bg-zinc-100 rounded"></Skeleton>
        <Skeleton className="w-[96px] h-[16px] bg-zinc-100 rounded"></Skeleton>
      </div>
    </div>
  );
}

export default function ProductsPage({
  products,
  isLoading,
}: {
  isLoading: boolean;
  products?: Product[];
}) {
  const { formatter } = useStoreContext();

  const { filtersCount } = useGetProductFilters();

  if (products?.length == 0 && filtersCount > 0) {
    return (
      <div className="space-y-8 container mx-auto max-w-[1024px] h-screen">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="space-y-4">
            <div className="w-[80px] h-[24px] bg-zinc-100 rounded" />
          </div>
        </div>

        <div>
          <p className="text-sm font-light">
            No products found with the selected filters
          </p>
        </div>
      </div>
    );
  }

  if (products?.length == 0) {
    return (
      <div className="space-y-8 container mx-auto max-w-[1024px] h-screen">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="space-y-4">
            <div className="w-[80px] h-[24px] bg-zinc-100 rounded" />
          </div>
        </div>

        <div>
          <p className="text-sm font-light">
            We're currently updating this section of our store. Check back soon.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 lg:gap-8">
      {isLoading && (
        <>
          <ProductCardLoadingSkeleton />
          <ProductCardLoadingSkeleton />
          <ProductCardLoadingSkeleton />
          <ProductCardLoadingSkeleton />

          <ProductCardLoadingSkeleton />
          <ProductCardLoadingSkeleton />
          <ProductCardLoadingSkeleton />
          <ProductCardLoadingSkeleton />

          <ProductCardLoadingSkeleton />
          <ProductCardLoadingSkeleton />
          <ProductCardLoadingSkeleton />
          <ProductCardLoadingSkeleton />
        </>
      )}
      {/* {!isLoading &&
        products?.flatMap((product) =>
          product.skus.map((sku: any) => (
            <Link
              to="/shop/product/$productSlug"
              key={`${product._id}-${sku.sku}`}
              params={(params) => ({
                ...params,
                productSlug: product._id,
              })}
              search={{ variant: sku.sku }}
              className="block mb-4"
            >
              <ProductSkuCard
                product={product}
                sku={sku}
                currencyFormatter={formatter}
              />
            </Link>
          ))
        )} */}

      {!isLoading &&
        products?.flatMap((product) => (
          <Link
            to="/shop/product/$productSlug"
            key={`${product._id}}`}
            params={(params) => ({
              ...params,
              productSlug: product._id,
            })}
            search={{ variant: product.skus[0].sku }}
            className="block mb-4"
          >
            <ProductCard product={product} currencyFormatter={formatter} />
          </Link>
        ))}
    </div>
  );
}
