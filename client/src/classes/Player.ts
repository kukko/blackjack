import Card from "./Card";

export default class Player{
	_name:string;
	_point?:number;
	_cards?:Card[];
	constructor(name, point = 0, cards = []){
		this._name = name;
		this._point = point;
		this._cards = cards;
	}
	get name(){
		return this._name;
	}
	set name(value){
		this._name = value;
	}
	get point(){
		return this._point;
	}
	get cards(){
		return this._cards;
	}
}