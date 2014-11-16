var screenEl = document.getElementById('screen');

var countDigital = 5;

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
	currentState.appendNum(num);
};

var onAdd = function () {
	console.log("operation +");
	currentState.setOperation(addOperation);
};

var onSub = function () {
	console.log("operation -");
	currentState.setOperation(subOperation);
};

var onMul = function () {
	console.log("operation *");
	currentState.setOperation(mulOperation);
};

var onDiv = function () {
	console.log("operation /");
	currentState.setOperation(divOperation);
};

var onCompute = function () {
	computeCalc();
};

var onReset = function () {
	resetCalc();
	printValue(0);
};

var printValue = function (value) {
	console.log("real value = " + value);
	if (value === Infinity) {
		screenEl.innerHTML = "ERROR"
	} else {
		var lengthInt = countDigital;
		var lengthFract = 0;
		var degree = 0;

		if (value !== Math.floor(value)) {
			lengthFract = 2;
			// приведение к мантиссе, если модуль числа слишком маленький
			if (Math.abs(value) < 0.1) {
				while (Math.abs(value) < 1) {
					degree--;
					value *= 10;
				}
			}
		}

		// приведение к мантиссе, если модуль числа слишком большой
		if (Math.abs(value) > Math.pow(10, lengthInt - lengthFract) || degree < 0) {
			while (Math.abs(value) >= 10) {
				degree++;
				value /= 10;
			}
		}

		if (degree == 0) {
			screenEl.innerHTML = value.toString().substr(0, countDigital + 1);
		} else {
			screenEl.innerHTML = Math.round(value) + "E" + degree;
		}
	}
};


// Общие функции

var appendNumberToArgument = function (num, calcArg) {
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
	// выбрана цифра -> добавить к первому аргументу
	this.appendNum = function (num) {
		appendNumberToArgument(num, "firstArg");
	};

	// выбрана операция -> перейти в OperationState
	this.setOperation = function (operation) {
		changeState(new OperationState(operation));
	};
}

// Ввод второго аргумента
function SecondArgState() {
	// выбрана цифра -> добавить ко второму аргументу
	this.appendNum = function (num) {
		appendNumberToArgument(num, "secondArg");
	};

	// выбрана операция -> вычислить и перейти в OperationState
	this.setOperation = function (operation) {
		computeNum();
		changeState(new OperationState(operation));
	};
}

// Введена операция
function OperationState(operation) {
	calcValues.operation = operation;

	//выбрана цифра -> перейти в SecondArgState и добавить цифру ко второму аргументу
	this.appendNum = function (num) {
		changeState(new SecondArgState());
		currentState.appendNum(num);
	};

	// выбрана операция -> сменить операцию
	this.setOperation = function (operation) {
		calcValues.operation = operation;
	};
}

// Результат
function ResultState() {
	// выбрана цифра -> сбросить калькулятор и добавить цифру к первому аргументу
	this.appendNum = function (num) {
		resetCalc();
		currentState.appendNum(num);
	};

	// выбрана операция -> перейти в OperationState
	this.setOperation = function (operation) {
		changeState(new OperationState(operation));
	};
}

// Смена состояния
function changeState(newState) {
	currentState = newState;
}
