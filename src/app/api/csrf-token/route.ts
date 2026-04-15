import { NextRequest } from "next/server";
import { getCsrfTokenHandler } from "@/lib/csrf";

export async function GET(request: NextRequest) {
  return getCsrfTokenHandler(request);
}
