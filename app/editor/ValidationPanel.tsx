import type { ValidationIssue } from '@/app/lib/story/validateStory';

type ValidationPanelProps = {
  issues: ValidationIssue[];
};


export default function ValidationPanel({ issues }: ValidationPanelProps) {
  if (issues.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 border rounded p-4">
      <h2 className="font-semibold mb-2">Validation</h2>

      <ul className="list-disc pl-5 space-y-1">
        {issues.map((issue) => (
          <li key={issue.id}>{issue.message}</li>
        ))}
      </ul>
    </div>
  );
}
