import { Component } from '@angular/core';

@Component({
    selector: 'counter',
    templateUrl: './counter.html',
    styleUrls:['./counter.css']
})
export class Counter {
    //Atributos de clase
    private counter: number = 0;

    get value(): number {
        return this.counter;
    }
    //Metodos de clase
    increment(): void{
        this.counter++;
    }
    decrement(): void{
        if (this.counter > 0){
            this.counter--;
        }
    }
}