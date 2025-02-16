import { AlertTriangle, CheckCircle2 } from 'lucide-react';

interface AlertProps {
  message: string;
  type: 'error' | 'success';
}

export const Alert = ({ message, type }: AlertProps) => {
  return (
    <div className={`p-4 mb-4 rounded-lg flex items-center gap-2 ${
      type === 'error' 
        ? 'bg-red-500/10 text-red-500 border border-red-500/20' 
        : 'bg-green-500/10 text-green-500 border border-green-500/20'
    }`}>
      {type === 'error' ? (
        <AlertTriangle className="h-5 w-5" />
      ) : (
        <CheckCircle2 className="h-5 w-5" />
      )}
      <p className="text-sm">{message}</p>
    </div>
  );
};
