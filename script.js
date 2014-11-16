var screenEl = document.getElementById('screen')

var countDigital = 6;

// промежуточные данные
var calcValues = {
	firstArg: null,
	secondArg: null,
	operation: null
};

// текущее состояние конечного автомата
var currentState = new FirstArgState();

//Callbacks

var onNum = function (num) {
	currentState.concatNum(num);
	console.log("calcValues.firstArg = " + calcValues.firstArg);
	console.log("calcValues.secondArg = " + calcValues.secondArg);
};

var onAdd = function () {
	currentState.doOperation(addOperation);
};

var onSub = function () {
	currentState.doOperation(subOperation);
};

var onMul = function () {
	currentState.doOperation(mulOperation);
};

var onDiv = function () {
	currentState.doOperation(divOperation);
};

var onCompute = function () {
	computeCalc();
};

var onReset = function () {
	resetCalc();
	printValue(0);
};

//TODO сделать отсечение числа для экрана калькулятора
var printValue = function (value) {
	screenEl.innerHTML = value;
};

// общие функции

var concatNumberWithArg = function (num, calcArg) {
	if (calcValues[calcArg] < Math.pow(10, countDigital - 1)) {
		calcValues[calcArg] *= 10;
		calcValues[calcArg] += num;
		printValue(calcValues[calcArg]);
	}
};

var computeNum = function () {
	calcValues.firstArg = calcValues.operation(calcValues.firstArg, calcValues.secondArg);
	calcValues.secondArg = null;
	calcValues.operation = null;
	printValue(calcValues.firstArg);
};

var computeCalc = function () {
	if (calcValues.secondArg != null) {
		computeNum();
		changeState(new ResultState());
	}
};

var resetCalc = function () {
	changeState(new FirstArgState());
	calcValues.firstArg = null;
	calcValues.secondArg = null;
	calcValues.operation = null;
};

// Операции
function addOperation(first, second) {
	return first + second;
}

function subOperation(first, second) {
	return first - second;
}

function mulOperation(first, second) {
	return first * second;
}

function divOperation(first, second) {
	return first / second;
}


// Состояния

// Ввод первого аргумента
function FirstArgState() {
	this.concatNum = function (num) {
		concatNumberWithArg(num, "firstArg");
	};

	this.doOperation = function (operation) {
		changeState(new OperationState(operation));
	};
}

// Ввод второго аргумента
function SecondArgState() {
	this.concatNum = function (num) {
		concatNumberWithArg(num, "secondArg");
	};

	this.doOperation = function (operation) {
		computeNum();
		changeState(new OperationState(operation));
	};
}

// Введена операция
function OperationState(operation) {
	calcValues.operation = operation;

	this.concatNum = function (num) {
		changeState(new SecondArgState());
		currentState.concatNum(num);
	};

	this.doOperation = function (operation) {
		calcValues.operation = operation;
	};
}

// Результат
function ResultState() {
	this.concatNum = function (num) {
		resetCalc();
		currentState.concatNum(num);
	};

	this.doOperation = function (operation) {
		changeState(new OperationState(operation));
	};
}

// Смена состояния
function changeState(newState) {
	delete currentState;
	currentState = newState;
	console.log("changeState -> " + currentState.toString());
}
