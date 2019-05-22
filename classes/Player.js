let Card = require("./Card.js");

class Player{
	constructor(connectionId, name, isAI = false){
		this._connectionId = connectionId;
		this._name = name;
		this.resetCards();
		this._isAI = isAI;
		this._stopped = false;
	}
	get connectionId(){
		return this._connectionId;
	}
	get name(){
		return this._name;
	}
	get cards(){
		return this._cards;
	}
	set cards(value){
		this._cards = value;
	}
	get isAI(){
		return this._isAI;
	}
	get stopped(){
		return this._stopped;
	}
	giveCard(card){
		this.cards.push(card);
	}
	resetCards(){
		this.cards = [];
	}
	valueOfHand(){
		let output = 0,
			numberOfAces = 0;
		for (let cardIndex in this.cards){
			let cardValue = this.cards[cardIndex].value;
			if (cardValue === "A"){
				numberOfAces++;
			}
			else{
				output += cardValue;
			}
		}
		for (let i = 0; i < numberOfAces; i++){
			if (output + 11 > 21){
				output++;
			}
			else{
				output += 11;
			}
		}
		return output;
	}
	isBusted(){
		return this.valueOfHand() > 21;
	}
}

module.exports = Player;