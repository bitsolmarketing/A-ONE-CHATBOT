import { NextRequest } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/session";
import { isManagerOrOwner, logAuditEvent } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sendText } from "@/lib/whatsapp/client";
import { clientIp } from "@/lib/api";
import { resetUserSession } from "@/app/api/webhook/route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const verifySchema = z.object({
  action: z.enum(["APPROVE", "REJECT", "APPROVE_PAYMENT", "REJECT_PAYMENT"]),
  notes: z.string().optional(),
  reason: z.string().optional(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || !isManagerOrOwner(session)) {
    return Response.json(
      { ok: false, error: "Unauthorized. Owner or Manager access required." },
      { status: 403 }
    );
  }

  const { id: orderId } = await params;
  if (!orderId) {
    return Response.json({ ok: false, error: "Missing order ID in route parameter." }, { status: 400 });
  }

  const body = await req.json().catch(() => ({}));
  const parsed = verifySchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { ok: false, error: "Invalid action. Must be 'APPROVE' or 'REJECT'." },
      { status: 400 }
    );
  }

  const { action, notes, reason } = parsed.data;
  const ip = clientIp(req);

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { customer: true, items: true },
    });

    if (!order) {
      return Response.json({ ok: false, error: "Order not found." }, { status: 404 });
    }

    const isApprove = action === "APPROVE" || action === "APPROVE_PAYMENT";
    const grandTotal = order.total || order.subtotal + (order.deliveryFee || 0);

    if (isApprove) {
      // 1. Approve Payment: status -> PREPARING, paymentStatus -> PAID
      const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: "PAID",
          status: "PREPARING",
          paymentVerifiedBy: session.name || session.email,
          paymentVerifiedAt: new Date(),
          paymentNotes: notes || "Payment approved by Owner/Manager",
        },
      });

      // Reset customer's in-flight chatbot session
      if (order.customerPhone) {
        resetUserSession(order.customerPhone);
      }

      // Log Audit Event
      await logAuditEvent({
        actorId: session.sub,
        actorEmail: session.email,
        action: "PAYMENT_VERIFIED",
        target: order.orderNumber,
        details: {
          orderId: order.id,
          orderNumber: order.orderNumber,
          customerPhone: order.customerPhone,
          amount: grandTotal,
          verifiedBy: session.name,
          notes,
        },
        ipAddress: ip,
        userAgent: req.headers.get("user-agent") || undefined,
      });

      // Send WhatsApp confirmation to Customer
      if (order.customerPhone) {
        const approvalMessage =
          `🎉 *Payment Verified!*\n\n` +
          `Aapki Rs. ${grandTotal.toLocaleString()} ki payment tasdeeq ho chuki hai. ` +
          `Aapka order kitchen mein tiyar ho raha hai. Jald rider dispatch kiya jayega. Shukriya!`;

        await sendText(order.customerPhone, approvalMessage).catch((err) =>
          console.error("[verify-payment] WhatsApp send approval error:", err)
        );
      }

      return Response.json({
        ok: true,
        action: "APPROVED",
        message: "Payment successfully approved and order sent to kitchen.",
        order: updatedOrder,
      });
    } else {
      // 2. Reject Payment: paymentStatus -> REJECTED
      const rejectionReason = reason || notes || "Slip could not be verified";
      const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: "REJECTED",
          paymentNotes: `Rejected: ${rejectionReason}`,
        },
      });

      // Log Audit Event
      await logAuditEvent({
        actorId: session.sub,
        actorEmail: session.email,
        action: "PAYMENT_REJECTED",
        target: order.orderNumber,
        details: {
          orderId: order.id,
          orderNumber: order.orderNumber,
          customerPhone: order.customerPhone,
          reason: rejectionReason,
          rejectedBy: session.name,
        },
        ipAddress: ip,
        userAgent: req.headers.get("user-agent") || undefined,
      });

      // Send WhatsApp rejection notice to Customer
      if (order.customerPhone) {
        const rejectionMessage =
          `⚠️ *Payment Not Verified!*\n\n` +
          `Aapki payment verify nahi ho saki. ` +
          `Meharbani farma kar durust receipt dobara upload karein ya Staff Support par rabta karein.`;

        await sendText(order.customerPhone, rejectionMessage).catch((err) =>
          console.error("[verify-payment] WhatsApp send rejection error:", err)
        );
      }

      return Response.json({
        ok: true,
        action: "REJECTED",
        message: "Payment rejected and customer notified.",
        order: updatedOrder,
      });
    }
  } catch (error: any) {
    console.error("[verify-payment] Error:", error);
    return Response.json(
      { ok: false, error: "Failed to process payment verification decision: " + error.message },
      { status: 500 }
    );
  }
}
