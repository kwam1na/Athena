import { useQuery } from "@tanstack/react-query";
import {
  INITIAL_LOAD_KEY,
  INITIAL_LOAD_TIME_KEY,
  SESSION_STORAGE_KEY,
} from "@/lib/constants";
import Footer from "./footer/Footer";
import { Link } from "@tanstack/react-router";
import { Button } from "./ui/button";
import { useStoreContext } from "@/contexts/StoreContext";
import { ProductCard, ProductSkuCard } from "./ProductCard";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { Product, ProductSku } from "@athena/webapp";
import ImageWithFallback from "./ui/image-with-fallback";
import { useNavigationBarContext } from "@/contexts/NavigationBarProvider";
import { HomeHero } from "./home/HomeHero";
import { productQueries } from "@/lib/queries/product";

function FeaturedProduct({ product }: { product: any }) {
  const { formatter } = useStoreContext();

  // find the lowest price sku for the product (product.skus)
  const lowestPriceSku = product.skus.reduce(
    (lowest: any, current: any) =>
      current.price < lowest.price ? current : lowest,
    product.skus[0]
  );

  const hasMultipleSkus = product.skus.length > 1;

  const priceLabel = hasMultipleSkus
    ? `Starting at ${formatter.format(lowestPriceSku.price)}`
    : formatter.format(lowestPriceSku.price);

  return (
    <div className="w-full flex flex-col xl:flex-row items-center justify-center gap-8 xl:gap-16">
      <div className="space-y-4 order-2 xl:order-1">
        <div className="text-sm flex flex-col items-start gap-4">
          <p className="font-medium">{product.name}</p>
          <p className="text-sm text-muted-foreground">{priceLabel}</p>
          {product.skus && product.skus.length > 1 && (
            <p className="text-sm text-muted-foreground">
              Available in multiple lengths
            </p>
          )}
        </div>

        <div>
          <Link
            to="/shop/product/$productSlug"
            params={(params) => ({ ...params, productSlug: product._id })}
            search={{ variant: product.skus?.[0].sku }}
          >
            <Button className="p-0" variant={"link"}>
              <p className="text-xs underline">Shop</p>
            </Button>
          </Link>
        </div>
      </div>

      <Link
        to="/shop/product/$productSlug"
        params={(params) => ({ ...params, productSlug: product._id })}
        search={{ variant: product.skus?.[0].sku }}
      >
        <ImageWithFallback
          alt={`${product.name} image`}
          className="aspect-square object-cover w-96 h-96 rounded"
          src={product.skus[0].images[0]}
        />
      </Link>
    </div>
  );
}

function ProductGrid({
  products,
  formatter,
}: {
  products: Product[];
  formatter: any;
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-24 xl:gap-4">
      {products?.slice(0, 4).map((product: Product) => (
        <Link
          to="/shop/product/$productSlug"
          key={product?._id}
          className="h-64 w-48 md:h-80 md:w-80 xl:h-96 xl:w-96 flex-shrink-0"
          params={(params) => ({
            ...params,
            productSlug: product?._id,
          })}
          search={{ variant: product?.skus?.[0].sku }}
        >
          <ProductCard product={product} currencyFormatter={formatter} />
        </Link>
      ))}
    </div>
  );
}

function ProductSkuGrid({
  products,
  formatter,
}: {
  products: ProductSku[];
  formatter: any;
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-24 xl:gap-4">
      {products?.slice(0, 4).map((product: ProductSku) => (
        <Link
          to="/shop/product/$productSlug"
          key={product?._id}
          className="h-64 w-48 md:h-80 md:w-80 xl:h-96 xl:w-96 flex-shrink-0"
          params={(params) => ({
            ...params,
            productSlug: product?.productId,
          })}
          search={{ variant: product?.sku }}
        >
          <ProductSkuCard sku={product} currencyFormatter={formatter} />
        </Link>
      ))}
    </div>
  );
}

function FeaturedSection({ data }: { data: any }) {
  const { formatter } = useStoreContext();

  if (data.subcategory) {
    const { name, products, slug } = data.subcategory;

    if (!products.length) return null;

    return (
      <div className="space-y-8">
        <p className="text-md font-medium">{`Shop ${name}`}</p>

        <div className="space-y-8 lg:space-y-20">
          <ProductGrid products={products} formatter={formatter} />
          <div className="text-sm">
            <Link
              to="/shop/$categorySlug/$subcategorySlug"
              params={{
                categorySlug: "hair",
                subcategorySlug: slug,
              }}
            >
              <Button className="p-0" variant={"link"}>
                Shop all
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (data.category) {
    const { name, products, slug } = data.category;

    if (!products?.length) return null;
    return (
      <div className="space-y-8">
        <p className="text-md font-medium">{`Shop ${name}`}</p>

        <div className="space-y-8 lg:space-y-20">
          <ProductGrid products={products} formatter={formatter} />
          <div className="text-sm"></div>
          <Link to="/shop/$categorySlug" params={{ categorySlug: slug }}>
            <Button className="p-0" variant={"link"}>
              Shop all
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (data.product) {
    return <FeaturedProduct product={data.product} />;
  }

  return null;
}

export default function HomePage() {
  const { setNavBarLayout, setAppLocation } = useNavigationBarContext();

  const { data: bestSellers, isLoading: isLoadingBestSellers } = useQuery(
    productQueries.bestSellers()
  );

  const { data: featured, isLoading: isLoadingFeatured } = useQuery(
    productQueries.featured()
  );

  const { data: products, isLoading: isLoadingProducts } = useQuery(
    productQueries.list()
  );

  useEffect(() => {
    setNavBarLayout("sticky");
    setAppLocation("home");
  }, []);

  useEffect(() => {
    const savedState = sessionStorage.getItem(INITIAL_LOAD_KEY);
    const lastLoadTime = sessionStorage.getItem(INITIAL_LOAD_TIME_KEY);

    if (!savedState || !lastLoadTime) {
      sessionStorage.setItem(INITIAL_LOAD_KEY, "true");
      sessionStorage.setItem(
        SESSION_STORAGE_KEY,
        new Date().getTime().toString()
      );
    }
  }, []);

  const { formatter } = useStoreContext();

  const bestSellersSorted = bestSellers?.sort(
    (a: any, b: any) => a.rank - b.rank
  );

  const bestSellersProducts = bestSellersSorted?.map((bestSeller: any) => {
    return bestSeller.productSku;
  });

  const featuredSectionSorted = featured?.sort(
    (a: any, b: any) => a.rank - b.rank
  );

  const isLoading =
    isLoadingBestSellers || isLoadingFeatured || isLoadingProducts;

  if (isLoading) return <div className="h-screen" />;

  if (products && products.length == 0) {
    return (
      <div className="container mx-auto px-4 lg:px-0 overflow-hidden">
        <div className="flex items-center justify-center h-screen">
          <div className="space-y-2">
            <p className="text-xl text-center font-medium">
              We're updating our store...
            </p>
            <p className="text-muted-foreground tex-sm text-center">
              We're working on bringing you amazing products. Check back soon!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden">
        <div className="space-y-32 pb-32">
          <div className="relative">
            <HomeHero />
          </div>

          <div className="container mx-auto space-y-32 pb-8 px-4 lg:px-0">
            {Boolean(bestSellersSorted?.length) && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-8"
              >
                <p className="text-md font-medium">Shop best sellers</p>

                <div className="space-y-8 lg:space-y-20">
                  <ProductSkuGrid
                    products={bestSellersProducts || []}
                    formatter={formatter}
                  />

                  <div className="text-sm">
                    <Link
                      to="/shop/$categorySlug"
                      params={{
                        categorySlug: "best-sellers",
                      }}
                    >
                      <Button className="p-0" variant={"link"}>
                        Shop all
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}

            {Boolean(featuredSectionSorted?.length) && (
              <div className="space-y-32">
                {featuredSectionSorted?.map((data: any) => (
                  <motion.div
                    key={data._id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <FeaturedSection data={data} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
