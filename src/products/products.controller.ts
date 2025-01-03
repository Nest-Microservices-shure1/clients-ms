import { BadRequestException, Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
import { PaginationDto } from 'src/common';
import { PRODUCT_SERVICE } from 'src/config';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(@Inject(PRODUCT_SERVICE) private readonly productsClient: ClientProxy) {}

  @Post()
  createProduct(@Body() createProductDto : CreateProductDto) {
    return this.productsClient.send({cmd: 'create_product'}, createProductDto)
  }

  @Get()
  findAllProducts(@Query() paginationDto: PaginationDto) {
    const { limit, page} = paginationDto
    return this.productsClient.send({cmd: 'find_all_products'}, {limit, page});
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productsClient.send({ cmd: 'find_one_product' }, { id })
      .pipe(
        catchError( error => { throw new RpcException(error)})
      )
  }

  @Patch(':id')
  patchProduct(@Param('id', ParseIntPipe) id: number ,@Body() updateProductDto: UpdateProductDto) {
    return this.productsClient.send({cmd: 'update_product'}, { id, ...updateProductDto}).pipe(
      catchError( error => {throw new RpcException(error)})
    )
  }

  @Delete(':id')
  deleteProduct(@Param('id',) id: string) {
    return this.productsClient.send({cmd: 'delete_product'}, { id })
  }
}
