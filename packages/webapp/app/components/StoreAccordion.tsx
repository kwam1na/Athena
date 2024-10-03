import { getAllStores } from "@/api/stores";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useGetActiveOrganization } from "@/hooks/useGetOrganizations";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams, useRouter } from "@tanstack/react-router";
import { Store } from "lucide-react";
import { Button } from "./ui/button";

export function StoreAccordion() {
  const { activeOrganization } = useGetActiveOrganization();

  const { data: stores } = useQuery({
    queryKey: ["stores", activeOrganization?.id],
    queryFn: () => getAllStores(activeOrganization!.id),
    enabled: Boolean(activeOrganization),
  });

  const router = useRouter();

  const { storeUrlSlug } = useParams({ strict: false });

  const matchedStore = stores?.find((s) => s.slug == storeUrlSlug);

  if (stores?.length == 0 || !stores || !matchedStore) return null;

  const currentPath = router.state.location.pathname;

  return (
    <Accordion
      type="single"
      collapsible
      className="w-full pl-4 pr-14"
      defaultValue="item-1"
    >
      <AccordionItem value="item-1" className="border-none">
        <AccordionTrigger>
          <div className="flex items-center">
            <Store className="w-4 h-4 text-muted-foreground mr-2" />
            <p className="text-sm text-muted-foreground">
              {matchedStore?.name}
            </p>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <Link
            to={"/$orgUrlSlug/store/$storeUrlSlug/products"}
            activeProps={{
              className: "font-bold",
            }}
            params={(prev) => ({
              orgUrlSlug: prev.orgUrlSlug!,
              storeUrlSlug: prev.storeUrlSlug!,
            })}
          >
            <Button
              className={`${currentPath.includes("Products".toLowerCase()) ? "font-bold bg-zinc-100" : ""}`}
              variant={"ghost"}
            >
              Products
            </Button>
          </Link>
        </AccordionContent>

        <AccordionContent>
          <Link
            to={"/$orgUrlSlug/store/$storeUrlSlug/orders"}
            activeProps={{
              className: "font-bold",
            }}
            params={(prev) => ({
              orgUrlSlug: prev.orgUrlSlug!,
              storeUrlSlug: prev.storeUrlSlug!,
            })}
          >
            <Button
              className={`${currentPath.includes("Orders".toLowerCase()) ? "font-bold bg-zinc-100" : ""}`}
              variant={"ghost"}
            >
              Orders
            </Button>
          </Link>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
