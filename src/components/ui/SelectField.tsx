import * as Select from '@radix-ui/react-select';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';

export interface SelectOption { value: string; label: string; }

interface SelectFieldProps {
  label: string;
  value: string;
  options: SelectOption[];
  onValueChange: (value: string) => void;
  className?: string;
}

export function SelectField({ label, value, options, onValueChange, className = '' }: SelectFieldProps) {
  return <Select.Root value={value} onValueChange={onValueChange}>
    <Select.Trigger className={`ui-select-trigger ${className}`} aria-label={label}>
      <Select.Value />
      <Select.Icon><ChevronDown aria-hidden="true" /></Select.Icon>
    </Select.Trigger>
    <Select.Portal>
      <Select.Content className="ui-select-content" position="popper" sideOffset={6} collisionPadding={12}>
        <Select.ScrollUpButton className="ui-select-scroll"><ChevronUp /></Select.ScrollUpButton>
        <Select.Viewport className="ui-select-viewport">
          {options.map((option) => <Select.Item className="ui-select-item" key={option.value} value={option.value}>
            <Select.ItemText>{option.label}</Select.ItemText>
            <Select.ItemIndicator><Check aria-hidden="true" /></Select.ItemIndicator>
          </Select.Item>)}
        </Select.Viewport>
        <Select.ScrollDownButton className="ui-select-scroll"><ChevronDown /></Select.ScrollDownButton>
      </Select.Content>
    </Select.Portal>
  </Select.Root>;
}
