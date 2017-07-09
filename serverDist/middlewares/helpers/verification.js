"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by andrey on 7/4/16.
 */

var crypto = require('crypto');

var VerificationMethods = function () {
	function VerificationMethods() {
		_classCallCheck(this, VerificationMethods);
	}

	_createClass(VerificationMethods, null, [{
		key: "verifyAppInstance",
		value: function verifyAppInstance(instanceEncoded) {
			var _this = this;

			var secretArray = [{
				"id": "production",
				"secret": "b76d4cab-a7e6-4f4c-ad0b-ed048391fdb4"
			}, {
				"id": "testserver",
				"secret": "7eb8c2a2-cd91-4d2f-aac3-a652230aa127"
			}, {
				"id": "andreyLocal",
				"secret": "7cdaae5f-fd2f-412a-a9e6-c05f56c41fa2"
			}, {
				"id": "denisLocal",
				"secret": "7d69f3b0-e479-4617-8c11-665a05ba4e9e"
			}, {
				"id": "testAccLocal",
				"secret": "331e164d-4424-42e2-9be4-33852b1e1f6d"
			}, {
				"id": "wixTestAccount",
				"secret": "125145c3-0089-45b9-83f7-d468c7009f72"
			}, {
				"id": "dump",
				"secret": "dump"
			}];

			var verified = false;

			secretArray.every(function (secretElement, secretIndex) {
				if (_this.verifyInstance(instanceEncoded, secretElement.secret)) {
					verified = true;
				}

				return !verified;
			});

			/*for (var secretIndex = 0; secretIndex < secretArray.length; secretIndex++) {
   	if (this.verifyInstance(instanceEncoded, secretArray[secretIndex].secret)) {
   		verified = true;
   		break;
   	}
   }*/

			return verified;
		}
	}, {
		key: "decode",
		value: function decode(data, encoding) {
			encoding = encoding === undefined ? 'utf8' : encoding;
			var buf = new Buffer(data.replace(/-/g, '+').replace(/_/g, '/'), 'base64');
			return encoding ? buf.toString(encoding) : buf;
		}
	}, {
		key: "verifyInstance",
		value: function verifyInstance(instance, secret) {
			// spilt the instance into signature and  data

			var pair = instance.split('.');
			if (pair.length > 1) {
				var signature = this.decode(pair[0], 'binary');
				var data = pair[1];
				// sign the data using hmac-sha1-256
				var hmac = crypto.createHmac('sha256', secret);
				var newSignature = hmac.update(data).digest('binary');

				return signature === newSignature;
			} else {
				return false;
			}
		}
	}, {
		key: "getDecodedInstanceJSON",
		value: function getDecodedInstanceJSON(instance) {
			var _pair = instance.split('.');
			var _decodedInstance = this.decode(_pair[1]);

			return JSON.parse(_decodedInstance);
		}
	}, {
		key: "isPremium",
		value: function isPremium(vendorProductId) {
			var _isPremium = false;

			if (vendorProductId === 'Premium-Package') {
				_isPremium = true;
			}

			return _isPremium;
		}
	}, {
		key: "checkBackupDate",
		value: function checkBackupDate(backupDate) {
			var currentTime = Date.now(),
			    monthInMillisec = 2629746000;

			return !(currentTime > backupDate + monthInMillisec);
		}
	}, {
		key: "checkUserId",
		value: function checkUserId(userId) {
			var bannedUsers = [{
				who: 'andreyLocal',
				id: '08712d4c-f160-496a-890a-ecf3fca6c5bb 1'
			}, {
				who: 'testServer',
				id: 'fdaafd0b-99e0-4de8-b1e4-8c6aa5f8da60'
			}];

			var _found = false;

			/*for (var userIndex = 0; userIndex < bannedUsers.length; userIndex++) {
   	if (userId === bannedUsers[userIndex].id) {
   		_found = true;
   		break
   	}
   }*/

			bannedUsers.every(function (bannedElement, bannedIndex) {
				if (userId === bannedElement.id) {
					_found = true;
				}
				return !_found;
			});

			return !_found;
		}
	}, {
		key: "getPremium",
		value: function getPremium(instance) {
			if (this.checkStocking(instance.siteOwnerId)) {
				return true;
			} else {
				return this.isPremium(instance.vendorProductId);
			}
		}
	}, {
		key: "checkStocking",
		value: function checkStocking(userId) {
			var freePremiumUsers = [{
				userId: 'c5c5d8ce-c9a3-4a6a-b6c4-18b522eb7555',
				expireDate: new Date(2020, 11, 26).getTime()
			}, {
				userId: 'fd5da7a8-d6e0-4409-add3-04d20f9a2ff1',
				expireDate: new Date(2025, 1, 8).getTime()
			}, {
				userId: '2ad6abc0-b01b-4632-ae3c-d91ac75cf3de', // Grisha
				expireDate: new Date(2025, 1, 8).getTime()
			}, {
				userId: 'bde8fe4a-a56f-4cca-bcdf-ebcbdc7e9eac', // Grisha
				expireDate: new Date(2017, 4, 6).getTime()
			}];

			var _found = false,
			    freePremium = false;

			freePremiumUsers.every(function (userElement, userElementIndex) {
				if (userId === userElement.userId) {
					_found = true;
					if (new Date().getTime() <= userElement.expireDate) {
						freePremium = true;
					}
				}

				return !_found;
			});

			return freePremium;
		}
	}]);

	return VerificationMethods;
}();

module.exports = VerificationMethods;