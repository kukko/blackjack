export default class Room{
	_name:string;
	constructor(name){
		this._name = name;
	}
	get name(){
		return this._name;
	}
}