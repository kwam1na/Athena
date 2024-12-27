import { Hono } from "hono";
import { HonoWithConvex } from "convex-helpers/server/hono";
import { ActionCtx } from "../../../../_generated/server";
import { api, internal } from "../../../../_generated/api";
import { Id } from "../../../../_generated/dataModel";

const paystackRoutes: HonoWithConvex<ActionCtx> = new Hono();

paystackRoutes.post("/", async (c) => {
  const payload = await c.req.json();

  console.log("received payload", payload);

  const { checkout_session_id, order_details } = payload?.data?.metadata || {};

  if (payload?.event == "charge.success" && checkout_session_id) {
    console.log(`charge successful for session: ${checkout_session_id}`);

    // throw new Error("ahhh");

    await c.env.runMutation(
      internal.storeFront.checkoutSession.updateCheckoutSession,
      {
        id: checkout_session_id as Id<"checkoutSession">,
        hasCompletedPayment: true,
        amount: payload.data.amount,
        externalTransactionId: payload.data.id.toString(),
        paymentMethod: {
          last4: payload?.data?.authorization?.last4,
          brand: payload?.data?.authorization?.brand,
          bank: payload?.data?.authorization?.bank,
          channel: payload?.data?.authorization?.channel,
        },
        orderDetails: {
          ...order_details,
          deliveryFee: order_details.deliveryFee
            ? parseFloat(order_details.deliveryFee)
            : null,
        },
      }
    );
  }

  if (payload?.event == "refund.processed") {
    await c.env.runMutation(api.storeFront.onlineOrder.update, {
      externalReference: payload?.data?.transaction_reference,
      update: {
        status: "refunded",
        refund_id: payload?.data?.id,
        refund_amount: payload?.data?.amount,
      },
    });
  }

  if (payload?.event == "refund.processing") {
    await c.env.runMutation(api.storeFront.onlineOrder.update, {
      externalReference: payload?.data?.transaction_reference,
      update: { status: "refund-processing" },
    });
  }

  if (payload?.event == "refund.pending") {
    await c.env.runMutation(api.storeFront.onlineOrder.update, {
      externalReference: payload?.data?.transaction_reference,
      update: { status: "refund-pending" },
    });
  }

  if (payload?.event == "refund.failed") {
    await c.env.runMutation(api.storeFront.onlineOrder.update, {
      externalReference: payload?.data?.transaction_reference,
      update: { status: "refund-failed" },
    });
  }

  return c.json({});
});

export { paystackRoutes };
