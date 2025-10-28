import { useState } from "react";
import { Process, AlgorithmResult } from "@/types/banker";
import { ProcessInput } from "@/components/ProcessInput";
import { QuizSection } from "@/components/QuizSection";
import { AlgorithmVisualization } from "@/components/AlgorithmVisualization";
import { ResultDisplay } from "@/components/ResultDisplay";
import { Button } from "@/components/ui/button";
import { calculateNeed, runSafetyAlgorithm, validateInput } from "@/utils/bankerAlgorithm";
import { RotateCcw, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { toast } = useToast();
  const [numResources] = useState(3);
  const [available, setAvailable] = useState([3, 3, 2]);
  const [processes, setProcesses] = useState<Process[]>([
    { id: "P0", allocation: [0, 1, 0], max: [7, 5, 3], need: [7, 4, 3] },
    { id: "P1", allocation: [2, 0, 0], max: [3, 2, 2], need: [1, 2, 2] },
    { id: "P2", allocation: [3, 0, 2], max: [9, 0, 2], need: [6, 0, 0] },
    { id: "P3", allocation: [2, 1, 1], max: [2, 2, 2], need: [0, 1, 1] },
    { id: "P4", allocation: [0, 0, 2], max: [4, 3, 3], need: [4, 3, 1] },
  ]);

  const [showQuiz, setShowQuiz] = useState(false);
  const [userGuess, setUserGuess] = useState<boolean | undefined>(undefined);
  const [result, setResult] = useState<AlgorithmResult | null>(null);
  const [showVisualization, setShowVisualization] = useState(false);

  const handleRunAlgorithm = () => {
    const validation = validateInput(processes.length, numResources, processes, available);
    if (!validation.valid) {
      toast({
        variant: "destructive",
        title: "Invalid Input",
        description: validation.error,
      });
      return;
    }

    const processesWithNeed = calculateNeed(processes);
    setProcesses(processesWithNeed);
    setShowQuiz(true);
    setResult(null);
    setShowVisualization(false);
    setUserGuess(undefined);
  };

  const handleAnswer = (guess: boolean) => {
    setUserGuess(guess);
    const algorithmResult = runSafetyAlgorithm({
      processes: calculateNeed(processes),
      available,
      numResources,
    });
    setResult(algorithmResult);
    setShowVisualization(true);
  };

  const handleReset = () => {
    setShowQuiz(false);
    setResult(null);
    setShowVisualization(false);
    setUserGuess(undefined);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 max-w-6xl">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">Banker's Algorithm</h1>
              <p className="text-xs text-muted-foreground">Interactive Deadlock Avoidance Learning Tool</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Page Title */}
        {!showQuiz && (
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 text-foreground">
              Configure Your System
            </h2>
            <p className="text-muted-foreground text-lg">
              Set up processes and resources to analyze system safety
            </p>
          </div>
        )}

        {/* Input Section */}
        {!showQuiz && (
          <div className="mb-10 animate-slide-up">
            <ProcessInput
              processes={processes}
              numResources={numResources}
              available={available}
              onProcessesChange={setProcesses}
              onAvailableChange={setAvailable}
              onNumResourcesChange={() => {}}
            />
          </div>
        )}

        {/* Run Button */}
        {!showQuiz && (
          <div className="flex justify-center mb-12">
            <Button
              onClick={handleRunAlgorithm}
              size="lg"
              className="h-14 px-12 text-base font-semibold bg-gradient-primary hover:opacity-90 text-white shadow-elevated w-full max-w-md"
              disabled={processes.length === 0}
            >
              Run Banker's Algorithm
            </Button>
          </div>
        )}

        {/* Quiz Section */}
        {showQuiz && !result && (
          <div className="mb-12">
            <QuizSection onAnswer={handleAnswer} />
          </div>
        )}

        {/* Visualization */}
        {showVisualization && result && (
          <div className="mb-12">
            <AlgorithmVisualization steps={result.steps} numResources={numResources} />
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="mb-12">
            <ResultDisplay result={result} userGuess={userGuess} />
          </div>
        )}

        {/* Reset Button */}
        {result && (
          <div className="flex justify-center mb-12">
            <Button
              onClick={handleReset}
              variant="outline"
              size="lg"
              className="gap-2 h-12 px-8 border-border"
            >
              <RotateCcw className="h-5 w-5" />
              Try Another Configuration
            </Button>
          </div>
        )}

        {/* Footer */}
        <footer className="text-center mt-20 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Built for Operating Systems education • Learn by doing
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;