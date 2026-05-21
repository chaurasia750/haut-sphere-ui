export interface DynamicField {
  propertyFieldId: number;
  key: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'textarea';
  isRequired?: boolean;
  options?: { label: string; value: string }[];
}

export interface UploadedFile {
  id: string;
  fileId: number;
  name: string;
  size: string;
  type: 'image' | 'pdf';
  url: string;
  preview: string;
}
