function main() {
	'use strict';

	const $ = document.querySelector.bind(document);

	const $app = $('.js-app');

	const templates = {

		calculatorButton: $(`[data-template="calculatorbutton"]`).innerHTML

	};

	const ACTION_CLEAR           = 'clear';
	const ACTION_CLEAR_ENTRY     = 'clearEntry';
	const ACTION_NEGATE          = 'negate';
	const ACTION_UPDATE_OPERATOR = 'updateOperator';
	const ACTION_APPEND_OPERAND  = 'appendOperand';
	const ACTION_ADD_PAREN       = 'addParen';
	const ACTION_BACKSPACE       = 'backspace';
	const ACTION_SHOW_TOTAL      = 'showTotal';

	const buttons = [
		{
			text: 'C',
			className: 'clear',
			action: ACTION_CLEAR
		},
		{
			text: '+/-',
			className: 'negation',
			action: ACTION_NEGATE
		},
		{
			text: '%',
			className: 'modulo',
			action: ACTION_UPDATE_OPERATOR,
			payload: {
				operator: '%',
			}
		},
		{
			text: '√',
			className: 'square',
			action: ACTION_UPDATE_OPERATOR,
			payload: {
				operator: 'yroot',
			}
		},


		{
			text: '7',
			action: ACTION_APPEND_OPERAND,
			payload: {
				value: '7',
			}
		},
		{
			text: '8',
			action: ACTION_APPEND_OPERAND,
			payload: {
				value: '8',
			}
		},
		{
			text: '9',
			action: ACTION_APPEND_OPERAND,
			payload: {
				value: '9',
			}
		},
		{
			text: '/',
			className: 'division',
			action: ACTION_UPDATE_OPERATOR,
			payload: {
				operator: '/',
			}
		},


		{
			text: '4',
			action: ACTION_APPEND_OPERAND,
			payload: {
				value: '4',
			}
		},
		{
			text: '5',
			action: ACTION_APPEND_OPERAND,
			payload: {
				value: '5',
			}
		},
		{
			text: '6',
			action: ACTION_APPEND_OPERAND,
			payload: {
				value: '6',
			}
		},
		{
			text: '',
			className: 'multiplication',
			icon: 'ion-ios-close-empty',
			action: ACTION_UPDATE_OPERATOR,
			payload: {
				operator: '*',
			}
		},


		{
			text: '1',
			action: ACTION_APPEND_OPERAND,
			payload: {
				value: '1',
			}
		},
		{
			text: '2',
			action: ACTION_APPEND_OPERAND,
			payload: {
				value: '2',
			}
		},
		{
			text: '3',
			action: ACTION_APPEND_OPERAND,
			payload: {
				value: '3',
			}
		},
		{
			text: '',
			className: 'subtraction',
			icon: 'ion-ios-minus-empty',
			action: ACTION_UPDATE_OPERATOR,
			payload: {
				operator: '-',
			}
		},


		{
			text: '0',
			action: ACTION_APPEND_OPERAND,
			payload: {
				value: '0',
			}
		},
		{
			className: 'paren',
			children: [
				{
					text: '(', className: 'open-paren',
					action: ACTION_ADD_PAREN,
					payload: {
						operator: '(',
					}
				},
				{
					text: ')', className: 'close-paren',
					action: ACTION_ADD_PAREN,
					payload: {
						operator: ')',
					}
				}
			]
		},
		{
			text: '.',
			action: ACTION_APPEND_OPERAND,
			payload: {
				value: '.',
			}
		},
		{
			text: '',
			className: 'addition',
			icon: 'ion-ios-plus-empty',
			action: ACTION_UPDATE_OPERATOR,
			payload: {
				operator: '+',
			}
		}
	];


	// Mode show total causes the total to be displayed in the current operand display
	const MODE_SHOW_TOTAL     = 1 << 1;
	// Mode insert operand causes the current operand to be overwritten. After the first character has been written, the mode should go to mode append operand
	const MODE_INSERT_OPERAND = 1 << 2;
	// Mode append operand causes any operand parts to be appended to the current operand
	const MODE_APPEND_OPERAND = 1 << 3;


	// The maximum number of digits the current operand may be
	const MAX_NUMBER_LENGTH = Number.MAX_SAFE_INTEGER.toString().length;


	const initialState = {

		activeButtons: [],

		buttons,

		expressions: ['5', '+', '7', '-', '45', '+', '3', '+', '177', '-'],

		currentOperand: '147',

		currentOperator: '-',

		mode: MODE_SHOW_TOTAL|MODE_INSERT_OPERAND,

		openParenStack: 0,

		error: null,

		total: 147,

	};

	const mutations = {

		CLEAR(state) {
			state.expressions = [];
			state.currentOperand = '0';
			state.currentOperator = '';
			state.openParenStack = 0;
			state.mode = MODE_SHOW_TOTAL|MODE_INSERT_OPERAND;
			state.error = null;
			state.total = 0;
		},

		BACKSPACE(state) {
			let operand = state.currentOperand.slice(0, -1);

			if (operand.length === 0) {
				operand = '0';
			}

			state.currentOperand = operand;
		},

		CLEAR_ENTRY(state) {
			state.currentOperand = '0';
		},

		NEGATE(state) {
			// Only add negative sign if not zero
			if (state.currentOperand !== 0) {
				state.currentOperand = (-state.currentOperand).toString();
			}
		},

		UPDATE_OPERATOR(state, { operator }) {
			const length = state.expressions.length;
			const last = state.expressions[length - 1] || '';
			const { mode, currentOperand } = state;

			if (mode & MODE_INSERT_OPERAND) {
				console.log('MODE_INSERT_OPERAND');

				if (length === 0) {
					state.expressions.push(currentOperand, operator);
				} else if (isOperator(last)) {
					// console.log('isoplast');                            // APPEND_OP LOG
					state.expressions.pop();
					state.expressions.push(operator);
				} else if (last === ')') {
					// console.log('nope');                                // APPEND_OP LOG
					state.expressions.push(operator);
				} else if (last === '(') {
					state.expressions.push(currentOperand, operator);
				} else {
					// console.log('else');                                // APPEND_OP LOG
				}
			} else if (mode & MODE_APPEND_OPERAND) {
				console.log('MODE_APPEND_OPERAND');

				if (length === 0) {
					console.log('length 0');                            // APPEND_OP LOG
					state.expressions.push(currentOperand, operator);
				} else if (isOperator(last)) {
					// console.log('isOperator(last)');                    // APPEND_OP LOG
					state.expressions.push(currentOperand, operator);
				} else if (last === ')') {
					// console.log('last === )');                          // APPEND_OP LOG
					state.expressions.push(operator);
				} else if (last === '(') {
					// console.log('last === (');                          // APPEND_OP LOG
					state.expressions.push(currentOperand, operator);
				} else {
					// console.log('else');
					// state.expressions.push(operator, currentOperand);
				}
			}

			state.currentOperator = operator;
			state.mode = MODE_INSERT_OPERAND|MODE_SHOW_TOTAL;

			console.log('UPDATE_OPERATOR:', state.expressions);
		},

		ADD_PAREN(state, { operator }) {
			const last = state.expressions[state.expressions.length - 1] || '';
			const { currentOperand, openParenStack } = state;

			// console.log('ADD_PAREN:', {last, operator});

			if (operator === ')' && openParenStack === 0) {
				// No need to add closing paren if there is no open paren
				return;
			} else if (operator === '(' && last === ')') {
				// FIXME: Look at real calculator for semantics
				return;
			}

			if (last === '(' && operator === ')') {
				// Handle immediate closed parens
				state.expressions.push(currentOperand, operator);
			} else if (isOperator(last) && operator === ')') {
				// Automatically append current operand when expressions
				// is "(5 *" so result is "(5 * 5)"
				state.expressions.push(currentOperand, operator);
			} else if ((isOperator(last) || length === 0) && operator === '(') {
				// Handle "5 *" where the result is "5 * (" and "(" is the beginning
				// of a new group expression
				state.expressions.push(operator);
			}

			if (operator === '(') {
				state.openParenStack++;
			} else if (operator === ')') {
				state.openParenStack--;
			}

			console.log('ADD_PAREN');
		},

		APPEND_OPERAND(state, { value, operator }) {
			const currentOperand = state.currentOperand;
			let newOperand = currentOperand;
			let newMode;

			// Don't append 0 to 0
			if (value === '0' && currentOperand[0] === '0') {
				return;
			} else if (value === '.' && currentOperand.includes('.')) {
				// Avoid appending multiple decimals
				return;
			}

			// Switch modes from showing the total to the current operand
			if (state.mode & MODE_SHOW_TOTAL) {
				newMode = MODE_INSERT_OPERAND;
			}

			if (state.mode & MODE_INSERT_OPERAND) {
				// console.log('INSERT');
				newOperand = value.toString();
				state.mode = MODE_APPEND_OPERAND;
			} else {
				// console.log('APPEND');
				newOperand += value.toString();
			}

			// TODO: Update font size, actually should do that in the vm
			state.currentOperand = newOperand.substring(0, MAX_NUMBER_LENGTH);
		},

		SHOW_TOTAL(state, { $commit, explicit }={}) {
			const last             = state.expressions[state.expressions.length - 1] || '';
			const expressions      = state.expressions.slice(0);
			const currentOperand   = state.currentOperand;
			const mode             = state.mode;
			const currentTotal     = state.total;
			const openParenStack   = state.openParenStack;
			const isFirstNumber    = typeof Number(expressions[0]) === 'number';
			const isSecondOperator = isOperator(expressions[1] || '');
			const length           = expressions.length;
			let times              = openParenStack;
			let total;

			if (expressions.length === 0) {
				return;
			}
			else if (explicit && isFirstNumber && isSecondOperator && length === 2) {
				// Handle case where expressions is 5 *

				// console.log('explicit && isFirstNumber && isSecondOperator');
				expressions.push(currentOperand);
			}
			else if (explicit && isOperator(last)) {
				// Handle case where expressions is ['5', '*', '4', '+'] and
				// the total is being explicitly being requested

				// console.log('explicit && isOperator(last)', isOperator(last), last);
				if (mode & MODE_INSERT_OPERAND) {
					expressions.push(currentTotal);
				} else if (mode & MODE_APPEND_OPERAND) {
					expressions.push(currentOperand);
				}
			}
			else if (isOperator(last)) {
				// Handle case where expressions is ['5', '*', '4', '+']

				// console.log('isOperator(last)');
				expressions.pop();
			}

			if (explicit) {
				// Automatically close parens when explicitly requesting
				// the total
				let times = openParenStack;

				while (times-- > 0) {
					expressions.push(')');
				}
			} else if ( ! explicit && openParenStack === 1) {
				// Auto close if there is only one missing paren
				expressions.push(')');
			}

			try {
				total = MathParser.eval(expressions.join(' '));

				if (explicit) {
					$commit('CLEAR');
				}

				state.total = total;
			} catch (err) {
				if (explicit) {
					$commit('CLEAR');
					state.error = err;
					console.log(err);
				}
			}

			console.log(
				'SHOW_TOTAL; Expressions: "%s"; Total: %s; Explicit: %s',
					expressions.join(' '),
					total,
					!! explicit);
		}

	};

	const actions = {

		clear({ commit }) {
			commit('CLEAR');
			console.log('');
		},

		backspace({ commit }) {
			commit('BACKSPACE');
			console.log('');
		},

		clearEntry({ commit }) {
			commit('CLEAR_ENTRY');
			console.log('');
		},

		negate({ commit }) {
			commit('NEGATE');
			console.log('');
		},

		updateOperator({ commit }, payload) {
			commit('UPDATE_OPERATOR', payload);
			commit('SHOW_TOTAL', {
				...payload,
				$commit: commit,
			});
			console.log('');
		},

		appendOperand({ commit }, payload) {
			commit('APPEND_OPERAND', payload);
			commit('SHOW_TOTAL', {
				...payload,
				$commit: commit,
			});
			console.log('');
		},

		showTotal({ commit }, payload) {
			// FIXME: Probably not supposed to pass commit, but idk
			//        how else to do it
			commit('SHOW_TOTAL', {
				...payload,
				$commit: commit,
			});
			console.log('');
		},

		addParen({ commit }, payload) {
			commit('ADD_PAREN', payload);
			commit('SHOW_TOTAL', {
				...payload,
				$commit: commit,
			});
			console.log('');
		}

	};

	const store = window.store = new Vuex.Store({

		state: initialState,

		actions,

		mutations,

	});


	Vue.component('calculatorbutton', {

		props: ['button'],

		template: templates.calculatorButton,

		computed: {

			className() {
				const button = this.button;
				let className = '';

				if (button.children) {
					className += ' has-children ';
				}

				if (button.className) {
					className += ` Calculator-button--${button.className} `;
				}

				return className;
			}

		},

		methods: {

			emitAction($event, button) {
				this.$store.dispatch(button.action, button.payload);
			}

		}

	});


	// [...document.querySelectorAll('.btest')].forEach(item => {
	// 	item.addEventListener('click', () => {
	// 		console.log('btest');
	// 	});
	// })

	const app = new Vue({

		el: $app,

		store,

		mounted() {
			setTimeout(() => this.appLoaded = true, 100)
		},

		data: {

			console,

			appLoaded: false,

		},

		computed: {

			...Vuex.mapState([
				'buttons',
				'expressions',
				'currentOperand',
				'currentOperator',
				'openParenStack',
				'total',
				'error',
				'mode'
			]),

			operand() {
				let operand;

				if (this.error) {
					return 'Error';
				}

				console.log('Flags:', getFlags(this.mode));

				if (this.mode & MODE_SHOW_TOTAL) {
					operand = this.total.toString();
					console.log('DISPLAY_TOTAL', this.total.toString());
				} else {
					operand = this.currentOperand;
					console.log('DISPLAY_CURRENT', this.currentOperand);
				}

				return operand;
			},

			expressionList() {
				return this.expressions.map((str, index, array) => {
					const s = str.trim();

					if (array[index -1] === '(') {
						return s;
					} else if (s === ')') {
						return s
					} else if (s[0] === '-' && isNumberPart(s[1])) {
						return ' ' + str;
					} else {
						return ' ' + s;
					}

					return str;
				})
				.join('');
			},

			font() {
				let length;

				if (this.mode & MODE_SHOW_TOTAL) {
					length = this.total.toString().length;
				} else {
					length = this.currentOperand.toString().length;
				}

				let size;
				let weight;

				if (length < 8) {
					size = '60px';
					weight = '200';
				} else if (length <= MAX_NUMBER_LENGTH) {
					size = '28px';
					weight = '300';
				} else if (length >= MAX_NUMBER_LENGTH) {
					size = '24px';
					weight = '300';
				}

				return { size, weight };

			},

		}

	});

	const Key = {
		Backspace:       8,
		Delete:         46,
		Enter:          13,
		Escape:         27,

		Multiply:      106,
		Add:           107,
		Subtract:      109,
		Decimal:       110,
		Divide:        111,

		Equals:        187,
		Dash:          189,
		ForwardSlash:  191,

		0:             48,
		1:             49,
		2:             50,
		3:             51,
		4:             52,
		5:             53,
		6:             54,
		7:             55,
		8:             56,
		9:             57,

		Numpad0:       96,
		Numpad1:       97,
		Numpad2:       98,
		Numpad3:       99,
		Numpad4:      100,
		Numpad5:      101,
		Numpad6:      102,
		Numpad7:      103,
		Numpad8:      104,
		Numpad9:      105,
	};

	const KeyTranslate = {
		48:  '0',
		49:  '1',
		50:  '2',
		51:  '3',
		52:  '4',
		53:  '5',
		54:  '6',
		55:  '7',
		56:  '8',
		57:  '9',

		96:  '0',
		97:  '1',
		98:  '2',
		99:  '3',
		100: '4',
		101: '5',
		102: '6',
		103: '7',
		104: '8',
		105: '9',

		106: '*',
		107: '+',
		109: '-',
		111: '/',

		189: '-',
		191: '/',
	};

	const OperatorKeys = [Key.Multiply, Key.Add, Key.Subtract, Key.Divide];

	window.addEventListener('keydown', function onWindowKeydown(e) {
		const { keyCode: key,
				ctrlKey,
				shiftKey } = e;

		// console.log(key, e.key, e.which);

		if (shiftKey && key === Key['9']) {
			store.dispatch(ACTION_ADD_PAREN, {
				operator: '('
			});
		}
		else if (shiftKey && key === Key['0']) {
			store.dispatch(ACTION_ADD_PAREN, {
				operator: ')'
			});
		}
		else if (shiftKey && key === Key['8']) {
			store.dispatch(ACTION_UPDATE_OPERATOR, {
				operator: '*'
			});
		}
		else if (shiftKey && key === Key.Equals) {
			store.dispatch(ACTION_UPDATE_OPERATOR, {
				operator: '+'
			});
		}
		else if (key === Key.Dash) {
			store.dispatch(ACTION_UPDATE_OPERATOR, {
				operator: '-'
			});
		}
		else if ((key >= 48 && key <= 57) || (key >= 96 && key <= 105)) {
			store.dispatch(ACTION_APPEND_OPERAND, {
				value: KeyTranslate[key]
			});
		}
		else if (key === Key.Decimal) {
			store.dispatch(ACTION_APPEND_OPERAND, {
				value: '.'
			});
		}
		else if ([Key.Multiply, Key.Add, Key.Subtract, Key.Divide].includes(key)) {
			store.dispatch(ACTION_UPDATE_OPERATOR, {
				operator: KeyTranslate[key]
			});
		}
		else if (key === Key.Backspace) {
			store.dispatch(ACTION_BACKSPACE);
			return e.preventDefault();
		}
		else if (key === Key.Delete) {
			store.dispatch(ACTION_CLEAR_ENTRY);
			return e.preventDefault();
		}
		else if (key === Key.Enter) {
			store.dispatch(ACTION_SHOW_TOTAL, {
				explicit: true
			});
			return e.preventDefault();
		}
		else if (key === Key.Escape) {
			store.dispatch(ACTION_CLEAR);
			return e.preventDefault();
		}
	});

	// Debug function for flags
	function getFlags(flags) {
		let arr = [];

		if (flags & MODE_SHOW_TOTAL) {
			arr.push('MODE_SHOW_TOTAL');
		}
		if (flags & MODE_INSERT_OPERAND) {
			arr.push('MODE_INSERT_OPERAND');
		}

		if (flags & MODE_APPEND_OPERAND) {
			arr.push('MODE_APPEND_OPERAND');
		}

		return arr.join('|');
	}
};


// TODO NEXT:
function getTotal(cb) {
	try {
		const total = MathParser.eval(this.expressions.join(''));
		return cb(null, total);
	} catch (err) {
		cb(err);
		console.log(err);
	}
}

function isNumberPart(str) {
	return (/^[0-9.]/).test(str);
}

setTimeout(main, 100);


// Have to mock commonjs because this was developed in node

const { MathParser, isOperator, operators } = (function (module) {
var exports = module.exports;

'use strict';

const Token = exports.Token = {
	NumericLiteral: 'NumericLiteral',
	Punctuator: 'Punctuator'
};

/**
 * Regex for numeric decimal literal constructed from ECMAScript spec
 */

const RE_NUMERIC_LITERAL = exports.RE_NUMERIC_LITERAL =
	/^(?:(?:0x[0-9a-fA-F]+|0X[0-9a-fA-F]+)|(?:0[oO][0-7]+)|(?:0[bB][01]+)|(?:(?:0|[1-9](?:[0-9]+)?)\.(?:[0-9]+)?|\.[0-9]+|(?:0|[1-9](?:[0-9]+)?))(?:[eE](?:[-+][0-9]+))?)/;

const operators =
	exports.operators = ['/', '*', '**', '-', '+', 'yroot', '%'];

const punctuation =
	exports.punctuation = ['(', ')', ...operators];

// All the operators, sorted by longest string length
const RE_PUNCTUATION = exports.RE_PUNCTUATION =
	new RegExp(
		'^(?:'
		+ punctuation.slice(0)
			.sort((a, b) => b.length - a.length)
			.map(str => escapeRegExp(str))
			.join('|')

		+ ')'
	);

const isOperator =
	exports.isOperator = (str) => operators.includes(str);

/**
 * Courtesy of
 * http://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex
 */

function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

function isWhitespace(str) {
	return /^\s$/.test(str);
}

/**
 * A Lexer
 * @param {String} data
 * @param {Object} options
 */

const Lexer = exports.Lexer = class Lexer {

	constructor(data, options) {
		let source = data;

		if (source.charAt(0) === '\uFEFF') {
			source = source.slice(1);
		}

		source = source.replace(/\r\n|[\n\r]/g, '\n');

		this.source        = source;
		this.input         = source;
		this.position      = 0;
		this.stash         = [];
		this.column        = 0;
		this.line          = 1;
	}

	static all(data, options) {
		const lexer = new Lexer(data, options);
		const tokens = [];
		let token;

		while (token = lexer.nextToken()) {
			tokens.push(token);
		}

		return tokens;
	}

	lex() {
		const token =
			null
			|| this.getPunctuationToken()
			|| this.getNumericToken()

		if (token == null) {
			this.error(`Unexpected token at (${this.position})`);
			// this.error(`Unexpected token (${this.line}:${this.column})`);
		}

		return token;
	}

	forward(index) {
		this.position += index;
		this.input = this.input.substring(index, this.source.length);
	}

	getPunctuationToken() {
		const position = this.position;
		const match = this.input.match(RE_PUNCTUATION);

		if (match) {
			this.forward(match[0].length);

			return {
				type: Token.Punctuator,
				value: match[0],
				start: position,
				end: this.position
			};
		}

		return null;
	}

	getNumericToken() {
		const position = this.position;
		const match = this.input.match(RE_NUMERIC_LITERAL);

		if (match) {
			this.forward(match[0].length);

			return {
				type: Token.NumericLiteral,
				raw: match[0],
				value: Number(match[0]),
				start: position,
				end: this.position
			};
		}

		return null;
	}

	hasEnded() {
		return this.input.length === 0;
	}

	skipWhitespace() {
		let position = this.position;
		let times = 0;
		let char;

		while (position < this.source.length) {
			char = this.input[times];

			if (isWhitespace(char)) {
				position++;
				times++;

				if (char === '\n') {
					this.line++;
					this.column = 0;
				}
			} else {
				break;
			}
		}

		this.position = position;
		this.input = this.input.substring(times, this.source.length);
	}

	/**
	 * Returns the next token without consuming the token or null if no
	 * tokens can be found.
	 *
	 * @return {Object|null}
	 */

	peek() {
		return this.lookahead(1);
	}

	/**
	 * Returns the token at `index` or `null` if there are no more tokens.
	 *
	 * @param  {Number} index - The number of tokens to look ahead
	 * @return {Object|null}
	 */

	lookahead(index) {
		const { stash } = this;
		let times = index - stash.length;
		let token;

		if (index < 0) {
			this.error('Lookahead index can not be less than 0');
		}

		if (stash[index - 1] !== undefined) {
			return stash[index - 1];
		}

		while (times-- > 0) {
			this.skipWhitespace();

			if (this.hasEnded()) {
				break;
			}

			token = this.lex();

			if (token) {
				stash.push(token);
			}
		}

		return stash[index - 1] || null;
	}

	nextToken() {
		if (this.stash.length) {
			return this.stash.shift();
		} else if (this.hasEnded()) {
			return null;
		}

		this.skipWhitespace();

		if (this.hasEnded()) {
			return null;
		}

		return this.lex();
	}

	error(message) {
		const err = new Error(message);
		throw err;
	}

};

const Parser = exports.Parser = class Parser {

	constructor(data, options) {
		this.lexer = new Lexer(data, options);
	}

	peek() {
		return this.lexer.peek();
	}

	next() {
		return this.lexer.nextToken();
	}

	error(message) {
		const err = new Error(message);
		throw err;
	}

	parsePrimary() {
		let token = this.peek();
		let expression;

		if (token == null) {
			this.error('Unexpected end of input');
		}

		if (token.value === '(') {
			token = this.next();
			expression = this.parseExpression();
			token = this.next();

			if (token == null) {
				this.error(`Unexpected end of input`);
			} else if (token.value !== ')') {
				this.error(`Unexpected token ${token.value}`);
			}

			return expression;
		} else if (token.type === Token.NumericLiteral) {
			token = this.next();
			return new Literal(token.raw, token.value);
		}

		this.error(`Unexpected token "${token.value}"`);
	}

	parseUnary() {
		let token = this.peek();

		if (token && (token.value === '-' || token.value === '+')) {
			token = this.next();

			return new UnaryExpression(token.value, this.parseUnary());
		}

		return this.parsePrimary();
	}

	// I'm not sure what these pow and nth square root operators are classified as
	parsePowAndSquare() {
		let expression = this.parseUnary();
		let token = this.peek();

		if (token == null) {
			return expression;
		}

		while (token && (token.value === '**' || token.value == 'yroot')) {
			token = this.next();

			const operator = token.value;
			const left = expression;
			const right = this.parseUnary();

			expression = new BinaryExpression(operator, left, right);

			token = this.peek();
		}

		return expression;
	}

	parseMultiplicative() {
		let expression = this.parsePowAndSquare();
		let token = this.peek();

		if (token == null) {
			return expression;
		}

		while (token && (token.value === '*' || token.value == '/' || token.value === '%')) {
			token = this.next();

			const operator = token.value;
			const left = expression;
			const right = this.parsePowAndSquare();

			expression = new BinaryExpression(operator, left, right);
			token = this.peek();
		}

		return expression;
	}

	parseAdditive() {
		let expression = this.parseMultiplicative();
		let token = this.peek();

		while (token && (token.value === '+' || token.value === '-')) {
			token = this.next();

			const operator = token.value;
			const left = expression;
			const right = this.parseMultiplicative();

			expression = new BinaryExpression(operator, left, right, token.start, token.end);
			token = this.peek();
		}

		return expression;
	}

	parseExpression() {
		return this.parseAdditive();
	}

	parse() {
		return this.parseExpression();
	}

}

class UnaryExpression {

	constructor(operator, expression) {
		this.type = 'UnaryExpression';
		this.operator = operator;
		this.expression = expression;
	}

}

class BinaryExpression {

	constructor(op, left, right, start, end) {
		this.type = 'BinaryExpression';
		this.operator = op;
		this.left = left;
		this.right = right;
		this.start = start;
		this.end = end;
	}

}

class Literal {

	constructor(raw, value) {
		this.type = 'Literal';
		this.raw = raw;
		this.value = value;
	}

}

const operations = {
	'+': (a, b) => a + b,
	'-': (a, b) => a - b,
	'*': (a, b) => a * b,
	'/': (a, b) => a / b,
	'%': (a, b) => a % b,
	'**': (a, b) => Math.pow(a, b),
	// NOTE: Apparently this is a naive implementation of nth root
	// http://stackoverflow.com/questions/7308627/javascript-calculate-the-nth-root-of-a-number
	'yroot': (a, b) => Math.pow(a, 1 / b),
};

/**
 * Evaluates the AST produced from the parser and returns its result
 * @return {Number}
 */

const evaluateAST = exports.evaluateAST = (node) => {
	let a;

	switch (node.type) {
		case 'Expression':
			return evaluateAST(node.expression);
		case 'Literal':
			return parseFloat(node.value);
		case 'UnaryExpression':
			a = evaluateAST(node.expression);

			switch (node.operator) {
				case '+':
					return +a;
				case '-':
					return -a;
				default:
					throw new Error(`Parsing error: Unrecognized unary operator "${node.operator}"`);
			}
		case 'BinaryExpression':
			const { left, right, operator } = node;
			const operation = operations[operator];

			if (operation === undefined) {
				throw new Error('Unsupported operand');
			}

			return operation(evaluateAST(left), evaluateAST(right));
		default:
			throw new Error(`Parsing error: Unrecognized node type "${node.type}"`);
	}
};

/**
 * Evaluates the expression passed and returns its result.
 *
 * @param {String} expression - The expression to evaluate
 * @return {Number}
 */

const MathParser = exports.MathParser = {

	eval(expression) {
		const ast = new Parser(expression).parse();

		return evaluateAST(ast);
	}

}


if (typeof window === 'object' && window) {
	window.MathParser = MathParser;

	window.e = function () {
		return MathParser.eval(...arguments);
	};

	window.parse = function () {
		return Parser.parse(...arguments);
	};

	window.lex = function () {
		return Lexer.all(...arguments);
	};
}

return module.exports;
}({ exports: {} }));
