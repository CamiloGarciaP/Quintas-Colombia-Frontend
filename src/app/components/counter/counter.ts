import { Component } from '@angular/core';

@Component({
    selector: 'counter',
    templateUrl: './counter.html',
    styleUrls:['./counter.css']
})
export class Counter {
    //Atributos de clase
    counter = 0;
    //Metodos de clase
    increment(){
        this.counter++;
    }
    decrement(){
        this.counter--;
    }
}