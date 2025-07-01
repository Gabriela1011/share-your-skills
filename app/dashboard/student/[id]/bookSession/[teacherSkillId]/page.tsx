import getSessionPrice from "./getSessionPrice"
import SelectSlot from "./SelectSlot"

export interface BookSessionProps {
  params: Promise<{
    id: string //studentId
    teacherSkillId: string
  }>
}

export default async function BookSession({ params }: BookSessionProps) {
  const { teacherSkillId, id } = await params
  const price = await getSessionPrice(teacherSkillId)

  return (
    <div>
      <h1>Book a Session</h1>
      <SelectSlot
        teacherSkillId={teacherSkillId} 
        studentId={id}
        price={price}
      />
    </div>
  )
}
