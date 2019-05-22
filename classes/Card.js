class Card{
	constructor(value, color){
		this._value = value;
		this._color = color;
	}
	get value(){
		if (this._value === "A"){
			return this._value
		}
		else if (["J", "Q", "K"].includes(this._value)){
			return 10;
		}
		else{
			return parseInt(this._value);
		}
	}
	get color(){
		return this._color;
	}
}

module.exports = Card;