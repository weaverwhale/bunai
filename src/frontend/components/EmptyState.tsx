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
      <div className="text-center py-12">
        <h2 className="text-3xl font-semibold text-gray-800 mb-3">
          How can I help you today?
        </h2>
        <div className="flex flex-col gap-2 mt-8 max-w-2xl mx-auto">
          {starterQuestions.map(question => (
            <button
              key={question}
              onClick={() => onStarterQuestion(question)}
              className="cursor-pointer px-4 py-3 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 rounded-lg text-sm text-left transition-colors"
            >
              {question}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
