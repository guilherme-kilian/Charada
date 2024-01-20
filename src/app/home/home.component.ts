import { keyframes } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { TitleStrategy } from '@angular/router';
import { WordsService } from '../words.service';

class BoardComponent {
  value:string
  status?:string;

  constructor(value?:string) {   
    this.value = value === undefined ? '' : value;
    this.status = 'default';
  }

  assignValue(value:string){ this.value = value; }

  cleanValue(){this.value = ""}

  isSuccess():boolean{ return this.status == 'success'; }

  isClose():boolean{ return this.status == 'close' }

  setSuccess() { this.status = 'success'; }

  setClose(){ 
    if(this.isSuccess())
      return;

    this.status = 'close'; 
  }
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  score:BoardComponent[][];
  board:BoardComponent[][];
  word:string;
  ended:boolean;
  column:number;
  index:number;
  wordsService:WordsService;

  constructor(private wordService: WordsService) {
    this.wordsService = wordService;
    this.word = wordService.getRandomWord();
    this.score = [];
    this.board = [];
    this.column = 0;
    this.index = 0;
    this.ended = false;
    }

  ngOnInit(): void {
    this.populateScore();
    this.populateBoard();
  }

  resetGame(){
    this.populateScore();
    this.populateBoard();
    this.column = 0;
    this.index = 0;
    this.word = this.wordService.getRandomWord();
    this.ended = false;
  }

  addLetter(letter:string){

    if(this.ended)
      return;

    if(letter === "Delete")
      return this.deleteLetter();

    if(letter === "Enter")
      return this.submitAttempt();

    this.score[this.column][this.index].assignValue(letter);

    if(this.index !== 4)
    this.index++;
  }

  private deleteLetter(){
    let current = this.score[this.column][this.index];

    if(this.index !== 0)
      this.index--;
    
    current.cleanValue();
  }

  private submitAttempt(){

    if(this.index !== 4 || this.score[this.column][this.index].value === "")
      return;

    if(this.column > 4)
      return this.endGame(false);

    let win:boolean = this.checkWinner(this.column);
    
    if(win)
      this.endGame(win);
    else{
      this.column++;
      this.index = 0;
    }
  }  

  private endGame(win:boolean){
    this.ended = true;
    win ? alert("Você ganhou!") : alert("Você perdeu.");    
  }

  //#region Check Winners

  private checkWinner(column:number):boolean{
    var line = this.score[column];
    
    this.checkCorrectPosition(line);
    this.checkCorrectLetter(line);

    let win:boolean = true;

    line.forEach(l => {
      if(!l.isSuccess())
        win = false;
    });

    return win;
  }

  private checkCorrectPosition(line:BoardComponent[]){
    let characters = this.word.toUpperCase().split('');
    for (let i = 0; i < line.length; i++) {
      let letter = line[i];

      if(!letter.isSuccess() && characters[i] === letter.value){
          letter.setSuccess();
          this.setScoreStatus(letter.value, true);
      }
    }
  }

  private checkCorrectLetter(line:BoardComponent[]){
    let characters = this.word.toUpperCase().split('');
    for (let i = 0; i < line.length; i++) {
      let letter = line[i];
      let hasLetter = characters.findIndex(f => f === letter.value);

      if(hasLetter !== -1)
        this.setCloseStatusIfNeeded(line, letter);   
    }
  }

  private setCloseStatusIfNeeded(line:BoardComponent[], letter:BoardComponent){
    let letters = line.filter(l => l.value === letter.value);
    let hasSuccess = false;
    letters.forEach(letter => {
      if(letter.isSuccess())
        hasSuccess = true;
    });

    if(!hasSuccess){
      letter.setClose();
      this.setScoreStatus(letter.value, false);      
    }
  }

  private setScoreStatus(letter:string, success:boolean ){
    if(success)
      this.board.find(b => b.find(d => d.value === letter)?.setSuccess())
    else
      this.board.find(b => b.find(d => d.value === letter)?.setClose())
  }

  //#endregion

  //#region Inicialize

  private populateScore(): void{
    this.score = [
      [ new BoardComponent(), new BoardComponent(),new BoardComponent(),new BoardComponent(),new BoardComponent() ],
      [ new BoardComponent(), new BoardComponent(),new BoardComponent(),new BoardComponent(),new BoardComponent() ],
      [ new BoardComponent(), new BoardComponent(),new BoardComponent(),new BoardComponent(),new BoardComponent() ],
      [ new BoardComponent(), new BoardComponent(),new BoardComponent(),new BoardComponent(),new BoardComponent() ],
      [ new BoardComponent(), new BoardComponent(),new BoardComponent(),new BoardComponent(),new BoardComponent() ],
      [ new BoardComponent(), new BoardComponent(),new BoardComponent(),new BoardComponent(),new BoardComponent() ]
    ] 
  }

  private populateBoard(): void{
    this.board = [
      [ 
        new BoardComponent('Q'), new BoardComponent('W'),new BoardComponent('E'),new BoardComponent('R'),new BoardComponent('T'), 
        new BoardComponent('Y'), new BoardComponent('U'),new BoardComponent('I'),new BoardComponent('O'),new BoardComponent('P')
      ],
      [ 
        new BoardComponent('A'), new BoardComponent('S'),new BoardComponent('D'),new BoardComponent('F'),new BoardComponent('G'),
        new BoardComponent('H'), new BoardComponent('J'),new BoardComponent('K'),new BoardComponent('L'),new BoardComponent('Delete')
      ],
      [ 
        new BoardComponent('Z'), new BoardComponent('X'),new BoardComponent('C'),new BoardComponent('V'),new BoardComponent('B'),
        new BoardComponent('N'), new BoardComponent('M'),new BoardComponent('Enter')
      ]
    ] 
  }
  //#endregion

}