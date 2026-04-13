import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/admin-auth";
import { UserStatus } from "@prisma/client";

// Payment methods available in Côte d'Ivoire
const PAYMENT_METHODS = [
  { id: "orange_money", label: "Orange Money", icon: "🟠" },
  { id: "mtn_money", label: "MTN Money", icon: "🟡" },
  { id: "wave", label: "Wave", icon: "🔵" },
  { id: "moov_money", label: "Moov Money", icon: "🟣" },
  { id: "card", label: "Carte bancaire", icon: "💳" },
  { id: "cash", label: "Espèces", icon: "💵" },
];

// GET /api/admin/payment-control - Get all users and providers with payment controls
export async function GET(request: NextRequest) {
  try {
    // Verify admin session
    const admin = await getAdminSession(request);
    if (!admin) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const statusFilter = searchParams.get("status") || "all";
    const type = searchParams.get("type") || "all"; // "clients", "providers", "all"

    // Build where clauses
    const userWhereClause: any = {
      role: "CLIENT",
    };

    const providerWhereClause: any = {};

    if (search) {
      const searchLower = search.toLowerCase();
      userWhereClause.OR = [
        { fullName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search } },
      ];
      providerWhereClause.OR = [
        { businessName: { contains: search, mode: "insensitive" } },
        { user: { fullName: { contains: search, mode: "insensitive" } } },
        { user: { email: { contains: search, mode: "insensitive" } } },
        { user: { phone: { contains: search } } },
      ];
    }

    if (statusFilter !== "all") {
      userWhereClause.status = statusFilter.toUpperCase() as UserStatus;
      providerWhereClause.user = { ...providerWhereClause.user, status: statusFilter.toUpperCase() as UserStatus };
    }

    // Fetch clients with their payment controls
    let clients: any[] = [];
    if (type === "all" || type === "clients") {
      const users = await db.user.findMany({
        where: userWhereClause,
        select: {
          id: true,
          fullName: true,
          email: true,
          phone: true,
          avatarUrl: true,
          status: true,
          createdAt: true,
          payments: {
            select: { amount: true, createdAt: true },
            orderBy: { createdAt: "desc" },
            take: 1,
          },
          _count: { select: { payments: true } },
          paymentControls: true,
        },
        take: 50,
        orderBy: { createdAt: "desc" },
      });

      clients = users.map((user) => {
        const blockedMethods = user.paymentControls
          .filter((c) => !c.isEnabled)
          .map((c) => c.paymentMethod);
        const totalPayments = user.payments.reduce((sum, p) => sum + p.amount, 0);

        return {
          id: user.id,
          name: user.fullName || "Sans nom",
          email: user.email || "-",
          phone: user.phone || "-",
          avatar: user.avatarUrl,
          status: user.status.toLowerCase(),
          totalPayments,
          blockedMethods,
          lastPayment: user.payments[0]?.createdAt || null,
          paymentCount: user._count.payments,
        };
      });
    }

    // Fetch providers with their payment controls
    let providers: any[] = [];
    if (type === "all" || type === "providers") {
      const providerList = await db.provider.findMany({
        where: providerWhereClause,
        select: {
          id: true,
          businessName: true,
          providerTier: true,
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
              phone: true,
              avatarUrl: true,
              status: true,
            },
          },
          reservations: {
            select: { priceTotal: true, createdAt: true },
            orderBy: { createdAt: "desc" },
            take: 1,
          },
          _count: { select: { reservations: true } },
          paymentControls: true,
        },
        take: 50,
        orderBy: { createdAt: "desc" },
      });

      providers = providerList.map((provider) => {
        const blockedMethods = provider.paymentControls
          .filter((c) => !c.isEnabled)
          .map((c) => c.paymentMethod);
        const totalPayouts = provider.reservations.reduce((sum, r) => sum + r.priceTotal, 0);

        return {
          id: provider.id,
          name: provider.user.fullName || provider.businessName || "Sans nom",
          businessName: provider.businessName || provider.user.fullName || "Sans nom",
          email: provider.user.email || "-",
          phone: provider.user.phone || "-",
          avatar: provider.user.avatarUrl,
          status: provider.user.status.toLowerCase(),
          tier: provider.providerTier.toLowerCase(),
          totalPayouts,
          blockedMethods,
          lastPayout: provider.reservations[0]?.createdAt || null,
          reservationCount: provider._count.reservations,
        };
      });
    }

    // Calculate stats
    const stats = {
      totalClients: clients.length,
      totalProviders: providers.length,
      clientsWithRestrictions: clients.filter((c) => c.blockedMethods.length > 0).length,
      providersWithRestrictions: providers.filter((p) => p.blockedMethods.length > 0).length,
      suspendedClients: clients.filter((c) => c.status === "suspended").length,
      suspendedProviders: providers.filter((p) => p.status === "suspended").length,
    };

    return NextResponse.json({
      clients,
      providers,
      paymentMethods: PAYMENT_METHODS,
      stats,
    });
  } catch (error) {
    console.error("Error fetching payment control data:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des données de contrôle de paiement" },
      { status: 500 }
    );
  }
}
