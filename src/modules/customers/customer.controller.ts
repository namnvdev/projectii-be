import { Controller, Get, Param } from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { CustomerResponseDto } from "./dto/response/customer-response.dto";
import { ApiResponseDto } from "src/common/dto/api-response.dto";
import { CustomerService } from "./customer.service";
import { Customer } from "./entities/customer.entity";
import { plainToInstance } from "class-transformer";

@ApiTags('Customers')
@Controller('customers')
export class CustomerController {

    constructor(private readonly customerService: CustomerService) {}


    @Get()
    @ApiOkResponse({ type: ApiResponseDto<Customer[]> })
    async findAll(): Promise<ApiResponseDto<Customer[]>> {
        var listCustomers = await this.customerService.findAll();
        return {
            statusCode: 200,
            message: 'Success',
            data: listCustomers
        }
    }
    
    @Get(':id')
    @ApiOkResponse({ type: ApiResponseDto<CustomerResponseDto> })
    async findOne(@Param('id') id: number): Promise<ApiResponseDto<CustomerResponseDto | null>> {
        var customer = plainToInstance(CustomerResponseDto, await this.customerService.findOne(id), { excludeExtraneousValues: true });
        
        return {
            statusCode: 200,
            message: 'Successfully',
            data: customer
        }
    }

}
