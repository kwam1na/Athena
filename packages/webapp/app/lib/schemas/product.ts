import { z } from "zod";

export const productSchema = z.object({
  availability: z.enum(["archived", "draft", "published"]),
  inventoryCount: z.number().min(0),
  categoryId: z.number(),
  currency: z.string(),
  storeId: z.number(),
  organizationId: z.number(),
  subcategoryId: z.number(),
  sku: z.string().min(3).nullable(),
  name: z.string().min(2),
  price: z.number().min(0),
  unitCost: z.number().min(0),
  images: z.array(z.string()),
});

export type ProductType = z.infer<typeof productSchema>;

export type ProductResponseBody = ProductType & {
  id: string;
  createdByUserId: string;
  productSlug: string;
};

export type ProductResponse = {
  product: ProductResponseBody;
  warning: string;
};
