import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { AddInventoryPageComponent } from './add-inventory-page.component';
import { IInventoryService, INVENTORY_SERVICE, CreateInventoryPayload } from '../../services/inventory.service';
import { PROPERTY_FIELD_MAPPER, IPropertyFieldMapper } from '../../services/property-field.mapper';
import { INVENTORY_PAYLOAD_BUILDER, IInventoryPayloadBuilder } from '../../services/inventory-payload.builder';
import { MediaService } from '@shared';

describe('AddInventoryPageComponent', () => {
  let component: AddInventoryPageComponent;
  let fixture: ComponentFixture<AddInventoryPageComponent>;
  let createInventory: ReturnType<typeof vi.fn>;
  let build: ReturnType<typeof vi.fn>;

  const mockPayload: CreateInventoryPayload = {
    propertyTypeId: 3,
    title: 'Test',
    description: '',
    fields: [],
    documentIds: [],
    profileId: 0,
  };

  beforeEach(async () => {
    createInventory = vi.fn().mockReturnValue(of(null));
    build = vi.fn().mockReturnValue(mockPayload);

    const inventoryService: IInventoryService = {
      getPropertyTypes: vi.fn().mockReturnValue(of([])) as any,
      getPropertyFields: vi.fn().mockReturnValue(of([])) as any,
      createInventory: createInventory as any,
      getPropertyById: vi.fn() as any,
      activateProperty: vi.fn() as any,
      deactivateProperty: vi.fn() as any,
      closeProperty: vi.fn() as any,
    };

    const fieldMapper: IPropertyFieldMapper = {
      toDynamicField: vi.fn() as any,
      toDynamicFields: vi.fn().mockReturnValue([]) as any,
    };

    const payloadBuilder: IInventoryPayloadBuilder = { build: build as any };

    const mediaService = {
      baseUrl: 'http://test',
      tempUpload: vi.fn() as any,
      tempUploadWithProgress: vi.fn() as any,
      getFileUrl: vi.fn() as any,
    };

    await TestBed.configureTestingModule({
      declarations: [AddInventoryPageComponent],
      providers: [
        provideNoopAnimations(),
        provideRouter([]),
        { provide: INVENTORY_SERVICE, useValue: inventoryService },
        { provide: PROPERTY_FIELD_MAPPER, useValue: fieldMapper },
        { provide: INVENTORY_PAYLOAD_BUILDER, useValue: payloadBuilder },
        { provide: MediaService, useValue: mediaService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AddInventoryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('onSubmit', () => {
    it('does nothing when selectedType is empty', () => {
      component.selectedType = '';
      component.formModel.propertyName = 'Test';
      component.onSubmit();
      expect(build).not.toHaveBeenCalled();
      expect(createInventory).not.toHaveBeenCalled();
    });

    it('does nothing when propertyName is empty', () => {
      component.selectedType = '3';
      component.formModel.propertyName = '';
      component.onSubmit();
      expect(build).not.toHaveBeenCalled();
      expect(createInventory).not.toHaveBeenCalled();
    });

    it('does nothing when propertyName is only whitespace', () => {
      component.selectedType = '3';
      component.formModel.propertyName = '   ';
      component.onSubmit();
      expect(build).not.toHaveBeenCalled();
      expect(createInventory).not.toHaveBeenCalled();
    });

    it('calls payloadBuilder.build with correct form state', () => {
      component.selectedType = '3';
      component.formModel.propertyName = 'Test Villa';
      component.formModel.dynamic = { Price: '500000' };
      component.fieldDefinitions = [
        { propertyFieldId: 1, key: 'Price', label: 'Price', type: 'number' },
      ];
      component.uploadedFiles = [];
      component.propertyImageId = null;

      component.onSubmit();

      expect(build).toHaveBeenCalledWith({
        selectedType: '3',
        propertyName: 'Test Villa',
        fieldDefinitions: component.fieldDefinitions,
        dynamicValues: { Price: '500000' },
        uploadedFiles: [],
        propertyImageId: null,
        status: undefined,
      });
    });

    it('passes status to builder when provided', () => {
      component.selectedType = '3';
      component.formModel.propertyName = 'Draft Property';
      component.onSubmit('draft');

      expect(build).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'draft' }),
      );
    });

    it('calls inventoryService.createInventory with built payload', () => {
      component.selectedType = '3';
      component.formModel.propertyName = 'Test';
      component.onSubmit();
      expect(createInventory).toHaveBeenCalledWith(mockPayload);
    });

    it('does nothing if already saving', () => {
      component.selectedType = '3';
      component.formModel.propertyName = 'Test';
      component.isSaving = true;
      component.onSubmit();
      expect(build).not.toHaveBeenCalled();
    });

    it('resets isSaving after response', () => {
      component.selectedType = '3';
      component.formModel.propertyName = 'Test';
      component.onSubmit();
      expect(component.isSaving).toBe(false);
    });
  });
});
