import { Test, TestingModule } from '@nestjs/testing';
import { ReportsService } from './reports.service';
import { Repository } from 'typeorm';
import { Report } from './report.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('ReportsService', () => {
  let service: ReportsService;
  let repository: Repository<Report>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        {
          provide: getRepositoryToken(Report),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
    repository = module.get<Repository<Report>>(getRepositoryToken(Report));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
