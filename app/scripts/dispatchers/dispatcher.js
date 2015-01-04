var Promise = require('es6-promise').Promise;
var merge = require('react/lib/merge');

var _callbacks = [];
var _promises = [];

/**
 * Add a promise to the queue of callback invocation promises.
 * @param {function} callback The Store's registered callback.
 * @param {object} payload The data from the Action.
 * @returns {void}
 */
var _addPromise = function (callback, payload) {
	_promises.push(new Promise(function (resolve, reject) {
		if (callback(payload)) {
			resolve(payload);
		}
		else {
			reject(new Error('Dispatcher callback unsuccessful'));
		}
	}));
};

/**
 * Empty the queue of callback invocation promises.
 * @returns {void}
 */
var _clearPromises = function () {
	_promises = [];
};

var Dispatcher = function () {};
Dispatcher.prototype = merge(Dispatcher.prototype, {

	/**
	 * Register a Store's callback so that it may be invoked by an action.
	 * @param {function} callback The callback to be registered.
	 * @returns {number} The index of the callback within the _callbacks array.
	 */
	register: function (callback) {
		_callbacks.push(callback);
		return _callbacks.length - 1; // index
	},

	/**
	 * dispatch
	 * @param  {object} payload The data from the action.
	 * @returns {void}
	 */
	dispatch: function (payload) {
		_callbacks.forEach(function (callback) {
			_addPromise(callback, payload);
		});
		Promise.all(_promises).then(_clearPromises);
	}

});

module.exports = Dispatcher;
