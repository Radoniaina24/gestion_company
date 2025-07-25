import { Test, TestingModule } from '@nestjs/testing';
import { DepartmentGateway } from './department.gateway';

describe('DepartmentGateway', () => {
  let gateway: DepartmentGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DepartmentGateway],
    }).compile();

    gateway = module.get<DepartmentGateway>(DepartmentGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
