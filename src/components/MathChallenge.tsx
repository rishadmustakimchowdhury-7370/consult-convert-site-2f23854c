import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle } from "lucide-react";

interface MathChallengeProps {
  onVerified: (verified: boolean) => void;
}

export const MathChallenge = ({ onVerified }: MathChallengeProps) => {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [answer, setAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const generateChallenge = () => {
    const n1 = Math.floor(Math.random() * 10) + 1;
    const n2 = Math.floor(Math.random() * 10) + 1;
    setNum1(n1);
    setNum2(n2);
    setAnswer("");
    setIsCorrect(null);
    onVerified(false);
  };

  useEffect(() => {
    generateChallenge();
  }, []);

  const handleAnswerChange = (value: string) => {
    setAnswer(value);
    const userAnswer = parseInt(value, 10);
    const correctAnswer = num1 + num2;
    
    if (value === "") {
      setIsCorrect(null);
      onVerified(false);
    } else if (userAnswer === correctAnswer) {
      setIsCorrect(true);
      onVerified(true);
    } else {
      setIsCorrect(false);
      onVerified(false);
    }
  };

  return (
    <div className="space-y-2 p-4 bg-muted/50 rounded-lg border">
      <Label className="text-sm font-medium flex items-center gap-2">
        Security Check
        {isCorrect === true && <CheckCircle className="w-4 h-4 text-green-500" />}
        {isCorrect === false && <XCircle className="w-4 h-4 text-destructive" />}
      </Label>
      <div className="flex items-center gap-3">
        <span className="text-lg font-semibold">
          {num1} + {num2} = ?
        </span>
        <Input
          type="number"
          value={answer}
          onChange={(e) => handleAnswerChange(e.target.value)}
          placeholder="Answer"
          className="w-24"
        />
        <button
          type="button"
          onClick={generateChallenge}
          className="text-xs text-muted-foreground hover:text-foreground underline"
        >
          New problem
        </button>
      </div>
      {isCorrect === false && answer !== "" && (
        <p className="text-xs text-destructive">Incorrect answer. Please try again.</p>
      )}
    </div>
  );
};
