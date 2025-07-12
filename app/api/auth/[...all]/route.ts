import { auth } from "@/lib/auth";
import ip from "@arcjet/ip";
import arcjet, {
  type ArcjetDecision,
  type BotOptions,
  type EmailOptions,
  type ProtectSignupOptions,
  type SlidingWindowRateLimitOptions,
  detectBot,
  protectSignup,
  shield,
  slidingWindow,
} from "@arcjet/next";
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest } from "next/server";

// ✅ Initialize Arcjet
import arcjetInstance from "@/lib/arcjet";

// ✅ Arcjet Rules Config
const emailOptions = {
  mode: "LIVE",
  block: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],
} satisfies EmailOptions;

const botOptions = {
  mode: "LIVE",
  allow: [],
} satisfies BotOptions;

const rateLimitOptions = {
  mode: "LIVE",
  interval: "2m",
  max: 5,
} satisfies SlidingWindowRateLimitOptions<[]>;

const signupOptions = {
  email: emailOptions,
  bots: botOptions,
  rateLimit: rateLimitOptions,
} satisfies ProtectSignupOptions<[]>;

// ✅ Protection Logic
async function protect(req: NextRequest): Promise<ArcjetDecision> {
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  const userId = session?.user.id || ip(req) || "127.0.0.1";

  if (req.nextUrl.pathname.startsWith("/api/auth/sign-up")) {
    const body = await req.clone().json();

    if (typeof body.email === "string") {
      return arcjetInstance
        .withRule(protectSignup(signupOptions))
        .protect(req, { email: body.email, footprint: userId });
    } else {
      return arcjetInstance
        .withRule(detectBot(botOptions))
        .withRule(slidingWindow(rateLimitOptions))
        .protect(req, { footprint: userId });
    }
  } else {
    return arcjetInstance
      .withRule(detectBot(botOptions))
      .protect(req, { footprint: userId });
  }
}

// ✅ Hook Auth
const authHandlers = toNextJsHandler(auth.handler);
export const { GET } = authHandlers;

// ✅ Protected POST
export const POST = async (req: NextRequest) => {
  const decision = await protect(req);

  console.log("Arcjet Decision:", decision);

  if (decision.isDenied()) {
    if (decision.reason.isRateLimit()) {
      return new Response(null, { status: 429 });
    }

    if (decision.reason.isEmail()) {
      let message = "Invalid email.";

      if (decision.reason.emailTypes.includes("INVALID")) {
        message = "Email address format is invalid. Is there a typo?";
      } else if (decision.reason.emailTypes.includes("DISPOSABLE")) {
        message = "We do not allow disposable email addresses.";
      } else if (decision.reason.emailTypes.includes("NO_MX_RECORDS")) {
        message = "Your email domain does not have an MX record. Is there a typo?";
      }

      return Response.json({ message }, { status: 400 });
    }

    return new Response(null, { status: 403 });
  }

  return authHandlers.POST(req);
};
