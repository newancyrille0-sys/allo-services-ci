import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { KycStatus } from "@prisma/client";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { action, reason } = body;

    if (!action || !["approve", "reject"].includes(action)) {
      return NextResponse.json(
        { error: "Action invalide" },
        { status: 400 }
      );
    }

    const newKycStatus = action === "approve" ? KycStatus.VERIFIED : KycStatus.REJECTED;

    // Update provider KYC status
    const provider = await db.provider.update({
      where: { id },
      data: {
        kycStatus: newKycStatus,
        isVerified: action === "approve",
        badgeVerified: action === "approve",
      },
    });

    // If approved, also activate the provider
    if (action === "approve") {
      await db.provider.update({
        where: { id },
        data: { isActive: true },
      });
    }

    // Log the action
    console.log(`[ADMIN] Provider ${id} KYC ${action}d. Reason: ${reason || "N/A"}`);

    return NextResponse.json({
      success: true,
      provider: {
        id: provider.id,
        kycStatus: provider.kycStatus,
        isVerified: provider.isVerified,
      },
    });
  } catch (error) {
    console.error("Error updating KYC status:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du KYC" },
      { status: 500 }
    );
  }
}
