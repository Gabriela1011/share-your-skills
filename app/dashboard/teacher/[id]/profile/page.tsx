import PersonalInfo from "./PersonalInfo";

export default function TeacherProfilePage() {
  return (
    <div className="min-h-screen w-full">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        <h1 className="text-3xl font-bold text-primary-foreground">
          Complete Your Profile
        </h1>
        <p className="text-primary-foreground">
          Welcome to ShareYourSkills! Let's set up your teaching profile.
        </p>
        <div className="space-y-8">
          <PersonalInfo />
        </div>
      </div>
    </div>
  );
}
