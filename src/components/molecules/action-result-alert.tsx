import { ActionResult } from '@/lib/actions/action-result';
import { Alert, AlertDescription, AlertTitle } from '../atoms/alert';

interface Props {
  result: ActionResult<any>;
}

const ActionResultAlert = ({ result }: Props) => {
  return (
    <Alert variant={result.status ?? 'default'}>
      <AlertTitle>{result.message}</AlertTitle>
      {result.stack && (
        <AlertDescription>
          <ul className="list-inside list-disc text-sm">
            {result.stack.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </AlertDescription>
      )}
    </Alert>
  );
};

export default ActionResultAlert;
