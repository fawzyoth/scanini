import { NextRequest, NextResponse } from "next/server";

const VISION_API_URL = "https://vision.googleapis.com/v1/images:annotate";

interface VisionResponse {
  responses: Array<{
    textAnnotations?: Array<{
      description: string;
      boundingPoly: {
        vertices: Array<{ x: number; y: number }>;
      };
    }>;
    fullTextAnnotation?: {
      text: string;
    };
    error?: { message: string };
  }>;
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.GOOGLE_CLOUD_VISION_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Google Cloud Vision API key not configured" },
      { status: 500 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");

    // Call Google Cloud Vision API
    const visionResponse = await fetch(`${VISION_API_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        requests: [
          {
            image: { content: base64 },
            features: [
              { type: "TEXT_DETECTION", maxResults: 1 },
              { type: "DOCUMENT_TEXT_DETECTION", maxResults: 1 },
            ],
          },
        ],
      }),
    });

    if (!visionResponse.ok) {
      const err = await visionResponse.text();
      return NextResponse.json(
        { error: `Vision API error: ${err}` },
        { status: 502 }
      );
    }

    const data: VisionResponse = await visionResponse.json();
    const response = data.responses[0];

    if (response.error) {
      return NextResponse.json(
        { error: response.error.message },
        { status: 502 }
      );
    }

    const fullText = response.fullTextAnnotation?.text || "";

    if (!fullText.trim()) {
      return NextResponse.json(
        { error: "No text detected in the image. Please try a clearer photo." },
        { status: 422 }
      );
    }

    // Parse the extracted text into structured menu data
    const menu = parseMenuText(fullText);

    return NextResponse.json({ text: fullText, menu });
  } catch (err) {
    console.error("Digitize error:", err);
    return NextResponse.json(
      { error: "Failed to process image" },
      { status: 500 }
    );
  }
}

interface ParsedDish {
  name: string;
  description: string;
  price: number;
}

interface ParsedCategory {
  name: string;
  dishes: ParsedDish[];
}

interface ParsedMenu {
  name: string;
  categories: ParsedCategory[];
}

function parseMenuText(text: string): ParsedMenu {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const categories: ParsedCategory[] = [];
  let currentCategory: ParsedCategory | null = null;
  let pendingDishName: string | null = null;

  // Price patterns: "12.50", "12,50", "12.50EUR", "12€", "$12.50"
  const priceRegex =
    /(?:^|[\s])([€$£]?\s?\d{1,4}[.,]\d{2}\s?[€$£]?(?:\s?EUR)?|\d{1,4}\s?[€$£])/;

  for (const line of lines) {
    const priceMatch = line.match(priceRegex);

    if (priceMatch) {
      // This line contains a price — it's a dish
      const priceStr = priceMatch[0]
        .replace(/[€$£\sEUR]/g, "")
        .replace(",", ".")
        .trim();
      const price = parseFloat(priceStr) || 0;

      // Dish name is the part before the price
      const priceIndex = line.indexOf(priceMatch[0]);
      const dishName = line.substring(0, priceIndex).trim();

      if (!currentCategory) {
        currentCategory = { name: "Menu", dishes: [] };
        categories.push(currentCategory);
      }

      if (pendingDishName && dishName) {
        // The pending name was actually a category or the dish name is on this line
        currentCategory.dishes.push({
          name: dishName || pendingDishName,
          description: dishName ? (pendingDishName || "") : "",
          price,
        });
        pendingDishName = null;
      } else {
        currentCategory.dishes.push({
          name: pendingDishName || dishName || "Unnamed dish",
          description: pendingDishName ? dishName : "",
          price,
        });
        pendingDishName = null;
      }
    } else {
      // No price on this line
      const isUpperOrBold =
        line === line.toUpperCase() && line.length > 1 && !/^\d/.test(line);
      const isShort = line.length <= 40;
      const hasNoPunctuation = !/[.,;:!?]/.test(line.slice(0, -1));

      if (isUpperOrBold && isShort && hasNoPunctuation) {
        // Likely a category header
        if (pendingDishName && currentCategory) {
          // Flush pending dish with no price
          currentCategory.dishes.push({
            name: pendingDishName,
            description: "",
            price: 0,
          });
        }
        pendingDishName = null;
        currentCategory = { name: titleCase(line), dishes: [] };
        categories.push(currentCategory);
      } else if (isShort && hasNoPunctuation && !pendingDishName) {
        // Possibly a dish name (price on next line or no price)
        pendingDishName = line;
      } else if (pendingDishName && currentCategory) {
        // This might be a description for the pending dish
        // Check if next data will give us a price, for now treat as description
        currentCategory.dishes.push({
          name: pendingDishName,
          description: line,
          price: 0,
        });
        pendingDishName = null;
      } else {
        // Possibly a standalone dish name or description
        pendingDishName = line;
      }
    }
  }

  // Flush any remaining pending dish
  if (pendingDishName && currentCategory) {
    currentCategory.dishes.push({
      name: pendingDishName,
      description: "",
      price: 0,
    });
  }

  // If no categories found, create a default one
  if (categories.length === 0) {
    categories.push({ name: "Menu", dishes: [] });
  }

  // Determine menu name from the first category or default
  const menuName =
    categories.length > 0 && categories[0].dishes.length === 0
      ? categories.shift()?.name || "My Menu"
      : "My Menu";

  return {
    name: menuName,
    categories: categories.filter((c) => c.dishes.length > 0),
  };
}

function titleCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
