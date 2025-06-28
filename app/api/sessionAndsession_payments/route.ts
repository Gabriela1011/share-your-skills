import { createClient } from "@/utils/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const supabase = await createClient()

  const body = await req.json()

  const {
    slotId,
    studentId,
    teacherSkillId,
    voucherId,
    voucherType,
    sessionPrice,
    finalPrice,
  } = body

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const { data: studentProfile } = await supabase
      .from("student_profiles")
      .select("id")
      .eq("user_id", user?.id)
      .single()

    const studentId = studentProfile?.id

    //se obtine teacher_id din teacher_skills
    const { data: teacherSkill } = await supabase
      .from("teacher_skills")
      .select("teacher_id")
      .eq("id", teacherSkillId)
      .single()

    const teacherId = teacherSkill?.teacher_id

    //se creeaza sesiunea
    const { data: session, error: sessionError } = await supabase
      .from("sessions")
      .insert({
        teacher_id: teacherId,
        student_id: studentId,
        teacher_skill_id: teacherSkillId,
        voucher_id: voucherId,
        slot_id: slotId,
        status: "scheduled",
      })
      .select()
      .single()

    if (sessionError) throw sessionError.message

    //obtin abonamentul din profilul profesorului
    const { data: teacherProfile, error: profileError } = await supabase
      .from("teacher_profiles")
      .select("id, subscription_id")
      .eq("id", teacherId)
      .single()

    if (profileError) throw profileError.message

    //obtin comisionul aferent abonamentului profesorului
    const { data: subscription, error: subscriptionError } = await supabase
      .from("subscriptions")
      .select("commission")
      .eq("id", teacherProfile.subscription_id)
      .single()

    if (subscriptionError) throw subscriptionError.message

    const commission = subscription.commission

    //se calculeaza sumele corespunzatoare fiecarui utilizator
    const teacherEarning = Math.floor(sessionPrice * (1 - commission / 100))
    const studentPayment = finalPrice // poate fi pret cu voucher aplicat (daca s a aplicat vreun voucher)
    const studentDiscount = voucherType
    const platformIncome = studentPayment - teacherEarning

    //se creeaza plata, trb politica
    const { error: paymentError } = await supabase
      .from("session_payments")
      .insert({
        session_id: session.id,
        session_price: sessionPrice,
        student_payment: studentPayment,
        student_discount: studentDiscount,
        commission,
        teacher_earning: teacherEarning,
        platform_income: platformIncome,
        payment_status: "pending",
      })

    if (paymentError) throw paymentError.message

    //daca a fost aplicat un voucher, se sterge voucher ul din baza de date
    if (voucherId && session) {
      const { error: deleteError } = await supabase
        .from("vouchers")
        .delete()
        .eq("id", voucherId)

      if (deleteError) throw deleteError
    }

    //marcheaza slotul ca rezervat
    // const { data: updatedSlot, error: updateSlotError } = await supabase
    //     .from("available_slots")
    //     .update({ is_booked: true })
    //     .eq("id", slotId)
    //     .select()
    //     .throwOnError();

    //     console.log("updated data is book", updatedSlot?.is_booked)

    //if (updateSlotError) throw updateSlotError.message;

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Payment error:", error)
    return NextResponse.json(
      { error: "Failed to process payment" },
      { status: 500 }
    )
  }
}

export async function PATCH(req: NextRequest) {
  const supabase = await createClient()
  const body = await req.json()
  const { slotId } = body

  try {
    const { error } = await supabase
      .from("available_slots")
      .update({ is_booked: true })
      .eq("id", slotId)
      .throwOnError()

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("PATCH error (mark slot):", err)
    return NextResponse.json(
      { error: "Failed to mark slot as booked" },
      { status: 500 }
    )
  }
}
