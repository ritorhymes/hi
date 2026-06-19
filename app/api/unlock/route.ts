import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

function matches(candidate: string, expected: string) {
  const candidateBuffer = Buffer.from(candidate);
  const expectedBuffer = Buffer.from(expected);

  if (candidateBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(candidateBuffer, expectedBuffer);
}

export async function POST(request: Request) {
  const configuredPassword = process.env.PAGE_PASSWORD;
  const configuredMessage = process.env.SECRET_MESSAGE;

  if (!configuredPassword || !configuredMessage) {
    return NextResponse.json(
      { error: "The gate has not been configured yet." },
      { status: 503 },
    );
  }

  try {
    const body = (await request.json()) as { password?: unknown };

    if (typeof body.password !== "string") {
      return NextResponse.json({ error: "Enter a password first." }, { status: 400 });
    }

    if (!matches(body.password, configuredPassword)) {
      return NextResponse.json({ error: "Nope. Try again." }, { status: 401 });
    }

    return NextResponse.json({ message: configuredMessage });
  } catch {
    return NextResponse.json({ error: "That request was not valid." }, { status: 400 });
  }
}
