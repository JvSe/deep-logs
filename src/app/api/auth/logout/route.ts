import { useAuthenticated } from "@/hooks/auth";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  console.log("logout");
  try {
    const cookieStore = await cookies();

    // Remove authentication cookies
    cookieStore.delete("token");
    useAuthenticated.getState().disconnect();

    return NextResponse.redirect(new URL("/", request.url), { status: 302 });
  } catch (error) {
    console.error("Erro durante logout:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Erro interno do servidor",
      },
      { status: 500 }
    );
  }
}
