let Card = require("./Card.js");

class Player{
	constructor(connectionId, name){
		this._connectionId = connectionId;
		this._name = name;
		this.resetCards();
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
	giveCard(value, color){
		this.cards.push(new Card(value, color));
	}
	resetCards(){
		this.cards = [];
	}
	valueOfHand(){
		let output = 0;
		for (let cardIndex in this.cards){
			output += this.cards[cardIndex].value;
		}
		return output;
	}
}

module.exports = Player;