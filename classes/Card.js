class Card{
	constructor(value, color){
		this._value = value;
		this._color = color;
	}
	get value(){
		return this._value;
	}
	get color(){
		return this._color;
	}
}

module.exports = Card;