// Define address structure
export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

// Define the different types of addresses
export type AddressType = 'residential' | 'permanent';

export interface Question {
  id: string;
  question: string;
  type:
    | 'text'
    | 'textarea'
    | 'select'
    | 'checkbox'
    | 'radio'
    | 'number'
    | 'address';
  options?: string[];
  required: boolean;
}

export interface Answer {
  question_id: string;
  answer: string | string[] | number | Address;
}
