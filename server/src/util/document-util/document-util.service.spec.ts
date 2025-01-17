import { Test, TestingModule } from '@nestjs/testing';

import { DocumentUtilService } from './document-util.service';

describe('DocumentUtilService', () => {
  let service: DocumentUtilService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DocumentUtilService],
    }).compile();

    service = module.get<DocumentUtilService>(DocumentUtilService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
