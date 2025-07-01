"use client";

import { useState, useEffect } from "react";
import { Trash2Icon, Info } from "lucide-react";
import { Skill, SkillCategory } from "@/app/dashboard/types";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { TooltipProvider ,Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";


interface SkillSelectorProps {
  initialSkills: Skill[];
}

//lista categori de skill uri
const skillCategories: SkillCategory[] = [
  "Languages",
  "Technology & Programming",
  "Academic Subjects",
  "School Subjects",
  "Business & Finance",
  "Sport & Health",
  "Music & Arts",
  "Others",
];

export default function SkillSelector({ initialSkills }: SkillSelectorProps) {

  const [skills, setSkills] = useState<Skill[]>(initialSkills || []);
  const [pendingCategory, setPendingCategory] = useState<SkillCategory | null>(null);
  const [focusedTooltipIndex, setFocusedTooltipIndex] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setSkills(initialSkills || [])
  }, [initialSkills]);


  const isCategorySelected = (category: SkillCategory) =>
    skills.some((sk) => sk.category === category);

  const confirmDeleteCategory = (category: SkillCategory) => {
    setPendingCategory(category);
  }

  const handleDeleteCategory = async () => {
    if(!pendingCategory) return;

    const skillsToDelete = skills.filter((sk) => sk.category === pendingCategory);

    for(const skill of skillsToDelete) {
      if(skill.id){
         await fetch(`/api/teacher-skills/${skill.id}`, {
            method: "DELETE",
        });
      }
    }

    setSkills((prev) => prev.filter((sk) => sk.category !== pendingCategory));
    setPendingCategory(null);
    toast({ 
      title: "Skills removed", 
      description: `All skills in "${pendingCategory}" were removed.` 
    });
  }

  
  //adaugare/eliminare categorie
  const toggleCategory = (category: SkillCategory) => {
    if (isCategorySelected(category)) {
      confirmDeleteCategory(category);
    } else {
      setSkills((prev) => [
        ...prev,
        { category, skill: "", description: "", level: "beginner", price: 0 },
      ]);
    }
  };

  //adauga skill nou intr o categorie
  const addSkillInput = (category: SkillCategory) => {
    setSkills((prev) => [
      ...prev,
      { category, skill: "", description: "", level: "beginner", price: 0 },
    ]);
  };

 
  const removeSkillInput = (index: number) => {
      setSkills((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDeleteSkill = async (skillId: string | undefined, index: number) => {
    if(!skillId) return removeSkillInput(index);

    try{
      const res = await fetch(`/api/teacher-skills/${skillId}`, {
        method: "DELETE",
      });

      if(!res.ok){
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete skill."
        });
      } else {
        toast({
          title: "Success",
          description: "Skill deleted successfully.",
        });
        removeSkillInput(index);
      }
    }catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong."
      });
    }
  }

  const set = new Set(skills.map((sk) => sk.category)); //pt a elimina categoriile duplicate
  const selectedCategories = Array.from(set); //transforma inapoi in array

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Skills You Want to Teach</h3>
      <p className="text-sm text-gray-400">
        Select the categories you want to teach in:
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {skillCategories.map((category) => (
          <label key={category} className="flex items-center gap-2">
            <input
              type="checkbox"
              value={category}
              checked={isCategorySelected(category)}
              onChange={() => toggleCategory(category)}
            />
            <span className="text-sm">{category}</span>
          </label>
        ))}
      </div>

      {selectedCategories.map((category) => (
        <div
          key={category}
          className="mt-4 p-4 bg-background/40 rounded-lg shadow-md"
        >
          <h4 className="font-medium mb-3">{category}</h4>
          <div className="space-y-4">
            {skills.map((skill, index) => (
              skill.category === category && (
                <div
                  key={skill.id ?? index}
                  className="flex flex-col gap-4 relative rounded-lg border-gray-200 bg-white border-2 shadow-sm p-2"
                >  
                  <input type="hidden" name="skill_id" defaultValue={skill.id} />
                  <input type="hidden" name="category" value={skill.category} /> 

                <div> 
                  <label className="text-sm font-medium">Specific Skill</label>
                  <div className="relative">
                    <input
                      type="text"
                      defaultValue={skill.skill}
                      name="skill"
                      readOnly={!!skill.id}
                      placeholder="e.g. English, Piano, Mathematics"
                      className="mt-1 block w-full rounded-md bg-white shadow-md px-4 py-2 pr-10 text-sm text-foreground placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition"
                      onFocus={() => {
                        if(skill.id) {
                          setFocusedTooltipIndex(index);
                          setTimeout(() => setFocusedTooltipIndex(null), 3000); //tooltip dispare dupa 3 secunde
                        }
                      }}
                    />
                    {skill.id && (
                      <TooltipProvider>
                        <Tooltip open={focusedTooltipIndex === index ? true : undefined}>
                          <TooltipTrigger asChild>
                            <span 
                                className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center cursor-help text-muted-foreground"
                                onMouseOver={() => setFocusedTooltipIndex(null)} //permite hover daca nu este deja selectat campul
                            >
                              <Info size={16} />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            Skill names can’t be edited after saving. Delete and add a new skill instead.
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      )}
                  </div>
                </div>

                  <div>
                    <label className="block text-sm font-medium">
                      Description
                    </label>
                    <textarea
                      defaultValue={skill.description}
                      name="description"
                      placeholder="Tell us what you want to teach and how you plan to guide your students."
                      rows={4}
                      className="mt-1 block w-full rounded-md bg-white shadow-md px-4 py-2 text-sm text-foreground placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium">Level</label>
                    <p className="text-sm text-gray-400">
                      Select your level for this skill
                    </p>
                    <select
                      value={skill.level}
                      name="level"
                      className="mt-1 block w-full rounded-md bg-white shadow-md px-4 py-2 text-sm text-foreground placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition"
                      onChange={(e) => {
                        const updatedLevel = e.target.value;
                        
                        setSkills((prevSkills) => 
                          prevSkills.map((s, i) => 
                            i === index ? { ...s, level: updatedLevel as "beginner" | "intermediate" | "advanced" } : s
                          )
                        )
                      }}
                    >
                      <option value="beginner" className="text-sm">Beginner</option>
                      <option value="intermediate" className="text-sm">Intermediate</option>
                      <option value="advanced" className="text-sm">Advanced</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium">
                      Price
                    </label>
                    <input
                      type="number"
                      defaultValue={skill.price}
                      name="price"
                      min={0}
                      step={1} //fara zecimale
                      placeholder="Price per session (RON)"
                      className="mt-1 block w-full rounded-md bg-white shadow-md px-4 py-2 pr-10 text-sm text-foreground placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition"
                    /> 
                  </div>
                  
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button
                        type="button"
                        className="absolute right-2 top-2 p-1 text-gray-400 hover:text-red-500 transition-colors rounded-full bg-gray-100 hover:bg-red-100 shadow-sm"
                      >
                        <Trash2Icon className="w-4 h-4" />
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action will remove this skill permanently.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteSkill(skill.id, index)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                 
                </div>
              )))}
              <button
                type="button"
                onClick={() => addSkillInput(category)}
                className="text-sm text-blue-400 hover:text-blue-700"
              >
                +Add another skill in this category
              </button>
          </div>
        </div>
      ))}

      {/* dialog global pt stergere unei intregi categorii */}
      <AlertDialog open={!!pendingCategory} onOpenChange={() => setPendingCategory(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete all skills in this category?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove all skills in the "{pendingCategory}" category.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCategory}>Delete All</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

