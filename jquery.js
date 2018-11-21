/*!
 * jQuery JavaScript Library v2.1.1
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2005, 2014 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2014-05-01T17:11Z
 */
// 整体上来看，是一个有两个函数参数的立即执行函数，第一个参数为全局对象，第二参数为函数
// 将函数作为参数传入，主要是为了判断jQuery在不同平台（AMD和CommonJS）下的加载逻辑
(function( global, factory ) {
    // 不同环境下的加载逻辑
    // CommonJS下，模块标识【module】和模块导出【exports】是CommonJS的基本要素
	if ( typeof module === "object" && typeof module.exports === "object" ) {
		// For CommonJS and CommonJS-like environments where a proper window is present,
		// execute the factory and get jQuery
		// For environments that do not inherently posses a window with a document
		// (such as Node.js), expose a jQuery-making factory as module.exports
		// This accentuates the need for the creation of a real window
		// e.g. var jQuery = require("jquery")(window);
		// See ticket #14549 for more info
		// CommonJS导出模块
		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( "jQuery requires a window with a document" );
				}
				return factory( w );
			};
	} else {
		// 立即执行函数内调用闭包函数，返回的函数就可以调用jQuery内部属性和方法
		factory( global );
	}

// Pass this if window is not defined yet
}(typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

// Can't do this because several apps including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
// Support: Firefox 18+
//
// 采用工厂模式创建对象
var arr = [];

// 变量slice为array的slice函数
var slice = arr.slice;

var concat = arr.concat;

var push = arr.push;

var indexOf = arr.indexOf;

// 声明数据类型对象
var class2type = {};

// 变量toString为对象toString函数
var toString = class2type.toString;

var hasOwn = class2type.hasOwnProperty;

/* jQuery浏览器功能测试*/
var support = {};



var
	// Use the correct document accordingly with window argument (sandbox)
	document = window.document,
    // 版本号
	version = "2.1.1",
    // 声明jQuery函数，该函数返回jQuery
	// Define a local copy of jQuery
	jQuery = function( selector, context ) {//旧构造函数
		/** 使用new运算符创建一个实例对象，该对象包含init的原型、实例对象属性和方法，this指向的新对象。
		    到这里，init对象不包含jQuery的原型对象
		*/
		// The jQuery object is actually just the init constructor 'enhanced'
		// Need init if jQuery is called (just allow error to be thrown if not included)
		return new jQuery.fn.init( selector, context );//新构造函数
	},

	// Support: Android<4.1
	// Make sure we trim BOM and NBSP
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	/* 匹配连接符-和其后第一位为数字或字母*/
	rdashAlpha = /-([\da-z])/gi,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	};

/** 原型属性和方法，降低内存空间，查找快捷。
    jQuery.fn保存jQuery原型对象的属性和方法，并将其赋值给init.prototype
    工具方法模块
*/
jQuery.fn = jQuery.prototype = {

	/*正在使用的jQuery版本号*/
	// The current version of jQuery being used
	jquery: version,

	constructor: jQuery,//强制指向jQuery构造函数，若不设置，this指向的是Object对象
    
    /*记录jQuery查找或过滤DOM元素时的选择器表达式，但不一定是可执行的选择器表达式，更多是为了方便调试*/
	// Start with an empty selector
	selector: "",
    
    /*当前jQuery对象中元素的个数*/
	// The default length of a jQuery object is 0
	length: 0,
    
    /*将当前jQuery对象转换为真正的数组，转换后的数组包含了所有元素，返回DOM元素集合*/
	toArray: function() {
		return slice.call( this );
	},
    
    /* 返回当前jQuery对象中指定位置的元素或包含了全部元素的数组
    */
	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num != null ?
            
            /* 若num不为null，则返回匹配的DOM元素
               若num为负数，则从尾至头返回匹配的DOM元素
               若超出索引范围，则返回undefined
            */
			// Return just the one element from the set
			( num < 0 ? this[ num + this.length ] : this[ num ] ) :
            
            // 若num为null，则返回DOM元素集合
			// Return all the elements in a clean array
			slice.call( this );
	},
    
    /* 从pushStack-end方法均返回jQuery对象或jQuery对象集合
    */

    /* 将DOM数组推入DOM栈内，添加prevObject对象属性，返回jQuery对象
       创建一个新的空jQuery对象，然后把DOM元素集合放入这个jQuery对象中，并保留对当前jQuery对象的引用
    */
	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {
        
        // 生成一个新的jQuery对象，将elems合并到新jQuery对象上
		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );
        
        // 将之前的对象引用给prevObject，只是将prevObject指向之前的对象
		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;
		ret.context = this.context;
        
        // 返回新的jQuery对象
		// Return the newly-formed element set
		return ret;
	},

    // 遍历当前jQuery对象，并在每个元素上执行回调函数
	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},
    
    /* 遍历当前jQuery对象，在每个元素上执行回调函数，并将回调函数的返回值放入一个新jQuery对象中。
       该方法常用于获取或设置DOM元素集合的值；
       该方法通过静态方法jQuery.map和原型方法pushStack实现；

    */
	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},
    
    // 返回元素集合，eq只返回一个元素
	slice: function() {

		/*slice为array的slice函数
		  slice.apply:
		    第一个参数：变更this指向，由原来的arr指向到jQuery对象
            第二个参数：指定项的起始和结束位置，不包括结束位置的项
          jQuery对象和arguments均为类数组对象，jQuery数组保存DOM
          元素集合，arguments保存函数传参。因此，slice.apply(..,..)
          返回DOM元素集合
		*/
		return this.pushStack( slice.apply( this, arguments ) );
	},
    
    // 返回集合中的第一个元素
	first: function() {
		return this.eq( 0 );
	},
    
    // 返回集合中的最后一个元素
	last: function() {
		return this.eq( -1 );
	},
    
    // 返回指定位置的元素，若为负数，则从尾至头返回一个元素
	eq: function( i ) {
		var len = this.length,
		    /* 利用运算符优先级，括号高于加号
		       括号内判断是否负数，若是，则函数传参+jQuery对象数组的长度为索引值，从尾至头返回jQuery对象
		                      若不是，则函数传参即为索引值，从头至尾返回jQuery对象
		    */
			j = +i + ( i < 0 ? len : 0 );
		    // 都会返回jQuery对象
		return this.pushStack( j >= 0 && j < len ? [ this[j] ] : [] );
	},
    
    /** 返回当前DOM对象之前的对象，若无，则返回空对象
        prevObject并不是主动声明的jQuery属性，那它从哪里来呢？
        当我们需要遍历DOM对象时，经常使用find来查找正在处理元素的后代元素，
        那我们来查看find方法的源码（2684行）
        其最根本的在于.pushStack方法新建属性prevObject，保存了之前的jQuery对象
    */
	end: function() {
		return this.prevObject || this.constructor(null);
	},

    /* 仅在jQuery内部使用*/
	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	/* 向当前jQuery对象的末尾添加新元素*/
	push: push,
	/* 对当前jQuery对象中的元素进行排序，可以传入一个比较函数*/
	sort: arr.sort,
	/* 向当前jQuery对象中插入、删除或替换元素，并返回被处理过的数组*/
	splice: arr.splice
};

/* 根据用户的调用方式，this的指向不同，扩展功能挂载的位置不同
   jQuery.extend的this指向jQuery函数（构造函数，也为对象），扩展功能挂载在jQuery函数对象上
   jQuery.fn.extend的this指向fn对象，fn对象和jQuery.prototype指向同一个对象，扩展功能挂载在jQuery实例对象上
   那么，为何提供两种插件接口？
   77行代码声明了一个jQuery函数，函数也是对象，使用了new运算符创建一个init的实例对象，实例对象的[[prototype]]指向的是
   init构造函数的原型，而init构造函数原型与fn对象指向同一个对象，在fn对象定义extend方法，就是在原型上扩展了新方法
   fn与jQuery是两个不同的对象，为了用户方便，在两个对象上分别定义了extend方法
   extend用于合并两个或多个对象的属性到第一个对象，常用于编写插件和处理函数的参数。
*/
jQuery.extend = jQuery.fn.extend = function() {

	/**函数参数数量，决定于调用函数时传参的个数。
       可以利用这个特性，通过arguments，实现函数重载。
       即根据arguments的值不同，进行实现不同的功能。
       options 指向某个源对象
       name 某个源对象的某个属性名
       src 目标对象的某个属性的原始值
       copy 某个源对象的某个属性的值
       copyIsArray 变量copy是否是数组
       clone 深度复制时原始值的修正值
       target 目标对象
       i 源对象的起始下标
       length 参数的个数，用于修正变量target
       deep 是否进行深度合并，
            false时，第一个参数的属性是一个对象或数组，会被第二个或后面的其他参数的同名属性完全覆盖；
            true时，为深度合并，合并过程是递归的
	*/
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;
    /*如果第一个参数是布尔值，则修改deep
      target为第二个参数，i从第三个元素开始
    */
	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;

		// skip the boolean and the target
		target = arguments[ i ] || {};
		i++;
	}
    
    /*如果target不是对象，也不是函数，而是字符串或其他基本类型，则target为空对象*/
	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}
    
    /* 表示期望的源对象没有传入，例如extend(object)/extend(deep,object)
       则target为jQuery对象，并将下标减一
    */
	// extend jQuery itself if only one argument is passed
	if ( i === length ) {
		target = this;
		i--;
	}

    // 遍历对象
	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// 循环遍历options对象
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];
                
                /*避免死循环*/
				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}
                
                /*深度合并，copy是对象或数组时*/
				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					/*数组*/
					if ( copyIsArray ) {
						copyIsArray = false;
						/*若目标对象中存在，且为数组，则返回src
						  反之[]*/
						clone = src && jQuery.isArray(src) ? src : [];
					} else {
						/*若目标对象中存在，且为数组，则返回src
						  反之{}*/
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}
                    
                    /*clone保存目标对象原始值或空数组（空对象）*/
                    /*递归合并到clone，再覆盖目标对象的同名属性*/
					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					/*源对象属性覆盖目标对象属性*/
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

/*一堆静态属性和方法，是其他模块实现的基础*/
jQuery.extend({
	// Unique for each copy of jQuery on the page
	/* 页面中，每个jQuery对象的id
	   正则表达式：\D 匹配任意非数字
	              \d 匹配任意数字
	   replace方法是去掉字符串中的非数字
	*/
	expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

	// Assume jQuery is ready without the ready module
	isReady: true,
    /* 接受一个字符串，抛出一个包含该字符串的异常*/
	error: function( msg ) {
		throw new Error( msg );
	},
    /* 表示一个空函数，当希望传递一个什么也不做的函数时，可以使用这个空函数
       开发插件时，这个方法可以作为可选回调函数的默认值，如果没有提供回调函数，则执行jQuery.noop
    */
	noop: function() {},

    // 是否是函数
	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},
    
    // 是否是数组
	isArray: Array.isArray,
    
    /* 判断是否为window对象，利用window对象的window属性进行全等判断
       window属性指向该window对象本身
    */
	isWindow: function( obj ) {
		return obj != null && obj === obj.window;
	},
    /*是否为数字*/
	isNumeric: function( obj ) {
		// parseFloat NaNs numeric-cast false positives (null|true|false|"")
		// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
		// subtraction forces infinities to NaN
		return !jQuery.isArray( obj ) && obj - parseFloat( obj ) >= 0;
	},
    
    /*判断是否为[object object]，即是否是用对象字面量或构造函数创建的对象*/
	isPlainObject: function( obj ) {
		// Not plain objects:
		// - Any object or value whose internal [[Class]] property is not "[object Object]"
		// - DOM nodes
		// - window
		if ( jQuery.type( obj ) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}
        
        /* 是否为自定义构造函数产生的对象
           在自定义构造函数中，这个函数的原型对象属性、方法、constructor属性会被重写
           isPrototypeOf为Object原型对象特有属性，若不存在，则为自定义构造函数
           hasOwnPropertyof-某个属性是否为某个对象的实例属性
        */
		if ( obj.constructor &&
				!hasOwn.call( obj.constructor.prototype, "isPrototypeOf" ) ) {
			return false;
		}

		// If the function hasn't returned already, we're confident that
		// |obj| is a plain object, created by {} or constructed with new Object
		return true;
	},
    /* 对象是否为空，即不包含属性或方法*/
	isEmptyObject: function( obj ) {
		var name;
		/* for-in循环对象中的实例属性和原型属性*/
		for ( name in obj ) {
			return false;
		}
		return true;
	},
    
    // 判断数据类型
	type: function( obj ) {

		// 若为null或undefined，则返回null或undefined
		if ( obj == null ) {
			return obj + "";
		}

		/* toString.call：调用Object原型的toString方法，判断原生对象类型
		   若为原生对象，则返回对应的[object Class]
		   其他返回object
		*/
		// Support: Android < 4.0, iOS < 6 (functionish RegExp)
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ toString.call(obj) ] || "object" :
			typeof obj;
	},
    
    /* 在全局作用域中执行JavaScript代码*/
	// Evaluates a script in a global context
	globalEval: function( code ) {
		var script,
			indirect = eval;

		code = jQuery.trim( code );

		if ( code ) {
			// If the code includes a valid, prologue position
			// strict mode pragma, execute code by injecting a
			// script tag into the document.
			if ( code.indexOf("use strict") === 1 ) {
				script = document.createElement("script");
				script.text = code;
				document.head.appendChild( script ).parentNode.removeChild( script );
			} else {
			// Otherwise, avoid the DOM node creation, insertion
			// and removal by using an indirect global eval
				indirect( code );
			}
		}
	},
    /* 将链式字符串转为驼峰式*/
	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},
    
    /* 用于检查DOM元素的节点名称与指定的值是否相等，检查时忽略大小写*/
	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

    /* 通用遍历迭代方法，用于无缝地遍历对象和数组
       callback总是指向当前元素
       返回false则退出each循环
    */
	// args is for internal usage only
	each: function( obj, callback, args ) {
		var value,
			i = 0,
			length = obj.length,
			isArray = isArraylike( obj );
        /*args可选，若传入，则只把该参数传给回调函数*/
		if ( args ) {
			// 数组或类数组对象
			if ( isArray ) {
				for ( ; i < length; i++ ) {

					// 使用Function.prototype.apply方法,以obj[i]和args作为参数，执行函数内部代码
					value = callback.apply( obj[ i ], args );
                    /*若callback返回false，则结束遍历*/
					if ( value === false ) {
						break;
					}
				}
			// 对象
			} else {
				for ( i in obj ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			}
        /* 若没有传入，执行回调函数时会传入两个参数
           下标或属性名，对应的元素或属性值
        */
		// A special, fast, case for the most common use of each
		} else {
			// 数组或类数组
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			// 对象
			} else {
				for ( i in obj ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			}
		}
        // 返回处理后的数组或对象，以支持链式句法
		return obj;
	},
    
    /* 移除字符串开头和结尾的空白符*/
	// Support: Android<4.1
	trim: function( text ) {
		return text == null ?
			"" :
			( text + "" ).replace( rtrim, "" );
	},

    /*将arr对象属性添加到results上*/
	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			/*若为[object array]*/
			if ( isArraylike( Object(arr) ) ) {
				/*不去重将arr合并到ret*/
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				/*类对象合并*/
				push.call( ret, arr );
			}
		}

		return ret;
	},
    
    /* 在数组中查找指定的元素并返回其下标*/
	inArray: function( elem, arr, i ) {
		/* indexOf，第一个参数是要查找的项；第二个参数是从第几位索引开始查找*/
		return arr == null ? -1 : indexOf.call( arr, elem, i );
	},

    /*将两个数组强制合并到第一个数组，不去重，参数可为类数组对象*/
	merge: function( first, second ) {
		var len = +second.length,
			j = 0,
			i = first.length;

		for ( ; j < len; j++ ) {
			first[ i++ ] = second[ j ];
		}

		first.length = i;

		return first;
	},
    /* 用于查找数组中满足过滤函数的元素，原数组不会受影响
       invert为true，返回一个不满足回调函数的元素数组
       invert未传入或为false，返回一个满足回调函数的元素数组
    */
	grep: function( elems, callback, invert ) {
		var callbackInverse,
			matches = [],
			i = 0,
			length = elems.length,
			// 未传入为true
			callbackExpect = !invert;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			/*满足回调函数,callbackInverse为false*/
			callbackInverse = !callback( elems[ i ], i );
			if ( callbackInverse !== callbackExpect ) {
				matches.push( elems[ i ] );
			}
		}

		return matches;
	},
    /* 静态方法jQuery.map
       对数组中的每个元素或对象的每个属性调用一个回调函数，
       并将回调函数的返回值放入一个新的数组中
       若为null和undefine则不放入数组中
       arg，仅限于jQuery内部使用，若传入参数arg，则该参数会被传给回调函数callback
    */
	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value,
			i = 0,
			length = elems.length,
			isArray = isArraylike( elems ),
			ret = [];

		// Go through the array, translating each of the items to their new values
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}
		}
        
        /* 返回新数组，二维数组可转为一维数组
        */
		// Flatten any nested arrays
		return concat.apply( [], ret );
	},

    /* 全局计数器，用于jQuery事件模块和缓存模块。
       在事件模块中，每个事件监听函数会被设置一个guid属性，用来唯一标识这个函数
       在缓存模块中，通过在DOM元素上附加一个唯一标识，来关联该元素和该元素对应的缓存
    */
	// A global GUID counter for objects
	guid: 1,
    
    /* 接受一个函数，返回一个新函数，新函数总是持有特定的上下文；
       有两种方式：
       1、fn为函数名，context为上下文，作用是fn的作用域是context
       2、fn为上下文，context为上下文中的一个属性且为函数名，其代码会将二者互换，作用依然是context的作用域是fn
       最终的达到的效果是强制函数的作用域指向上下文
    */
	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var tmp, args, proxy;
        /* context为字符串且为一个函数名，fn为object，且context是fn的一个属性
           然后，将context和fn互换，修正为proxy(context,fn)
        */
		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}
        
        // 无论传参是什么，到这一步，fn是函数名，context是上下文

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}
        
        // 除fn和context外，其余参数以数组形式保存在args中
		// Simulated bind
		args = slice.call( arguments, 2 );

		proxy = function() {
			/* 将$.proxy多余参数与proxy函数传入的参数合并，在执行fn函数*/
			return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
		};
        
        // 设置唯一标识，且代理函数和原始函数关联了起来
		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},
    /* 返回当前时间的毫秒数*/
	now: Date.now,
    
    /* jQuery静态方法，在jQuery库内未被使用，用于其他工程或项目保存浏览器功能测试*/
	// jQuery.support is not used in Core but other projects attach their
	// properties to it so it needs to exist.
	support: support
});

// 保存原生对象toString字符串，用于判断原生对象类型
// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

// 判断是否为Array引用类型
function isArraylike( obj ) {
	var length = obj.length,
		type = jQuery.type( obj );

    // 若是函数引用类型或窗口对象，则返回false
	if ( type === "function" || jQuery.isWindow( obj ) ) {
		return false;
	}
    
    // 若是元素节点，且length大于0，则是数组
	if ( obj.nodeType === 1 && length ) {
		return true;
	}

	return type === "array" || length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj;
}

/* 选择符引擎Sizzle（行635-2682）
   为了兼容低版本浏览器，实现querySelectorAll等高级API，因此，开发了Sizzle引擎
   也就是说在高级浏览器上，jquery使用querySelectorAll来处理DOM，而在低版本浏览
   器中为实现该高级API，需要使用原生js去模拟querySelectorAll等。
   与querySelectorAll一样，从右向左解析选择符，提高查询效率
*/
var Sizzle =
/*!
 * Sizzle CSS Selector Engine v1.10.19
 * http://sizzlejs.com/
 *
 * Copyright 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2014-04-18
 */
(function( window ) {

var i,
    /* Sizzle引擎浏览器功能测试，未暴露给jQuery，尽在内部使用*/
	support,
	Expr,
	getText,
	isXML,
	tokenize,
	compile,
	select,
	outermostContext,
	sortInput,
	hasDuplicate,

	// Local document vars
	setDocument,
	document,
	docElem,
	// 文档是否为HTML文档
	documentIsHTML,
	/*IE8开始支持querySelectorAll的API，
	  但是会有各式各样的BUG,
	  所以sizzle使用rbuggyQSA记录BUG问题
	*/
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + -(new Date()),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
    // 判断是否有重复项
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
		}
		return 0;
	},
    
    // 字符串undefined
	// General-purpose constants
	strundefined = typeof undefined,
	MAX_NEGATIVE = 1 << 31,

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf if we can't use a native one
	indexOf = arr.indexOf || function( elem ) {
		var i = 0,
			len = this.length;
		for ( ; i < len; i++ ) {
			if ( this[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
    
    // 正则表达式字符串
	// Regular expressions
    
    /* 空白分割，空白符包括空格、制表符、换行符、中文全角空格等
       \x2o 空格
       \t   制表
       \r   换行
       \n   回车换行
       \f   换页
       正则表达式字符串的表达方式
       \\x20 \\t \\r \\n \\f
    */
	// Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",

	/* 后向引用(?:exp)匹配exp，不捕获匹配的文本，也不给此分组分配组号
	   不会改变正则表达式的处理方式，其匹配的内容不会被捕获到某个组里面
	*/
	// http://www.w3.org/TR/css3-syntax/#characters
	characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

    // CSS中ID选择器
	// Loosely modeled on CSS identifier characters
	// An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
	// Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = characterEncoding.replace( "w", "w#" ),

    // 属性选择器
	// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + characterEncoding + ")(?:" + whitespace +
		// Operator (capture 2)
		"*([*^$|!~]?=)" + whitespace +
		// "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
		"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace +
		"*\\]",

	pseudos = ":(" + characterEncoding + ")(?:\\((" +
		// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
		// 1. quoted (capture 3; capture 4 or capture 5)
		"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
		// 2. simple (capture 6)
		"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +
		// 3. anything else (capture 2)
		".*" +
		")\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),
    
    // 逗号分组
	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	// 关系符
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

    /* 字面量正则表达式
       \x00-\xao 只匹配汉字
       ATTR:/^\[[\x20\t\r\n\f]*((?:\\.|[\w-]|[^\x00-\xa0])+)(?:[\x20\t\r\n\f]*([*^$|!~]?=)[\x20\t\r\n\f]*(?:'((?:\\.|[^\\'])*)'|"((?:\\.|[^\\"])*)"|((?:\\.|[\w#-]|[^\x00-\xa0])+))|)[\x20\t\r\n\f]*\]/
       CHILD:/^:(only|first|last|nth|nth-last)-(child|of-type)(?:\([\x20\t\r\n\f]*(even|odd|(([+-]|)(\d*)n|)[\x20\t\r\n\f]*(?:([+-]|)[\x20\t\r\n\f]*(\d+)|))[\x20\t\r\n\f]*\)|)/i
       CLASS:/^\.((?:\\.|[\w-]|[^\x00-\xa0])+)/
       ID:/^#((?:\\.|[\w-]|[^\x00-\xa0])+)/
       PSEUDO:/^:((?:\\.|[\w-]|[^\x00-\xa0])+)(?:\((('((?:\\.|[^\\'])*)'|"((?:\\.|[^\\"])*)")|((?:\\.|[^\\()[\]]|\[[\x20\t\r\n\f]*((?:\\.|[\w-]|[^\x00-\xa0])+)(?:[\x20\t\r\n\f]*([*^$|!~]?=)[\x20\t\r\n\f]*(?:'((?:\\.|[^\\'])*)'|"((?:\\.|[^\\"])*)"|((?:\\.|[\w#-]|[^\x00-\xa0])+))|)[\x20\t\r\n\f]*\])*)|.*)\)|)/
       TAG:/^((?:\\.|[\w*-]|[^\x00-\xa0])+)/
       bool:/^(?:checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped)$/i
       needsContext:/^[\x20\t\r\n\f]*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\([\x20\t\r\n\f]*((?:-\d)?\d*)[\x20\t\r\n\f]*\)|)(?=[^-]|$)/i
    */ 
	matchExpr = {
		"ID": new RegExp( "^#(" + characterEncoding + ")" ),
		"CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
		"TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		/*判断当前HTML属性是否为布尔型*/
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rnative = /^[^{]+\{\s*\[native \w/,
    
    // sizzle引擎私有变量判断是否为ID/TAG/CLASS选择器的正则表达式
	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rsibling = /[+~]/,
	rescape = /'|\\/g,

	// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox<24
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			high < 0 ?
				// BMP codepoint
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	};
    
// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

/* Sizzle构造函数
   以selector = 'div.aaron input[name=ttt],div p'为例
   选择器引擎入口，查找与选择器表达式selector匹配的元素集合
*/
function Sizzle( selector, context, results, seed ) {
	var match, elem, m, nodeType,
		// QSA vars
		i, groups, old, nid, newContext, newSelector;

    /* ownerDocument是只读属性，返回子节点的根级Document对象
       若节点为文档节点，则返回null
    */
	if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
		setDocument( context );
	}

	context = context || document;
	results = results || [];

	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	if ( (nodeType = context.nodeType) !== 1 && nodeType !== 9 ) {
		return [];
	}
    
    /*若是html文档，且seed为undefined*/
	if ( documentIsHTML && !seed ) {
        
        /*是否为ID、TAG、CLASS选择，使用ById ByTagName ByClassName获取DOM*/
		// Shortcuts
		if ( (match = rquickExpr.exec( selector )) ) {
			// Speed-up: Sizzle("#ID")
			if ( (m = match[1]) ) {
				if ( nodeType === 9 ) {
					elem = context.getElementById( m );
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document (jQuery #6963)
					if ( elem && elem.parentNode ) {
						// Handle the case where IE, Opera, and Webkit return items
						// by name instead of ID
						if ( elem.id === m ) {
							results.push( elem );
							return results;
						}
					} else {
						return results;
					}
				} else {
					/*context不是文档节点*/
					// Context is not a document
					if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
						contains( context, elem ) && elem.id === m ) {
						results.push( elem );
						return results;
					}
				}

			// Speed-up: Sizzle("TAG")
			} else if ( match[2] ) {
				push.apply( results, context.getElementsByTagName( selector ) );
				return results;

			// Speed-up: Sizzle(".CLASS")
			} else if ( (m = match[3]) && support.getElementsByClassName && context.getElementsByClassName ) {
				push.apply( results, context.getElementsByClassName( m ) );
				return results;
			}
		}

		// QSA path
		if ( support.qsa && (!rbuggyQSA || !rbuggyQSA.test( selector )) ) {
			nid = old = expando;
			newContext = context;
			newSelector = nodeType === 9 && selector;

			// qSA works strangely on Element-rooted queries
			// We can work around this by specifying an extra ID on the root
			// and working up from there (Thanks to Andrew Dupont for the technique)
			// IE 8 doesn't work on object elements
			if ( nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
				groups = tokenize( selector );

				if ( (old = context.getAttribute("id")) ) {
					nid = old.replace( rescape, "\\$&" );
				} else {
					context.setAttribute( "id", nid );
				}
				nid = "[id='" + nid + "'] ";

				i = groups.length;
				while ( i-- ) {
					groups[i] = nid + toSelector( groups[i] );
				}
				newContext = rsibling.test( selector ) && testContext( context.parentNode ) || context;
				newSelector = groups.join(",");
			}

			if ( newSelector ) {
				try {
					push.apply( results,
						newContext.querySelectorAll( newSelector )
					);
					return results;
				} catch(qsaError) {
				} finally {
					if ( !old ) {
						context.removeAttribute("id");
					}
				}
			}
		}
	}
    
    /* context = document
       results = []
       seed = undefined
       selector = 'div.aaron input[name=ttt],div p'
       传入select函数中，返回DOM集合
       p2659
    */
	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key + " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key + " " ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */
function assert( fn ) {
	var div = document.createElement("div");

	try {
		return !!fn( div );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( div.parentNode ) {
			div.parentNode.removeChild( div );
		}
		// release memory in IE
		div = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = attrs.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			( ~b.sourceIndex || MAX_NEGATIVE ) -
			( ~a.sourceIndex || MAX_NEGATIVE );

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Checks a node for validity as a Sizzle context
 * @param {Element|Object=} context
 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
 */
function testContext( context ) {
	return context && typeof context.getElementsByTagName !== strundefined && context;
}

/* 语法简洁*/
// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Detects XML nodes
 * @param {Element|Object} elem An element or a document
 * @returns {Boolean} True iff elem is a non-HTML XML node
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var hasCompare,
		doc = node ? node.ownerDocument || node : preferredDoc,
		parent = doc.defaultView;

	// If no document and documentElement is available, return
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Set our document
	document = doc;
	docElem = doc.documentElement;

	// Support tests
	documentIsHTML = !isXML( doc );

	// Support: IE>8
	// If iframe document is assigned to "document" variable and if iframe has been reloaded,
	// IE will throw "permission denied" error when accessing "document" variable, see jQuery #13936
	// IE6-8 do not support the defaultView property so parent will be undefined
	if ( parent && parent !== parent.top ) {
		// IE11 does not have attachEvent, so all must suffer
		if ( parent.addEventListener ) {
			parent.addEventListener( "unload", function() {
				setDocument();
			}, false );
		} else if ( parent.attachEvent ) {
			parent.attachEvent( "onunload", function() {
				setDocument();
			});
		}
	}

	/* Attributes
	---------------------------------------------------------------------- */
    
    /* 检验当前浏览器设置属性时，是否需要传入DOM属性参数
       true，不需要传入；false，需要传入
    */
	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties (excepting IE8 booleans)
	support.attributes = assert(function( div ) {
		div.className = "i";
		return !div.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( div ) {
		div.appendChild( doc.createComment("") );
		return !div.getElementsByTagName("*").length;
	});

	// Check if getElementsByClassName can be trusted
	support.getElementsByClassName = rnative.test( doc.getElementsByClassName ) && assert(function( div ) {
		div.innerHTML = "<div class='a'></div><div class='a i'></div>";

		// Support: Safari<4
		// Catch class over-caching
		div.firstChild.className = "i";
		// Support: Opera<10
		// Catch gEBCN failure to find non-leading classes
		return div.getElementsByClassName("i").length === 2;
	});

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( div ) {
		docElem.appendChild( div ).id = expando;
		return !doc.getElementsByName || !doc.getElementsByName( expando ).length;
	});

	// ID find and filter
	if ( support.getById ) {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== strundefined && documentIsHTML ) {
				var m = context.getElementById( id );
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [ m ] : [];
			}
		};
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
	} else {
		// Support: IE6/7
		// getElementById is not reliable as a find shortcut
		delete Expr.find["ID"];

		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== strundefined ) {
				return context.getElementsByTagName( tag );
			}
		} :
		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== strundefined && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See http://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( doc.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( div ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// http://bugs.jquery.com/ticket/12359
			div.innerHTML = "<select msallowclip=''><option selected=''></option></select>";

			// Support: IE8, Opera 11-12.16
			// Nothing should be selected when empty strings follow ^= or $= or *=
			// The test attribute must be unknown in Opera but "safe" for WinRT
			// http://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
			if ( div.querySelectorAll("[msallowclip^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !div.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}
		});

		assert(function( div ) {
			// Support: Windows 8 Native Apps
			// The type and name attributes are restricted during .innerHTML assignment
			var input = doc.createElement("input");
			input.setAttribute( "type", "hidden" );
			div.appendChild( input ).setAttribute( "name", "D" );

			// Support: IE8
			// Enforce case-sensitivity of name attribute
			if ( div.querySelectorAll("[name=d]").length ) {
				rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":enabled").length ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			div.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}
    
    /* matchesSelector方法，检查DOM元素与选择器表达式是否匹配
       msMatchesSelector---IE9+
       mozMatchesSelector---FF3.6+
       webkitMatchesSelector---Safari5+、Chrome
    */
	if ( (support.matchesSelector = rnative.test( (matches = docElem.matches ||
		docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( div ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( div, "div" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( div, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */
	hasCompare = rnative.test( docElem.compareDocumentPosition );
    
    /* 检测一个元素是否包含另一个元素*/
	// Element contains another
	// Purposefully does not implement inclusive descendent
	// As in, an element does not contain itself
	contains = hasCompare || rnative.test( docElem.contains ) ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
				    /* 调用原生方法contains*/
					adown.contains( bup ) :
					/* 调用原生方法compareDocumentPosition*/
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		/*若没有compareDocumentPosition和contains原生方法，则使用如下的递归函数进行包含关系判断*/
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = hasCompare ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

        /* compareDocumentPosition方法比较两个节点，并返回描述它们在文档中位置的整数
           例子如下：
		     A.compareDocumentPosition(B);
		     1：没有关系，两个节点不属于同一个文档
             2：A位于B后
             4：A位于B前
             8：A位于B内
             16：A位于B外
             32：没有关系，或是两个节点是同一元素的两个属性
             注释：返回值可以是值的组合。
             例如，返回20 意味着在A位于B外（16），并且 A位于B前（4）
             IE9+
        */
		// Sort on method existence if only one input has compareDocumentPosition
		var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
		if ( compare ) {
			return compare;
		}
        
        /* 若在同一个文档内，计算文档位置*/
		// Calculate position if both inputs belong to the same document
		compare = ( a.ownerDocument || a ) === ( b.ownerDocument || b ) ?
			a.compareDocumentPosition( b ) :

			// Otherwise we know they are disconnected
			1;

		// Disconnected nodes
		if ( compare & 1 ||
			(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {
            
            /* 包含关系*/
			// Choose the first element that is related to our preferred document
			if ( a === doc || a.ownerDocument === preferredDoc && contains(preferredDoc, a) ) {
				return -1;
			}
			if ( b === doc || b.ownerDocument === preferredDoc && contains(preferredDoc, b) ) {
				return 1;
			}

			// Maintain original order
			return sortInput ?
				( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
				0;
		}
        
        /* &，按位与，两个数值对应的位上都是1时才返回1，其余都是0
           只有a在b前返回-1，其余返回1
        */
		return compare & 4 ? -1 : 1;
	} :
	function( a, b ) {
		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Parentless nodes are either documents or disconnected
		if ( !aup || !bup ) {
			return a === doc ? -1 :
				b === doc ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return doc;
};

/* 便捷方法，
   使用指定的选择器表达式expr对元素集合elements进行过滤，并返回过滤结果
   调用函数Sizzle来实现
*/
Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

/* 便捷方法，检查某个元素node是否匹配选择器表达式expr*/
Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );
    
    /* 若浏览器支持原生方法，则尝试调用原生方法检查元素是否匹配
       若不支持或抛出异常，则调用Sizzle，查找，返回值长度是否大于0
    */

	if ( support.matchesSelector && documentIsHTML &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch(e) {}
	}

	return Sizzle( expr, document, null, [ elem ] ).length > 0;
};

/* 工具方法，检测元素a是否包含元素b
   使用了compareDocumentPosition、contains原生方法*/
Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val !== undefined ?
		val :
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null;
};

/* 工具方法，抛出异常*/
Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/* 工具方法
   对元素集合中的元素按照出现在文档中的顺序进行排序，并删除重复元素
*/
/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				/* Array，push方法返回是数组长度
                   将索引插入duplicates数组中
				*/
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			/* splice，删除操作，2个参数，
			   第一个参数是要删除第一项的位置，第二个参数是要删除的项数
			*/
			results.splice( duplicates[ j ], 1 );
		}
	}

	// Clear input after sorting to release objects
	// See https://github.com/jquery/sizzle/pull/225
	sortInput = null;

	return results;
};

/* 工具方法，获取DOM元素集合中所有元素合并的文本内容*/
/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;
    // 若不是节点，则认为是数组，递归合并
	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		while ( (node = elem[i++]) ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	// 元素节点、文档节点、文档片段节点
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (jQuery #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// 遍历子元素，获取子元素文本内容
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	// 文本节点、CDATA节点
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

/* 扩展方法和属性
   Expr与Sizzle.selectors指向同一个对象，是为了减少拼写字符串、缩短作用域链，且方便压缩
*/
Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,
    
    /* 确定块表达式的类型，并解析其中的参数*/
	match: matchExpr,

    /* 属性值读取函数集*/
	attrHandle: {},

    /* 块表达式查找函数集
       在setDocument方法中分别定义了ID、CLASS、TAG所对应的查找函数
       例如ID---》getElementById
           CLASS--->getElementsByClassName
           TAG--->getElementsByTagName
    */
	find: {},

    /* 记录选择器关系
       块间关系过滤函数集
    */
	relative: {
		// 父子关系，返回第一个后代元素
		">": { dir: "parentNode", first: true },
		// 祖宗和后代关系，返回所有后代元素
		" ": { dir: "parentNode" },
		// 临近兄弟关系，返回第一个兄弟元素
		"+": { dir: "previousSibling", first: true },
		// 兄弟关系，返回所有的兄弟元素
		"~": { dir: "previousSibling" }
	},

    // 保存ATTR、CHILD、PSEUDO三种复杂选择器的兼容处理
    /* 块表达式预过滤函数集，调用对应类型的预过滤函数，执行过滤前的修正操作*/
	preFilter: {

		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[3] || match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[6] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] ) {
				match[2] = match[4] || match[5] || "";

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},
    
    /* 块表达式过滤函数集
       调用对应类型的过滤函数，执行过滤操作，若过滤函数返回false，则把元素集合中对应位置的元素替换为false
       ID选择器位于setDocument内根据不同浏览器进行了定义
       从1.8后采用了空间换时间的方式，通过把各种过滤器编译
       成闭包的函数，来提高查询效率
       将闭包作为私有变量的保存处理，把过滤器中每一个选择原
       子都变成了函数的处理方法，然后通过闭包保存着。再缓存
       在内存中去，这样又重复使用的时候就会首先调用缓存
    */
	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== strundefined && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, outerCache, node, diff, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) {
										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {
							// Seek `elem` from a previously-cached index
							outerCache = parent[ expando ] || (parent[ expando ] = {});
							cache = outerCache[ type ] || [];
							nodeIndex = cache[0] === dirruns && cache[1];
							diff = cache[0] === dirruns && cache[2];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									outerCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						// Use previously-cached element index if available
						} else if ( useCache && (cache = (elem[ expando ] || (elem[ expando ] = {}))[ type ]) && cache[0] === dirruns ) {
							diff = cache[1];

						// xml :nth-child(...) or :nth-last-child(...) or :nth(-last)?-of-type(...)
						} else {
							// Use the same loop as above to seek `elem` from the start
							while ( (node = ++nodeIndex && node && node[ dir ] ||
								(diff = nodeIndex = 0) || start.pop()) ) {

								if ( ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) && ++diff ) {
									// Cache the index of each encountered element
									if ( useCache ) {
										(node[ expando ] || (node[ expando ] = {}))[ type ] = [ dirruns, diff ];
									}

									if ( node === elem ) {
										break;
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf.call( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},
    
    /* 伪类*/
	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": function( elem ) {
			return elem.disabled === false;
		},

		"disabled": function( elem ) {
			return elem.disabled === true;
		},

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
			//   but not by others (comment: 8; processing instruction: 7; etc.)
			// nodeType < 6 works because attributes (2) do not appear as children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeType < 6 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&

				// Support: IE<8
				// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text" );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};
Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

/* 位置伪类过滤函数集*/
// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

/* 词法分析器，是将编写的文本代码流解析为一个一个的记号，
   分析得到的记号以供后续语法分析使用
   复杂的选择器，在低版本浏览器是无法直接获取的，那就需
   要库把复杂选择器按照一样的设计规则，分解成浏览器原始
   API能够识别的结构，然后通过其他方法找这个结构。因此，
   tokenize采用了分割算法来识别复杂选择器
   selector = soFar = div.aaron input[name=ttt],div p
   为例进行代码分析
*/
tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {
        /*第一次循环，matched为undefined
          第二次循环，matched为非空字符串，执行||后代码，match为空*/
		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			/*第一次循环，使groups为二维数组
			  第二次循环，使groups为二维数组*/
			groups.push( (tokens = []) );
		}

		matched = false;
        
        // 关系符
		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			// 取得数组第一项
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			// 截取字符串，从上一个匹配项字符串长度的位置截取
			soFar = soFar.slice( matched.length );
		}

		/* 假如soFar = div.aaron input[name=ttt],div p
		   Expr.filter包括ID、TAG、CLASS、ATTR、CHILD、PSEUDO
		   matchExpr包括ID、CLASS、TAG、ATTR、PSEUDO、CHILD、bool、needsContext
		   preFilter包括ATTR、CHILD、PSEUDO
		*/
		// Filters
		for ( type in Expr.filter ) {
			/* 首次循环
			   type = ID    null  false tokens = []
			   type = TAG   true        tokens = [ {value: 'div',type:'TAG', matched:['div','div']}]
			   此时soFar = .aaron input[name=ttt],div p
			   type = CLASS true        tokens = [{...},{
	                                               value: '.aaron',
	                                               type: 'CLASS',
	                                               matched: ['.aaron','aaron']
			                                     }]  
			   type = ATTR  null  false
			   type = CHILD null  false
			   type = PSEUDO null false
			*/
			if ( type == 'CLASS' ) {
				// console.log(matchExpr[ type ].exec( soFar ))
			}
			if ( (match = matchExpr[ type ].exec( soFar )) && 
				(!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});

				/* 当type为TAG时，matched = 'div' matched.length = 3
				   那么，从第4位截取soFar soFar = .aaron input[name=ttt],div p
				   当type为CLASS时，matched = '.aaron' matched.length = 6
				   那么，从第4位截取soFar soFar =  input[name=ttt],div p
				*/
				soFar = soFar.slice( matched.length );
			}
		}
		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
};

// tokenize('div.aaron input[name=ttt],div p')
// console.log(matchExpr)

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

/* sizzle过滤器
   从种子集合seed里边找到选择器指定的元素
   调用逻辑select--compile--matcherFromTokens--addCombinator
*/
function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		checkNonElements = base && dir === "parentNode",
		doneName = done++;

	return combinator.first ?
	    // 沿着父级或之前的元素获取第一个的元素
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
		} :
        
        // 沿着父级或之前的元素获取所有的元素
		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var oldCache, outerCache,
				newCache = [ dirruns, doneName ];

			// We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});
						if ( (oldCache = outerCache[ dir ]) &&
							oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

							// Assign to newCache so results back-propagate to previous elements
							return (newCache[ 2 ] = oldCache[ 2 ]);
						} else {
							// Reuse newcache so results back-propagate to previous elements
							outerCache[ dir ] = newCache;

							// A match means we're done; a fail means we have to keep checking
							if ( (newCache[ 2 ] = matcher( elem, context, xml )) ) {
								return true;
							}
						}
					}
				}
			}
		};
}

function elementMatcher( matchers ) {
	// 生成一个终极匹配器
	return matchers.length > 1 ?
	// 若是多个匹配器的情况，那么就需要elem符合全部匹配器规则
		function( elem, context, xml ) {
			var i = matchers.length;
			// 从右到左开始匹配
			while ( i-- ) {
				// 若有一个没匹配中，那就说明该节点elem不符合规则
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		// 单个匹配器的话就返回自己即可
		matchers[0];
}

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf.call( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

/* 充当了selector“分词”与Expr中定义的匹配方法的串联和纽带的作用，
   可以说选择符的各种排列组合都是能适应的。
   Sizzle巧妙的是没有直接将拿到的“分词”结果与Expr中的方法逐个匹配
   逐个执行，而是先根据规则组合出一个大的匹配方法，最好一步执行
   matcherFromTokens的分解是有规律的
*/
function matcherFromTokens( tokens ) {
	/*Array(3)*/
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf.call( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			return ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
		} ];

	for ( ; i < len; i++ ) {
		/*当遇到关系选择器时，elementMatcher函数将matchers数组中的函数生成一个函数*/
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			/*在递归分解tokens中的词法元素时，提出第一个type匹配到对应的处理方法*/
			// f()
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	var bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, outermost ) {
			var elem, j, matcher,
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				setMatched = [],
				contextBackup = outermostContext,
				/* 有可能是直接从seed中查询过滤，也有可能在context或者context的父节点范围内。
				   如果不是从seed开始，那只能把整个DOM树节点取出来过滤了，把整个DOM树节点取出
				   来过滤了，它会先执行Expr.find["TAG"]( "*", outermost )这句代码等到一个elems
				   集合（数组合集）
				*/
				// We must always have either seed elements or outermost context
				elems = seed || byElement && Expr.find["TAG"]( "*", outermost ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
				len = elems.length;

			if ( outermost ) {
				outermostContext = context !== document && context;
			}

			// Add elements passing elementMatchers directly to results
			// Keep `i` a string if there are no elements so `matchedCount` will be "00" below
			// Support: IE<9, Safari
			// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
			for ( ; i !== len && (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context, xml ) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// Apply set filters to unmatched elements
			matchedCount += i;
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
	/* 以selector = 'div.aaron input[name=ttt],div p', 
	   match = [Array(5),Array(3)]为例
	*/
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];
	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !match ) {
			match = tokenize( selector );
		}
		i = match.length;
		while ( i-- ) {
			// f()
			cached = matcherFromTokens( match[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}
        /* superMatcher函数不是一个直接定义的方法，
           通过matcherFromGroupMatchers方法return的一个函数
        */
		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );

		// Save selector and tokenization
		cached.selector = selector;
	}
	return cached;
};

/* context = document
   results = []
   seed = undefined
   selector = 'div.aaron input[name=ttt],div p'
   传入select函数中，返回DOM集合
*/
/**
 * A low-level selection function that works with Sizzle's compiled
 *  selector functions
 * @param {String|Function} selector A selector or a pre-compiled
 *  selector function built with Sizzle.compile
 * @param {Element} context
 * @param {Array} [results]
 * @param {Array} [seed] A set of elements to match against
 */
select = Sizzle.select = function( selector, context, results, seed ) {
	var i, tokens, token, type, find,
	    /*compiled为false*/
		compiled = typeof selector === "function" && selector,
		/*match = [Array(5),Array(3)]*/
		match = !seed && tokenize( (selector = compiled.selector || selector) );

	results = results || [];

	// Try to minimize operations if there is no seed and only one group
	if ( match.length === 1 ) {

		// Take a shortcut and set the context if the root selector is an ID
		tokens = match[0] = match[0].slice( 0 );
		if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
				support.getById && context.nodeType === 9 && documentIsHTML &&
				Expr.relative[ tokens[1].type ] ) {

			context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
			if ( !context ) {
				return results;

			// Precompiled matchers will still verify ancestry, so step up a level
			} else if ( compiled ) {
				context = context.parentNode;
			}

			selector = selector.slice( tokens.shift().value.length );
		}

		// Fetch a seed set for right-to-left matching
		i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
		while ( i-- ) {
			token = tokens[i];

			// Abort if we hit a combinator
			if ( Expr.relative[ (type = token.type) ] ) {
				break;
			}
			if ( (find = Expr.find[ type ]) ) {
				// Search, expanding context for leading sibling combinators
				if ( (seed = find(
					token.matches[0].replace( runescape, funescape ),
					rsibling.test( tokens[0].type ) && testContext( context.parentNode ) || context
				)) ) {

					// If seed is empty or no tokens remain, we can return early
					tokens.splice( i, 1 );
					selector = seed.length && toSelector( tokens );
					if ( !selector ) {
						push.apply( results, seed );
						return results;
					}

					break;
				}
			}
		}
	}
    
    /* superMatcher函数不是一个直接定义的方法，
       通过matcherFromGroupMatchers方法return的一个函数
    */
	// Compile and execute a filtering function if one is not provided
	// Provide `match` to avoid retokenization if we modified the selector above
	( compiled || compile( selector, match ) )(
		seed,
		context,
		!documentIsHTML,
		results,
		rsibling.test( selector ) && testContext( context.parentNode ) || context
	);
	return results;
};

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome<14
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = !!hasDuplicate;

/*仿照默认文件作初始化*/
// Initialize against the default document
setDocument();

/*浏览器兼容性处理*/
// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( div1 ) {
	// Should return 1, but returns 4 (following)
	return div1.compareDocumentPosition( document.createElement("div") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( div ) {
	div.innerHTML = "<a href='#'></a>";
	return div.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( div ) {
	div.innerHTML = "<input/>";
	div.firstChild.setAttribute( "value", "" );
	return div.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( div ) {
	return div.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return elem[ name ] === true ? name.toLowerCase() :
					(val = elem.getAttributeNode( name )) && val.specified ?
					val.value :
				null;
		}
	});
}

return Sizzle;

})( window );


/* 暴露Sizzle给jQuery对象，
   静态方法或属性
*/
jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.pseudos;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


var rneedsContext = jQuery.expr.match.needsContext;

// 是否为单个标签
var rsingleTag = (/^<(\w+)\s*\/?>(?:<\/\1>|)$/);

var risSimple = /^.[^:#\[\.,]*$/;

/* filter、not都调用winnow函数，对当前匹配元素集合进行过滤
   参数not：false--filter，true--not
*/
// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {

	/*函数*/
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			/* jshint -W018 */
			return !!qualifier.call( elem, i, elem ) !== not;
		});

	}
    
    /*DOM元素*/
	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		});

	}
    
    /*字符串*/
	if ( typeof qualifier === "string" ) {
		if ( risSimple.test( qualifier ) ) {
			return jQuery.filter( qualifier, elements, not );
		}

		qualifier = jQuery.filter( qualifier, elements );
	}

	return jQuery.grep( elements, function( elem ) {
		return ( indexOf.call( qualifier, elem ) >= 0 ) !== not;
	});
}

// 返回与指定选择器表达式匹配的集合
jQuery.filter = function( expr, elems, not ) {
	var elem = elems[ 0 ];
    
    /* not是true，保留不匹配元素*/
	if ( not ) {
		expr = ":not(" + expr + ")";
	}
    /* 若elems为1，则检验elem是否匹配表达式，是保留，不是返回空数组
       若>1,则筛选出elems中的DOM集合，和expr作为参数，调用Sizzle构造函数，返回匹配expr的DOM元素集合
    */
	return elems.length === 1 && elem.nodeType === 1 ?
		jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [] :
		jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
			return elem.nodeType === 1;
		}));
};

/* 在原型对象上，使用extend方法，扩展find、filter、not、is方法*/
jQuery.fn.extend({
    /* 当前元素集合中匹配的后代元素集合*/
	find: function( selector ) {
		var i,
			len = this.length,
			ret = [],
			self = this;
        /* 若selector是jQuery对象或DOM元素，则检查其是否是当前元素集合中某个元素的后代元素，是则保留，不是则丢弃
           最终返回一个新的jQuery对象
        */
		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter(function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			}) );
		}
        // 若为string，则遍历当前元素集合，查找匹配的后代元素
		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		// Needed because $( selector, context ) becomes $( context ).find( selector )
		ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
		ret.selector = this.selector ? this.selector + " " + selector : selector;
		return ret;
	},
	/* 当前元素集合中，只保留与selector匹配的元素*/
	filter: function( selector ) {
		return this.pushStack( winnow(this, selector || [], false) );
	},
	/* 当前元素集合中，只保留与selector不匹配的元素*/
	not: function( selector ) {
		return this.pushStack( winnow(this, selector || [], true) );
	},
	/* 当前元素集合中，有一个匹配selector，返回true*/
	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	}
});


// Initialize a jQuery object


// A central reference to the root jQuery(document)
var rootjQuery,
    
    /** html字符串正则表达式
     非全局模式，区分大小写，
     (?:)不改变正则的处理方式，只是不捕获匹配的文本，不配置组号
     [^>]匹配除>的任意字符
     \w匹配大小写字母、数字、下划线或汉字
     \W匹配除了大小写字母、数字、下划线或汉字的字符
     \s匹配任意空字符
     rquickExpr正则可以分为以下两个部分：
	 1、\s*(<[\w\W]+>)[^>]*--含有尖括号的html字符串
	 2、#([\w-]*)--id 
	 */
	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,


    /* 在原型上创建init方法
       context用来限定查找范围，称为选择器的上下文，或上下文
    */
	init = jQuery.fn.init = function( selector, context ) {
		var match, elem;
        
        // 若传入为空字符串、null、undefined和false则返回jQuery实例对象
		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}
        // 若传入非空html字符串
		// Handle HTML strings
		if ( typeof selector === "string" ) {

			// 若传入的是标签html字符串，但不一定是合法的html代码，例如<a>，<a></p>
			if ( selector[0] === "<" && selector[ selector.length - 1 ] === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];
            
            //若包含空白字符的标签html字符串或包含#字符的字符串
			} else {

				/** 用圆括号来表达子表达式（分组）
				    regexp.exec为捕获组方法，返回应用正则表达式的字符串的匹配项数组、index和input
				    index返回匹配项在字符串中的位置
				    input返回应用正则表达式的字符串
				    匹配项数组：第0个是与正则表达式匹配的文本，第1个是与正则表达式子表达式匹配的文本，
				               第2个是与正则表达式第2个子表达式相匹配的文本。。。
				    非全局模式下，多次调用始终返回第一个匹配项
				    全局模式下，每次调用则会在字符串中继续查找新匹配项
				    match[2]为id字符串
                */
				match = rquickExpr.exec( selector );
			}
            // 标签选择器或id选择器，且未指定context
			// Match html or make sure no context is specified for #id
			if ( match && (match[1] || !context) ) {
                
                /* 标签选择器，调用parseHTML方法，
                   其实是调用document.createElement方法，
                   生成DOM元素*/
				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;

					// scripts is true for back-compat
					// Intentionally let the error be thrown if parseHTML is not present
					jQuery.merge( this, jQuery.parseHTML(
						match[1],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );
                    
                    /*若为单个标签且context为[object object]*/
					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {
							/*若this对象中为函数，则调用该方法*/
							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

                            /*若不为函数，则设为属性值*/
							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;
                
                // id选择器
				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[2] );
                    
                    /*Blackberry4.6会返回不在文档中的DOM节点*/
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

            /* 选择器表达式*/
			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
            
				/*若未指定上下文，则rootjQuery.find
				若指定上下文，且上下文为jQuery对象，则context.find
				jquery为jQuery实例对象的原型属性，保存着版本号，若存在，则为jQuery对象*/
				return ( context || rootjQuery ).find( selector );
            
			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				/*若指定上下文，且上下文不为jQuery对象，
				则先用context生成一个jQuery对象，用新生成的jQuery对象调用find*/
				return this.constructor( context ).find( selector );
			}
        
        // DOM元素
		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			/*手动设置第一个元素和context为selector，封装到jQuery对象*/
			this.context = this[0] = selector;
			this.length = 1;
			return this;

        // 若传入函数，则在document上绑定ready事件的监听函数
		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return typeof rootjQuery.ready !== "undefined" ?
				rootjQuery.ready( selector ) :
				// Execute immediately if ready is not present
				selector( jQuery );
		}

        /*若为jQuery对象*/
		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}
        /*若为任意其他值，例如{context:'aa'}，则将其属性添加到jQuery对象上*/
		return jQuery.makeArray( selector, this );
	};

/** jQuery使用了new运算符，this指向了init对象，使其无法调用jQuery原型对象的属性和方法。
    jQuery.fn.init.prototype被赋值了jQuery.fn，使init原型对象上包含了jQuery原型对象的属性和方法，
    这样jQeury就可以调用jQuery原来定义的原型属性和方法，进而解决新旧构造器隔离的问题
*/
// Give the init function the jQuery prototype for later instantiation
init.prototype = jQuery.fn;

// Initialize central reference
rootjQuery = jQuery( document );

/*DOM遍历 Traversing
*/
var rparentsprev = /^(?:parents|prev(?:Until|All))/,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};
/*工具函数，是DOM遍历模块实现的核心*/
jQuery.extend({
	/*负责从一个元素出发，查找某个方向上的所有元素，直到遇到document对象或匹配参数until的元素为止
      匹配参数until的元素不会包含在查找结果中
      为parents、parentsUntil、nextAll、nextUntil、prevAll、prevUntil实现功能的基础函数
	*/
	dir: function( elem, dir, until ) {
		/*dir为查找方向，可选值有parentNode、nextSibling、previousSibling*/
		var matched = [],
			truncate = until !== undefined;

		while ( (elem = elem[ dir ]) && elem.nodeType !== 9 ) {
			if ( elem.nodeType === 1 ) {
				if ( truncate && jQuery( elem ).is( until ) ) {
					break;
				}
				matched.push( elem );
			}
		}
		return matched;
	},
    /*查找一个元素的所有兄弟，包括起始元素，但不包括参数elem
      为siblings、children的实现提供基础功能
    */
	sibling: function( n, elem ) {
		var matched = [];
        /*从父节点的第一个子节点开始循环，剔除elem本身，保存在matched数组*/
		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				matched.push( n );
			}
		}

		return matched;
	}
});

jQuery.fn.extend({
	/* 返回当前元素集合中，匹配target的集合*/
	has: function( target ) {
		/* 匹配target参数的jQuery对象*/
		var targets = jQuery( target, this ),
			l = targets.length;

		return this.filter(function() {
			var i = 0;
			for ( ; i < l; i++ ) {
				/* 判断当前集合元素是否包含匹配target对象，若包含则保留*/
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},
    /* 在当前元素集合和它们的祖先元素中查找与selectors匹配的最近元素，并返回一个新jQuery对象*/
	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			matched = [],
			// 获取与selectors匹配的元素集合
			pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;
        // 遍历当前元素集合
		for ( ; i < l; i++ ) {
			// 迭代当前元素集合每一项的祖先元素
			for ( cur = this[i]; cur && cur !== context; cur = cur.parentNode ) {
				// 若当前元素或其祖先元素不是文档片段，且匹配selectors，则保存在matched中
				// Always skip document fragments
				if ( cur.nodeType < 11 && (pos ?
					pos.index(cur) > -1 :

					// Don't pass non-elements to Sizzle
					cur.nodeType === 1 &&
						jQuery.find.matchesSelector(cur, selectors)) ) {

					matched.push( cur );
					break;
				}
			}
		}
        // 若多个，则需要排序去重，一个不需要处理。然后调用pushStack，重构为一个新的jQuery对象
		return this.pushStack( matched.length > 1 ? jQuery.unique( matched ) : matched );
	},
    
    /* 返回elem在当前元素集合的索引位置
       基础方法：indexOf.call()
    */
	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {
        
        /*未传入参数
            若当前元素集合第一个元素有父元素，则返回其在兄弟元素的索引
            若无，则返回-1*/
		// No argument, return index in parent
		if ( !elem ) {
			return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
		}

        /* 字符串
           先获取与elem匹配的元素集合
           再返回当前元素集合第一个元素在上一步获取的元素集合中的索引
        */
		// index in selector
		if ( typeof elem === "string" ) {
			return indexOf.call( jQuery( elem ), this[ 0 ] );
		}

		// Locate the position of the desired element
		return indexOf.call( this,
            /*若为jQuery对象，返回jQuery对象第一个元素在当前元素集合的索引
            否则为DOM元素，返回其在当前元素集合的索引*/
			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[ 0 ] : elem
		);
	},
    
    /*当前元素集合与匹配selector元素集合合并去重，返回一个新的jQuery对象*/
	add: function( selector, context ) {
		return this.pushStack(
			jQuery.unique(
				jQuery.merge( this.get(), jQuery( selector, context ) )
			)
		);
	},
    
    // 在对象栈中回溯到上一个位置，并返回当前DOM对象和之前的DOM对象整合后的对象
	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter(selector)
		);
	}
});

/*从一个元素出发，查找某个方向上的第1个节点元素
  为next、prev的实现提供基础功能
*/
function sibling( cur, dir ) {
	/*循环遍历，获得第一个为元素节点的元素*/
	while ( (cur = cur[dir]) && cur.nodeType !== 1 ) {}
	return cur;
}

/*DOM遍历模块的所有公开方法都指向了同样的但不是同一个模板函数
  这一部分基于工具函数jQuery.dir、sibling、jQuery.sibling实现
*/
jQuery.each({
	/*遍历函数*/
	/*返回指定DOM元素的父元素，并过滤掉文档片段节点*/
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	/*返回指定DOM元素的所有祖先元素*/
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	/*返回指定DOM元素的祖先元素，直到遇到匹配参数until的元素为止*/
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	/*返回指定DOM元素之后紧挨着的兄弟元素*/
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	/*返回指定DOM元素之前紧挨着的兄弟元素*/
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	/*返回指定DOM元素之后的所有兄弟元素*/
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	/*返回指定DOM元素之前的所有兄弟元素*/
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	/*返回指定DOM元素之后的所有兄弟元素，直到遇到untile元素结束*/
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	/*返回指定DOM元素之前的所有兄弟元素，直到遇到untile元素结束*/
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	/*返回指定DOM元素的所有兄弟元素*/
	siblings: function( elem ) {
		return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
	},
	/*返回指定DOM元素的所有子元素，但不包含文本节点和注释节点*/
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	/*返回指定DOM元素的子元素，且包含文本节点和注释节点，或返回当前元素的作为HTML对象的框架文档*/
	contents: function( elem ) {
		return elem.contentDocument || jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	/*公开方法，模板函数，闭包函数*/
	jQuery.fn[ name ] = function( until, selector ) {
		/*查找匹配的元素
		  当前DOM元素集合中每一项和until为参数，调用fn函数，并将fn函数返回值保存在matched数组中
		*/
		var matched = jQuery.map( this, fn, until );
        /*是否以Until为结尾的方法
          否，则jQuery.fn[name] = function(selector){}
          时，则jQuery.fn[name] = function(until,selector){}
        */
		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			/*过滤掉与selector选择器表达式不符合的元素*/
			matched = jQuery.filter( selector, matched );
		}

		if ( this.length > 1 ) {
			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				/*根据文档的顺序进行排序，并剔除重复元素*/
				jQuery.unique( matched );
			}
            
            /*若为查找父级或之前的元素，则按从顶层到底层排序*/
			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				matched.reverse();
			}
		}
        /*重新组合jQuery对象，并返回*/
		return this.pushStack( matched );
	};
});

/**空白字符：空格、制表、换行、中文全角空格等 
   匹配至少一个非空白字符
*/
var rnotwhite = (/\S+/g);


/* 声明optionsCache变量，缓存option
   once：确保这个回调列表只执行一次
   memory：保持以前的值和将添加到这个列表的后面的最新的值立即执行任何回调
           也就是说：记录上一次触发回调函数列表时的参数，之后添加的任何回调函数都将用记录的参数值立即调用
           主要用来实现Deferred的异步收集与pipe管道风格的数据传递的
   unique：确保一次只能添加一个回调，回调列表中无重复的回调
   stopOnFalse：当一个回调返回false时中断调用
   这四中option可以组合使用
*/
// String to Object options format cache
var optionsCache = {};

// Convert String-formatted options into Object-formatted ones and store in cache
function createOptions( options ) {
	var object = optionsCache[ options ] = {};
	jQuery.each( options.match( rnotwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	});
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */

 // 一个多用途的回调列表对象，提供了强大的方式来管理回调函数队列
 /* 观察者模式使用场合：当一个对象的改变需要同时改变其他对象，且它不知道
    具体有多少对象需要改变的时候，可以考虑观察者模式
    提供了add、remove、fire、lock等操作
    提供了once、memory、unique、stopOnFalse四个option，可进行特殊的控制
    Callbacks用于queue、ajax、Deferred对象中
    Callbacks是工厂模式，使用对象字面量声明一个新对象
 */
jQuery.Callbacks = function( options ) {

    // 字符串类型的option转为对象类型
	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
	    // 先在optionsCache缓存中查找，若无，则调用createOptions方法，生成该项
		( optionsCache[ options ] || createOptions( options ) ) :
		jQuery.extend( {}, options );

	var // 声明memory变量，用来存储上一次fire的值
	    // Last fire value (for non-forgettable lists)
		memory,
		// 回调是否被发布fire过
		// Flag to know if list was already fired
		fired,
		// 回调是否正在执行中
		// Flag to know if list is currently firing
		firing,
		// option为memory时，开始fire的回调列表索引位置
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// 待执行的最后一个回调函数的下标
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// 声明数组，用于存放回调（订阅者订阅的函数）
		// Actual callback list
		list = [],
		/* 非布尔操作符，
		   option为once（是一个对象）时，!对象返回false，stack为false
		   option.once为null时，!null返回true，stack为[]
		   (与操作符，第二个操作数为对象，第一个操作数为true，则返回该对象)
		*/
		// Stack of fire calls for repeatable lists
		stack = !options.once && [],

		// 用给定的参数调用所有的回调--实际触发回调函数的工具函数
		// Fire callbacks
		fire = function( data ) {
            /*在上一次fire中，保存上一次的值，用于memory为true时fire
              与布尔操作符
			  options.memory为对象，则返回第二个操作数，memory为data
			  options.memory为null，则返回null，memory为null
			*/
			memory = options.memory && data;
			fired = true;
			/* option为memory，则for循环从firingStart索引位置开始，
			   即从最新添加的回调列表执行一次
			*/
			firingIndex = firingStart || 0;
			firingStart = 0;
			// 回调列表长度
			firingLength = list.length;
			firing = true;
			// 执行回调列表
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				/*func对象原型方法apply：
				  list[firingIndex]函数内部this值为data[0],函数参数列表为data[1]
				  options.stopOnFalse为对象，则终止for循环，清空memory，防止在add中意外的fire
				  options.stopOnFalse为null，循环继续
				*/
				if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
					memory = false; // To prevent further calls using add
					break;
				}
			}
			firing = false;
			if ( list ) {
				// option为once时，stack为false
				if ( stack ) {
					if ( stack.length ) {
						fire( stack.shift() );
					}
				} else if ( memory ) {
					list = [];
				} else {
					// option为once时，将回调列表list禁用，即list为undefined
					self.disable();
				}
			}
		},
		// Actual Callbacks object
		self = {

			/* 添加一个回调函数或回调集合到变量list，
			   若为unique模式，若回调列表中存在，则不添加
			*/
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					/* 保存之前回调函数列表的长度*/
					// First, we save the current length
					var start = list.length;
					(function add( args ) {
						jQuery.each( args, function( _, arg ) {
							var type = jQuery.type( arg );
							if ( type === "function" ) {
								/* 非布尔操作符 
								   options.unique为对象，!options.unique为false，
								   则去判断回调是否存在list中
                                   options.unique为null，!options.unique为true，
                                   则不去判断回调是否存在list中，即不去重
								*/
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							// 若为数组或类数组对象，递归
							} else if ( arg && arg.length && type !== "string" ) {
								// Inspect recursively
								add( arg );
							}
						});
					})( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					/* 再一次add时，
					   memory保存着上一次fire的值,且不为空。
					   因此，在add时，用保持的以前的值，执行新添加的回调
					*/
					// With memory, if we're not firing then
					// we should call right away
					} else if ( memory ) {
						// memory为true时，回调列表fire开始的位置
						firingStart = start;
						// fire回调列表，此时的list包含最新添加的回调
						fire( memory );
					}
				}
				return this;
			},

			// 从回调列表中删除一个回调或回调集合
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					jQuery.each( arguments, function( _, arg ) {
						var index;
						while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
							list.splice( index, 1 );
							// Handle firing indexes
							if ( firing ) {
								if ( index <= firingLength ) {
									firingLength--;
								}
								if ( index <= firingIndex ) {
									firingIndex--;
								}
							}
						}
					});
				}
				return this;
			},

			// 确定列表中是否有这个回调
			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ? jQuery.inArray( fn, list ) > -1 : !!( list && list.length );
			},

			// 从列表中删除所有的回调
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				firingLength = 0;
				return this;
			},

			// 禁用回调列表中的回调，不再做任何事情
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},

			// 确定回调列表是否已被禁用
			// Is it disabled?
			disabled: function() {
				return !list;
			},

			// 锁定当前状态的回调列表
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory ) {
					self.disable();
				}
				return this;
			},

			// 确定回调列表是否已被锁定
			// Is it locked?
			locked: function() {
				return !stack;
			},

			// 使用给定的上下文和参数触发回调函数列表中的所有回调函数
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( list && ( !fired || stack ) ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					if ( firing ) {
						// js为松散类型，stack转为数组类型
						stack.push( args );
					} else {
						fire( args );
					}
				}
				return this;
			},
            
            // 用给定的参数触发回调函数列表中的所有的回调函数
			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},

			// 判断回调函数列表是否被触发过
			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};
    /* 返回回调函数列表*/
	return self;
};


jQuery.extend({
    /* Defered提供了一个抽象的非阻塞的解决方案（如异步请求的响应），它创建一个promise对象
       其目的是在未来某个时间点返回一个响应。简单来说就是一个异步/同步回调函数的处理方案
       说白了就是：一个可链式操作的对象，提供多个回调函数的注册，以及回调列队的回执，并转达
       任何异步操作成功或失败的消息
       在此，该对象称之为“异步队列”
       promise方法、DOM ready、Ajax模块及动画模块使用了Deferred模块
       jQuery.Deferred遵循Promise/A规范
       Deferred也可认为是一种观察者模式，
       可订阅done、fail、progress，
       通过resolve、reject、notify发布
    */
	Deferred: function( func ) {
		/* 工厂模式
		*/
		/* 动作接口定义
		   使用二维数组，保存了所有的接口API，
		   通过jQuery.each将这些接口分布挂在promise内部对象和deferred外部对象上
		*/
		var tuples = [
		        // 发布，订阅，监听列表，结果
				// action, add listener, listener list, final state
				[ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks("memory") ]
			],
            /*异步队列状态 待定pending、成功resolved、失败rejected*/
			state = "pending",
			/* 内部promise对象
			   不包括resolve、reject、notify和resolveWith、rejectWith、notifyWith等能改变deferred对象状态的方法
			   只包括done、fail、progress
			*/
			promise = {
				/* 获取异步队列的状态*/
				state: function() {
					return state;
				},
				/* 添加回调函数，当异步队列处于成功或失败状态时被调用*/
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				// then方法，同时添加成功回调函数、失败回调函数、消息回调函数
				then: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;
					/* 以function(newDefer){...}作为参数，调用jQuery.Deferred方法；
					   当参数为函数时，则以Deferred为上下文、Deferred为参数，执行函数；
					   返回promise对象，以支持链式用法
					*/
					return jQuery.Deferred(function( newDefer ) {
						// 遍历tuples，newDefer就是之前已经定义的deferred对象
						jQuery.each( tuples, function( i, tuple ) {
							// 取出传入的回调函数
							var fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];

							/* 为done、fail、progress(Callbacks.add)添加回调函数
							   针对deferred对象直接做处理
							   当回调函数被触发时，执行回调函数
							*/
							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[ tuple[1] ](function() {
								/* 若fn存在，则调用fn
								   this一般为Deferred对象，arguments一般为触发时传入的参数
								*/
								var returned = fn && fn.apply( this, arguments );
								// fn返回一个异步队列对象，则在该对象上添加之前deferred对象的resolve、reject和notify函数
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.done( newDefer.resolve )
										.fail( newDefer.reject )
										.progress( newDefer.notify );
								} else {
								/* fn不返回一个异步队列对象，则执行回调函数
								*/
									newDefer[ tuple[ 0 ] + "With" ]( this === promise ? newDefer.promise() : this, fn ? [ returned ] : arguments );
								}
							});
						});
						// 防止内存泄漏
						fns = null;
					}).promise();
				},
				/* 返回一个Promise对象用来观察当某个类型的所有行动绑定到集合，排队与否还是已经完成
			       默认情况下，type是fx，意味着当选定的元素已完成所有动画，返回的Promise是解决的
			       解决上下文和唯一的参数是哪个集合到promise()调用
			       如果target是提供，promise()将附加到它的方法，然后返回这个对象，而不是创建一个新的。
			       这对在已经存在的对象上附加Promise的行为非常有用
			       type是需要处理的字符串，target是附加promise方法的Object
			       返回当前Deferred对象的只读副本，或为普通对象增加异步队列的功能
			    */
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					/* 若obj不为null，则使用jQuery.extend，
					   将promise的属性和方法挂在obj对象上，即为普通对象增加异步队列的功能
					*/
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			// 外部接口对象
			deferred = {};
        /* 返回一个异步队列的副本，通过过滤函数过滤当前异步队列的状态和值*/
		// Keep pipe for back-compat
		promise.pipe = promise.then;

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			// list就是jQuery.Callbacks
			var list = tuple[ 2 ],
				stateString = tuple[ 3 ];

			// promise[ done | fail | progress ] = list.add
			promise[ tuple[1] ] = list.add;

			// Handle state
			if ( stateString ) {
				// 添加回调函数：匿名函数、disable、lock
				list.add(function() {
					// state = [ resolved | rejected ]
					state = stateString;
                
                /* 位操作符
                   按位异或^，将两侧操作数转为数值，再转为二进制，
                   同一位上，相同则为0，不同则为1，再转为十进制，即可
                */
                /* i为0时，添加reject_list.disable函数
                   i为1时，添加resolve_list.disable函数
                */
				// [ reject_list | resolve_list ].disable; progress_list.lock
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}
            /* 定义调用方法 resolveWith | rejectWith | notifyWith（jQuery.Callbacks的fireWith）
            */
			// deferred[ resolve | reject | notify ]
			deferred[ tuple[0] ] = function() {
				deferred[ tuple[0] + "With" ]( this === deferred ? promise : this, arguments );
				return this;
			};
			/* resolveWith | rejectWith | notifyWith = jQuery.Callbacks的fireWith
			   callbacks.fireWith是访问给定的上下文和参数列表中的所有回调
			*/
			deferred[ tuple[0] + "With" ] = list.fireWith;
		});
        
        // 将promise对象挂载deferred对象上
		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			//func函数this为deferred，且以deferred为参数，执行func函数
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},
     
    /* 提供一种方法来执行一个或多个对象的回调函数；
       如果传入多个异步队列，该方法将返回一个新的主异步队列的只读副本，这个副本将
       跟踪所传入的异步队列的最终状态。一旦所有异步队列都变成成功状态，主异步队列
       的成功回调函数将被调用，参数是包含了所有异步队列成功参数的数组；如果其中一
       个异步队列变成失败状态，主异步队列的失败回调函数将被调用，参数是失败异步队
       列的失败参数；
       如果传入单个异步队列，该方法将返回只读副本，可在只读副本上继续调用添加回调
       函数的方法（如deferred.then），当异步队列进入成功或失败状态时，相应状态的
       回调函数被执行，通常是由创建异步队列的代码触发执行；
       如果传入一个非异步队列参数，非异步队列将被当作一个成功状态的异步队列，所有
       的成功回调函数会被立即执行，参数是这个非异步队列参数；
       如果没有传入参数，则创建一个异步队列并返回它的只读副本，立即执行所有成功回
       调函数
    */
	// Deferred helper
	when: function( subordinate /* , ..., subordinateN */ ) {
		var i = 0,
		    // resolveValues为传参数组
			resolveValues = slice.call( arguments ),
			length = resolveValues.length,
            
            /* length不是1
               length是1，判断subordinate.promise是否为function，若是，remaining等于1
               也就是说remaining等于1时，subordinate一定是Deferred对象
            */
			// the count of uncompleted subordinates
			remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

            /* 如果resolveValues只有一个Deferred对象，deferred为subordinate
               如果不只有一个，deferred为jQuery.Deferred()
               建立主异步队列对象
            */
			// the master Deferred. If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

            /* 通过判断异步对象执行的次数来决定是不是已经完成了所有的处理或者是失败处理
            */
			// Update function for both resolve and progress values
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					contexts[ i ] = this;

					/* 当promise是解决的（done）时，values是resolveValues
					   当promise是访问deferred对象（progress）时，values是progressValues
					*/
					values[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;

					/* 全等操作符
					*/
					if ( values === progressValues ) {
						// 触发主异步队列对象进度通知回调函数
						deferred.notifyWith( contexts, values );
					} else if ( !( --remaining ) ) {
						/* 当remaining为0时，表明子异步队列全部触发完成，此时触发主异步队列对象成功回调函数*/
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;

		// add listeners to Deferred subordinates; treat others as resolved
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
					    // done订阅的是updateFunc返回的匿名函数
						.done( updateFunc( i, resolveContexts, resolveValues ) )
						.fail( deferred.reject )
						.progress( updateFunc( i, progressContexts, progressValues ) );
				} else {
					--remaining;
				}
			}
		}

		// if we're not waiting on anything, resolve the master
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

        // 链式操作
		return deferred.promise();
	}
});


/*ready模块*/
// The deferred used on DOM ready
/*监听函数列表，用于存放ready事件监听函数*/
var readyList;

jQuery.fn.ready = function( fn ) {
	// Add the callback
	jQuery.ready.promise().done( fn );

	return this;
};

jQuery.extend({

	/*状态标记*/
	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,
    
    /*等待计数器*/
	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,
    
    /*延迟或恢复ready事件的触发，通常用在ready事件触发之前，由动态脚本加载器加载其他JS脚本。
      这个方法必须尽早调用，若在ready事件触发后再调用则无任何效果
      可多次执行holdReady(true)来多次延迟ready事件，但需要执行相同次数的holdReady(false)
      来恢复ready事件
    */
	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},
    // 触发ready事件监听函数列表readyList
	// Handle when the DOM is ready
	ready: function( wait ) {

        /*判断是否延迟ready事件的触发*/
		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}
        
        /*记录DOM的状态*/
		// Remember that the DOM is ready
		jQuery.isReady = true;

        /*判断是否延迟ready事件的触发*/
		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}
        
        /*执行ready事件监听函数列表readyList*/
		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );
        
        /*执行已经绑定的ready事件监听函数，执行完毕后，清除ready事件*/
		// Trigger any bound ready events
		if ( jQuery.fn.triggerHandler ) {
			jQuery( document ).triggerHandler( "ready" );
			jQuery( document ).off( "ready" );
		}
	}
});

// ready事件和该事件自动消除方法
/**
 * The ready event handler and self cleanup method
 */
function completed() {
	document.removeEventListener( "DOMContentLoaded", completed, false );
	window.removeEventListener( "load", completed, false );
	jQuery.ready();
}

jQuery.ready.promise = function( obj ) {
	/*ready未被调用过，则初始化readyList（异步队列）*/
	if ( !readyList ) {

		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called after the browser event has already occurred.
		// we once tried to use readyState "interactive" here, but it caused issues like the one
		// discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15

		/** document的文件加载状态有：
		    uninitialized：初始状态
		    loading：HTML文档在加载
		    interactive：HTML文档已完成加载，但资源文件在加载
		    complete：资源文件加载完毕，即将触发load事件
		*/
		// 页面加载完毕后的动作，即文档已就绪，则立即调用jQuery.ready
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			setTimeout( jQuery.ready );
        // 在其他状态下，定义DOMContentLoaded事件，执行completed函数
		} else {
			/** DOMContentLoaded事件是HTML文档解析并加载完毕时，被触发的，此时，资源（样式、图片等）文件未加载完，
			    即document.readyState为interactive时 */
            // 为document添加DOMContentLoaded事件，在冒泡阶段触发，事件触发后，去执行completed函数中的代码
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", completed, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", completed, false );
		}
	}
	return readyList.promise( obj );
};
// 尽管用户不使用ready事件，也手动触发ready事件
// Kick off the DOM ready check even if the user does not
jQuery.ready.promise();



/* 可以为集合中的元素设置一个或多个属性值，或读取第一个元素的属性值。
*/
// Multifunctional method to get and set values of a collection
// The value/s can optionally be executed if it's a function
var access = jQuery.access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
	var i = 0,
		len = elems.length,
		bulk = key == null;

    // 设置多个值
	// Sets many values
	if ( jQuery.type( key ) === "object" ) {
		chainable = true;
		for ( i in key ) {
			// 递归迭代
			jQuery.access( elems, fn, i, key[i], true, emptyGet, raw );
		}
    
    // 设置单个值
	// Sets one value
	} else if ( value !== undefined ) {
		chainable = true;

		if ( !jQuery.isFunction( value ) ) {
			raw = true;
		}

		if ( bulk ) {
			// Bulk operations run against the entire set
			if ( raw ) {
				fn.call( elems, value );
				// 此处有闭包，为防止内存泄漏。因此，将fn置为null
				fn = null;

			// ...except when executing function values
			} else {
				bulk = fn;
				fn = function( elem, key, value ) {
					return bulk.call( jQuery( elem ), value );
				};
			}
		}

		if ( fn ) {
			// 遍历元素集合，为每个元素执行回调函数fn
			for ( ; i < len; i++ ) {
				fn( elems[i], key, raw ? value : value.call( elems[i], i, fn( elems[i], key ) ) );
			}
		}
	}
    // 若key是对象，则返回elems集合
	return chainable ?
		elems :
        /* 读取属性
           elems不为空，则为第一个元素执行回调函数fn，读取key对应的属性值
           否则返回undefined
        */
		// Gets
		bulk ?
			fn.call( elems ) :
			len ? fn( elems[0], key ) : emptyGet;
};


/**判断对象是否有保存数据的能力
   DOM节点仅支持元素节点和文档根节点
   任何对象
 * Determines whether an object can have data
 */
jQuery.acceptData = function( owner ) {
	// Accepts only:
	//  - Node
	//    - Node.ELEMENT_NODE
	//    - Node.DOCUMENT_NODE
	//  - Object
	//    - Any
	/* jshint -W018 */
	return owner.nodeType === 1 || owner.nodeType === 9 || !( +owner.nodeType );
};

// Data类，用于数据缓存--构造函数+原型模式
function Data() {

	/* 设置cache对象中属性0的访问器属性
	   属性0只设置了[[Get]]，因此，该属性只能读取
	*/
	// Support: Android < 4,
	// Old WebKit does not have Object.preventExtensions/freeze method,
	// return new empty object instead with no [[set]] accessor
	Object.defineProperty( this.cache = {}, 0, {
		get: function() {
			return {};
		}
	});
    
    /* Data实例对象扩展expando属性，用于把当前数据缓存的UUID值做一个节点的属性
       给写入到指定的元素上形成关联桥梁
       说白了，就是将this.expando的值作为对象的属性，这个属性用来保存uid的值
       Data实例化一次，产生一次expando，并是不调用一次$().data()/$.data()就生成一次
    */
	this.expando = jQuery.expando + Math.random();
}

// 设置uid的默认初始值,该值被jQuery对象expando属性保存着
Data.uid = 1;
Data.accepts = jQuery.acceptData;

Data.prototype = {
	// 设置、获取uid
	key: function( owner ) {
		// We can accept data for non-element nodes in modern browsers,
		// but we should not, see #8335.
		// Always return the key for a frozen object.
		if ( !Data.accepts( owner ) ) {
			return 0;
		}

		var descriptor = {},
		    // 判断对象是否已经存在uid
			// Check if the owner object already has a cache key
			unlock = owner[ this.expando ];
        /* 若unlock为空，则生成uid，即owner[this.expando] = unlock = Data.uid++
           这样，在cache对象中，保持了数据的唯一性
        */
		// If not, create one
		if ( !unlock ) {
			// 后置++，先赋值给unlock，uid再自增1
			unlock = Data.uid++;
            
            // 为DOM对象或js对象定义[this.expando]属性，其值为unlock
			// Secure it in a non-enumerable, non-writable property
			try {
				descriptor[ this.expando ] = { value: unlock };
				Object.defineProperties( owner, descriptor );

			// Support: Android < 4
			// Fallback to a less secure definition
			} catch ( e ) {
				descriptor[ this.expando ] = unlock;
				jQuery.extend( owner, descriptor );
			}
		}
        
        // 若this.cache[unlock]不存在，则置为空值对象
		// Ensure the cache object
		if ( !this.cache[ unlock ] ) {
			this.cache[ unlock ] = {};
		}
        
        // 返回唯一标识uid
		return unlock;
	},
	// 保存缓存数据
	set: function( owner, data, value ) {
		var prop,
			// There may be an unlock assigned to this node,
			// if there is no entry for this "owner", create one inline
			// and set the unlock as though an owner entry had always existed
			// 获取uid
			unlock = this.key( owner ),
			cache = this.cache[ unlock ];
		// Handle: [ owner, key, value ] args
		if ( typeof data === "string" ) {
			cache[ data ] = value;

		// Handle: [ owner, { properties } ] args
		} else {
			// Fresh assignments by object are shallow copied
			if ( jQuery.isEmptyObject( cache ) ) {
				jQuery.extend( this.cache[ unlock ], data );
			// Otherwise, copy the properties one-by-one to the cache object
			} else {
				for ( prop in data ) {
					cache[ prop ] = data[ prop ];
				}
			}
		}
		return cache;
	},
	/* 获取缓存数据*/
	get: function( owner, key ) {
		// Either a valid cache is found, or will be created.
		// New caches will be created and the unlock returned,
		// allowing direct access to the newly created
		// empty data object. A valid owner object must be provided.
		var cache = this.cache[ this.key( owner ) ];

		return key === undefined ?
			cache : cache[ key ];
	},
	access: function( owner, key, value ) {
		var stored;
		// In cases where either:
		//
		//   1. No key was specified
		//   2. A string key was specified, but no value provided
		//
		// Take the "read" path and allow the get method to determine
		// which value to return, respectively either:
		//
		//   1. The entire cache object
		//   2. The data stored at the key
		//
		if ( key === undefined ||
				((key && typeof key === "string") && value === undefined) ) {

			stored = this.get( owner, key );

			return stored !== undefined ?
				stored : this.get( owner, jQuery.camelCase(key) );
		}

		// [*]When the key is not a string, or both a key and value
		// are specified, set or extend (existing objects) with either:
		//
		//   1. An object of properties
		//   2. A key and value
		//
		this.set( owner, key, value );

		// Since the "set" path can have two possible entry points
		// return the expected data based on which path was taken[*]
		return value !== undefined ? value : key;
	},
	/* 删除缓存数据*/
	remove: function( owner, key ) {
		var i, name, camel,
			unlock = this.key( owner ),
			cache = this.cache[ unlock ];
        /* 若未传入key，则DOM元素或js对象缓存数据全部清除*/
		if ( key === undefined ) {
			this.cache[ unlock ] = {};

		} else {
			/* 若key为字符串数组，则转为驼峰式，并遍历删除*/
			// Support array or space separated string of keys
			if ( jQuery.isArray( key ) ) {
				// If "name" is an array of keys...
				// When data is initially created, via ("key", "val") signature,
				// keys will be converted to camelCase.
				// Since there is no way to tell _how_ a key was added, remove
				// both plain key and camelCase key. #12786
				// This will only penalize the array argument path.
				name = key.concat( key.map( jQuery.camelCase ) );
			} else {
				/* key是字符串(或带空格字符串），转为驼峰式*/
				camel = jQuery.camelCase( key );
				/* 若key存在于缓存对象中，则name为数组*/
				// Try the string as a key before any manipulation
				if ( key in cache ) {
					name = [ key, camel ];
				} else {
					/* 若在数据对象中，则创建数组，
                       若不在，则匹配rnotwhite正则表达式，返回的数组，进行缓存数据删除
					*/
					// If a key with the spaces exists, use it.
					// Otherwise, create an array by matching non-whitespace
					name = camel;
					name = name in cache ?
						[ name ] : ( name.match( rnotwhite ) || [] );
				}
			}

			i = name.length;
			while ( i-- ) {
				delete cache[ name[ i ] ];
			}
		}
	},
	/* 判断DOM对象或js对象是否有缓存数据*/
	hasData: function( owner ) {
		return !jQuery.isEmptyObject(
			this.cache[ owner[ this.expando ] ] || {}
		);
	},
	discard: function( owner ) {
		if ( owner[ this.expando ] ) {
			delete this.cache[ owner[ this.expando ] ];
		}
	}
};
// jQuery内部使用的数据
var data_priv = new Data();

// 用户自定义的数据
var data_user = new Data();

/*
	Implementation Summary

	1. Enforce API surface and semantic compatibility with 1.9.x branch
	2. Improve the module's maintainability by reducing the storage
		paths to a single mechanism.
	3. Use the same single mechanism to support "private" and "user" data.
	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
	5. Avoid exposing implementation details on user objects (eg. expando properties)
	6. Provide a clear path for implementation upgrade to WeakMap in 2014
*/
var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
	rmultiDash = /([A-Z])/g;
/* 解析HTML5属性，data-*/
function dataAttr( elem, key, data ) {
	var name;

	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {
		name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();
		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
					data === "false" ? false :
					data === "null" ? null :
					// Only convert to a number if it doesn't change the string
					+data + "" === data ? +data :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
					data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			data_user.set( elem, key, data );
		} else {
			data = undefined;
		}
	}
	return data;
}
/* $().data()方法代码中，有elem = this[ 0 ]，elem为DOM元素，两次为相同的对象，uid相同，缓存区相同，因此会被覆盖。
   $.data()代码中，elem是jQuery的实例对象，不同的实例对象，uid不同，分配了不同的缓存区，因此不覆盖。
*/
jQuery.extend({
	/* 判断DOM元素或js对象是否有缓存数据*/
	hasData: function( elem ) {
		return data_user.hasData( elem ) || data_priv.hasData( elem );
	},
    
    /* 用户自定义数据缓存，
       $.data()，两次使用jQuery获取相同DOM节点，并使用$.data()和相同key存储不同的数据，两者不覆盖
    */
	data: function( elem, name, data ) {
		return data_user.access( elem, name, data );
	},
    /* 删除缓存数据*/
	removeData: function( elem, name ) {
		data_user.remove( elem, name );
	},

    // 内部数据缓存
	// TODO: Now that all calls to _data and _removeData have been replaced
	// with direct calls to data_priv methods, these can be deprecated.
	_data: function( elem, name, data ) {
		return data_priv.access( elem, name, data );
	},

	_removeData: function( elem, name ) {
		data_priv.remove( elem, name );
	}
});

jQuery.fn.extend({

	/* 在元素上存放或读取数据，返回jQuery对象 
	   两次使用jQuery获取相同DOM节点，并使用$().data()、相同的uid存储不同的数据，后者会覆盖前者
	*/
	data: function( key, value ) {
		var i, name, data,
			elem = this[ 0 ],
			attrs = elem && elem.attributes;
        /* 未传入参数*/
		// Gets all values
		if ( key === undefined ) {
			/* this指向$()(jQuery实例对象)*/
			if ( this.length ) {
				/* 获取缓存数据*/
				data = data_user.get( elem );

				if ( elem.nodeType === 1 && !data_priv.get( elem, "hasDataAttrs" ) ) {
					i = attrs.length;
					while ( i-- ) {

						// Support: IE11+
						// The attrs elements can be null (#14894)
						if ( attrs[ i ] ) {
							name = attrs[ i ].name;
							if ( name.indexOf( "data-" ) === 0 ) {
								/* data-转为驼峰式*/
								name = jQuery.camelCase( name.slice(5) );
								dataAttr( elem, name, data[ name ] );
							}
						}
					}
					/* 将HTML5属性data-进行内部数据缓存*/
					data_priv.set( elem, "hasDataAttrs", true );
				}
			}
            
            /* 返回第一个DOM元素的缓存数据*/
			return data;
		}
        
        /* 若key为对象，为每个DOM元素设置数据缓存*/
		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each(function() {
				data_user.set( this, key );
			});
		}

		return access( this, function( value ) {
			var data,
				camelKey = jQuery.camelCase( key );

			// The calling jQuery object (element matches) is not empty
			// (and therefore has an element appears at this[ 0 ]) and the
			// `value` parameter was not undefined. An empty jQuery object
			// will result in `undefined` for elem = this[ 0 ] which will
			// throw an exception if an attempt to read a data cache is made.
			/* 若只传入key，value未传入；
               获取对应的缓存数据，若无，则返回undefined
			*/
			if ( elem && value === undefined ) {
				// Attempt to get data from the cache
				// with the key as-is
				data = data_user.get( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// Attempt to get data from the cache
				// with the key camelized
				data = data_user.get( elem, camelKey );
				if ( data !== undefined ) {
					return data;
				}

				// Attempt to "discover" the data in
				// HTML5 custom data-* attrs
				data = dataAttr( elem, camelKey, undefined );
				if ( data !== undefined ) {
					return data;
				}

				// We tried really hard, but the data doesn't exist.
				return;
			}
            /* 若key和value均传入，则进行数据缓存*/
			// Set the data...
			this.each(function() {
				// First, attempt to store a copy or reference of any
				// data that might've been store with a camelCased key.
				var data = data_user.get( this, camelKey );

				// For HTML5 data-* attribute interop, we have to
				// store property names with dashes in a camelCase form.
				// This might not apply to all properties...*
				data_user.set( this, camelKey, value );

				// *... In the case of properties that might _actually_
				// have dashes, we need to also store a copy of that
				// unchanged property.
				if ( key.indexOf("-") !== -1 && data !== undefined ) {
					data_user.set( this, key, value );
				}
			});
		}, null, value, arguments.length > 1, null, true );
	},
    /* 删除缓存数据*/
	removeData: function( key ) {
		/* 遍历DOM元素，删除对应的缓存数据*/
		return this.each(function() {
			data_user.remove( this, key );
		});
	}
});


/* 队列Queue模块，基于数据缓存模块和数组实现的*/
jQuery.extend({
	/* 函数入队，并返回队列
	   只传入elem，返回匹配元素的默认函数队列
	   只传入elem、type，返回匹配元素用户自定义的函数队列
	   传入elem、type、data，修改匹配元素的函数队列：
	       data是函数数组，用函数数组替换原函数队列
	       data是函数，则将函数队列添加到原函数队列
	*/
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			/* 从缓存对象中，读取队列*/
			queue = data_priv.get( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				/*queue是undefined，或data是数组，则data覆盖原来的缓存队列，并将data返回queue*/
				if ( !queue || jQuery.isArray( data ) ) {
					queue = data_priv.access( elem, type, jQuery.makeArray(data) );
				} else {
					/* data被添加到原来的缓存队列*/
					queue.push( data );
				}
			}
			return queue || [];
		}
	},
    /* 函数出队，并执行*/
	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			/* hooks为包含empty方法的缓存对象*/
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};
        
        /* 若是inprogress站位符，则直接忽略跳过，获取下一个队列中的函数*/
		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {
            
            /* 若为默认队列，添加inprogress占位符*/
			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}
            
            /* 删除上一个函数队列的stop函数*/
			// clear up the last queue stop function
			delete hooks.stop;
			/* 执行函数
               next封装了jQuery.dequeue的函数，不会自动执行，要在出队的函数返回前手动调用next，以使下一个函数得以顺序执行
               hooks为包含empty方法的缓存对象
			*/
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			/* 函数队列全部执行，删除队列缓存对象*/
			hooks.empty.fire();
		}
	},
    
	/* 返回一个包含empty方法的缓存对象*/
	// not intended for public consumption - generates a queueHooks object, or returns the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return data_priv.get( elem, key ) || data_priv.access( elem, key, {
			empty: jQuery.Callbacks("once memory").add(function() {
				data_priv.remove( elem, [ type + "queue", key ] );
			})
		});
	}
});

jQuery.fn.extend({
	/* 读取函数队列，或函数入队*/
	queue: function( type, data ) {
		var setter = 2;
        
        /* 若type不为string，则type为fx默认值，将type赋值给data*/
		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

        /* 只传入type，则获取第一个DOM元素的函数队列*/
		if ( arguments.length < setter ) {
			return jQuery.queue( this[0], type );
		}

		return data === undefined ?
			this :
			/* 遍历DOM元素，修改每个DOM项的函数队列*/
			this.each(function() {
				var queue = jQuery.queue( this, type, data );

				// ensure a hooks for this queue
				jQuery._queueHooks( this, type );
                
                /*fx，且不为inprogress，则出队，执行函数*/
				if ( type === "fx" && queue[0] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			});
	},
	/* 用于出队并执行匹配元素关联的函数队列中的下一个函数*/
	dequeue: function( type ) {
		/* 遍历DOM元素*/
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	/* 移除匹配元素的函数队列中所有未执行的函数*/
	clearQueue: function( type ) {
		/* 将缓存对象中的值置为空数组*/
		return this.queue( type || "fx", [] );
	},

	/* 观察函数队列是否完成，返回异步队列只读副本
	*/
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
		    /* 计数器*/
			count = 1,
			/* 异步队列*/
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			/* 计数器-1的回调函数--特殊函数*/
			resolve = function() {
				/* 计数器为0时，即所有函数队列都被执行完毕时，
				   可以自动销毁每个DOM元素上的函数队列的缓存对象，
				   不需要用户手动每个去销毁
				*/
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";
        
        /* 遍历DOM元素*/
		while ( i-- ) {
			tmp = data_priv.get( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				/* 为每个DOM项缓存对象empty回调函数列表添加特殊函数*/
				tmp.empty.add( resolve );
			}
		}
		resolve();
		/* 返回异步队列的只读副本*/
		return defer.promise( obj );
	}
});



var pnum = (/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/).source;

var cssExpand = [ "Top", "Right", "Bottom", "Left" ];

var isHidden = function( elem, el ) {
		// isHidden might be called from jQuery#filter function;
		// in that case, element will be second argument
		elem = el || elem;
		return jQuery.css( elem, "display" ) === "none" || !jQuery.contains( elem.ownerDocument, elem );
	};

var rcheckableType = (/^(?:checkbox|radio)$/i);



(function() {
	var fragment = document.createDocumentFragment(),
		div = fragment.appendChild( document.createElement( "div" ) ),
		input = document.createElement( "input" );

	// #11217 - WebKit loses check when the name is after the checked attribute
	// Support: Windows Web Apps (WWA)
	// `name` and `type` need .setAttribute for WWA
	input.setAttribute( "type", "radio" );
	input.setAttribute( "checked", "checked" );
	input.setAttribute( "name", "t" );

	div.appendChild( input );

    /* 检验当前浏览器在复制check元素时，是否可以复制checked状态*/
	// Support: Safari 5.1, iOS 5.1, Android 4.x, Android 2.3
	// old WebKit doesn't clone checked state correctly in fragments
	support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;

    /* 检验当前浏览器在复制DOM元素时，是否可以复制textarea元素和check元素的defaultValue*/
	// Make sure textarea (and checkbox) defaultValue is properly cloned
	// Support: IE9-IE11+
	div.innerHTML = "<textarea>x</textarea>";
	support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;
})();
var strundefined = typeof undefined;
/* 检验当前浏览器是否支持onfocusin事件*/
support.focusinBubbles = "onfocusin" in window;


var /*键盘事件类型*/
	rkeyEvent = /^key/,
	/*鼠标事件类型*/
	rmouseEvent = /^(?:mouse|pointer|contextmenu)|click/,
	/*焦点事件类型*/
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
 /*事件模块底层方法*/
jQuery.event = {

	global: {},
    /*绑定一个或多个类型的事件监听函数
      elem是绑定的DOM元素
      types是事件类型
      handler是监听函数
      data是自定义数据
      selector是选择器表达式
      实际上只是在DOM元素上绑定主监听函数，其他函数被封装为监听对象，存入缓存对象handle内
    */
	add: function( elem, types, handler, data, selector ) {
        /* elemData：DOM元素关联的缓存对象
           eventHandle：主监听函数
           events：DOM元素关联的事件缓存对象
           t：遍历事件类型计数器
           handleObj：封装了事件函数的监听对象
           handleObjIn：传入的监听对象
           handlers：事件类型对应的监听对象数组
           type：单个事件类型
           namespaces：命名空间数组
           special：特殊事件类型对应的修正对象
           tmp：数组，用于存放正则rtypenamespace对事件类型的匹配结果
           origType：原始的事件类型，tmp中通过正则表达式获得的事件类型
        */
		var handleObjIn, eventHandle, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			/*获取缓存数据*/
			elemData = data_priv.get( elem );
        
        /*过滤文本节点、注释节点*/
		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}
        
        /*待绑定监听函数是自定义监听对象，且含有handler属性时*/
		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			/*备份传入的监听对象*/
			handleObjIn = handler;
			/*handle定义为一个监听函数*/
			handler = handleObjIn.handler;
			/*选择器表达式重新赋值*/
			selector = handleObjIn.selector;
		}
        
        /*为监听函数分配一个唯一标识guid*/
		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}
        /*取出或初始化事件缓存对象
          events保存着不同事件类型的监听对象数组
        */
		// Init the element's event structure and main handler, if this is the first
		if ( !(events = elemData.events) ) {
			events = elemData.events = {};
		}
		/*取出或初始化主监听函数
		  handle保存着主监听函数
          对于一个DOM元素，只会为她分配一个主监听函数，且所有类型的事件在被绑定时，真正会绑定到元素上的只有这个主监听函数
		*/
		if ( !(eventHandle = elemData.handle) ) {
			/*若不存在，表示从未在当前元素上绑定过事件，则为当前元素初始化一个主监听函数，并把它存储到事件缓存对象handle上
              主监听函数是dispatch的封装
			*/
			eventHandle = elemData.handle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== strundefined && jQuery.event.triggered !== e.type ?
					jQuery.event.dispatch.apply( elem, arguments ) : undefined;
			};
		}
        /*事件类型转为数组*/
		// Handle multiple events separated by a space
		types = ( types || "" ).match( rnotwhite ) || [ "" ];
		t = types.length;
		/*遍历事件类型*/
		while ( t-- ) {
			/*解析事件类型和命名空间*/
			tmp = rtypenamespace.exec( types[t] ) || [];
			/*事件类型*/
			type = origType = tmp[1];
			/*命名空间，并排序，是为了在移除事件时简化对命名空间的匹配过程*/
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}
            
            /*尝试从修正对象集中获取当前事件类型对应的修正对象，若未取到，则默认为一个空对象*/
			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

            /*修正type为实际使用的事件类型
              如果传入了参数selector，则绑定的是代理事件，可能需要把当前事件类型修正为可冒泡的事件类型
              如果未传入，则是普通的事件绑定，但也可能因为浏览器对某些特殊事件不支持或支持得不完整，需要
              修正为支持度更好的事件类型
            */
			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};
            
            /*封装传入的监听函数为对象，并添加一些属性*/
			// handleObj is passed to all event handlers
			handleObj = jQuery.extend({
				type: type, //修正后实际事件类型
				origType: origType,//为修正的原始事件类型
				data: data,//自定义数据
				handler: handler,//主监听函数
				guid: handler.guid,//主监听函数id
				selector: selector,//选择器表达式
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),//是否需要context
				namespace: namespaces.join(".")//命名空间
			}, handleObjIn );
            
            /*若是第一个绑定该类型的事件，则初始化监听对象数组，并绑定主监听函数*/
			// Init the event handler queue if we're the first
			if ( !(handlers = events[ type ]) ) {
				handlers = events[ type ] = [];
				/*代理监听对象的位置计数器*/
				handlers.delegateCount = 0;
                /*为DOM元素绑定主监听函数*/
				// Only use addEventListener if the special events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );
					}
				}
			}
            /*若修正对象存在add，则调用add方法，绑定监听函数*/
			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}
            /*将监听对象插入到监听对象数组*/
			// Add to the element's handler list, delegates in front
			if ( selector ) {
				/*若传入selector，则将监听对象插入代理事件位置上*/
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}
            /*记录绑定过的事件类型*/
			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

	},
    /*移除一个或多个类型的事件监听函数
      mappedTypes是布尔值，指解除事件时是否严格检测事件的类型。
      若未传入该参数，则需要检测已绑定事件的原始类型与传入的事件类型types是否匹配
      如果未true，则不执行检测
    */
	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var j, origCount, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			/*数据缓存对象*/
			elemData = data_priv.hasData( elem ) && data_priv.get( elem );
        /*过滤没有数据缓存或事件缓存对象的情况*/
		if ( !elemData || !(events = elemData.events) ) {
			return;
		}
        
        /*事件类型转数组*/
		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( rnotwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();
            /*type不存在时，解除所有的绑定监听函数*/
			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}
            /*修正事件类型*/
			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			/*获取监听对象数组*/
			handlers = events[ type ] || [];
			/*若存在命名空间，则创建命名空间正则表达式，用于检测*/
			tmp = tmp[2] && new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			/*遍历监听对象数组*/
			while ( j-- ) {
				/*取出监听对象*/
				handleObj = handlers[ j ];
                /*从事件原始类型、guid、命名空间、选择器表达式进行判断是否调用移除方法
                  若同时满足以下条件，则调用移除方法：
                  1、不需要检测原始事件类型或监听对象原始事件类型与传入的相等
                  2、未传入监听函数或监听对象函数唯一标识与传入的相等
                  3、没有命名空间或监听对象命名空间符合传入的命名空间的规则
                  4、未传入选择器表达式或监听对象选择器表达式与传入的相等或者（选择器表达式为通配符和监听对象有选择器表达式）
                */
				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );
                    /*selector存在，则是代理事件，代理计时器自减*/
					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					/*修正对象存在remove方法，则调用该方法，解除监听对象*/
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			/*当当前监听对象数组变为空时，表示对应的所有事件都已经被移除，因此，应该从当前DOM元素解除主监听函数*/
			if ( origCount && !handlers.length ) {
				/*优先调用修正对象的teardown方法，若不存在或返回为false时，则调用jQuery静态方法removeEvent，移除主监听函数*/
				if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}
        
        /*若事件缓存对象为空对象，则移除主监听函数和events属性*/
		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			delete elemData.handle;
			data_priv.remove( elem, "events" );
		}
	},
    /*手动触发事件，执行绑定的事件监听函数和默认行为，且会模拟冒泡过程
      onlyHandlers是布尔值，指示是否只执行监听函数，而不会触发默认行为
                  true是执行监听函数，且不会触发默认行为
    */
	trigger: function( event, data, elem, onlyHandlers ) {

        /* type是事件类型，若event含有type属性，表示参数event可能是自定义事件或jQuery对象，从中取出type
           namespaces是命名空间数组
           i是while循环的计数器
           cur是当前元素或for循环中的临时变量
           ontype是含有前缀on的事件类型，用于调用对应的行内监听函数
           special是事件类型修正对象
           hanlde是主监听函数或行内监听函数
           eventPath是冒泡路径数组，保存冒泡路径上的元素和事件类型
           bubbleType是当前事件类型所对应的冒泡事件类型
           tmp是当前元素构造冒泡路径时所达到的最顶层元素
        */
		var i, cur, tmp, bubbleType, ontype, handle, special,
			eventPath = [ elem || document ],
			type = hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split(".") : [];

		cur = tmp = elem = elem || document;
        
        /*过滤文本节点和注释节点*/
		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

        /*过滤focuse/blur事件的默认行为所触发的focusin/focusout事件*/
        /*jQuery.event.triggered指示正在触发默认行为的事件类型，在触发行为前被设置为事件类型，触发后被设置为undefined*/
		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}
        
        /*解析事件类型和命名空间*/
		if ( type.indexOf(".") >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}
		/*若不含有:,则返回含有on前缀的事件类型*/
		ontype = type.indexOf(":") < 0 && "on" + type;
        
        /*创建jQuery事件对象*/
		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		/*是否阻止默认行为*/
		event.isTrigger = onlyHandlers ? 2 : 3;
		/*命名空间及命名空间正则表达式*/
		event.namespace = namespaces.join(".");
		event.namespace_re = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" ) :
			null;
        
        /*清空事件返回值*/
		// Clean up the event in case it is being reused
		event.result = undefined;
		/*设置事件目标*/
		if ( !event.target ) {
			event.target = elem;
		}
        
        /*设置自定义数据*/
		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );
        
        /*修正事件类型，获取实际的事件类型*/
		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};

		/*过滤掉修正对象有trigger方法且调用函数返回false的元素*/
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		/*构造冒泡路径
          只有onlyHandler为false，且当前事件冒泡，同时当前元素不是window对象，才会构造冒泡路径
		*/
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			/*检测是否为焦点事件，若是，cur为当前elem元素，在随后的代码中把当前elem和事件focusin/focusout放入路径数组eventPath中
              若不是，cur为当前elem元素的父元素
			*/
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			/*遍历cur元素的父级及以上元素，并保存在eventPath*/
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			/*当冒泡路径顶级元素时文档对象时，根据标准事件规范，在冒泡路径内，添加window对象*/
			if ( tmp === (elem.ownerDocument || document) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}
        
        /*触发冒泡路径上的主监听函数和行内监听函数*/
		// Fire handlers on the event path
		i = 0;
		while ( (cur = eventPath[i++]) && !event.isPropagationStopped() ) {
            
            /*事件类型*/
			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			/*提前当前元素的主监听函数*/
			handle = ( data_priv.get( cur, "events" ) || {} )[ event.type ] && data_priv.get( cur, "handle" );
			/*执行当前元素的主监听函数*/
			if ( handle ) {
				handle.apply( cur, data );
			}
            
            /*执行行内监听函数*/
			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && handle.apply && jQuery.acceptData( cur ) ) {
				event.result = handle.apply( cur, data );
				if ( event.result === false ) {
					event.preventDefault();
				}
			}
		}
		event.type = type;

        /*触发默认行为
          未阻止默认行为，且未发生默认行为被阻止的情况下，触发默认行为
        */
		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {
            
            /*对于允许挂缓存对象的元素，当修正对象未预留默认行为方法，或默认行为方法返回false时，执行以下操作*/
			if ( (!special._default || special._default.apply( eventPath.pop(), data ) === false) &&
				jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Don't do default actions on window, that's where global variables be (#6170)
				/*触发默认行为满足以下所有条件：
                  存在含有on前缀的事件类型；
                  当前元素type属性值为函数
                  当前元素不指向window对象
				*/
				if ( ontype && jQuery.isFunction( elem[ type ] ) && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					/*防止重复触发ontype事件，将ontype事件函数保存在tmp内，并且elem对应的属性值置为null*/
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					/*先保存正在触发默认行为的事件类型*/
					jQuery.event.triggered = type;
					/*执行对应的事件函数*/
					elem[ type ]();
					/*清空之前保存的事件类型*/
					jQuery.event.triggered = undefined;
                    /*恢复elem元素的ontype属性*/
					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}
        /*返回事件执行返回值*/
		return event.result;
	},
    /*分发事件，执行事件监听函数*/
	dispatch: function( event ) {
		/*若事件由浏览器触发，则参数event是原生事件对象，之后会把event封装成jQuery事件对象
          若事件是手动触发的，则参数event是jQuery事件对象
		*/
        /*构造jQuery事件对象*/
		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event );
        /*handlers是当前事件类型对应的监听对象数组
          args是将函数参数转为数组
          handlerQueue是待执行队列，包含了后代元素匹配的代理监听对象数组，以及当前元素上绑定的普通监听对象数组
          i，j是循环计数器
          ret是事件监听函数的返回值，会将它赋值给event.result
          matched是待执行队列handlerQueue中的一个元素，循环遍历时的临时复用变量
          handleObj是监听对象
        */
		var i, j, ret, matched, handleObj,
			handlerQueue = [],
			args = slice.call( arguments ),
			/*监听对象数组*/
			handlers = ( data_priv.get( this, "events" ) || {} )[ event.type ] || [],
			/*提取修正对象及方法*/
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[0] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}
		
		/*提取后代元素匹配的代理监听对象数组和代理元素上绑定的普通监听对象数组*/
		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );
        
        /*执行后代元素的代理监听对象数组和代理元素上的普通监听对象数组*/
		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		/*遍历带有监听对象的元素
          若某个元素的监听函数调用了stopPropagation则终止第一层while循环
		*/
		while ( (matched = handlerQueue[ i++ ]) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			/*遍历监听对象，并执行监听对象函数
              若某个元素的监听函数调用了stopImmediatePropagation则终止第二层和第一层while循环
			*/
			while ( (handleObj = matched.handlers[ j++ ]) && !event.isImmediatePropagationStopped() ) {
                
                /*触发监听函数满足以下条件之一：
                  事件对象没有命名空间正则表达式；
                  监听对象命名空间符合事件对象命名空间的正则规则
                */
				// Triggered event must either 1) have no namespace, or
				// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.namespace_re || event.namespace_re.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;
                    /*执行监听函数，ret保存返回结果*/
					ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
							.apply( matched.elem, args );

					if ( ret !== undefined ) {
						/*若监听函数返回结果为false，则阻止浏览器默认行为和阻止事件捕获、冒泡*/
						if ( (event.result = ret) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}
        
        /*修正对象有postDispatch，则调用该函数*/
		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}
        /*返回监听函数执行结果*/
		return event.result;
	},
    /*提取后代元素匹配的代理监听对象数组和代理元素绑定的普通监听对象数组*/
	handlers: function( event, handlers ) {
		/*matches是保存某个后代元素或当前元素匹配的事件监听对象数组
          handleObj是监听对象
          sel是某个后代元素与代理监听对象选择器表达式的匹配结果
		*/
		var i, matches, sel, handleObj,
			handlerQueue = [],
			/*代理监听对象的位置计数器*/
			delegateCount = handlers.delegateCount,
			/*事件目标元素*/
			cur = event.target;

		// Find delegate handlers
		// Black-hole SVG <use> instance trees (#13180)
		// Avoid non-left-click bubbling in Firefox (#3861)
        /*提取后代元素匹配的代理监听对象*/
		if ( delegateCount && cur.nodeType && (!event.button || event.type !== "click") ) {

            /*遍历当前元素this的后代元素*/
			for ( ; cur !== this; cur = cur.parentNode || this ) {

                /*过滤掉不可用元素和触发click事件类型的元素*/
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.disabled !== true || event.type !== "click" ) {
					matches = [];

					/*遍历代理监听对象数组，把后代元素匹配的代理监听对象存储到matches中*/
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];
                        
                        /*记录某个后代元素cur与代理监听对象选择器表达式的匹配结果*/
						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matches[ sel ] === undefined ) {
							matches[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) >= 0 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						/*若后代元素cur与代理监听对象选择器表达式的匹配，则将代理监听对象存储到数组matches中*/
						if ( matches[ sel ] ) {
							matches.push( handleObj );
						}
					}
				    /*若后代元素有匹配的代理监听对象，则以{elem:cur,handlers:matches}的形式存入待执行队列handlerQueue*/
					if ( matches.length ) {
						handlerQueue.push({ elem: cur, handlers: matches });
					}
				}
			}
		}
        /*提取代理元素绑定的普通监听对象数组*/
		// Add the remaining (directly-bound) handlers
		if ( delegateCount < handlers.length ) {
			handlerQueue.push({ elem: this, handlers: handlers.slice( delegateCount ) });
		}

		return handlerQueue;
	},
    /*事件对象的公共属性*/
	// Includes some event props shared by KeyEvent and MouseEvent
	props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
    /*事件属性修正对象集*/
	fixHooks: {},
    /*键盘事件对象的属性和修正方法*/
	keyHooks: {
		/*键盘事件对象专有属性*/
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {
            /*跨浏览器获取keypress事件中字符编码*/
			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},
    /*鼠标事件对象的属性和修正方法*/
	mouseHooks: {
		/*鼠标事件对象专有属性*/
		props: "button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
		filter: function( event, original ) {
			var eventDoc, doc, body,
				button = original.button;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;
                /*页面x等于客户区x+滚动左边距-视口左边距*/
				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}
            
            /*jQuery事件对象，鼠标事件中1是左键，2是中键，3是右键*/
			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},
    /*把原生事件对象封装为jQuery事件对象，并修正不兼容属性
      event可以是原生事件对象或jQuery对象
    */
	fix: function( event ) {
		/*若为jQuery事件对象，则直接返回，不进行封装*/
		if ( event[ jQuery.expando ] ) {
			return event;
		}
        
        /*若为原生事件对象，则合并公共事件属性和专属事件属性，最终生成一个可读写的事件对象*/
		// Create a writable copy of the event object and normalize some properties
		var i, prop, copy,
			type = event.type,
			originalEvent = event,
			fixHook = this.fixHooks[ type ];
        /*添加鼠标或键盘事件修正对象*/
		if ( !fixHook ) {
			this.fixHooks[ type ] = fixHook =
				rmouseEvent.test( type ) ? this.mouseHooks :
				rkeyEvent.test( type ) ? this.keyHooks :
				{};
		}
		/*整合公共属性和专有属性*/
		copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = new jQuery.Event( originalEvent );

		i = copy.length;
		/*添加事件对象属性到新创建的jQuery事件对象*/
		while ( i-- ) {
			prop = copy[ i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Support: Cordova 2.5 (WebKit) (#13255)
		// All events should have a target; Cordova deviceready doesn't
		/*若事件目标不存在，则其事件目标设置为document*/
		if ( !event.target ) {
			event.target = document;
		}
        /*事件目标必须为元素类型*/
		// Support: Safari 6.0+, Chrome < 28
		// Target should not be a text node (#504, #13143)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}
        /*若修正方法存在，则调用该方法，并返回修正后的事件对象
          若不存在，则直接返回新创建的jQuery事件对象
        */
		return fixHook.filter ? fixHook.filter( event, originalEvent ) : event;
	},
    /*事件修正对象集，用于修正事件的绑定、代理、触发和移除行为*/
	special: {
		/*防止手动触发load事件时，从当前元素冒泡到window对象上的触发load事件*/
		load: {
			// Prevent triggered image.load events from bubbling to window.load
			/*当前事件不允许冒泡*/
			noBubble: true
		},
		/*在为不冒泡的focus、blur应用事件代理时，需要将事件类型更正为支持冒泡的focusin/focusout*/
		focus: {
			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== safeActiveElement() && this.focus ) {
					this.focus();
					return false;
				}
			},
			/*delegateType，绑定代理事件时使用的事件类型*/
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === safeActiveElement() && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},
		click: {
			// For checkbox, fire native event so checked state will be right
			/*用于执行特殊的事件响应行为，在触发当前类型的事件时被调用*/
			trigger: function() {
				if ( this.type === "checkbox" && this.click && jQuery.nodeName( this, "input" ) ) {
					this.click();
					return false;
				}
			},
            
            /*用于执行特殊的默认行为，在触发默认行为时被调用。this指向document对象*/
			// For cross-browser consistency, don't fire native .click() on links
			_default: function( event ) {
				return jQuery.nodeName( event.target, "a" );
			}
		},
        /*页面刷新或关闭时被触发，若监听函数返回一个非空字符串，则会弹出一个确认对话框，让
          用户选择继续or离开。监听函数可以返回除undefined和null外的任意值，在对话框上，会
          显示返回的字符串
        */
		beforeunload: {
			postDispatch: function( event ) {

				// Support: Firefox 20+
				// Firefox doesn't alert if the returnValue field is not set.
				if ( event.result !== undefined && event.originalEvent ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	},
    /*模拟事件
      借助一个原生事件对象或jQuery事件对象，来为不支持冒泡的事件模拟冒泡过程
      bubble，布尔值，是否模拟冒泡过程
    */
	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		/*合并事件对象，创建一个jQuery事件对象*/
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		if ( bubble ) {
			jQuery.event.trigger( e, null, elem );
		} else {
			jQuery.event.dispatch.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};
/*移除主监听函数*/
jQuery.removeEvent = function( elem, type, handle ) {
	if ( elem.removeEventListener ) {
		elem.removeEventListener( type, handle, false );
	}
};

/*事件对象
  为构造函数，2个参数：
  src：原生事件类型、自定义事件类型、原生事件对象或jQuery事件对象
  props：可选的JS对象，其中的属性将被设置到新创建jQuery事件对象上
*/
jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}
    /*若为原生事件对象，则备份原生事件对象*/
	// Event object
	if ( src && src.type ) {
		/*原生事件对象*/
		this.originalEvent = src;
		/*事件类型*/
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		/*检验跨浏览器默认行为是否被取消*/
		this.isDefaultPrevented = src.defaultPrevented ||
				src.defaultPrevented === undefined &&
				// Support: Android < 4.0
				src.returnValue === false ?
			returnTrue :
			returnFalse;

	// Event type
	/*若为事件类型，则备份事件类型*/
	} else {
		this.type = src;
	}

    /*扩展自定义事件属性*/
	// Put explicitly provided properties onto the event object
	if ( props ) {
		/*将JS对象添加到事件对象上*/
		jQuery.extend( this, props );
	}
    /*修正时间戳
      若为原生事件对象，返回事件对象事件戳
      若为事件类型，返回当前时间
    */
	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();
    /*为当前jQuery事件对象设置标记jQuery.expando*/
	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
/*事件对象原型对象*/
jQuery.Event.prototype = {
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,
    /*阻止浏览器默认行为*/
	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;

		if ( e && e.preventDefault ) {
			e.preventDefault();
		}
	},
	/*停止事件捕获和冒泡*/
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;

		if ( e && e.stopPropagation ) {
			e.stopPropagation();
		}
	},
	/*停止事件捕获和冒泡，也阻止执行任何事件处理程序*/
	stopImmediatePropagation: function() {
		var e = this.originalEvent;

		this.isImmediatePropagationStopped = returnTrue;

		if ( e && e.stopImmediatePropagation ) {
			e.stopImmediatePropagation();
		}

		this.stopPropagation();
	}
};

// Create mouseenter/leave events using mouseover/out and event-time checks
// Support: Chrome 15+
/*初始化事件mouseenter/leave pointerover/out对应的修正对象
  使用冒泡的mouseover、mouseout模拟不冒泡的mouseenter、mouseleave
*/
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout",
	pointerenter: "pointerover",
	pointerleave: "pointerout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		/*bindType，绑定普通事件时使用的事件类型*/
		bindType: fix,
        /*用于执行特殊的事件响应行为，在每次触发当前类型的事件时被调用*/
		handle: function( event ) {
			var ret,
			    /*目标元素*/
				target = this,
				/*mouseover/out的相关元素*/
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			/*只触发了子元素的mouseover、mouseout事件，禁止了父元素mouseout、mouseenter事件*/
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			/*返回监听函数的返回值*/
			return ret;
		}
	};
});

/*创建冒泡的focus和blur事件，并兼容FF、Chrome、Safari浏览器*/
// Create "bubbling" focus and blur events
// Support: Firefox, Chrome, Safari
if ( !support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler on the document while someone wants focusin/focusout
		/*在document对象上为focus、blur事件绑定一个特殊的捕获阶段的主监听函数，该函数有jQuery.event.simulate的创建*/
		var handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			/*setup，用于执行特殊的主监听函数绑定行为，或执行必须的初始化操作，在第一次绑定当前类型的事件时被调用*/
			setup: function() {
				var doc = this.ownerDocument || this,
				    /*记录绑定focusin/out事件的次数*/
					attaches = data_priv.access( doc, fix );
                /*计数器为0，绑定主监听函数*/
 				if ( !attaches ) {
					doc.addEventListener( orig, handler, true );
				}
				/*次数+1*/
				data_priv.access( doc, fix, ( attaches || 0 ) + 1 );
			},
			/*用于执行特殊的主监听函数移除行为，在当前类型的事件全部移除后被调用*/
			teardown: function() {
				var doc = this.ownerDocument || this,
				    /*次数-1*/
					attaches = data_priv.access( doc, fix ) - 1;
                /*计数器为0，移除主监听函数，清空缓存数据对象*/
				if ( !attaches ) {
					doc.removeEventListener( orig, handler, true );
					data_priv.remove( doc, fix );

				} else {
					data_priv.access( doc, fix, attaches );
				}
			}
		};
	});
}
/*实例事件对象的方法*/
jQuery.fn.extend({
    
    /*统一的事件绑定方法，为异步链式，用来完成一些阻塞进程的操作
      types是事件类型
      selector是选择器表达式
      data是传递给监听函数的自定义数据
      fn是待绑定的监听函数
      one是仅在on方法内部使用，为one方法提供支持
    */
	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var origFn, type;
        
        /*事件类型是对象，遍历对象并调用on方法
          selector为字符串
          转为（事件类型，表达式，自定义数据）
          selector不为字符串时，data存在则为本身，否则为selector，selector被强制为undefiend。
          转为（事件类型，自定义数据）

        */
		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) {
				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
		}
        /*事件类型不是对象，
          当没有传入自定义数据和监听函数时，
          则将fn强制为selector，selector为undefined
          最终转为（事件类型，监听函数）
        */
		if ( data == null && fn == null ) {
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			/*事件类型不是对象，
	          当没有传入监听函数时，传入自定义数据，字符串形表达式
	          则将fn强制为data，data为undefined
	          最终转为（事件类型，表达式，监听函数）
	        */
			if ( typeof selector === "string" ) {
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
				/*事件类型不是对象，
		          当没有传入监听函数时，传入自定义数据，不是字符串形表达式
		          则将fn强制为data，data为selector，selector为undefined
		          最终转为（事件类型，自定义数据，监听函数）
		        */
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return this;
		}
        
        /*one为1时，将fn进行封装，先移除所有监听函数，再调用待绑定的监听函数*/
		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
			/*将封装的fn和原来的fn统一为一个函数*/
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		/*遍历当前DOM元素集合，调用jQuery.event.add方法添加监听函数*/
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	/*绑定最多执行一次的事件监听函数*/
	one: function( types, selector, data, fn ) {
		return this.on( types, selector, data, fn, 1 );
	},
	/*统一的事件移除方法*/
	off: function( types, selector, fn ) {
		var handleObj, type;
		/*被分发的jQuery事件对象，表示types所代表的事件正在被触发*/
		if ( types && types.preventDefault && types.handleObj ) {
			// ( event )  dispatched jQuery.Event
			/*监听对象*/
			handleObj = types.handleObj;
			/*delegateTarget表示监听函数被绑定的元素*/
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {
			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {
			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		/*遍历当前DOM元素集合*/
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},
    /*手动触发当前DOM元素集合中每个DOM元素的事件监听函数，并模拟冒泡过程，触发默认行为*/
	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	/*手动触发第一个匹配元素上绑定的事件监听函数，并模拟冒泡过程，但不触发默认行为*/
	triggerHandler: function( type, data ) {
		var elem = this[0];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
});


/*DOM操作 Manipulation*/
var 
    // (?!pattern)在任何不匹配pattern的字符串开始处匹配查找字符串
    // 不匹配br等自关闭标签
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
	// 匹配标签
	rtagName = /<([\w:]+)/,
	// 是否为标签<、字符&、数字&#
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style|link)/i,
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /^$|\/(?:java|ecma)script/i,
	rscriptTypeMasked = /^true\/(.*)/,
	/*CDATA区域*/
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,

	// We have to close these tags to support XHTML (#13200)
	/**/
	wrapMap = {

		// Support: IE 9
		option: [ 1, "<select multiple='multiple'>", "</select>" ],

		thead: [ 1, "<table>", "</table>" ],
		col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

		_default: [ 0, "", "" ]
	};

// Support: IE 9
wrapMap.optgroup = wrapMap.option;

wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

// Support: 1.x compatibility
// Manipulating tables requires a tbody
/*浏览器兼容性，table元素需要一个tbody元素*/
function manipulationTarget( elem, content ) {
	return jQuery.nodeName( elem, "table" ) &&
		jQuery.nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ?

		elem.getElementsByTagName("tbody")[0] ||
			elem.appendChild( elem.ownerDocument.createElement("tbody") ) :
		elem;
}

/*手动失效script文档*/
// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = (elem.getAttribute("type") !== null) + "/" + elem.type;
	return elem;
}
/*手动恢复script文档*/
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );

	if ( match ) {
		elem.type = match[ 1 ];
	} else {
		elem.removeAttribute("type");
	}

	return elem;
}

// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		data_priv.set(
			elems[ i ], "globalEval", !refElements || data_priv.get( refElements[ i ], "globalEval" )
		);
	}
}

/*将原始元素关联的事件逐个绑定到副本元素上*/
function cloneCopyEvent( src, dest ) {
	var i, l, type, pdataOld, pdataCur, udataOld, udataCur, events;

	if ( dest.nodeType !== 1 ) {
		return;
	}
    /*复制内部事件和数据*/
	// 1. Copy private data: events, handlers, etc.
	if ( data_priv.hasData( src ) ) {
		pdataOld = data_priv.access( src );
		pdataCur = data_priv.set( dest, pdataOld );
		events = pdataOld.events;

		if ( events ) {
			delete pdataCur.handle;
			pdataCur.events = {};

			for ( type in events ) {
				for ( i = 0, l = events[ type ].length; i < l; i++ ) {
					jQuery.event.add( dest, type, events[ type ][ i ] );
				}
			}
		}
	}
    /*复制用户自定义数据*/
	// 2. Copy user data
	if ( data_user.hasData( src ) ) {
		udataOld = data_user.access( src );
		udataCur = jQuery.extend( {}, udataOld );

		data_user.set( dest, udataCur );
	}
}
/*提取context节点中含有tag的元素*/
function getAll( context, tag ) {
	var ret = context.getElementsByTagName ? context.getElementsByTagName( tag || "*" ) :
			context.querySelectorAll ? context.querySelectorAll( tag || "*" ) :
			[];

	return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
		jQuery.merge( [ context ], ret ) :
		ret;
}

// Support: IE >= 9
function fixInput( src, dest ) {
	var nodeName = dest.nodeName.toLowerCase();

	// Fails to persist the checked state of a cloned checkbox or radio button.
	if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
		dest.checked = src.checked;

	// Fails to return the selected option to the default selected state when cloning options
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

jQuery.extend({
	/*复制DOM元素，并修正不兼容属性*/
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var i, l, srcElements, destElements,
		    /*深度复制当前元素*/
			clone = elem.cloneNode( true ),
			/*是否在当前文档*/
			inPage = jQuery.contains( elem.ownerDocument, elem );

		// Support: IE >= 9
		// Fix Cloning issues
		/*修正checkbox元素浏览器兼容问题*/
		if ( !support.noCloneChecked && ( elem.nodeType === 1 || elem.nodeType === 11 ) &&
				!jQuery.isXMLDoc( elem ) ) {

			// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
		    /*存放副本元素的后代元素集合*/
			destElements = getAll( clone );
			/*存放原始元素的后代元素集合*/
			srcElements = getAll( elem );

			for ( i = 0, l = srcElements.length; i < l; i++ ) {
				fixInput( srcElements[ i ], destElements[ i ] );
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			/*把当前元素后代元素的数据和事件复制到副本元素后代元素上*/
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0, l = srcElements.length; i < l; i++ ) {
					cloneCopyEvent( srcElements[ i ], destElements[ i ] );
				}
			} else {
				/*把原始元素关联的数据和事件复制到副本元素上*/
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		/*缓存script文档*/
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

        /*返回复制的DOM元素*/
		// Return the cloned set
		return clone;
	},
    
    /* 生成文档片段
       elems 数组，包含待转换的HTML代码
       context 文档对象
       scripts 数组，用于存放转换后DOM元素中的script元素
    */
	buildFragment: function( elems, context, scripts, selection ) {
		var elem, tmp, tag, wrap, contains, j,
		    /*创建一个文档片段*/
			fragment = context.createDocumentFragment(),
			nodes = [],
			i = 0,
			l = elems.length;

		for ( ; i < l; i++ ) {
			elem = elems[ i ];

			if ( elem || elem === 0 ) {

                // 若为节点，则直接添加到nodes
				// Add nodes directly
				if ( jQuery.type( elem ) === "object" ) {
					// Support: QtWebKit
					// jQuery.merge because push.apply(_, arraylike) throws
					jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );
                
                // 若不是标签、字符、数字代码，则转为文本节点，添加到nodes
				// Convert non-html into a text node
				} else if ( !rhtml.test( elem ) ) {
					nodes.push( context.createTextNode( elem ) );

				// Convert html into DOM nodes
				} else {
                    
                    // 创建临时div元素
					tmp = tmp || fragment.appendChild( context.createElement("div") );
                    
                    // 提取标签名，并转为小写
					// Deserialize a standard representation
					tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
					/* 从对象wrapMap中取出标签tag对应的父标签
					   若tag为需要包含在父标签内，例如option，则在tag前先添加select的html片段，将其包裹在select标签内
					*/
					wrap = wrapMap[ tag ] || wrapMap._default;
					/* replace使用特殊字符$n，匹配第n个捕获组的子字符串，其中n=0-9，如$1是匹配第一个捕获组的子字符串
					   可将自关闭标签，拆解如<div/>=><div></div>
					*/
					tmp.innerHTML = wrap[ 1 ] + elem.replace( rxhtmlTag, "<$1></$2>" ) + wrap[ 2 ];
                    
                    // 剥去div等父级节点，如option，tmp = 'select'
					// Descend through wrappers to the right content
					j = wrap[ 0 ];
					while ( j-- ) {
						tmp = tmp.lastChild;
					}
                    
                    // 将最准确的节点加到nodes，如option，tmp.childNodes就为option，没有添加额外的节点
					// Support: QtWebKit
					// jQuery.merge because push.apply(_, arraylike) throws
					jQuery.merge( nodes, tmp.childNodes );

					// Remember the top-level container
					tmp = fragment.firstChild;

					// Fixes #12346
					// Support: Webkit, IE
					tmp.textContent = "";
				}
			}
		}

		// Remove wrapper from fragment
		fragment.textContent = "";

		i = 0;
		while ( (elem = nodes[ i++ ]) ) {

			// #4087 - If origin and destination elements are the same, and this is
			// that element, do not do anything
			if ( selection && jQuery.inArray( elem, selection ) !== -1 ) {
				continue;
			}

			contains = jQuery.contains( elem.ownerDocument, elem );

			// Append to fragment
			tmp = getAll( fragment.appendChild( elem ), "script" );

			// Preserve script evaluation history
			if ( contains ) {
				setGlobalEval( tmp );
			}
            
            /*提取script元素*/
			// Capture executables
			if ( scripts ) {
				j = 0;
				while ( (elem = tmp[ j++ ]) ) {
					if ( rscriptType.test( elem.type || "" ) ) {
						scripts.push( elem );
					}
				}
			}
		}

		return fragment;
	},
    /* 删除多个DOM元素的缓存数据和事件，并没有移除DOM元素上的expando属性*/
	cleanData: function( elems ) {
		var data, elem, type, key,
			special = jQuery.event.special,
			i = 0;

		for ( ; (elem = elems[ i ]) !== undefined; i++ ) {
			/* 判断是否可以设置缓存数据*/
			if ( jQuery.acceptData( elem ) ) {
				/*uid*/
				key = elem[ data_priv.expando ];
                /*若uid存在，则删除事件及缓存数据*/
				if ( key && (data = data_priv.cache[ key ]) ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}
					/* 删除内部缓存对象数据及uid*/
					if ( data_priv.cache[ key ] ) {
						// Discard any remaining `private` data
						delete data_priv.cache[ key ];
					}
				}
			}
		    /* 删除用户自定义缓存对象数据及uid*/
			// Discard any remaining `user` data
			delete data_user.cache[ elem[ data_user.expando ] ];
		}
	}
});

jQuery.fn.extend({
	/*获取匹配元素集合中所有元素合并后的文本内容，
	  或设置每个元素的文本内容
	*/
	text: function( value ) {
		return access( this, function( value ) {
			return value === undefined ?
                /*获取当前DOM元素集合中所有元素合并后的文本内容--Sizzle.getText*/
				jQuery.text( this ) :
				/*清空当前DOM元素每一项的缓存，然后设置每一项的文本内容*/
				this.empty().each(function() {
					if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
						this.textContent = value;
					}
				});
		}, null, value, arguments.length );
	},
    
    /* 在domManip中处理以下4个方法的共性，并通过回调函数将结果返回
    */
    // 向每个匹配的元素内部追加内容
	append: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		});
	},
    
    // 向每个匹配的元素内部头部插入内容
	prepend: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		});
	},
    
    // 在每个匹配的元素之前插入内容
	before: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		});
	},
    
    // 在每个匹配的元素之后插入内容
	after: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		});
	},
    /*删除当前DOM元素集合*/
	remove: function( selector, keepData /* Internal Use Only */ ) {
		var elem,
		    /*若selector传入，保留与selector匹配的元素*/
			elems = selector ? jQuery.filter( selector, this ) : this,
			i = 0;
        /* 遍历DOM元素，
           若keepData为false，则删除每个DOM元素及后代元素的缓存数据和事件
           之后删除每个DOM元素（除顶级文档节点外）
        */
		for ( ; (elem = elems[i]) != null; i++ ) {
			if ( !keepData && elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem ) );
			}

			if ( elem.parentNode ) {
				if ( keepData && jQuery.contains( elem.ownerDocument, elem ) ) {
					setGlobalEval( getAll( elem, "script" ) );
				}
				elem.parentNode.removeChild( elem );
			}
		}

		return this;
	},
    /*从文档中移除当前DOM元素集合的所有子元素*/
	empty: function() {
		var elem,
			i = 0;
        /* 遍历DOM元素*/
		for ( ; (elem = this[i]) != null; i++ ) {
			if ( elem.nodeType === 1 ) {
                
                /* 删除当前元素的后代元素的缓存数据和事件*/
				// Prevent memory leaks
				jQuery.cleanData( getAll( elem, false ) );

				// Remove any remaining nodes
				/*textContent为DOM属性，获取或设置节点文本内容，若设置节点内容，其子元素会被删除*/
				elem.textContent = "";
			}
		}

		return this;
	},
    /*创建当前DOM元素集合的深度复制副本
      dataAndEvents：可选布尔值，指示是否复制数据和事件
      deepDataAndEvents：可选的布尔值，指示是否深度复制数据和事件。若为true，则把
                         原始元素的后代元素关联的数据和事件复制到副本元素的后代元素上
    */
	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;
        /*遍历当前DOM元素集合，在回调函数中调用方法jQuery.clone复制每个匹配元素，并返回副本元素*/
		return this.map(function() {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},
    /*获取匹配元素集合中第一个元素的HTML内容或设置每个元素的HTML内容*/
	html: function( value ) {
		return access( this, function( value ) {
			var elem = this[ 0 ] || {},
				i = 0,
				l = this.length;
            /*未传入value，读取第一个DOM元素的HTML内容*/
			if ( value === undefined && elem.nodeType === 1 ) {
				return elem.innerHTML;
			}

			// See if we can take a shortcut and just use innerHTML
			/*满足以下全部条件进行DOM元素内容替换
              字符串；
              不是script、style、link标签；
              不需要包裹父标签（如select等）
			*/
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {
                
                /*将HTML代码修正为标准闭合标签*/
				value = value.replace( rxhtmlTag, "<$1></$2>" );

				try {
					/*遍历当前DOM元素集合*/
					for ( ; i < l; i++ ) {
						elem = this[ i ] || {};
                        
                        /* 设置文本内容前，先移除当前元素后代元素的缓存数据和事件*/
						// Remove element nodes and prevent memory leaks
						if ( elem.nodeType === 1 ) {
							/*清空当前DOM元素内挂载的缓存数据和事件*/
							jQuery.cleanData( getAll( elem, false ) );
							/*替换当前元素内容*/
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch( e ) {}
			}
            /*以上2种情况均不符合，则移除后代元素关联的数据和事件、移除子元素，调用append插入HTML内容*/
			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},
    /*当前DOM元素集合被新内容替换掉*/
	replaceWith: function() {
		var arg = arguments[ 0 ];

		// Make the changes, replacing each context element with the new content
		this.domManip( arguments, function( elem ) {
			arg = this.parentNode;
            /*清除掉当前元素关联的事件和数据*/
			jQuery.cleanData( getAll( this ) );

			if ( arg ) {
				/*替换当前元素*/
				arg.replaceChild( elem, this );
			}
		});

		// Force removal if there was no new content (e.g., from empty arguments)
		return arg && (arg.length || arg.nodeType) ? this : this.remove();
	},
    
    /*从文档中移除当前DOM元素集合，但保留后代元素和匹配元素关联的数据和事件
      常用于移除的元素稍后再次插入文档的场景
    */
	detach: function( selector ) {
		return this.remove( selector, true );
	},
    /*操作DOM核心方法，为append、prepend、before、after、replaceWith提供了基础功能*/
	domManip: function( args, callback ) {
      /*args是含有待插入内容的数组，内容可以是DOM元素、HTML代码、函数或jQuery对象*/
		// Flatten any nested arrays
		/*args转为数组*/
		args = concat.apply( [], args );

		var fragment, first, scripts, hasScripts, node, doc,
			i = 0,
			/*当前DOM元素集合长度*/
			l = this.length,
			/*当前DOM元素集合备份*/
			set = this,
			iNoClone = l - 1,
			value = args[ 0 ],
			/*待插入内容是否为函数*/
			isFunction = jQuery.isFunction( value );

		// We can't cloneNode fragments that contain checked, in WebKit
		/*若当前浏览器在复制check元素时，不能复制checked状态，且传入的HTML代码中含有checked属性，DOM元素集合长度大于1
          则遍历DOM元素集合，为每个项调用domManip函数，执行一次HTML代码转换
		*/
		if ( isFunction ||
				( l > 1 && typeof value === "string" &&
					!support.checkClone && rchecked.test( value ) ) ) {
			return this.each(function( index ) {
			    /*获取当前项*/
				var self = set.eq( index );
				if ( isFunction ) {
					/*执行回调函数，并将返回值作为domManip函数的参数*/
					args[ 0 ] = value.call( this, index, self.html() );
				}
				/*为每个项调用domManip函数，执行一次HTML代码转换*/
				self.domManip( args, callback );
			});
		}
        /**/
		if ( l ) {
			/*将HTML代码转为DOM元素，并保存在fragment*/
			fragment = jQuery.buildFragment( args, this[ 0 ].ownerDocument, false, this );
			first = fragment.firstChild;

            /*出于性能考虑，若文档片段只有一个子元素，则将子元素赋值给fragment，这样性能好于插入文档片段*/
			if ( fragment.childNodes.length === 1 ) {
				fragment = first;
			}
            
			if ( first ) {
				scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
				hasScripts = scripts.length;

				// Use the original fragment for the last item instead of the first because it can end up
				// being emptied incorrectly in certain situations (#8070).
				/*遍历DOM元素集合，为每个元素上执行回调函数插入元素*/
				for ( ; i < l; i++ ) {
					node = fragment;

					if ( i !== iNoClone ) {
						/*深度复制*/
						node = jQuery.clone( node, true, true );

						// Keep references to cloned scripts for later restoration
						if ( hasScripts ) {
							// Support: QtWebKit
							// jQuery.merge because push.apply(_, arraylike) throws
							/*查找script标签，并存入scripts数组*/
							jQuery.merge( scripts, getAll( node, "script" ) );
						}
					}
                    /*执行回调函数*/
					callback.call( this[ i ], node, i );
				}
                /*恢复script文档，手动执行script文档*/
				if ( hasScripts ) {
					doc = scripts[ scripts.length - 1 ].ownerDocument;

                    /*恢复script文档*/
					// Reenable scripts
					jQuery.map( scripts, restoreScript );
                    
                    /*遍历scripts文档集合，手动执行script文档*/
					// Evaluate executable scripts on first document insertion
					for ( i = 0; i < hasScripts; i++ ) {
						node = scripts[ i ];
						/*手动执行script文档需要满足以下所有条件：
                          是javas（ecma）cript文档；
                          未被缓存；
                          属于当前文档
						*/
						if ( rscriptType.test( node.type || "" ) &&
							!data_priv.access( node, "globalEval" ) && jQuery.contains( doc, node ) ) {
                            
                            /*若存在src属性，则同步加载*/
							if ( node.src ) {
								// Optional AJAX dependency, but won't run scripts if not present
								if ( jQuery._evalUrl ) {
									jQuery._evalUrl( node.src );
								}
						    /*若不存在，则过滤掉CDATA区域文档，取出js文档，调用globalEval方法，加载文档*/
							} else {
								jQuery.globalEval( node.textContent.replace( rcleanScript, "" ) );
							}
						}
					}
				}
			}
		}
        /*返回元素集合*/
		return this;
	}
});

/*将当前DOM元素集合的每一项插入到目标元素对应位置*/
jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	/*模板函数，闭包机制*/
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			ret = [],
			/*获取目标元素*/
			insert = jQuery( selector ),
			last = insert.length - 1,
			i = 0;
        /*遍历目标元素*/
		for ( ; i <= last; i++ ) {
			/*待插入元素，遍历到最后一个目标元素时，插入待插入元素集合，其他插入带插入元素集合副本*/
			elems = i === last ? this : this.clone( true );
			/*执行操作函数*/
			jQuery( insert[ i ] )[ original ]( elems );

			// Support: QtWebKit
			// .get() because push.apply(_, arraylike) throws
			/*待插入元素保存在ret中*/
			push.apply( ret, elems.get() );
		}
        /*创建新的jQuery对象，并被返回*/
		return this.pushStack( ret );
	};
});


/*样式操作 CSS*/
var iframe,
	elemdisplay = {};

/**
 * Retrieve the actual display of a element
 * @param {String} name nodeName of the element
 * @param {Object} doc Document object
 */
// Called only from within defaultDisplay
function actualDisplay( name, doc ) {
	var style,
		elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),

		// getDefaultComputedStyle might be reliably used only on attached element
		display = window.getDefaultComputedStyle && ( style = window.getDefaultComputedStyle( elem[ 0 ] ) ) ?

			// Use of this method is a temporary fix (more like optmization) until something better comes along,
			// since it was removed from specification and supported only in FF
			style.display : jQuery.css( elem[ 0 ], "display" );

	// We don't have any data stored on the element,
	// so use "detach" method as fast way to get rid of the element
	elem.detach();

	return display;
}

/**
 * Try to determine the default display value of an element
 * @param {String} nodeName
 */
function defaultDisplay( nodeName ) {
	var doc = document,
		display = elemdisplay[ nodeName ];

	if ( !display ) {
		display = actualDisplay( nodeName, doc );

		// If the simple way fails, read from inside an iframe
		if ( display === "none" || !display ) {

			// Use the already-created iframe if possible
			iframe = (iframe || jQuery( "<iframe frameborder='0' width='0' height='0'/>" )).appendTo( doc.documentElement );

			// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
			doc = iframe[ 0 ].contentDocument;

			// Support: IE
			doc.write();
			doc.close();

			display = actualDisplay( nodeName, doc );
			iframe.detach();
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return display;
}
var rmargin = (/^margin/);

var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );

/*获取某个DOM元素的计算样式*/
var getStyles = function( elem ) {
		return elem.ownerDocument.defaultView.getComputedStyle( elem, null );
	};


/*读取计算样式*/
function curCSS( elem, name, computed ) {
	var width, minWidth, maxWidth, ret,
		style = elem.style;

	computed = computed || getStyles( elem );

	// Support: IE9
	// getPropertyValue is only needed for .css('filter') in IE9, see #12537
	if ( computed ) {
		ret = computed.getPropertyValue( name ) || computed[ name ];
	}

	if ( computed ) {

		if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
			ret = jQuery.style( elem, name );
		}

		// Support: iOS < 6
		// A tribute to the "awesome hack by Dean Edwards"
		// iOS < 6 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
		// this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
		if ( rnumnonpx.test( ret ) && rmargin.test( name ) ) {

			// Remember the original values
			width = style.width;
			minWidth = style.minWidth;
			maxWidth = style.maxWidth;

			// Put in the new values to get a computed value out
			style.minWidth = style.maxWidth = style.width = ret;
			ret = computed.width;

			// Revert the changed values
			style.width = width;
			style.minWidth = minWidth;
			style.maxWidth = maxWidth;
		}
	}

	return ret !== undefined ?
		// Support: IE
		// IE returns zIndex value as an integer.
		ret + "" :
		ret;
}


function addGetHookIf( conditionFn, hookFn ) {
	// Define the hook, we'll check on the first run if it's really needed.
	return {
		get: function() {
			if ( conditionFn() ) {
				// Hook not needed (or it's not possible to use it due to missing dependency),
				// remove it.
				// Since there are no other hooks for marginRight, remove the whole object.
				delete this.get;
				return;
			}

			// Hook needed; redefine it so that the support test is not executed again.

			return (this.get = hookFn).apply( this, arguments );
		}
	};
}


(function() {
	var pixelPositionVal, boxSizingReliableVal,
		docElem = document.documentElement,
		container = document.createElement( "div" ),
		div = document.createElement( "div" );

	if ( !div.style ) {
		return;
	}

	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	container.style.cssText = "border:0;width:0;height:0;top:0;left:-9999px;margin-top:1px;" +
		"position:absolute";
	container.appendChild( div );

	// Executing both pixelPosition & boxSizingReliable tests require only one layout
	// so they're executed at the same time to save the second computation.
	function computePixelPositionAndBoxSizingReliable() {
		div.style.cssText =
			// Support: Firefox<29, Android 2.3
			// Vendor-prefix box-sizing
			"-webkit-box-sizing:border-box;-moz-box-sizing:border-box;" +
			"box-sizing:border-box;display:block;margin-top:1%;top:1%;" +
			"border:1px;padding:1px;width:4px;position:absolute";
		div.innerHTML = "";
		docElem.appendChild( container );

		var divStyle = window.getComputedStyle( div, null );
		pixelPositionVal = divStyle.top !== "1%";
		boxSizingReliableVal = divStyle.width === "4px";

		docElem.removeChild( container );
	}

	// Support: node.js jsdom
	// Don't assume that getComputedStyle is a property of the global object
	if ( window.getComputedStyle ) {
		jQuery.extend( support, {
			pixelPosition: function() {
				// This test is executed only once but we still do memoizing
				// since we can use the boxSizingReliable pre-computing.
				// No need to check if the test was already performed, though.
				computePixelPositionAndBoxSizingReliable();
				return pixelPositionVal;
			},
			boxSizingReliable: function() {
				if ( boxSizingReliableVal == null ) {
					computePixelPositionAndBoxSizingReliable();
				}
				return boxSizingReliableVal;
			},
			/* 检验当前浏览器是否返回正确的计算样式marginRight（右外边距）
               true，返回正确的计算样式
               false，返回错误的计算样式
			*/
			reliableMarginRight: function() {
				// Support: Android 2.3
				// Check if div with explicit width and no margin-right incorrectly
				// gets computed margin-right based on width of container. (#3333)
				// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
				// This support function is only executed once so no memoizing is needed.
				var ret,
					marginDiv = div.appendChild( document.createElement( "div" ) );

				// Reset CSS: box-sizing; display; margin; border; padding
				marginDiv.style.cssText = div.style.cssText =
					// Support: Firefox<29, Android 2.3
					// Vendor-prefix box-sizing
					"-webkit-box-sizing:content-box;-moz-box-sizing:content-box;" +
					"box-sizing:content-box;display:block;margin:0;border:0;padding:0";
				marginDiv.style.marginRight = marginDiv.style.width = "0";
				div.style.width = "1px";
				docElem.appendChild( container );

				ret = !parseFloat( window.getComputedStyle( marginDiv, null ).marginRight );

				docElem.removeChild( container );

				return ret;
			}
		});
	}
})();


// A method for quickly swapping in/out CSS properties to get correct calculations.
/*快速换进换出样式*/
jQuery.swap = function( elem, options, callback, args ) {
	var ret, name,
		old = {};

	// Remember the old values, and insert the new ones
	for ( name in options ) {
		old[ name ] = elem.style[ name ];
		elem.style[ name ] = options[ name ];
	}

	ret = callback.apply( elem, args || [] );

	// Revert the old values
	for ( name in options ) {
		elem.style[ name ] = old[ name ];
	}

	return ret;
};


var
	// swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
	// see here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rnumsplit = new RegExp( "^(" + pnum + ")(.*)$", "i" ),
	rrelNum = new RegExp( "^([+-])=(" + pnum + ")", "i" ),

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: "0",
		fontWeight: "400"
	},

	cssPrefixes = [ "Webkit", "O", "Moz", "ms" ];

// return a css property mapped to a potentially vendor prefixed property
function vendorPropName( style, name ) {

	// shortcut for names that are not vendor prefixed
	if ( name in style ) {
		return name;
	}

	// check for vendor prefixed names
	var capName = name[0].toUpperCase() + name.slice(1),
		origName = name,
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in style ) {
			return name;
		}
	}

	return origName;
}

function setPositiveNumber( elem, value, subtract ) {
	var matches = rnumsplit.exec( value );
	return matches ?
		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i = extra === ( isBorderBox ? "border" : "content" ) ?
		// If we already have the right measurement, avoid augmentation
		4 :
		// Otherwise initialize for horizontal or vertical properties
		name === "width" ? 1 : 0,

		val = 0;

	for ( ; i < 4; i += 2 ) {
		// both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {
			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// at this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {
			// at this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// at this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property, which is equivalent to the border-box value
	var valueIsBorderBox = true,
		val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		styles = getStyles( elem ),
		isBorderBox = jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// some non-html elements return undefined for offsetWidth, so check for null/undefined
	// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
	// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
	if ( val <= 0 || val == null ) {
		// Fall back to computed then uncomputed css if necessary
		val = curCSS( elem, name, styles );
		if ( val < 0 || val == null ) {
			val = elem.style[ name ];
		}

		// Computed unit is not pixels. Stop here and return.
		if ( rnumnonpx.test(val) ) {
			return val;
		}

		// we need the check for style in case a browser which returns unreliable values
		// for getComputedStyle silently falls back to the reliable elem.style
		valueIsBorderBox = isBorderBox &&
			( support.boxSizingReliable() || val === elem.style[ name ] );

		// Normalize "", auto, and prepare for extra
		val = parseFloat( val ) || 0;
	}

	// use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

function showHide( elements, show ) {
	var display, elem, hidden,
		values = [],
		index = 0,
		length = elements.length;

	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		values[ index ] = data_priv.get( elem, "olddisplay" );
		display = elem.style.display;
		if ( show ) {
			// Reset the inline display of this element to learn if it is
			// being hidden by cascaded rules or not
			if ( !values[ index ] && display === "none" ) {
				elem.style.display = "";
			}

			// Set elements which have been overridden with display: none
			// in a stylesheet to whatever the default browser style is
			// for such an element
			if ( elem.style.display === "" && isHidden( elem ) ) {
				values[ index ] = data_priv.access( elem, "olddisplay", defaultDisplay(elem.nodeName) );
			}
		} else {
			hidden = isHidden( elem );

			if ( display !== "none" || !hidden ) {
				data_priv.set( elem, "olddisplay", hidden ? display : jQuery.css( elem, "display" ) );
			}
		}
	}

	// Set the display of most of the elements in a second loop
	// to avoid the constant reflow
	for ( index = 0; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
			elem.style.display = show ? values[ index ] || "" : "none";
		}
	}

	return elements;
}

jQuery.extend({
	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	/*样式修正对象集*/
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	/*无单位的数值型样式*/
	cssNumber: {
		"columnCount": true,
		"fillOpacity": true,
		"flexGrow": true,
		"flexShrink": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	/*样式名修正*/
	cssProps: {
		// normalize float css property
		"float": "cssFloat"
	},

	// Get and set the style property on a DOM Node
	/*读取或设置内联样式*/
	style: function( elem, name, value, extra ) {
		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			style = elem.style;

		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// convert relative number strings (+= or -=) to relative numbers. #7345
			if ( type === "string" && (ret = rrelNum.exec( value )) ) {
				value = ( ret[1] + 1 ) * ret[2] + parseFloat( jQuery.css( elem, name ) );
				// Fixes bug #9237
				type = "number";
			}

			// Make sure that null and NaN values aren't set. See: #7116
			if ( value == null || value !== value ) {
				return;
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// Fixes #8908, it can be done more correctly by specifying setters in cssHooks,
			// but it would mean to define eight (for every problematic property) identical functions
			if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value, extra )) !== undefined ) {
				style[ name ] = value;
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},
    /* 浏览器解析CSS引擎是从右向左解析，原因在于
       正向解析时，父父节点包含多个子节点，若出现不匹配的情况，会不断的回溯，效率很低
       逆向解析时，子节点只有一个父节点，先找到匹配的目标子节点集合，在根据选择器规则，
       对父节点进行验证，进行过滤，最终找到最终匹配集合，降低了搜索步骤，较正向解析效率高
    */
    /*读取计算样式*/
	css: function( elem, name, extra, styles ) {
		var val, num, hooks,
			origName = jQuery.camelCase( name );

		// Make sure that we're working with the right name
		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( elem.style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		//convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Return, converting to number if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || jQuery.isNumeric( num ) ? num || 0 : val;
		}
		return val;
	}
});

/*覆盖样式height、width的默认读取和设置行为*/
jQuery.each([ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {
				// certain elements can have dimension info if we invisibly show them
				// however, it must have a current display style that would benefit from this
				return rdisplayswap.test( jQuery.css( elem, "display" ) ) && elem.offsetWidth === 0 ?
					jQuery.swap( elem, cssShow, function() {
						return getWidthOrHeight( elem, name, extra );
					}) :
					getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var styles = extra && getStyles( elem );
			return setPositiveNumber( elem, value, extra ?
				augmentWidthOrHeight(
					elem,
					name,
					extra,
					jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				) : 0
			);
		}
	};
});

// Support: Android 2.3
/*覆盖样式marginRight的默认读取行为*/
jQuery.cssHooks.marginRight = addGetHookIf( support.reliableMarginRight,
	function( elem, computed ) {
		if ( computed ) {
			/* 通过将元素设置为inline-block，获取正确的marginRight*/
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			// Work around by temporarily setting element display to inline-block
			return jQuery.swap( elem, { "display": "inline-block" },
				curCSS, [ elem, "marginRight" ] );
		}
	}
);

// These hooks are used by animate to expand properties
jQuery.each({
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// assumes a single number if not a string
				parts = typeof value === "string" ? value.split(" ") : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
});

jQuery.fn.extend({
	css: function( name, value ) {
		return access( this, function( elem, name, value ) {
			var styles, len,
				map = {},
				i = 0;

			if ( jQuery.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	},
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each(function() {
			if ( isHidden( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		});
	}
});


function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || "swing";
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			if ( tween.elem[ tween.prop ] != null &&
				(!tween.elem.style || tween.elem.style[ tween.prop ] == null) ) {
				return tween.elem[ tween.prop ];
			}

			// passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails
			// so, simple values such as "10px" are parsed to Float.
			// complex values such as "rotate(1rad)" are returned as is.
			result = jQuery.css( tween.elem, tween.prop, "" );
			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {
			// use step hook for back compat - use cssHook if its there - use .style if its
			// available and use plain properties where available
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.style && ( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null || jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE9
// Panic based approach to setting things on disconnected nodes

Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p * Math.PI ) / 2;
	}
};

jQuery.fx = Tween.prototype.init;

// Back Compat <1.8 extension point
jQuery.fx.step = {};




var
	fxNow, timerId,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" ),
	rrun = /queueHooks$/,
	animationPrefilters = [ defaultPrefilter ],
	tweeners = {
		"*": [ function( prop, value ) {
			var tween = this.createTween( prop, value ),
				target = tween.cur(),
				parts = rfxnum.exec( value ),
				unit = parts && parts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

				// Starting value computation is required for potential unit mismatches
				start = ( jQuery.cssNumber[ prop ] || unit !== "px" && +target ) &&
					rfxnum.exec( jQuery.css( tween.elem, prop ) ),
				scale = 1,
				maxIterations = 20;

			if ( start && start[ 3 ] !== unit ) {
				// Trust units reported by jQuery.css
				unit = unit || start[ 3 ];

				// Make sure we update the tween properties later on
				parts = parts || [];

				// Iteratively approximate from a nonzero starting point
				start = +target || 1;

				do {
					// If previous iteration zeroed out, double until we get *something*
					// Use a string for doubling factor so we don't accidentally see scale as unchanged below
					scale = scale || ".5";

					// Adjust and apply
					start = start / scale;
					jQuery.style( tween.elem, prop, start + unit );

				// Update scale, tolerating zero or NaN from tween.cur()
				// And breaking the loop if scale is unchanged or perfect, or if we've just had enough
				} while ( scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations );
			}

			// Update tween properties
			if ( parts ) {
				start = tween.start = +start || +target || 0;
				tween.unit = unit;
				// If a +=/-= token was provided, we're doing a relative animation
				tween.end = parts[ 1 ] ?
					start + ( parts[ 1 ] + 1 ) * parts[ 2 ] :
					+parts[ 2 ];
			}

			return tween;
		} ]
	};

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout(function() {
		fxNow = undefined;
	});
	return ( fxNow = jQuery.now() );
}

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		i = 0,
		attrs = { height: type };

	// if we include width, step value is 1 to do all cssExpand values,
	// if we don't include width, step value is 2 to skip over Left and Right
	includeWidth = includeWidth ? 1 : 0;
	for ( ; i < 4 ; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( tweeners[ prop ] || [] ).concat( tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( (tween = collection[ index ].call( animation, prop, value )) ) {

			// we're done with this property
			return tween;
		}
	}
}

function defaultPrefilter( elem, props, opts ) {
	/* jshint validthis: true */
	var prop, value, toggle, tween, hooks, oldfire, display, checkDisplay,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHidden( elem ),
		dataShow = data_priv.get( elem, "fxshow" );

	// handle queue: false promises
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always(function() {
			// doing this makes sure that the complete handler will be called
			// before this completes
			anim.always(function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			});
		});
	}

	// height/width overflow pass
	if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
		// Make sure that nothing sneaks out
		// Record all 3 overflow attributes because IE9-10 do not
		// change the overflow attribute when overflowX and
		// overflowY are set to the same value
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Set display property to inline-block for height/width
		// animations on inline elements that are having width/height animated
		display = jQuery.css( elem, "display" );

		// Test default display if display is currently "none"
		checkDisplay = display === "none" ?
			data_priv.get( elem, "olddisplay" ) || defaultDisplay( elem.nodeName ) : display;

		if ( checkDisplay === "inline" && jQuery.css( elem, "float" ) === "none" ) {
			style.display = "inline-block";
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		anim.always(function() {
			style.overflow = opts.overflow[ 0 ];
			style.overflowX = opts.overflow[ 1 ];
			style.overflowY = opts.overflow[ 2 ];
		});
	}

	// show/hide pass
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.exec( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {

				// If there is dataShow left over from a stopped hide or show and we are going to proceed with show, we should pretend to be hidden
				if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
					hidden = true;
				} else {
					continue;
				}
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );

		// Any non-fx value stops us from restoring the original display value
		} else {
			display = undefined;
		}
	}

	if ( !jQuery.isEmptyObject( orig ) ) {
		if ( dataShow ) {
			if ( "hidden" in dataShow ) {
				hidden = dataShow.hidden;
			}
		} else {
			dataShow = data_priv.access( elem, "fxshow", {} );
		}

		// store state if its toggle - enables .stop().toggle() to "reverse"
		if ( toggle ) {
			dataShow.hidden = !hidden;
		}
		if ( hidden ) {
			jQuery( elem ).show();
		} else {
			anim.done(function() {
				jQuery( elem ).hide();
			});
		}
		anim.done(function() {
			var prop;

			data_priv.remove( elem, "fxshow" );
			for ( prop in orig ) {
				jQuery.style( elem, prop, orig[ prop ] );
			}
		});
		for ( prop in orig ) {
			tween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );

			if ( !( prop in dataShow ) ) {
				dataShow[ prop ] = tween.start;
				if ( hidden ) {
					tween.end = tween.start;
					tween.start = prop === "width" || prop === "height" ? 1 : 0;
				}
			}
		}

	// If this is a noop like .hide().hide(), restore an overwritten display value
	} else if ( (display === "none" ? defaultDisplay( elem.nodeName ) : display) === "inline" ) {
		style.display = display;
	}
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( jQuery.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// not quite $.extend, this wont overwrite keys already present.
			// also - reusing 'index' from above because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

/*动画模块*/
function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = animationPrefilters.length,
		deferred = jQuery.Deferred().always( function() {
			// don't match elem in the :animated selector
			delete tick.elem;
		}),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
				// archaic crash bug won't allow us to use 1 - ( 0.5 || 0 ) (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length ; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ]);

			if ( percent < 1 && length ) {
				return remaining;
			} else {
				deferred.resolveWith( elem, [ animation ] );
				return false;
			}
		},
		animation = deferred.promise({
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, { specialEasing: {} }, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,
					// if we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// resolve when we played the last frame
				// otherwise, reject
				if ( gotoEnd ) {
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		}),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length ; index++ ) {
		result = animationPrefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		})
	);

	// attach callbacks from options
	return animation.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );
}

jQuery.Animation = jQuery.extend( Animation, {

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.split(" ");
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length ; index++ ) {
			prop = props[ index ];
			tweeners[ prop ] = tweeners[ prop ] || [];
			tweeners[ prop ].unshift( callback );
		}
	},

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			animationPrefilters.unshift( callback );
		} else {
			animationPrefilters.push( callback );
		}
	}
});

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
		opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

	// normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.fn.extend({
	fadeTo: function( speed, to, easing, callback ) {

		// show any hidden elements after setting opacity to 0
		return this.filter( isHidden ).css( "opacity", 0 ).show()

			// animate to the value specified
			.end().animate({ opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {
				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || data_priv.get( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each(function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = data_priv.get( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		});
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each(function() {
			var index,
				data = data_priv.get( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// enable finishing flag on private data
			data.finish = true;

			// empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// turn off finishing flag
			delete data.finish;
		});
	}
});

jQuery.each([ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
});

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx("show"),
	slideUp: genFx("hide"),
	slideToggle: genFx("toggle"),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.timers = [];
jQuery.fx.tick = function() {
	var timer,
		i = 0,
		timers = jQuery.timers;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];
		// Checks the timer has not already been removed
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	jQuery.timers.push( timer );
	if ( timer() ) {
		jQuery.fx.start();
	} else {
		jQuery.timers.pop();
	}
};

jQuery.fx.interval = 13;

jQuery.fx.start = function() {
	if ( !timerId ) {
		timerId = setInterval( jQuery.fx.tick, jQuery.fx.interval );
	}
};

jQuery.fx.stop = function() {
	clearInterval( timerId );
	timerId = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,
	// Default speed
	_default: 400
};


// Based off of the plugin by Clint Helfers, with permission.
// http://blindsignals.com/index.php/2009/07/jquery-delay/
jQuery.fn.delay = function( time, type ) {
	time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
	type = type || "fx";
    
    /* 调用.queue，向函数队列添加一个定时器函数，用来延迟下一个函数的出队时间。
       定时器延迟了next函数的执行时间（这段代码与jQuery.dequeue代码有关）
    */
	return this.queue( type, function( next, hooks ) {
		var timeout = setTimeout( next, time );
		hooks.stop = function() {
			clearTimeout( timeout );
		};
	});
};


(function() {
	var input = document.createElement( "input" ),
		select = document.createElement( "select" ),
		opt = select.appendChild( document.createElement( "option" ) );

	input.type = "checkbox";
    
    /* Safari默认值为空字符串，其他默认值为on
       检验check、radio元素的默认值
    */
	// Support: iOS 5.1, Android 4.x, Android 2.3
	// Check the default checkbox/radio value ("" on old WebKit; "on" elsewhere)
	support.checkOn = input.value !== "";

    /* 检验当前浏览器选择框默认选择项selected的值*/
	// Must access the parent to make an option select properly
	// Support: IE9, IE10
	support.optSelected = opt.selected;

    /* 检验当前浏览器选择框被禁用，其选择项是否被自动禁用
       早期Safari，会自动禁用，值为true
       其他浏览器，则不会自动禁用，值为false
    */
	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Check if an input maintains its value after becoming a radio
	// Support: IE9, IE10
	input = document.createElement( "input" );
	input.value = "t";
	input.type = "radio";

	/* 检验当前浏览器设置type为radio时，其value值是否会丢失
       IE10-会丢失
	*/
	support.radioValue = input.value === "t";
})();


var nodeHook, boolHook,
	attrHandle = jQuery.expr.attrHandle;

jQuery.fn.extend({
	/*获取或设置属性，有四种情况，如下：
      .attr(name):获取当前DOM元素集合中第一个元素的HTML属性值
      .attr(name,value):为当前DOM元素集合中每个元素设置HTML属性
      .attr({...}):为当前DOM元素集合中每个元素设置一个或多个HTML属性
      .attr(name,fn):为当前DOM元素集合中每个元素设置HTML属性，其值为fn函数的返回值，若为null或undefined，则不进行设置
      这个方法应用了access方法和jQuery.attr方法
	*/
	attr: function( name, value ) {
		return access( this, jQuery.attr, name, value, arguments.length > 1 );
	},
    /*删除HTML属性，应用了jQuery.removeAttr方法*/
	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	}
});

jQuery.extend({
	/*静态方法，用于获取或设置DOM元素的HTML属性*/
	attr: function( elem, name, value ) {
		var hooks, ret,
			nType = elem.nodeType;
        
        /*忽略文本节点、注释节点、属性节点，不在这些节点上获取或设置HTML属性*/
		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}
        
        /*若不支持getAttributes，则使用jQuery.prop，获取或设置DOM属性*/
		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === strundefined ) {
			return jQuery.prop( elem, name, value );
		}

        /*不是XML*/
		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			/*HTML属性为小写*/
			name = name.toLowerCase();
			/*获取特殊HTML属性*/
			hooks = jQuery.attrHooks[ name ] ||
			    /*判断属性是否为布尔型，若是则返回boolHook
			      否则返回nodeHook-通用HTML属性修正对象*/
				( jQuery.expr.match.bool.test( name ) ? boolHook : nodeHook );
		}

        /*若传入参数value，则为设置HTML属性*/
		if ( value !== undefined ) {
            /*值为null，则删除对应的HTML属性*/
			if ( value === null ) {
				jQuery.removeAttr( elem, name );
            /*值不为null，且修正对象hooks存在，包含set方法，返回值不为undefined，设置HTML属性成功*/
			} else if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;
            /*值不为null，hooks对象等不适合，则调用原生方法setAttribute，设置HTML属性*/
			} else {
				elem.setAttribute( name, value + "" );
				return value;
			}
        /*若不传入参数value，则为获取HTML属性*/
        /*修正对象hooks存在，返回值不为null，获取HTML属性成功*/
		} else if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
			return ret;
        /*Sizzle引擎Sizzle获取HTML属性*/
		} else {
			ret = jQuery.find.attr( elem, name );

			// Non-existent attributes return null, we normalize to undefined
			return ret == null ?
				undefined :
				ret;
		}
	},
    
    /*删除HTML属性*/
	removeAttr: function( elem, value ) {
		var name, propName,
			i = 0,
			/*获取属性名（value中以空格为分隔符）*/
			attrNames = value && value.match( rnotwhite );
        /*只对元素节点进行删除*/
		if ( attrNames && elem.nodeType === 1 ) {
			/*循环删除属性*/
			while ( (name = attrNames[i++]) ) {
				propName = jQuery.propFix[ name ] || name;
                
                /*若为布尔型属性，则先置为false*/
				// Boolean attributes get special treatment (#10870)
				if ( jQuery.expr.match.bool.test( name ) ) {
					// Set corresponding property to false
					elem[ propName ] = false;
				}
                /*调用原生removeAttribute方法删除属性*/
				elem.removeAttribute( name );
			}
		}
	},
    
    /*存放需要修正的HTML属性和对应的修正对象，每个修正对象包含set方法
      当前版本只存放type方法，用于修正radio元素value被覆盖的问题
    */
	attrHooks: {
		type: {
			set: function( elem, value ) {
				/* 若自动丢失，则本地缓存，设置type后，再重新设置value*/
				if ( !support.radioValue && value === "radio" &&
					jQuery.nodeName( elem, "input" ) ) {
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to default in case type is set after value during creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	}
});

/*若某个HTML属性对应的DOM属性的值为布尔型，则该HTML属性为布尔型HTML属性，属性名为小写*/
// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		/*若当前HTML属性值为false，则删除该属性*/
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		/*若为true，则调用原生setAttribute方法，设置属性*/
		} else {
			elem.setAttribute( name, name );
		}
		return name;
	}
};
jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
	var getter = attrHandle[ name ] || jQuery.find.attr;

	attrHandle[ name ] = function( elem, name, isXML ) {
		var ret, handle;
		if ( !isXML ) {
			// Avoid an infinite loop by temporarily removing this function from the getter
			handle = attrHandle[ name ];
			attrHandle[ name ] = ret;
			ret = getter( elem, name, isXML ) != null ?
				name.toLowerCase() :
				null;
			attrHandle[ name ] = handle;
		}
		return ret;
	};
});




var rfocusable = /^(?:input|select|textarea|button)$/i;

jQuery.fn.extend({
	/*获取或设置DOM元素的DOM属性
      .prop(name):获取当前DOM元素集合中第一个元素的DOM属性值
      .prop(name,value):为当前DOM元素集合中每个元素设置DOM属性
      .prop({...}):为当前DOM元素集合中每个元素设置一个或多个DOM属性
      .prop(name,fn):为当前DOM元素集合中每个元素设置DOM属性，其值为fn函数的返回值，若为null或undefined，则不进行设置
      这个方法应用了access方法和jQuery.prop方法
	*/
	prop: function( name, value ) {
		return access( this, jQuery.prop, name, value, arguments.length > 1 );
	},
    /*为当前DOM元素集合中每个元素删除一个DOM属性*/
	removeProp: function( name ) {
		return this.each(function() {
			delete this[ jQuery.propFix[ name ] || name ];
		});
	}
});

jQuery.extend({
	/*HTML属性名修正对象*/
	propFix: {
		"for": "htmlFor",
		"class": "className"
	},
    
    /*获取或设置DOM元素的DOM属性*/
	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			/*获取修正后的属性名和对象*/
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}
        /*若传入value，则设置DOM属性*/
		if ( value !== undefined ) {
			/*先调用hooks的set方法，若不成功，则在elem上直接设置DOM属性*/
			return hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ?
				ret :
				( elem[ name ] = value );
        /*未传入value，则获取DOM属性*/
		} else {
			return hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ?
				ret :
				elem[ name ];
		}
	},
    /*保存需要修正的DOM属性和对应的修正对象*/
	propHooks: {
		tabIndex: {
			get: function( elem ) {
				/*当设置了tabindex，为可获得焦点的元素，为a标签是，通过属性节点获取tabIndex并返回；其他返回-1*/
				return elem.hasAttribute( "tabindex" ) || rfocusable.test( elem.nodeName ) || elem.href ?
					elem.tabIndex :
					-1;
			}
		}
	}
});

// Support: IE9+
// Selectedness for an option in an optgroup can be inaccurate
if ( !support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {
			var parent = elem.parentNode;
			if ( parent && parent.parentNode ) {
				parent.parentNode.selectedIndex;
			}
			return null;
		}
	};
}

/*添加其他需要修正的HTML属性*/
jQuery.each([
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
});




var rclass = /[\t\r\n\f]/g;

jQuery.fn.extend({
	/*为当前DOM元素集合中每个元素添加一个或多个类
      addClass(value):一个或多个以空格分隔的类样式，这些类样式将被添加到当前类样式之后
      addClass(fn):返回一个或多个以空格分隔的类样式，这些类样式将被添加到当前类样式中
                   fn有有2个参数：当前元素在集合中的下标位置、当前类样式
	*/
	addClass: function( value ) {
		var classes, elem, cur, clazz, j, finalValue,
			proceed = typeof value === "string" && value,
			i = 0,
			len = this.length;

		if ( jQuery.isFunction( value ) ) {
			/*若为函数，循环以fn调用返回结果，调用addClass*/
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call( this, j, this.className ) );
			});
		}

		if ( proceed ) {
			// The disjunction here is for better compressibility (see removeClass)
			classes = ( value || "" ).match( rnotwhite ) || [];
            /*遍历当前DOM元素集合*/
			for ( ; i < len; i++ ) {
				elem = this[ i ];
				/*获取每个元素的类样式*/
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					" "
				);

				if ( cur ) {
					j = 0;
					/*循环添加类样式*/
					while ( (clazz = classes[j++]) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}

					// only assign if different to avoid unneeded rendering.
					finalValue = jQuery.trim( cur );
					if ( elem.className !== finalValue ) {
						elem.className = finalValue;
					}
				}
			}
		}

		return this;
	},
    /*为当前DOM元素集合中每个元素删除一个或多个类
      removeClass(value):一个或多个以空格分隔的类样式，这些类样式将从当前类样式被删除
      removeClass(fn):返回一个或多个以空格分隔的类样式，这些类样式将从当前类样式被删除
                   fn有有2个参数：当前元素在集合中的下标位置、当前类样式
      removeClass():删除当前类样式
	*/
	removeClass: function( value ) {
		var classes, elem, cur, clazz, j, finalValue,
			proceed = arguments.length === 0 || typeof value === "string" && value,
			i = 0,
			len = this.length;

		if ( jQuery.isFunction( value ) ) {
			/*若为函数，则遍历当前元素数组，调用removeClass*/
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call( this, j, this.className ) );
			});
		}
		if ( proceed ) {
			classes = ( value || "" ).match( rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					""
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						/*使用replace方法，替换掉classes里的项*/
						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) >= 0 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}
                    /*若未传入参数，则直接赋值为空字符串*/
					// only assign if different to avoid unneeded rendering.
					finalValue = value ? jQuery.trim( cur ) : "";
					if ( elem.className !== finalValue ) {
						elem.className = finalValue;
					}
				}
			}
		}

		return this;
	},
    /*为当前DOM元素集合中每个元素删除或添加一个或多个类
      .toggleClass(value):若每个元素中含有指定的类，则删除，若没有则添加
      .toggleClass()、.toggleClass(boolean):若当前无类或为false，则删除当前类样式；否则设置为最近一次缓存的类
      .toggleClass(value,boolean):true为添加，false为删除
      .toggleClass(fn,boolean):以每个元素类、boolean为参数调用fn，其返回值和boolean循环调用toggleClass，true为添加，false为删除
    */
	toggleClass: function( value, stateVal ) {
		var type = typeof value;

		if ( typeof stateVal === "boolean" && type === "string" ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					classNames = value.match( rnotwhite ) || [];

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( type === strundefined || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					data_priv.set( this, "__className__", this.className );
				}

				// If the element has a class name or if we're passed "false",
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				this.className = this.className || value === false ? "" : data_priv.get( this, "__className__" ) || "";
			}
		});
	},
    /*检测当前DOM元素集合中是否含有指定的样式，只要有一个元素含有就返回true
      使用空格分隔类，并使用string.indexOf进行判断
    */
	hasClass: function( selector ) {
		var className = " " + selector + " ",
			i = 0,
			l = this.length;
		for ( ; i < l; i++ ) {
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
				return true;
			}
		}

		return false;
	}
});




var rreturn = /\r/g;

jQuery.fn.extend({
	/*为当前DOM元素集合，获取或设置当前值
	  .val():获取第一个元素的值
	  .val(value):为当前DOM元素集合每个元素设置当前值
	  .val(fn):为当前DOM元素集合每个元素用fn（当前元素的值为参数）返回值设置当前值
	*/
	val: function( value ) {
		var hooks, ret, isFunction,
			elem = this[0];
        /*获取第一个元素的值*/
		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?
					// handle most common string cases
					ret.replace(rreturn, "") :
					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";

			} else if ( typeof val === "number" ) {
				val += "";

			} else if ( jQuery.isArray( val ) ) {
				/*将null或undefined置空*/
				val = jQuery.map( val, function( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	/*保存需要修正的节点和修正对象，包含option、select、radio、checkbox*/
	valHooks: {
		option: {
			get: function( elem ) {
				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :
					// Support: IE10-11+
					// option.text throws exceptions (#14686, #14858)
					jQuery.trim( jQuery.text( elem ) );
			}
		},
		select: {
			get: function( elem ) {
				var value, option,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one" || index < 0,
					values = one ? null : [],
					max = one ? index + 1 : options.length,
					i = index < 0 ?
						max :
						one ? index : 0;

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// IE6-9 doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&
							// Don't return options that are disabled or in a disabled optgroup
							( support.optDisabled ? !option.disabled : option.getAttribute( "disabled" ) === null ) &&
							( !option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];
					if ( (option.selected = jQuery.inArray( option.value, values ) >= 0) ) {
						optionSet = true;
					}
				}

				// force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	}
});

// Radios and checkboxes getter/setter
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
			}
		}
	};
	/* radio、checkbox元素未指定value时，统一返回on*/
	if ( !support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			// Support: Webkit
			// "" is returned instead of "on" if a value isn't specified
			return elem.getAttribute("value") === null ? "on" : elem.value;
		};
	}
});




// Return jQuery for attributes-only inclusion

/*事件便捷方法*/
jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {
    /*初始化事件便捷方法click(data,fn)等*/
	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
});
/*实例事件方法*/
jQuery.fn.extend({
	/*绑定鼠标指针进入和离开时执行的事件监听函数*/
	hover: function( fnOver, fnOut ) {
		/*使用便捷方法，链式绑定函数*/
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	},
    /*遗留方法*/
	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
	}
});


var nonce = jQuery.now();

var rquery = (/\?/);

// ajax交互模块

/* 字符串转JavaScript值*/
// Support: Android 2.3
// Workaround failure to string-cast null input
jQuery.parseJSON = function( data ) {
	/* JSON.parse，将字符串解析为原生JavaScript值
	   若字符串不符合JSON规范，这个方法会报错
	*/
	return JSON.parse( data + "" );
};

/* 接受一个格式良好的XML字符串，返回解析后的XML文档*/
// Cross-browser xml parsing
jQuery.parseXML = function( data ) {
	var xml, tmp;
	if ( !data || typeof data !== "string" ) {
		return null;
	}
    /* 若XML格式不良好，会返回一个Document对象，但这个对象的文档元素是<parsererror>
       但IE9中使用这个实例对象，解析失败时，是抛出一个解析错误，而不是Document对象。
       因此，使用try-catch，捕获这个错误，将其置为undefined
    */
	// Support: IE9
	try {
		/* DOMParser，将某个XML文档解析为DOM结构*/
		tmp = new DOMParser();
		/* parseFromString，第一个参数是要解析的XML字符串和内容类型，第二个参数是内容类型text/xml*/
		xml = tmp.parseFromString( data, "text/xml" );
	} catch ( e ) {
		xml = undefined;
	}
    
    /* xml为undefined或有parsererror标签，则xml解析失败*/
	if ( !xml || xml.getElementsByTagName( "parsererror" ).length ) {
		jQuery.error( "Invalid XML: " + data );
	}
	return xml;
};


var
	// Document location
	ajaxLocParts,
	ajaxLocation,

	rhash = /#.*$/,
	rts = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rurl = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat("*");

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
	ajaxLocation = location.href;
} catch( e ) {
	// Use the href attribute of an A element
	// since IE will modify it given document.location
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( rnotwhite ) || [];

		if ( jQuery.isFunction( func ) ) {
			// For each dataType in the dataTypeExpression
			while ( (dataType = dataTypes[i++]) ) {
				// Prepend if requested
				if ( dataType[0] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					(structure[ dataType ] = structure[ dataType ] || []).unshift( func );

				// Otherwise append
				} else {
					(structure[ dataType ] = structure[ dataType ] || []).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if ( typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[ dataTypeOrTransport ] ) {
				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		});
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var key, deep,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || (deep = {}) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var ct, type, finalDataType, firstDataType,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while ( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},
		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

		// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {
								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s[ "throws" ] ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return { state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current };
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}

jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: ajaxLocation,
		type: "GET",
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},
    // ajax全局配置方法
	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),
    
    /*ajax模块
    */
	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var transport,
			// URL without anti-cache param
			cacheURL,
			// Response headers
			responseHeadersString,
			responseHeaders,
			// timeout handle
			timeoutTimer,
			// Cross-domain detection vars
			parts,
			// To know if global events are to be dispatched
			fireGlobals,
			// Loop variable
			i,
			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context && ( callbackContext.nodeType || callbackContext.jquery ) ?
				jQuery( callbackContext ) :
				jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks("once memory"),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
			// The jqXHR state
			state = 0,
			// Default abort message
			strAbort = "canceled",
			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( (match = rheaders.exec( responseHeadersString )) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					var lname = name.toLowerCase();
					if ( !state ) {
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( state < 2 ) {
							for ( code in map ) {
								// Lazy-add the new callback in a way that preserves old ones
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						} else {
							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR ).complete = completeDeferred.add;
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (prefilters might expect it)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || ajaxLocation ) + "" ).replace( rhash, "" )
			.replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( rnotwhite ) || [ "" ];

		// A cross-domain request is in order when we have a protocol:host:port mismatch
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? "80" : "443" ) ) !==
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? "80" : "443" ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( state === 2 ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		fireGlobals = s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger("ajaxStart");
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		cacheURL = s.url;

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				cacheURL = ( s.url += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data );
				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add anti-cache in url if needed
			if ( s.cache === false ) {
				s.url = rts.test( cacheURL ) ?

					// If there is already a '_' parameter, set its value
					cacheURL.replace( rts, "$1_=" + nonce++ ) :

					// Otherwise add one to the end
					cacheURL + ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + nonce++;
			}
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
			// Abort if not done already and return
			return jqXHR.abort();
		}

		// aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout(function() {
					jqXHR.abort("timeout");
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch ( e ) {
				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader("Last-Modified");
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader("etag");
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger("ajaxStop");
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
});
// 添加ajax快捷方法
jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		});
	};
});
// 使用each方法添加ajax门面接口
// Attach a bunch of functions for handling common AJAX events
jQuery.each( [ "ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend" ], function( i, type ) {
	jQuery.fn[ type ] = function( fn ) {
		return this.on( type, fn );
	};
});


jQuery._evalUrl = function( url ) {
	return jQuery.ajax({
		url: url,
		type: "GET",
		dataType: "script",
		async: false,
		global: false,
		"throws": true
	});
};

/*工具方法--包裹元素*/
jQuery.fn.extend({
	/*将包裹元素插入第一个DOM元素之前，并将当前DOM元素集合插入包裹元素最内层元素内
      相当于整体包裹DOM元素集合
	*/
	wrapAll: function( html ) {
		var wrap;

		if ( jQuery.isFunction( html ) ) {
			return this.each(function( i ) {
				jQuery( this ).wrapAll( html.call(this, i) );
			});
		}

		if ( this[ 0 ] ) {
            
			// The elements to wrap the target around
			/*获取包裹元素*/
			wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );
            /*在当前DOM元素集合第一项前插入wrap*/
			if ( this[ 0 ].parentNode ) {
				wrap.insertBefore( this[ 0 ] );
			}
            /*遍历包裹元素，在每个包裹元素的最内层元素节点插入当前DOM元素集合*/
			wrap.map(function() {
				var elem = this;

				while ( elem.firstElementChild ) {
					elem = elem.firstElementChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},
    /*为当前DOM元素集合每一项子元素集合前后包裹一段HTML代码*/
	wrapInner: function( html ) {
		/*参数为函数，遍历当前DOM元素集合，以函数返回值为参数，调用wrapInner方法*/
		if ( jQuery.isFunction( html ) ) {
			return this.each(function( i ) {
				jQuery( this ).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
			    /*获取当前元素的子元素*/
				contents = self.contents();
            /*存在子元素，则wrapAll子元素集合
              若不存在，当前元素插入html
            */
			if ( contents.length ) {
				contents.wrapAll( html );
			} else {
				self.append( html );
			}
		});
	},
    /*为当前DOM元素集合每一项前后包裹一段HTML代码*/
	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each(function( i ) {
			jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
		});
	},
    /*移除当前DOM元素集合每一项的父元素，保留每一项元素在父元素的位置上*/
	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	}
});

/* 判断DOM元素是否占据布局空间，
   返回true，不占据布局空间
   返回false，占据布局空间
*/
jQuery.expr.filters.hidden = function( elem ) {
	// Support: Opera <= 12.12
	// Opera reports offsetWidths and offsetHeights less than zero on some elements
	return elem.offsetWidth <= 0 && elem.offsetHeight <= 0;
};

/* 判断DOM元素是否占据布局空间
   返回true，占据布局空间
   返回false，不占据布局空间
*/
jQuery.expr.filters.visible = function( elem ) {
	return !jQuery.expr.filters.hidden( elem );
};




var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// Item is non-scalar (array or object), encode its numeric index.
				buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {
		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}

// Serialize an array of form elements or a set of
// key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, value ) {
			// If value is a function, invoke it and return its value
			value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
			s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
		};

	// Set traditional to true for jQuery <= 1.3.2 behavior.
	if ( traditional === undefined ) {
		traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		});

	} else {
		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" ).replace( r20, "+" );
};

jQuery.fn.extend({
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map(function() {
			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		})
		.filter(function() {
			var type = this.type;

			// Use .is( ":disabled" ) so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !rcheckableType.test( type ) );
		})
		.map(function( i, elem ) {
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val ) {
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});


jQuery.ajaxSettings.xhr = function() {
	try {
		return new XMLHttpRequest();
	} catch( e ) {}
};

var xhrId = 0,
	xhrCallbacks = {},
	xhrSuccessStatus = {
		// file protocol always yields status code 0, assume 200
		0: 200,
		// Support: IE9
		// #1450: sometimes IE returns 1223 when it should be 204
		1223: 204
	},
	/* 若当前浏览器可创建XMLHttpRequest对象，则返回XMLHttpRequest对象，否则，返回undefined*/
	xhrSupported = jQuery.ajaxSettings.xhr();

// Support: IE9
// Open requests must be manually aborted on unload (#5280)
if ( window.ActiveXObject ) {
	jQuery( window ).on( "unload", function() {
		for ( var key in xhrCallbacks ) {
			xhrCallbacks[ key ]();
		}
	});
}

/* 检验当前浏览器是否支持跨域资源共享*/
support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
/* 检验当前浏览器能否创建XMLHttpRequest对象*/
support.ajax = xhrSupported = !!xhrSupported;

jQuery.ajaxTransport(function( options ) {
	var callback;

	// Cross domain only allowed if supported through XMLHttpRequest
	if ( support.cors || xhrSupported && !options.crossDomain ) {
		return {
			send: function( headers, complete ) {
				var i,
					xhr = options.xhr(),
					id = ++xhrId;

				xhr.open( options.type, options.url, options.async, options.username, options.password );

				// Apply custom fields if provided
				if ( options.xhrFields ) {
					for ( i in options.xhrFields ) {
						xhr[ i ] = options.xhrFields[ i ];
					}
				}

				// Override mime type if needed
				if ( options.mimeType && xhr.overrideMimeType ) {
					xhr.overrideMimeType( options.mimeType );
				}

				// X-Requested-With header
				// For cross-domain requests, seeing as conditions for a preflight are
				// akin to a jigsaw puzzle, we simply never set it to be sure.
				// (it can always be set on a per-request basis or even using ajaxSetup)
				// For same-domain requests, won't change header if already provided.
				if ( !options.crossDomain && !headers["X-Requested-With"] ) {
					headers["X-Requested-With"] = "XMLHttpRequest";
				}

				// Set headers
				for ( i in headers ) {
					xhr.setRequestHeader( i, headers[ i ] );
				}

				// Callback
				callback = function( type ) {
					return function() {
						if ( callback ) {
							delete xhrCallbacks[ id ];
							callback = xhr.onload = xhr.onerror = null;

							if ( type === "abort" ) {
								xhr.abort();
							} else if ( type === "error" ) {
								complete(
									// file: protocol always yields status 0; see #8605, #14207
									xhr.status,
									xhr.statusText
								);
							} else {
								complete(
									xhrSuccessStatus[ xhr.status ] || xhr.status,
									xhr.statusText,
									// Support: IE9
									// Accessing binary-data responseText throws an exception
									// (#11426)
									typeof xhr.responseText === "string" ? {
										text: xhr.responseText
									} : undefined,
									xhr.getAllResponseHeaders()
								);
							}
						}
					};
				};

				// Listen to events
				xhr.onload = callback();
				xhr.onerror = callback("error");

				// Create the abort callback
				callback = xhrCallbacks[ id ] = callback("abort");

				try {
					// Do send the request (this may raise an exception)
					xhr.send( options.hasContent && options.data || null );
				} catch ( e ) {
					// #14683: Only rethrow if this hasn't been notified as an error yet
					if ( callback ) {
						throw e;
					}
				}
			},

			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
});




// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /(?:java|ecma)script/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and crossDomain
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function( s ) {
	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {
		var script, callback;
		return {
			send: function( _, complete ) {
				script = jQuery("<script>").prop({
					async: true,
					charset: s.scriptCharset,
					src: s.url
				}).on(
					"load error",
					callback = function( evt ) {
						script.remove();
						callback = null;
						if ( evt ) {
							complete( evt.type === "error" ? 404 : 200, evt.type );
						}
					}
				);
				document.head.appendChild( script[ 0 ] );
			},
			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
});




var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" && !( s.contentType || "" ).indexOf("application/x-www-form-urlencoded") && rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always(function() {
			// Restore preexisting value
			window[ callbackName ] = overwritten;

			// Save back as free
			if ( s[ callbackName ] ) {
				// make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		});

		// Delegate to script
		return "script";
	}
});




// data: string of html
// context (optional): If specified, the fragment will be created in this context, defaults to document
// keepScripts (optional): If true, will include scripts passed in the html string
jQuery.parseHTML = function( data, context, keepScripts ) {
	if ( !data || typeof data !== "string" ) {
		return null;
	}
	if ( typeof context === "boolean" ) {
		keepScripts = context;
		context = false;
	}

	// 若context为null，则将document赋值给context
	context = context || document;

	var parsed = rsingleTag.exec( data ),
		scripts = !keepScripts && [];

	// Single tag
	if ( parsed ) {
		/*单个标签产生一个DOM元素*/
		return [ context.createElement( parsed[1] ) ];
	}

	parsed = jQuery.buildFragment( [ data ], context, scripts );

	if ( scripts && scripts.length ) {
		jQuery( scripts ).remove();
	}

	return jQuery.merge( [], parsed.childNodes );
};


// Keep a copy of the old load method
var _load = jQuery.fn.load;

/**
 * Load a url into a page
 */
jQuery.fn.load = function( url, params, callback ) {
	if ( typeof url !== "string" && _load ) {
		return _load.apply( this, arguments );
	}

	var selector, type, response,
		self = this,
		off = url.indexOf(" ");

	if ( off >= 0 ) {
		selector = jQuery.trim( url.slice( off ) );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax({
			url: url,

			// if "type" variable is undefined, then "GET" method will be used
			type: type,
			dataType: "html",
			data: params
		}).done(function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery("<div>").append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		}).complete( callback && function( jqXHR, status ) {
			self.each( callback, response || [ jqXHR.responseText, status, jqXHR ] );
		});
	}

	return this;
};



/* 用于检测DOM元素是否有正在执行动画*/
jQuery.expr.filters.animated = function( elem ) {
	/* 遍历全局动画函数数组*/
	return jQuery.grep(jQuery.timers, function( fn ) {
		/* 检测每个动画函数的属性elem是否是当前元素*/
		return elem === fn.elem;
	}).length;
};




var docElem = window.document.documentElement;

/**
 * Gets a window from an element
 */
function getWindow( elem ) {
	return jQuery.isWindow( elem ) ? elem : elem.nodeType === 9 && elem.defaultView;
}

jQuery.offset = {
	setOffset: function( elem, options, i ) {
		var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
			position = jQuery.css( elem, "position" ),
			curElem = jQuery( elem ),
			props = {};

		// Set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		curOffset = curElem.offset();
		curCSSTop = jQuery.css( elem, "top" );
		curCSSLeft = jQuery.css( elem, "left" );
		calculatePosition = ( position === "absolute" || position === "fixed" ) &&
			( curCSSTop + curCSSLeft ).indexOf("auto") > -1;

		// Need to be able to calculate position if either top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;

		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );

		} else {
			curElem.css( props );
		}
	}
};

jQuery.fn.extend({
	offset: function( options ) {
		if ( arguments.length ) {
			return options === undefined ?
				this :
				this.each(function( i ) {
					jQuery.offset.setOffset( this, options, i );
				});
		}

		var docElem, win,
			elem = this[ 0 ],
			box = { top: 0, left: 0 },
			doc = elem && elem.ownerDocument;

		if ( !doc ) {
			return;
		}

		docElem = doc.documentElement;

		// Make sure it's not a disconnected DOM node
		if ( !jQuery.contains( docElem, elem ) ) {
			return box;
		}

		// If we don't have gBCR, just use 0,0 rather than error
		// BlackBerry 5, iOS 3 (original iPhone)
		if ( typeof elem.getBoundingClientRect !== strundefined ) {
			box = elem.getBoundingClientRect();
		}
		win = getWindow( doc );
		return {
			top: box.top + win.pageYOffset - docElem.clientTop,
			left: box.left + win.pageXOffset - docElem.clientLeft
		};
	},

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			elem = this[ 0 ],
			parentOffset = { top: 0, left: 0 };

		// Fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is its only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {
			// We assume that getBoundingClientRect is available when computed position is fixed
			offset = elem.getBoundingClientRect();

		} else {
			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			offset = this.offset();
			if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			parentOffset.top += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
			parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
		}

		// Subtract parent offsets and element margins
		return {
			top: offset.top - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || docElem;

			while ( offsetParent && ( !jQuery.nodeName( offsetParent, "html" ) && jQuery.css( offsetParent, "position" ) === "static" ) ) {
				offsetParent = offsetParent.offsetParent;
			}

			return offsetParent || docElem;
		});
	}
});

// Create scrollLeft and scrollTop methods
jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
	var top = "pageYOffset" === prop;

	jQuery.fn[ method ] = function( val ) {
		return access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? win[ prop ] : elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : window.pageXOffset,
					top ? val : window.pageYOffset
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length, null );
	};
});

// Add the top/left cssHooks using jQuery.fn.position
// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
// getComputedStyle returns percent when specified for top/left/bottom/right
// rather than make the css module depend on the offset module, we just check for it here
jQuery.each( [ "top", "left" ], function( i, prop ) {
	jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
		function( elem, computed ) {
			if ( computed ) {
				computed = curCSS( elem, prop );
				// if curCSS returns percentage, fallback to offset
				return rnumnonpx.test( computed ) ?
					jQuery( elem ).position()[ prop ] + "px" :
					computed;
			}
		}
	);
});


// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name }, function( defaultExtra, funcName ) {
		// margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {
					// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
					// isn't a whole lot we can do. See pull request at this URL for discussion:
					// https://github.com/jquery/jquery/pull/764
					return elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
					// whichever is greatest
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?
					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable, null );
		};
	});
});


// The number of elements contained in the matched element set
jQuery.fn.size = function() {
	return this.length;
};

// andSelf是addBack的别名，也是回溯到之前的DOM对象方法
jQuery.fn.andSelf = jQuery.fn.addBack;




// Register as a named AMD module, since jQuery can be concatenated with other
// files that may use define, but not via a proper concatenation script that
// understands anonymous AMD modules. A named AMD is safest and most robust
// way to register. Lowercase jquery is used because AMD module names are
// derived from file names, and jQuery is normally delivered in a lowercase
// file name. Do this after creating the global so that if an AMD module wants
// to call noConflict to hide this version of jQuery, it will work.

// Note that for maximum portability, libraries that are not jQuery should
// declare themselves as anonymous modules, and avoid setting a global if an
// AMD loader is present. jQuery is a special case. For more information, see
// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

if ( typeof define === "function" && define.amd ) {
	define( "jquery", [], function() {
		return jQuery;
	});
}


/* 用于释放jQuery对全局变量$的控制权，
   如果有必要，也可以释放全局变量jQuery的控制权
*/

var  
    /* 把可能存在的window.jQuery和window.$
       备份到局部变量_jQuery和_$
    */
	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,
    // 先保存$指向的库或其他
	// Map over the $ in case of overwrite
	_$ = window.$;
// 多库共存处理，即无冲突处理
jQuery.noConflict = function( deep ) {
	// 判断$变量是否为jQuery变量，若是，$指向_$保存的库或其他，且只能使用jQuery访问jQuery对象
	/* 当前jQuery库持有全局变量$的情况下，
	   释放$的控制权给前一个JavaScript库
	*/
	if ( window.$ === jQuery ) {
		window.$ = _$;
	}
    
    /* 参数deep为true，且在当前jQuery库持有全局变量jQuery的情况下，
       释放jQuery的控制权给前一个JavaScript库
    */
	if ( deep && window.jQuery === jQuery ) {
		window.jQuery = _jQuery;
	}

	return jQuery;
};

/* 手动将jQuery添加到window对象上，明确地使变量jQuery
   成为公开的全局变量
*/
// Expose jQuery and $ identifiers, even in
// AMD (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
// and CommonJS for browser emulators (#13566)
if ( typeof noGlobal === strundefined ) {
	window.jQuery = window.$ = jQuery;
}



// 工厂模式创建jQuery对象，return该对象，所以可以链式方法取值
return jQuery;

}));
