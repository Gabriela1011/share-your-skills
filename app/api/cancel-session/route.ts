
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

type SessionPaymentUpdate = {
  payment_status: "student_refunded" | "no_refund_cancellation";
  teacher_earning?: number;
  platform_income?: number;
};


export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { sessionId, refund } = await req.json();

  // Determinam noul status pentru sesiune
  const newSessionStatus = refund ? "cancellation_with_refund" : "cancelled";
  const newPaymentStatus: SessionPaymentUpdate["payment_status"] = refund 
        ? "student_refunded" 
        : "no_refund_cancellation";

  // Update in tabela sessions
  const { error: sessionError } = await supabase
    .from("sessions")
    .update({ status: newSessionStatus })
    .eq("id", sessionId);

  if (sessionError) {
    return NextResponse.json({ error: sessionError.message }, { status: 500 });
  }

  //politica update
  //construim obiectul de trimis in session_payments
  const paymentUpdate: SessionPaymentUpdate = {
    payment_status: newPaymentStatus
  };

  //setam veniturile la 0 in caz de refund
  if(refund){
    paymentUpdate.teacher_earning = 0
    paymentUpdate.platform_income = 0
  }

  // Update in tabela session_payments
  const {data: paymentData, error: paymentError } = await supabase
    .from("session_payments")
    .update(paymentUpdate)
    .eq("session_id", sessionId);
    
    console.log("eroare",paymentError);

  if (paymentError) {
    return NextResponse.json({ error: paymentError.message }, { status: 500 });
  }


  return NextResponse.json({ success: true, refundGiven: refund });
}
