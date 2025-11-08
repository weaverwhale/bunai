interface EmptyStateProps {
  starterQuestions: string[];
  onStarterQuestion: (question: string) => void;
}

export function EmptyState({
  starterQuestions,
  onStarterQuestion,
}: EmptyStateProps) {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center py-12 px-4">
        <h2 className="text-3xl font-semibold text-text mb-3">
          How can I help you today?
        </h2>
        <div className="flex flex-col gap-3 mt-8 max-w-2xl mx-auto">
          {starterQuestions.map(question => (
            <button
              key={question}
              onClick={() => onStarterQuestion(question)}
              className="cursor-pointer p-4 py-3 bg-surface border border-border hover:bg-surface-secondary text-text-secondary hover:text-text rounded-lg text-sm text-left transition-all"
            >
              {question}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
