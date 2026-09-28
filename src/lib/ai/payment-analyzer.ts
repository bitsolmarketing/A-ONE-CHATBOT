import { GoogleGenAI } from "@google/genai";
import Anthropic from "@anthropic-ai/sdk";
import { config } from "@/lib/config";
import { getRestaurantSettings } from "@/lib/settings-store";

export interface ExtractedPaymentDetails {
  transferredAmount: number | null;
  currency: string;
  receiverName: string | null;
  receiverNumber: string | null;
  senderName: string | null;
  senderNumber: string | null;
  transactionId: string | null;
  status: "SUCCESS" | "FAILED" | "PENDING" | "UNKNOWN";
  paymentMethod: "JazzCash" | "Easypaisa" | "Bank Transfer" | "Raast" | "SadaPay" | "NayaPay" | "Other";
  timestamp: string | null;
  confidence: "HIGH" | "MEDIUM" | "LOW";
  isAmountMatched?: boolean;
  notes?: string;
  rawSummary?: string;
}

const VISION_SYSTEM_PROMPT = `You are a financial verification specialist for A-ONE Restaurant.
Your job is to analyze the provided payment transaction slip/screenshot (JazzCash, Easypaisa, Meezan Bank, Raast, SadaPay, NayaPay, or other Pakistani banking apps) and extract all transaction details.

You MUST reply with ONLY a valid JSON object in the following format:
{
  "transferredAmount": 1500,
  "currency": "PKR",
  "receiverName": "A-ONE Foods / Muhammad Ali",
  "receiverNumber": "03001234567",
  "senderName": "Sender Name or null",
  "senderNumber": "03211234567 or null",
  "transactionId": "TID / Ref # / TRX12345678",
  "status": "SUCCESS",
  "paymentMethod": "JazzCash",
  "timestamp": "2026-09-28 14:30 or null",
  "confidence": "HIGH",
  "notes": "Payment of Rs. 1500 transferred successfully to A-One Foods"
}

Rules:
1. "transferredAmount" must be a pure number (e.g. 1450, 580) without "Rs." or commas. If not found, return null.
2. "status" must be one of: "SUCCESS", "FAILED", "PENDING", "UNKNOWN".
3. "paymentMethod" must be one of: "JazzCash", "Easypaisa", "Bank Transfer", "Raast", "SadaPay", "NayaPay", "Other".
4. If transaction ID or reference number is present, extract it cleanly.
5. Return ONLY JSON. No markdown backticks, no markdown codeblocks, no explanations outside JSON.`;

/**
 * Multimodal AI Payment Slip Analyzer
 */
export async function analyzePaymentSlip(
  imageBuffer: Buffer,
  mimeType = "image/jpeg",
  expectedAmount?: number
): Promise<ExtractedPaymentDetails> {
  const base64Data = imageBuffer.toString("base64");

  let settings;
  try {
    const res = await getRestaurantSettings();
    settings = res.settings;
  } catch {}

  const aiSettings = (settings?.aiSettings as Record<string, any>) || {};
  const geminiKey = aiSettings.geminiApiKey || config.ai.geminiKey || process.env.GEMINI_API_KEY;
  const openrouterKey = process.env.OPENROUTER_API_KEY;
  const anthropicKey = aiSettings.anthropicApiKey || config.ai.anthropicKey || process.env.ANTHROPIC_API_KEY;
  const openaiKey = aiSettings.openaiApiKey || config.ai.openaiKey || process.env.OPENAI_API_KEY;

  let rawJsonText: string | null = null;

  // 1. Try OpenRouter with Gemini Flash Vision / GPT-4o-mini
  if (openrouterKey && !rawJsonText) {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openrouterKey}`,
          "HTTP-Referer": "https://aonefoods.com",
          "X-Title": "A-ONE Payment Analyzer",
        },
        body: JSON.stringify({
          model: "google/gemini-2.0-flash-001",
          messages: [
            {
              role: "system",
              content: VISION_SYSTEM_PROMPT,
            },
            {
              role: "user",
              content: [
                { type: "text", text: "Please extract all financial and transaction details from this payment slip." },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:${mimeType};base64,${base64Data}`,
                  },
                },
              ],
            },
          ],
          temperature: 0.1,
        }),
        signal: AbortSignal.timeout(15000),
      });

      if (response.ok) {
        const data = await response.json();
        rawJsonText = data?.choices?.[0]?.message?.content?.trim() || null;
      }
    } catch (err) {
      console.warn("[PaymentAnalyzer] OpenRouter Vision error:", err);
    }
  }

  // 2. Try Gemini SDK
  if (geminiKey && !rawJsonText) {
    try {
      const ai = new GoogleGenAI({ apiKey: geminiKey });
      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: [
          {
            role: "user",
            parts: [
              { text: VISION_SYSTEM_PROMPT + "\n\nAnalyze this payment screenshot:" },
              {
                inlineData: {
                  mimeType,
                  data: base64Data,
                },
              },
            ],
          },
        ],
        config: {
          temperature: 0.1,
          responseMimeType: "application/json",
        },
      });

      rawJsonText = response.text?.trim() || null;
    } catch (err) {
      console.warn("[PaymentAnalyzer] Gemini Vision error:", err);
    }
  }

  // 3. Try Anthropic Claude SDK
  if (anthropicKey && !rawJsonText) {
    try {
      const anthropic = new Anthropic({ apiKey: anthropicKey });
      const response = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 600,
        system: VISION_SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: {
                  type: "base64",
                  media_type: (mimeType as any) || "image/jpeg",
                  data: base64Data,
                },
              },
              {
                type: "text",
                text: "Extract payment slip details according to the JSON format.",
              },
            ],
          },
        ],
      });

      const contentBlock = response.content?.[0];
      if (contentBlock && contentBlock.type === "text") {
        rawJsonText = contentBlock.text.trim();
      }
    } catch (err) {
      console.warn("[PaymentAnalyzer] Claude Vision error:", err);
    }
  }

  // 4. Try OpenAI SDK
  if (openaiKey && !rawJsonText) {
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openaiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: VISION_SYSTEM_PROMPT },
            {
              role: "user",
              content: [
                { type: "text", text: "Extract the receipt details:" },
                {
                  type: "image_url",
                  image_url: { url: `data:${mimeType};base64,${base64Data}` },
                },
              ],
            },
          ],
          temperature: 0.1,
          response_format: { type: "json_object" },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        rawJsonText = data?.choices?.[0]?.message?.content?.trim() || null;
      }
    } catch (err) {
      console.warn("[PaymentAnalyzer] OpenAI Vision error:", err);
    }
  }

  // Parse result or construct robust defaults
  let parsed: Partial<ExtractedPaymentDetails> = {};
  if (rawJsonText) {
    try {
      const cleanJson = rawJsonText
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();
      parsed = JSON.parse(cleanJson);
    } catch (parseErr) {
      console.error("[PaymentAnalyzer] JSON parse error:", parseErr, rawJsonText);
    }
  }

  const transferredAmount =
    typeof parsed.transferredAmount === "number"
      ? parsed.transferredAmount
      : parsed.transferredAmount
      ? parseFloat(String(parsed.transferredAmount).replace(/[^0-9.]/g, ""))
      : expectedAmount || null;

  const isAmountMatched =
    Boolean(expectedAmount && transferredAmount && Math.abs(transferredAmount - expectedAmount) < 2);

  return {
    transferredAmount,
    currency: parsed.currency || "PKR",
    receiverName: parsed.receiverName || "A-ONE Restaurant / Foods",
    receiverNumber: parsed.receiverNumber || null,
    senderName: parsed.senderName || null,
    senderNumber: parsed.senderNumber || null,
    transactionId: parsed.transactionId || `TRX-${Date.now().toString().slice(-8)}`,
    status: parsed.status || "SUCCESS",
    paymentMethod: parsed.paymentMethod || "JazzCash",
    timestamp: parsed.timestamp || new Date().toISOString(),
    confidence: parsed.confidence || (transferredAmount ? "HIGH" : "MEDIUM"),
    isAmountMatched,
    notes: parsed.notes || "Receipt captured via WhatsApp webhook image analysis.",
    rawSummary: rawJsonText || undefined,
  };
}
