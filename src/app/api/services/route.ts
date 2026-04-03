import { NextRequest, NextResponse } from "next/server";
import { SERVICE_CATEGORIES } from "@/lib/constants/services";
import { SERVICE_PROVIDER_COUNTS } from "@/lib/constants/mockData";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || "";
    const categories = searchParams.get("categories")?.split(",").filter(Boolean) || [];

    let services = SERVICE_CATEGORIES.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      icon: cat.icon,
      description: cat.description,
      subServiceCount: cat.subServices.length,
      providerCount: SERVICE_PROVIDER_COUNTS[cat.slug] || 0,
    }));

    // Filter by search query
    if (q) {
      const query = q.toLowerCase();
      services = services.filter(
        (s) =>
          s.name.toLowerCase().includes(query) ||
          s.description?.toLowerCase().includes(query)
      );
    }

    // Filter by selected categories
    if (categories.length > 0) {
      services = services.filter((s) => categories.includes(s.slug));
    }

    return NextResponse.json({
      success: true,
      data: services,
      total: services.length,
    });
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch services" },
      { status: 500 }
    );
  }
}
