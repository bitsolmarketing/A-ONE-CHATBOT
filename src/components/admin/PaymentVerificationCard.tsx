"use client";

import { useState } from "react";
import {
  CreditCard,
  CheckCircle2,
  XCircle,
  Sparkles,
  Phone,
  AlertCircle,
  Eye,
  Check,
  X,
  ExternalLink,
  ShieldCheck,
  Loader2,
  DollarSign,
  Receipt,
  Maximize2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export interface PaymentVerificationOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  total: number;
  subtotal?: number;
  deliveryFee?: number;
  deliveryAddress?: string | null;
  paymentMethod?: string | null;
  paymentReference?: string | null;
  paymentScreenshot?: string | null;
  paymentNotes?: string | null;
  createdAt: string;
  items?: Array<{
    itemName: string;
    quantity: number;
    unitPrice: number;
  }>;
}

interface Props {
  order: PaymentVerificationOrder;
  onApproveSuccess?: (orderId: string) => void;
  onRejectSuccess?: (orderId: string) => void;
}

export function PaymentVerificationCard({
  order,
  onApproveSuccess,
  onRejectSuccess,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [showZoomModal, setShowZoomModal] = useState(false);
  const [decisionFeedback, setDecisionFeedback] = useState<string | null>(null);

  // Parse AI extraction notes from JSON
  let aiData: any = null;
  if (order.paymentNotes) {
    try {
      aiData = JSON.parse(order.paymentNotes);
    } catch {
      // Plain text notes
    }
  }

  const detectedAmount = aiData?.transferredAmount;
  const isAmountMatch =
    detectedAmount && Math.abs(detectedAmount - (order.total || 0)) < 2;

  async function handleDecision(action: "APPROVE" | "REJECT", reason?: string) {
    if (loading) return;
    setLoading(true);
    setDecisionFeedback(null);

    try {
      const res = await fetch(`/api/orders/${order.id}/verify-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          notes: action === "APPROVE" ? "Approved by Owner in Admin Portal" : undefined,
          reason: reason || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Failed to process payment decision.");
      }

      setDecisionFeedback(
        action === "APPROVE"
          ? "✅ Payment approved! Customer notified & order dispatched to kitchen."
          : "❌ Payment rejected! Customer notified to re-upload receipt."
      );

      if (action === "APPROVE") {
        onApproveSuccess?.(order.id);
      } else {
        setShowRejectModal(false);
        onRejectSuccess?.(order.id);
      }
    } catch (err: any) {
      alert("Verification Error: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Card className="bg-gradient-to-br from-neutral-900 via-neutral-900/90 to-neutral-950 border-amber-500/40 shadow-xl shadow-amber-500/5 relative overflow-hidden">
        {/* Glowing Ambient Indicator */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <CardHeader className="pb-3 border-b border-neutral-800/80">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-bold">
                <CreditCard className="size-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-white text-sm">
                    #{order.orderNumber}
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    Awaiting Approval
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400">
                  {new Date(order.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}{" "}
                  · {order.paymentMethod || "Online Transfer"}
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-xs text-neutral-400 font-medium">Grand Total</p>
              <p className="text-base font-black text-amber-400 font-mono">
                Rs. {order.total?.toLocaleString()}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-4 space-y-4 text-xs">
          {decisionFeedback && (
            <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="size-4 shrink-0 text-emerald-400" />
              <span>{decisionFeedback}</span>
            </div>
          )}

          {/* 2-Column Grid: Slip Preview + AI Extraction & Order Summary */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
            {/* Left: Uploaded Slip Image */}
            <div className="md:col-span-5 flex flex-col gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 flex items-center justify-between">
                <span>Customer Receipt / Slip</span>
                {order.paymentScreenshot && (
                  <button
                    type="button"
                    onClick={() => setShowZoomModal(true)}
                    className="text-[10px] text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold"
                  >
                    <Maximize2 className="size-3" /> Zoom
                  </button>
                )}
              </span>

              {order.paymentScreenshot ? (
                <div
                  onClick={() => setShowZoomModal(true)}
                  className="relative group cursor-pointer aspect-[3/4] max-h-56 w-full rounded-xl bg-neutral-950 border border-neutral-800 overflow-hidden flex items-center justify-center"
                >
                  <img
                    src={order.paymentScreenshot}
                    alt="Payment Slip"
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white font-bold text-xs">
                    <Maximize2 className="size-4" /> View Full Slip
                  </div>
                </div>
              ) : (
                <div className="aspect-[3/4] max-h-44 w-full rounded-xl bg-neutral-950/80 border border-dashed border-neutral-800 flex flex-col items-center justify-center text-neutral-500 p-4 text-center">
                  <Receipt className="size-8 text-neutral-600 mb-2" />
                  <p className="text-xs">No screenshot image attached.</p>
                  <p className="text-[10px] text-neutral-600">Manual TID verification required.</p>
                </div>
              )}

              {order.paymentReference && (
                <div className="p-2 rounded-lg bg-neutral-950 border border-neutral-800 text-[11px] font-mono text-amber-300 flex items-center justify-between">
                  <span className="text-neutral-500">TID / Ref:</span>
                  <span className="font-bold">{order.paymentReference}</span>
                </div>
              )}
            </div>

            {/* Right: AI Vision Insights & Order Details */}
            <div className="md:col-span-7 space-y-3">
              {/* AI Multimodal Analysis Box */}
              <div className="p-3.5 rounded-xl bg-neutral-950 border border-amber-500/30 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wide">
                    <Sparkles className="size-3.5 text-amber-400" />
                    AI Slip Vision Extraction
                  </span>
                  {aiData?.confidence && (
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300 border border-neutral-700">
                      {aiData.confidence} CONFIDENCE
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 rounded-lg bg-neutral-900/90 border border-neutral-800">
                    <p className="text-neutral-500 text-[10px]">Detected Amount</p>
                    <p
                      className={`font-mono font-bold text-sm ${
                        isAmountMatch
                          ? "text-emerald-400"
                          : detectedAmount
                          ? "text-rose-400"
                          : "text-amber-400"
                      }`}
                    >
                      {detectedAmount ? `Rs. ${detectedAmount.toLocaleString()}` : "Not Detected"}
                    </p>
                    {isAmountMatch ? (
                      <span className="text-[9px] text-emerald-400 font-bold flex items-center gap-1 mt-0.5">
                        <Check className="size-2.5" /> Matches Bill (Rs. {order.total})
                      </span>
                    ) : detectedAmount ? (
                      <span className="text-[9px] text-rose-400 font-bold flex items-center gap-1 mt-0.5">
                        <AlertCircle className="size-2.5" /> Expected Rs. {order.total}
                      </span>
                    ) : null}
                  </div>

                  <div className="p-2 rounded-lg bg-neutral-900/90 border border-neutral-800">
                    <p className="text-neutral-500 text-[10px]">Slip Status</p>
                    <p className="font-bold text-xs text-white">
                      {aiData?.status || "SUCCESS"}
                    </p>
                    <p className="text-[9px] text-neutral-400 truncate mt-0.5">
                      {aiData?.paymentMethod || order.paymentMethod || "Online"}
                    </p>
                  </div>
                </div>

                {aiData?.receiverName && (
                  <div className="text-[11px] text-neutral-300 flex items-center justify-between border-t border-neutral-900 pt-1.5">
                    <span className="text-neutral-500">Receiver Match:</span>
                    <span className="font-semibold text-emerald-400 flex items-center gap-1">
                      <ShieldCheck className="size-3" /> {aiData.receiverName}
                    </span>
                  </div>
                )}

                {aiData?.notes && (
                  <p className="text-[10px] text-neutral-400 italic bg-neutral-900/60 p-1.5 rounded">
                    "{aiData.notes}"
                  </p>
                )}
              </div>

              {/* Customer & Items Brief */}
              <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800 text-[11px] space-y-1.5">
                <div className="flex justify-between items-center text-neutral-300">
                  <span className="font-semibold text-white">{order.customerName}</span>
                  <span className="font-mono text-amber-400 flex items-center gap-1">
                    <Phone className="size-3" /> {order.customerPhone}
                  </span>
                </div>

                {order.items && order.items.length > 0 && (
                  <div className="border-t border-neutral-800/80 pt-1.5 space-y-1">
                    {order.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between text-neutral-400 text-[10px]">
                        <span>
                          <strong className="text-white">{it.quantity}x</strong> {it.itemName}
                        </span>
                        <span>Rs. {(it.unitPrice * it.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Approval Buttons */}
          <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-end gap-2.5">
            <Button
              type="button"
              variant="destructive"
              disabled={loading}
              onClick={() => setShowRejectModal(true)}
              className="bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-600/40 text-xs font-bold h-9 px-4"
            >
              <XCircle className="size-4 mr-1.5" />
              Reject Payment
            </Button>

            <Button
              type="button"
              disabled={loading}
              onClick={() => handleDecision("APPROVE")}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs h-9 px-5 shadow-lg shadow-emerald-600/20 uppercase tracking-wider"
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-1.5" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle2 className="size-4 mr-1.5" />
                  Approve Payment (Yes)
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Full Slip Image Zoom Modal */}
      {showZoomModal && order.paymentScreenshot && (
        <div
          onClick={() => setShowZoomModal(false)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-3xl max-h-[90vh] bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl p-2 flex flex-col"
          >
            <div className="flex items-center justify-between p-2 border-b border-neutral-800 text-xs text-neutral-300">
              <span className="font-mono font-bold text-amber-400">
                Receipt for Order #{order.orderNumber} (Rs. {order.total})
              </span>
              <button
                type="button"
                onClick={() => setShowZoomModal(false)}
                className="p-1 text-neutral-400 hover:text-white rounded-lg"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="flex-1 overflow-auto flex items-center justify-center p-2">
              <img
                src={order.paymentScreenshot}
                alt="Payment Slip Zoomed"
                className="max-h-[75vh] w-auto object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}

      {/* Rejection Reason Prompt Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-neutral-900 border-neutral-800 text-neutral-100 shadow-2xl">
            <CardHeader className="flex flex-row items-start justify-between border-b border-neutral-800 pb-3">
              <div>
                <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                  <XCircle className="size-4 text-rose-500" />
                  Reject Payment for #{order.orderNumber}
                </CardTitle>
                <CardDescription className="text-xs text-neutral-400">
                  Customer will receive a WhatsApp notice to submit a valid payment receipt.
                </CardDescription>
              </div>
              <button
                type="button"
                onClick={() => setShowRejectModal(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white"
              >
                <X className="size-5" />
              </button>
            </CardHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleDecision("REJECT", rejectReason || "Slip could not be verified");
              }}
            >
              <CardContent className="space-y-4 pt-4 text-xs">
                <div>
                  <label className="block font-semibold mb-1 text-neutral-300">
                    Reason for Rejection
                  </label>
                  <input
                    type="text"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="e.g. Incomplete transaction slip / Amount mismatch / Invalid TID"
                    required
                    className="w-full h-9 rounded-lg bg-neutral-950 border border-neutral-800 px-3 text-xs text-neutral-100 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div className="flex gap-2 justify-end pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowRejectModal(false)}
                    className="border-neutral-800 bg-neutral-950 text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs"
                  >
                    {loading ? "Rejecting..." : "Confirm & Send WhatsApp Notice"}
                  </Button>
                </div>
              </CardContent>
            </form>
          </Card>
        </div>
      )}
    </>
  );
}
