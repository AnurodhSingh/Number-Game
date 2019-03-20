import React, { Component } from 'react';
import {
	Platform,
	NetInfo
} from 'react-native';
import * as CONST from './Const';
import DeviceInfo from 'react-native-device-info';
import * as RNIap from 'react-native-iap';
import moment from 'moment';

class Validators {
	static validEmail(email) {
		var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(email);
	}

	static validPassword(password) {
		if (password.length < 5) {
			return false;
		}
		return true;
	}

	static validPhoneNumber(number) {
		var re = /^(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/gm;
		if (!re.test(number)) {
			return false;
		}
		return true;
	}

	static validMobileNumber(number) {
		if (number.length != 10) {
			return true;
		}
		return false;
	}

	static isEmpty(name) {
		if (name && name.trim() != '') {
			return false;
		}
		return true;
	}

	static onlyAlphabets(value) {
		let flag = /[^0-9\s]|^\S+$]/;
		return flag.test(value);
	}
	static isNetworkConnected() {
		if (Platform.OS === 'ios') {
			return new Promise(resolve => {
				const handleFirstConnectivityChangeIOS = isConnected => {
					NetInfo.isConnected.removeEventListener(
						'change',
						handleFirstConnectivityChangeIOS
					);
					resolve(isConnected);
				};
				NetInfo.isConnected.addEventListener(
					'change',
					handleFirstConnectivityChangeIOS
				);
			});
		}

		return NetInfo.isConnected.fetch().then(isConnected => { return isConnected; });
	}
	static async restoreAccount(all_plans) {
		let data = null;
		try {
			await RNIap.initConnection();
			const purchases = await RNIap.getAvailablePurchases();
			let restoredTitles = '';
			purchases.forEach(purchase => {
				all_plans.map(item => {
					let productId = Platform.OS == 'ios' ? item.itunes_id : item.play_store_id;
					if (purchase.productId == productId) {
						restoredTitles = item.title;
						data = {
							udid: DeviceInfo.getUniqueID(),
							transaction_receipt: purchase.transactionReceipt,
							transaction_date: purchase.originalTransactionDateIOS ? purchase.originalTransactionDateIOS : purchase.transactionDate,
							product_id: purchase.productId,
							transaction_identifier: purchase.originalTransactionIdentifierIOS ? purchase.originalTransactionIdentifierIOS : purchase.transactionId,
							subscription_type: CONST.RESTORE,
							restoredTitles
						};
					}
				});

			})
			RNIap.endConnection();
			return data;
		} catch (error) {
			RNIap.endConnection();
			console.log('## restoreAccount error ', error); // standardized err.code and err.message available
			return data;
		}
	}

	static dateFormatter(date) {
		if(date && date!='') {
			return moment(date).format('l')
		}
		else {
			return '';
		}
	}
	static getTwoInitials(stringVal) {
		return stringVal.split(' ').map((n)=>n[0]).join('').substring(0,2).toUpperCase();
	}
	static timeFormatter(timeInSeconds) {
		let d = Number(timeInSeconds);
		let h = Math.floor(d / 3600);
		let m = Math.floor(d % 3600 / 60);
		let s = Math.floor(d % 3600 % 60);

		let hDisplay = h > 0 ? h + (':') : '';
		let mDisplay = m > 0 ? m + (':') : '00:';
		let sDisplay = s >= 0 ? ( s<10 ? '0' + s : s ) : '';

		return (hDisplay + mDisplay + sDisplay);
	}
	static timeFormatDescriptive(time) {
		let d = Number(time);
		let h = Math.floor(d / 3600);
		let m = Math.floor(d % 3600 / 60);

		let hDisplay = h > 0 ? h + (' Hour ') : '';
		let mDisplay = m > 0 ? m + (' Min') : '';
		return (hDisplay + mDisplay);
	}
	static decrypt(cipher_text){
        var Base64={_keyStr:'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',encode:function(e){var t='';var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64;}else if(isNaN(i)){a=64;}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a);}return t;},decode:function(e){var t='';var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9+/=]/g,'');while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r);}if(a!=64){t=t+String.fromCharCode(i);}}t=Base64._utf8_decode(t);return t;},_utf8_encode:function(e){e=e.replace(/rn/g,'n');var t='';for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128);}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128);}}return t;},_utf8_decode:function(e){var t='';var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++;}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2;}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3;}}return t;}};
        var characters = [' ', '!', '"', '#', '$', '%', '&', '\'', '(', ')', '*', '+', ',', '-', '.',
            '/', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ':', ';', '<', '=',
            '>', '?', '@', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
            'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '[',
            '\\', ']', '^', '_', '`', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
            'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
        var CustomEncDec = {
            encrypt:function(plain_text, key){
                var cipher_text = '';
                for (var i = 0; i < plain_text.length; ++i) {
                    var x = plain_text[i];
                    if(characters.includes(x)) {
                        cipher_text += characters[(characters.indexOf(x) + CustomEncDec.shiftBy(key)) % 91];
                    } else {
                        cipher_text += x;
                    }
                }
                return Base64.encode(cipher_text);
            },
            decrypt:function(cipher_text, key){
                cipher_text = Base64.decode(cipher_text);
                var plain_text = '';
                for (var i = 0; i < cipher_text.length; ++i) {
                    var x = cipher_text[i];
                    if(characters.includes(x)) {
                        plain_text += characters[(characters.indexOf(x) - CustomEncDec.shiftBy(key)+ 91) % 91];
                    } else {
                        plain_text += x;
                    }
                }
                return plain_text;
            },
            shiftBy:function(key){
                let sum = 0;
                for (var i = 0; i < key.length; i++) {
                    sum += key.charCodeAt(i);
                }
                return (sum % 26);
            }
        };
        let plain = CustomEncDec.decrypt(cipher_text, DeviceInfo.getUniqueID());
        return plain;
    }
}
	
export default Validators;
