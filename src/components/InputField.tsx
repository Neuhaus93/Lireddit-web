import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Textarea,
} from '@chakra-ui/react';
import { useField } from 'formik';
import React from 'react';

type InputFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  label: string;
  textarea?: boolean;
};

export const InputField: React.FC<InputFieldProps> = ({
  label,
  textarea,
  size: _,
  ...props
}) => {
  const [field, { error }] = useField(props);

  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={field.name}>{label}</FormLabel>
      <Input {...field} {...props} id={field.name} />
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};

type TextareaFieldProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  name: string;
  label: string;
};

export const TextareaField: React.FC<TextareaFieldProps> = ({
  label,
  ...props
}) => {
  const [field, { error }] = useField(props);

  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={field.name}>{label}</FormLabel>
      <Textarea {...field} {...props} id={field.name} />
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};
