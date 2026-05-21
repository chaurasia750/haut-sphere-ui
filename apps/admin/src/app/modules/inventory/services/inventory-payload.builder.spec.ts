import { InventoryPayloadBuilder, BuildPayloadData } from './inventory-payload.builder';
import { DynamicField, UploadedFile } from '../models/inventory-form.model';

function defaultData(overrides: Partial<BuildPayloadData> = {}): BuildPayloadData {
  return {
    selectedType: '3',
    propertyName: 'Luxury Villa',
    fieldDefinitions: [],
    dynamicValues: {},
    uploadedFiles: [],
    propertyImageId: null,
    ...overrides,
  };
}

describe('InventoryPayloadBuilder', () => {
  let builder: InventoryPayloadBuilder;

  beforeEach(() => {
    builder = new InventoryPayloadBuilder();
  });

  it('sets propertyTypeId from selectedType', () => {
    const payload = builder.build(defaultData({ selectedType: '7' }));
    expect(payload.propertyTypeId).toBe(7);
  });

  it('sets title from propertyName', () => {
    const payload = builder.build(defaultData({ propertyName: 'My Property' }));
    expect(payload.title).toBe('My Property');
  });

  it('trims whitespace from propertyName', () => {
    const payload = builder.build(defaultData({ propertyName: '  Spaced Out  ' }));
    expect(payload.title).toBe('Spaced Out');
  });

  it('maps all dynamic fields except Description into fields array', () => {
    const fieldDefinitions: DynamicField[] = [
      { propertyFieldId: 10, key: 'Price', label: 'Price', type: 'number' },
      { propertyFieldId: 11, key: 'Area', label: 'Area', type: 'number' },
    ];
    const payload = builder.build(defaultData({
      fieldDefinitions,
      dynamicValues: { Price: '500000', Area: '2500' },
    }));
    expect(payload.fields).toEqual([
      { propertyFieldId: 10, value: '500000' },
      { propertyFieldId: 11, value: '2500' },
    ]);
    expect(payload.description).toBe('');
  });

  it('extracts Description as top-level field and excludes from fields', () => {
    const fieldDefinitions: DynamicField[] = [
      { propertyFieldId: 10, key: 'Price', label: 'Price', type: 'number' },
      { propertyFieldId: 12, key: 'Description', label: 'Description', type: 'textarea' },
    ];
    const payload = builder.build(defaultData({
      fieldDefinitions,
      dynamicValues: { Price: '500000', Description: 'Beautiful home' },
    }));
    expect(payload.description).toBe('Beautiful home');
    expect(payload.fields).toEqual([{ propertyFieldId: 10, value: '500000' }]);
  });

  it('skips fields with empty values', () => {
    const fieldDefinitions: DynamicField[] = [
      { propertyFieldId: 10, key: 'Price', label: 'Price', type: 'number' },
      { propertyFieldId: 11, key: 'Area', label: 'Area', type: 'number' },
    ];
    const payload = builder.build(defaultData({
      fieldDefinitions,
      dynamicValues: { Price: '500000', Area: '' },
    }));
    expect(payload.fields).toEqual([{ propertyFieldId: 10, value: '500000' }]);
  });

  it('sets empty fields array when no dynamic values', () => {
    const payload = builder.build(defaultData());
    expect(payload.fields).toEqual([]);
  });

  it('sets documentIds from uploaded files', () => {
    const uploadedFiles: UploadedFile[] = [
      { id: 'local-1', fileId: 201, name: 'img.png', size: '1 MB', type: 'image', url: '', preview: '' },
      { id: 'local-2', fileId: 202, name: 'doc.pdf', size: '2 MB', type: 'pdf', url: '', preview: '' },
    ];
    const payload = builder.build(defaultData({ uploadedFiles }));
    expect(payload.documentIds).toEqual([201, 202]);
  });

  it('sets empty documentIds when no files uploaded', () => {
    const payload = builder.build(defaultData());
    expect(payload.documentIds).toEqual([]);
  });

  it('sets profileId from propertyImageId', () => {
    const payload = builder.build(defaultData({ propertyImageId: 42 }));
    expect(payload.profileId).toBe(42);
  });

  it('uses 0 for profileId when no image uploaded', () => {
    const payload = builder.build(defaultData({ propertyImageId: null }));
    expect(payload.profileId).toBe(0);
  });

  it('adds status when provided', () => {
    const payload = builder.build(defaultData({ status: 'draft' }));
    expect(payload.status).toBe('draft');
  });

  it('omits status when not provided', () => {
    const payload = builder.build(defaultData());
    expect(payload.status).toBeUndefined();
  });

  it('builds full payload matching expected API shape', () => {
    const fieldDefinitions: DynamicField[] = [
      { propertyFieldId: 10, key: 'Price', label: 'Price', type: 'number' },
      { propertyFieldId: 12, key: 'Description', label: 'Description', type: 'textarea' },
    ];
    const uploadedFiles: UploadedFile[] = [
      { id: 'loc-1', fileId: 301, name: 'a.jpg', size: '1 MB', type: 'image', url: '', preview: '' },
    ];
    const payload = builder.build(defaultData({
      selectedType: '5',
      propertyName: '  Test  ',
      fieldDefinitions,
      dynamicValues: { Price: '999', Description: 'Nice place' },
      uploadedFiles,
      propertyImageId: 77,
      status: 'draft',
    }));
    expect(payload).toEqual({
      propertyTypeId: 5,
      title: 'Test',
      description: 'Nice place',
      fields: [{ propertyFieldId: 10, value: '999' }],
      documentIds: [301],
      profileId: 77,
      status: 'draft',
    });
  });
});
