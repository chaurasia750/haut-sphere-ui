import { Component } from '@angular/core';

interface PropertyType {
  id: string;
  label: string;
  dynamicFields: DynamicField[];
}

interface DynamicField {
  key: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'textarea';
  placeholder: string;
  options?: { label: string; value: string }[];
}

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  type: 'image' | 'pdf';
  url: string;
  preview: string;
}

@Component({
  selector: 'app-add-inventory-page',
  standalone: false,
  templateUrl: './add-inventory-page.component.html',
  styleUrls: ['./add-inventory-page.component.scss'],
})
export class AddInventoryPageComponent {
  selectedType = '';
  selectedCategory = '';
  selectedBhk = '';
  isDragging = false;
  propertyImage: string | null = null;

  uploadedFiles: UploadedFile[] = [];

  propertyTypes: PropertyType[] = [
    {
      id: 'real-estate',
      label: 'Real Estate',
      dynamicFields: [
        { key: 'furnishing', label: 'Furnishing Status', type: 'select', placeholder: 'Select furnishing', options: [
          { label: 'Fully Furnished', value: 'fully' },
          { label: 'Semi Furnished', value: 'semi' },
          { label: 'Unfurnished', value: 'unfurnished' },
        ]},
        { key: 'parking', label: 'Parking', type: 'select', placeholder: 'Select parking', options: [
          { label: 'Covered Parking', value: 'covered' },
          { label: 'Open Parking', value: 'open' },
          { label: 'No Parking', value: 'none' },
        ]},
        { key: 'floor', label: 'Floor Number', type: 'text', placeholder: 'e.g. 3rd Floor' },
        { key: 'totalFloors', label: 'Total Floors', type: 'text', placeholder: 'e.g. 12' },
        { key: 'possession', label: 'Possession Status', type: 'select', placeholder: 'Select status', options: [
          { label: 'Ready to Move', value: 'ready' },
          { label: 'Under Construction', value: 'under-construction' },
          { label: 'Yet to Start', value: 'yet-to-start' },
        ]},
      ],
    },
    {
      id: 'interior',
      label: 'Interior Decor',
      dynamicFields: [
        { key: 'designStyle', label: 'Design Style', type: 'select', placeholder: 'Select design style', options: [
          { label: 'Modern', value: 'modern' },
          { label: 'Contemporary', value: 'contemporary' },
          { label: 'Minimalist', value: 'minimalist' },
          { label: 'Classic', value: 'classic' },
          { label: 'Industrial', value: 'industrial' },
          { label: 'Bohemian', value: 'bohemian' },
        ]},
        { key: 'serviceCost', label: 'Service Cost (₹)', type: 'number', placeholder: 'e.g. 500000' },
        { key: 'projectDuration', label: 'Project Duration', type: 'select', placeholder: 'Select duration', options: [
          { label: '1-2 Months', value: '1-2' },
          { label: '2-4 Months', value: '2-4' },
          { label: '4-6 Months', value: '4-6' },
          { label: '6-12 Months', value: '6-12' },
        ]},
        { key: 'rooms', label: 'Number of Rooms', type: 'text', placeholder: 'e.g. 3 Bedrooms' },
      ],
    },
    {
      id: 'construction',
      label: 'Construction',
      dynamicFields: [
        { key: 'budget', label: 'Budget (₹)', type: 'number', placeholder: 'e.g. 2500000' },
        { key: 'projectType', label: 'Project Type', type: 'select', placeholder: 'Select project type', options: [
          { label: 'New Construction', value: 'new' },
          { label: 'Renovation', value: 'renovation' },
          { label: 'Extension', value: 'extension' },
          { label: 'Commercial Build', value: 'commercial' },
        ]},
        { key: 'timeline', label: 'Expected Timeline', type: 'select', placeholder: 'Select timeline', options: [
          { label: '3-6 Months', value: '3-6' },
          { label: '6-12 Months', value: '6-12' },
          { label: '12-18 Months', value: '12-18' },
          { label: '18+ Months', value: '18-plus' },
        ]},
        { key: 'material', label: 'Material Preference', type: 'select', placeholder: 'Select material', options: [
          { label: 'Premium', value: 'premium' },
          { label: 'Standard', value: 'standard' },
          { label: 'Economy', value: 'economy' },
        ]},
      ],
    },
  ];

  categories: { label: string; value: string }[] = [
    { label: 'Residential', value: 'residential' },
    { label: 'Commercial', value: 'commercial' },
    { label: 'Industrial', value: 'industrial' },
    { label: 'Land', value: 'land' },
  ];

  bhkOptions: { label: string; value: string }[] = [
    { label: '1 BHK', value: '1' },
    { label: '2 BHK', value: '2' },
    { label: '3 BHK', value: '3' },
    { label: '4 BHK', value: '4' },
    { label: '5+ BHK', value: '5-plus' },
  ];

  formModel = {
    propertyName: '',
    price: null,
    area: null,
    location: '',
    locationUrl: '',
    description: '',
    bhk: '',
    category: '',
    dynamic: {} as Record<string, string>,
  };

  get currentType(): PropertyType | undefined {
    return this.propertyTypes.find(t => t.id === this.selectedType);
  }

  get typeLabel(): string {
    return this.currentType?.label || '';
  }

  onPropertyImageSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.propertyImage = e.target?.result as string;
      };
      reader.readAsDataURL(input.files[0]);
    }
    input.value = '';
  }

  removePropertyImage(event: Event): void {
    event.stopPropagation();
    this.propertyImage = null;
  }

  removeFile(id: string): void {
    this.uploadedFiles = this.uploadedFiles.filter(f => f.id !== id);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      input.value = '';
    }
  }

  onSubmit(): void {
    console.log('Submitting inventory:', this.formModel);
  }
}
