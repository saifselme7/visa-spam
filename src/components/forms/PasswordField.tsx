import { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { TextField, type TextFieldProps } from './TextField';
import { IconButton } from '@/components/ui/IconButton';

export type PasswordFieldProps = Omit<TextFieldProps, 'type' | 'iconLeft' | 'trailing'>;

export function PasswordField(props: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <TextField
      {...props}
      type={visible ? 'text' : 'password'}
      iconLeft={<Lock />}
      trailing={
        <IconButton
          size="sm"
          label={visible ? 'Hide password' : 'Show password'}
          icon={visible ? <EyeOff /> : <Eye />}
          onClick={() => {
            setVisible((current) => !current);
          }}
          className="border-transparent bg-transparent"
        />
      }
    />
  );
}
