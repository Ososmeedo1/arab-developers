"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import ProgressBar from "@/components/ProgressBar";
import OptionButton from "@/components/OptionButton";
import SectionCard from "@/components/SectionCard";

const FOCUS_OPTIONS = [
  { value: "frontend", label: "Frontend" },
  { value: "backend", label: "Backend" },
  { value: "fullstack", label: "Full-stack" },
];

const FE_FRAMEWORKS = [
  { value: "react", label: "React" },
  { value: "angular", label: "Angular" },
  { value: "vue", label: "Vue" },
];

const BE_FRAMEWORKS = [
  { value: "node", label: "Node.js" },
  { value: "dotnet", label: ".NET" },
  { value: "php", label: "PHP" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
];

const AGE_OPTIONS = [
  { value: "under18", label: "Under 18" },
  { value: "18-24", label: "18–24" },
  { value: "25-34", label: "25–34" },
  { value: "35-44", label: "35–44" },
  { value: "45+", label: "45+" },
];

const EDUCATION_OPTIONS = [
  { value: "graduate", label: "Graduate" },
  { value: "student", label: "Student" },
];

const EMPLOYMENT_OPTIONS = [
  { value: "employed", label: "Employed" },
  { value: "freelancer", label: "Freelancer" },
  { value: "unemployed", label: "Un-employed" },
];

function getSteps(focus) {
  const steps = ["focus"];
  if (focus === "fullstack") {
    steps.push("frontendFramework", "backendFramework");
  } else if (focus === "frontend") {
    steps.push("frontendFramework");
  } else if (focus === "backend") {
    steps.push("backendFramework");
  }
  steps.push("ageRange", "education", "employment");
  return steps;
}

function getMaxStep(focus) {
  return getSteps(focus).length;
}

export default function SurveyPage() {
  const router = useRouter();
  const [answers, setAnswers] = useState({
    focus: null,
    frontendFramework: null,
    backendFramework: null,
    ageRange: null,
    education: null,
    employment: null,
  });
  const [currentStep, setCurrentStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [loadingExisting, setLoadingExisting] = useState(true);

  useEffect(() => {
    async function loadExisting() {
      try {
        const res = await fetch("/api/responses/me");
        if (res.ok) {
          const data = await res.json();
          setAnswers({
            focus: data.focus || null,
            frontendFramework: data.frontendFramework || null,
            backendFramework: data.backendFramework || null,
            ageRange: data.ageRange || null,
            education: data.education || null,
            employment: data.employment || null,
          });
          setIsEdit(true);
        }
      } catch {
        // No existing response
      }
      setLoadingExisting(false);
    }
    loadExisting();
  }, []);

  const steps = getSteps(answers.focus);
  const stepField = steps[currentStep];
  const totalSteps = steps.length;
  const displayStep = currentStep + 1;

  const selectAnswer = useCallback(
    async (field, value) => {
      const next = { ...answers, [field]: value };
      setAnswers(next);
      setError(null);

      const nextSteps = getSteps(next.focus);
      if (currentStep < nextSteps.length - 1) {
        setTimeout(() => setCurrentStep((s) => s + 1), 180);
      }
    },
    [answers, currentStep]
  );

  const goBack = () => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
      setError(null);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);

    const method = isEdit ? "PATCH" : "POST";
    const url = isEdit ? "/api/responses/me" : "/api/responses";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answers),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Something went wrong");
        setSubmitting(false);
        return;
      }

      router.push("/results");
    } catch {
      setError("Network error. Please try again.");
      setSubmitting(false);
    }
  };

  if (loadingExisting) {
    return (
      <>
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-muted-foreground text-sm">Loading...</div>
        </main>
      </>
    );
  }

  const canSubmit =
    stepField === "employment" &&
    answers.focus &&
    answers.ageRange &&
    answers.education &&
    answers.employment &&
    (answers.focus === "frontend" ? answers.frontendFramework : true) &&
    (answers.focus === "backend" ? answers.backendFramework : true) &&
    (answers.focus === "fullstack"
      ? answers.frontendFramework && answers.backendFramework
      : true);

  return (
    <>
      <Navbar />
      <main className="flex-1 flex items-start justify-center pt-8 sm:pt-16 px-4 pb-16">
        <div className="w-full max-w-lg">
          <div className="mb-8">
            <ProgressBar current={displayStep} total={totalSteps} />
          </div>

          <SectionCard className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            {stepField === "focus" && (
              <QuestionGroup
                title="What is your primary development focus?"
                options={FOCUS_OPTIONS}
                selected={answers.focus}
                onSelect={(v) => selectAnswer("focus", v)}
              />
            )}

            {stepField === "frontendFramework" && (
              <QuestionGroup
                title="Which frontend framework do you use?"
                options={FE_FRAMEWORKS}
                selected={answers.frontendFramework}
                onSelect={(v) => selectAnswer("frontendFramework", v)}
              />
            )}

            {stepField === "backendFramework" && (
              <QuestionGroup
                title="Which backend framework do you use?"
                options={BE_FRAMEWORKS}
                selected={answers.backendFramework}
                onSelect={(v) => selectAnswer("backendFramework", v)}
              />
            )}

            {stepField === "ageRange" && (
              <QuestionGroup
                title="What is your age range?"
                options={AGE_OPTIONS}
                selected={answers.ageRange}
                onSelect={(v) => selectAnswer("ageRange", v)}
              />
            )}

            {stepField === "education" && (
              <QuestionGroup
                title="What is your education level?"
                options={EDUCATION_OPTIONS}
                selected={answers.education}
                onSelect={(v) => selectAnswer("education", v)}
              />
            )}

            {stepField === "employment" && (
              <QuestionGroup
                title="What is your employment status?"
                options={EMPLOYMENT_OPTIONS}
                selected={answers.employment}
                onSelect={(v) => selectAnswer("employment", v)}
              />
            )}
          </SectionCard>

          {error && (
            <div
              role="alert"
              className="mt-4 rounded-xl border border-destructive/30 bg-destructive/10 px-5 py-3 text-sm text-destructive"
            >
              {error}
            </div>
          )}

          <div className="mt-5 flex items-center gap-3">
            {currentStep > 0 && (
              <button
                onClick={goBack}
                className="px-5 py-2.5 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:border-foreground/25 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-accent/40"
              >
                Back
              </button>
            )}
            {canSubmit && (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 px-5 py-2.5 rounded-xl bg-primary-accent text-primary-accent-foreground text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-accent/50"
              >
                {submitting
                  ? "Submitting..."
                  : isEdit
                    ? "Update Answers"
                    : "Submit"}
              </button>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

function QuestionGroup({ title, options, selected, onSelect }) {
  return (
    <div className="space-y-5">
      <h2 className="text-xl font-semibold text-card-foreground tracking-tight">
        {title}
      </h2>
      <div className="space-y-3">
        {options.map((opt) => (
          <OptionButton
            key={opt.value}
            label={opt.label}
            selected={selected === opt.value}
            onClick={() => onSelect(opt.value)}
          />
        ))}
      </div>
    </div>
  );
}
