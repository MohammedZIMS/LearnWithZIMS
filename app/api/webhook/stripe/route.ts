import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, env.STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    console.error("Webhook verification failed:", error);
    return new Response("Webhook error", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    console.log("Received checkout.session.completed:", session.id);
    console.log("Metadata:", session.metadata);

    const courseId = session.metadata?.courseId;
    const enrollmentId = session.metadata?.enrollmentId;
    const customerId = session.customer as string;

    if (!courseId || !enrollmentId) {
      console.error("Missing metadata in session");
      return new Response("Missing metadata", { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { stripeCustomerId: customerId },
    });

    if (!user) {
      console.error("User not found for customerId:", customerId);
      return new Response("User not found", { status: 404 });
    }

    await prisma.enrollment.update({
      where: { id: enrollmentId },
      data: {
        userId: user.id,
        courseId: courseId,
        amount: session.amount_total ?? 0,
        status: "Active",
      },
    });

    console.log(`Enrollment ${enrollmentId} updated to Active.`);
  }

  return new Response(null, { status: 200 });
}
