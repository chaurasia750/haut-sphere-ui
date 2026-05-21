import { PropertyFieldMapper } from './property-field.mapper';
import { PropertyField } from '../models/property-field.model';

describe('PropertyFieldMapper', () => {
  let mapper: PropertyFieldMapper;

  beforeEach(() => {
    mapper = new PropertyFieldMapper();
  });

  it.each([
    { input: 'dropdown', expected: 'select' },
    { input: 'textbox', expected: 'text' },
    { input: 'number', expected: 'number' },
    { input: 'textarea', expected: 'textarea' },
  ])('maps $input type to $expected', ({ input, expected }) => {
    const field: PropertyField = {
      id: 1, fieldName: 'f', fieldLabel: 'F', fieldType: input as any,
      isRequired: false, isFilterable: false, options: [],
    };
    expect(mapper.toDynamicField(field).type).toBe(expected);
  });

  it('passes through propertyFieldId', () => {
    const field: PropertyField = {
      id: 42, fieldName: 'x', fieldLabel: 'X', fieldType: 'textbox',
      isRequired: false, isFilterable: false, options: [],
    };
    expect(mapper.toDynamicField(field).propertyFieldId).toBe(42);
  });

  it('passes through isRequired', () => {
    const req: PropertyField = {
      id: 1, fieldName: 'x', fieldLabel: 'X', fieldType: 'textbox',
      isRequired: true, isFilterable: false, options: [],
    };
    const opt: PropertyField = { ...req, isRequired: false };
    expect(mapper.toDynamicField(req).isRequired).toBe(true);
    expect(mapper.toDynamicField(opt).isRequired).toBe(false);
  });

  it('maps options when present', () => {
    const field: PropertyField = {
      id: 1, fieldName: 'c', fieldLabel: 'C', fieldType: 'dropdown',
      isRequired: false, isFilterable: false,
      options: [{ label: 'One', value: '1' }, { label: 'Two', value: '2' }],
    };
    const result = mapper.toDynamicField(field);
    expect(result.options).toEqual([{ label: 'One', value: '1' }, { label: 'Two', value: '2' }]);
  });

  it('omits options when empty', () => {
    const field: PropertyField = {
      id: 1, fieldName: 'c', fieldLabel: 'C', fieldType: 'textbox',
      isRequired: false, isFilterable: false, options: [],
    };
    expect(mapper.toDynamicField(field).options).toBeUndefined();
  });

  it('falls back to text for unknown fieldType', () => {
    const field: PropertyField = {
      id: 1, fieldName: 'x', fieldLabel: 'X', fieldType: 'unknown' as any,
      isRequired: false, isFilterable: false, options: [],
    };
    expect(mapper.toDynamicField(field).type).toBe('text');
  });

  it('toDynamicFields maps an array', () => {
    const fields: PropertyField[] = [
      { id: 1, fieldName: 'a', fieldLabel: 'A', fieldType: 'textbox', isRequired: false, isFilterable: false, options: [] },
      { id: 2, fieldName: 'b', fieldLabel: 'B', fieldType: 'number', isRequired: true, isFilterable: false, options: [] },
    ];
    const result = mapper.toDynamicFields(fields);
    expect(result).toHaveLength(2);
    expect(result[0].propertyFieldId).toBe(1);
    expect(result[1].propertyFieldId).toBe(2);
  });
});
