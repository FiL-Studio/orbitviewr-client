

export class Input {
	dom: HTMLElement = null;
	constructor(dom: HTMLElement = null){

		if(!dom) return;
		this.dom = dom as HTMLInputElement;

		this.create();
		this.addEventListeners();

	}

	create(){

	}

	addEventListeners(){
		
	}

	update(){
		
	}
}