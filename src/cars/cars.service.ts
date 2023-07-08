import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Car } from './interfaces/car.interface';
import {v4 as uuid} from 'uuid';
import { CreateCarDto, UpdateCarDto } from './dto';

@Injectable()
export class CarsService {    
    private cars: Car[] = [
        // {
        //     id: uuid(),
        //     brand: "Toyota",
        //     model: "Corolla"
        // },
    ]

    findAll(){
        return this.cars;
    }

    findOneById(id: string){
        const car = this.cars?.find(car=>car?.id.includes(id));
        if(!car) throw new NotFoundException(`Car with id ${id} not found`);
        return car
    }

    create(createCarDto: CreateCarDto){
        const {brand, model} = createCarDto
        if(!createCarDto) throw new NotFoundException();
        if(this.cars.filter(car=>car.brand === brand && car.model === model).length) return "That car already exists"
        this.cars.push({
            id: uuid(),
            brand,
            model
        });
        return this.cars
    }

    update(id: string, updateCarDto: UpdateCarDto){
        let carDB = this.findOneById(id);
        if(updateCarDto.id && updateCarDto.id !== id)
            throw new BadRequestException(`Car ID ${id} cannot be updated`)
        this.cars = this.cars.map(car=>{
            if(car.id === id){
                carDB = {...carDB, ...updateCarDto, id}
                return carDB
            }
            return car
        })
        return carDB
    }

    delete(id: string){
        this.findOneById(id)
        this.cars = this.cars.filter(car => car.id !== id)
    }

    fillCarsWithSeedData(cars :Car[]){
        this.cars = cars
    }
}
