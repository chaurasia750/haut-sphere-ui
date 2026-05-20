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
  selector: 'app-add-property-page',
  standalone: false,
  templateUrl: './add-property-page.component.html',
  styleUrls: ['./add-property-page.component.scss'],
})
export class AddPropertyPageComponent {
  selectedType = 'real-estate';
  selectedCategory = '';
  selectedBhk = '';
  isDragging = false;

  uploadedFiles: UploadedFile[] = [
    {
      id: '1',
      name: 'living-room.jpg',
      size: '2.4 MB',
      type: 'image',
      url: '#',
      preview: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=200&h=150&fit=crop',
    },
    {
      id: '2',
      name: 'kitchen-view.jpg',
      size: '1.8 MB',
      type: 'image',
      url: '#',
      preview: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=200&h=150&fit=crop',
    },
    {
      id: '3',
      name: 'floor-plan.pdf',
      size: '856 KB',
      type: 'pdf',
      url: '#',
      preview: '',
    },
  ];

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
    propertyName: 'Skyline Luxury Apartment',
    price: 8500000,
    area: 1560,
    location: 'Whitefield, Bangalore',
    description: 'A stunning 3BHK apartment in the heart of Whitefield with panoramic city views, modern amenities, and premium finishes throughout.',
    bhk: '3',
    category: 'residential',
    dynamic: {} as Record<string, string>,
  };

  get currentType(): PropertyType {
    return this.propertyTypes.find(t => t.id === this.selectedType) || this.propertyTypes[0];
  }

  get typeLabel(): string {
    return this.currentType.label;
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
    console.log('Submitting property:', this.formModel);
  }
}
