///#source 1 1 /JavaScript-Mvc-framework/libs/jquery.validate.js
/*
 * jQuery Validation Plugin v1.13.1
 *
 * http://jqueryvalidation.org/
 *
 * Copyright (c) 2014 Jörn Zaefferer
 * Released under the MIT license
 */
(function( factory ) {
	if ( typeof define === "function" && define.amd ) {
		define( ["jquery"], factory );
	} else {
		factory( jQuery );
	}
}(function( $ ) {

$.extend($.fn, {
	// http://jqueryvalidation.org/validate/
	validate: function( options ) {

		// if nothing is selected, return nothing; can't chain anyway
		if ( !this.length ) {
			if ( options && options.debug && window.console ) {
				console.warn( "Nothing selected, can't validate, returning nothing." );
			}
			return;
		}

		// check if a validator for this form was already created
		var validator = $.data( this[ 0 ], "validator" );
		if ( validator ) {
			return validator;
		}

		// Add novalidate tag if HTML5.
		this.attr( "novalidate", "novalidate" );

		validator = new $.validator( options, this[ 0 ] );
		$.data( this[ 0 ], "validator", validator );

		if ( validator.settings.onsubmit ) {

			this.validateDelegate( ":submit", "click", function( event ) {
				if ( validator.settings.submitHandler ) {
					validator.submitButton = event.target;
				}
				// allow suppressing validation by adding a cancel class to the submit button
				if ( $( event.target ).hasClass( "cancel" ) ) {
					validator.cancelSubmit = true;
				}

				// allow suppressing validation by adding the html5 formnovalidate attribute to the submit button
				if ( $( event.target ).attr( "formnovalidate" ) !== undefined ) {
					validator.cancelSubmit = true;
				}
			});

			// validate the form on submit
			this.submit( function( event ) {
				if ( validator.settings.debug ) {
					// prevent form submit to be able to see console output
					event.preventDefault();
				}
				function handle() {
					var hidden, result;
					if ( validator.settings.submitHandler ) {
						if ( validator.submitButton ) {
							// insert a hidden input as a replacement for the missing submit button
							hidden = $( "<input type='hidden'/>" )
								.attr( "name", validator.submitButton.name )
								.val( $( validator.submitButton ).val() )
								.appendTo( validator.currentForm );
						}
						result = validator.settings.submitHandler.call( validator, validator.currentForm, event );
						if ( validator.submitButton ) {
							// and clean up afterwards; thanks to no-block-scope, hidden can be referenced
							hidden.remove();
						}
						if ( result !== undefined ) {
							return result;
						}
						return false;
					}
					return true;
				}

				// prevent submit for invalid forms or custom submit handlers
				if ( validator.cancelSubmit ) {
					validator.cancelSubmit = false;
					return handle();
				}
				if ( validator.form() ) {
					if ( validator.pendingRequest ) {
						validator.formSubmitted = true;
						return false;
					}
					return handle();
				} else {
					validator.focusInvalid();
					return false;
				}
			});
		}

		return validator;
	},
	// http://jqueryvalidation.org/valid/
	valid: function() {
		var valid, validator;

		if ( $( this[ 0 ] ).is( "form" ) ) {
			valid = this.validate().form();
		} else {
			valid = true;
			validator = $( this[ 0 ].form ).validate();
			this.each( function() {
				valid = validator.element( this ) && valid;
			});
		}
		return valid;
	},
	// attributes: space separated list of attributes to retrieve and remove
	removeAttrs: function( attributes ) {
		var result = {},
			$element = this;
		$.each( attributes.split( /\s/ ), function( index, value ) {
			result[ value ] = $element.attr( value );
			$element.removeAttr( value );
		});
		return result;
	},
	// http://jqueryvalidation.org/rules/
	rules: function( command, argument ) {
		var element = this[ 0 ],
			settings, staticRules, existingRules, data, param, filtered;

		if ( command ) {
			settings = $.data( element.form, "validator" ).settings;
			staticRules = settings.rules;
			existingRules = $.validator.staticRules( element );
			switch ( command ) {
			case "add":
				$.extend( existingRules, $.validator.normalizeRule( argument ) );
				// remove messages from rules, but allow them to be set separately
				delete existingRules.messages;
				staticRules[ element.name ] = existingRules;
				if ( argument.messages ) {
					settings.messages[ element.name ] = $.extend( settings.messages[ element.name ], argument.messages );
				}
				break;
			case "remove":
				if ( !argument ) {
					delete staticRules[ element.name ];
					return existingRules;
				}
				filtered = {};
				$.each( argument.split( /\s/ ), function( index, method ) {
					filtered[ method ] = existingRules[ method ];
					delete existingRules[ method ];
					if ( method === "required" ) {
						$( element ).removeAttr( "aria-required" );
					}
				});
				return filtered;
			}
		}

		data = $.validator.normalizeRules(
		$.extend(
			{},
			$.validator.classRules( element ),
			$.validator.attributeRules( element ),
			$.validator.dataRules( element ),
			$.validator.staticRules( element )
		), element );

		// make sure required is at front
		if ( data.required ) {
			param = data.required;
			delete data.required;
			data = $.extend( { required: param }, data );
			$( element ).attr( "aria-required", "true" );
		}

		// make sure remote is at back
		if ( data.remote ) {
			param = data.remote;
			delete data.remote;
			data = $.extend( data, { remote: param });
		}

		return data;
	}
});

// Custom selectors
$.extend( $.expr[ ":" ], {
	// http://jqueryvalidation.org/blank-selector/
	blank: function( a ) {
		return !$.trim( "" + $( a ).val() );
	},
	// http://jqueryvalidation.org/filled-selector/
	filled: function( a ) {
		return !!$.trim( "" + $( a ).val() );
	},
	// http://jqueryvalidation.org/unchecked-selector/
	unchecked: function( a ) {
		return !$( a ).prop( "checked" );
	}
});

// constructor for validator
$.validator = function( options, form ) {
	this.settings = $.extend( true, {}, $.validator.defaults, options );
	this.currentForm = form;
	this.init();
};

// http://jqueryvalidation.org/jQuery.validator.format/
$.validator.format = function( source, params ) {
	if ( arguments.length === 1 ) {
		return function() {
			var args = $.makeArray( arguments );
			args.unshift( source );
			return $.validator.format.apply( this, args );
		};
	}
	if ( arguments.length > 2 && params.constructor !== Array  ) {
		params = $.makeArray( arguments ).slice( 1 );
	}
	if ( params.constructor !== Array ) {
		params = [ params ];
	}
	$.each( params, function( i, n ) {
		source = source.replace( new RegExp( "\\{" + i + "\\}", "g" ), function() {
			return n;
		});
	});
	return source;
};

$.extend( $.validator, {

	defaults: {
		messages: {},
		groups: {},
		rules: {},
		errorClass: "error",
		validClass: "valid",
		errorElement: "label",
		focusCleanup: false,
		focusInvalid: true,
		errorContainer: $( [] ),
		errorLabelContainer: $( [] ),
		onsubmit: true,
		ignore: ":hidden",
		ignoreTitle: false,
		onfocusin: function( element ) {
			this.lastActive = element;

			// Hide error label and remove error class on focus if enabled
			if ( this.settings.focusCleanup ) {
				if ( this.settings.unhighlight ) {
					this.settings.unhighlight.call( this, element, this.settings.errorClass, this.settings.validClass );
				}
				this.hideThese( this.errorsFor( element ) );
			}
		},
		onfocusout: function( element ) {
			if ( !this.checkable( element ) && ( element.name in this.submitted || !this.optional( element ) ) ) {
				this.element( element );
			}
		},
		onkeyup: function( element, event ) {
			if ( event.which === 9 && this.elementValue( element ) === "" ) {
				return;
			} else if ( element.name in this.submitted || element === this.lastElement ) {
				this.element( element );
			}
		},
		onclick: function( element ) {
			// click on selects, radiobuttons and checkboxes
			if ( element.name in this.submitted ) {
				this.element( element );

			// or option elements, check parent select in that case
			} else if ( element.parentNode.name in this.submitted ) {
				this.element( element.parentNode );
			}
		},
		highlight: function( element, errorClass, validClass ) {
			if ( element.type === "radio" ) {
				this.findByName( element.name ).addClass( errorClass ).removeClass( validClass );
			} else {
				$( element ).addClass( errorClass ).removeClass( validClass );
			}
		},
		unhighlight: function( element, errorClass, validClass ) {
			if ( element.type === "radio" ) {
				this.findByName( element.name ).removeClass( errorClass ).addClass( validClass );
			} else {
				$( element ).removeClass( errorClass ).addClass( validClass );
			}
		}
	},

	// http://jqueryvalidation.org/jQuery.validator.setDefaults/
	setDefaults: function( settings ) {
		$.extend( $.validator.defaults, settings );
	},

	messages: {
		required: "This field is required.",
		remote: "Please fix this field.",
		email: "Please enter a valid email address.",
		url: "Please enter a valid URL.",
		date: "Please enter a valid date.",
		dateISO: "Please enter a valid date ( ISO ).",
		number: "Please enter a valid number.",
		digits: "Please enter only digits.",
		creditcard: "Please enter a valid credit card number.",
		equalTo: "Please enter the same value again.",
		maxlength: $.validator.format( "Please enter no more than {0} characters." ),
		minlength: $.validator.format( "Please enter at least {0} characters." ),
		rangelength: $.validator.format( "Please enter a value between {0} and {1} characters long." ),
		range: $.validator.format( "Please enter a value between {0} and {1}." ),
		max: $.validator.format( "Please enter a value less than or equal to {0}." ),
		min: $.validator.format( "Please enter a value greater than or equal to {0}." )
	},

	autoCreateRanges: false,

	prototype: {

		init: function() {
			this.labelContainer = $( this.settings.errorLabelContainer );
			this.errorContext = this.labelContainer.length && this.labelContainer || $( this.currentForm );
			this.containers = $( this.settings.errorContainer ).add( this.settings.errorLabelContainer );
			this.submitted = {};
			this.valueCache = {};
			this.pendingRequest = 0;
			this.pending = {};
			this.invalid = {};
			this.reset();

			var groups = ( this.groups = {} ),
				rules;
			$.each( this.settings.groups, function( key, value ) {
				if ( typeof value === "string" ) {
					value = value.split( /\s/ );
				}
				$.each( value, function( index, name ) {
					groups[ name ] = key;
				});
			});
			rules = this.settings.rules;
			$.each( rules, function( key, value ) {
				rules[ key ] = $.validator.normalizeRule( value );
			});

			function delegate( event ) {
				var validator = $.data( this[ 0 ].form, "validator" ),
					eventType = "on" + event.type.replace( /^validate/, "" ),
					settings = validator.settings;
				if ( settings[ eventType ] && !this.is( settings.ignore ) ) {
					settings[ eventType ].call( validator, this[ 0 ], event );
				}
			}
			$( this.currentForm )
				.validateDelegate( ":text, [type='password'], [type='file'], select, textarea, " +
					"[type='number'], [type='search'] ,[type='tel'], [type='url'], " +
					"[type='email'], [type='datetime'], [type='date'], [type='month'], " +
					"[type='week'], [type='time'], [type='datetime-local'], " +
					"[type='range'], [type='color'], [type='radio'], [type='checkbox']",
					"focusin focusout keyup", delegate)
				// Support: Chrome, oldIE
				// "select" is provided as event.target when clicking a option
				.validateDelegate("select, option, [type='radio'], [type='checkbox']", "click", delegate);

			if ( this.settings.invalidHandler ) {
				$( this.currentForm ).bind( "invalid-form.validate", this.settings.invalidHandler );
			}

			// Add aria-required to any Static/Data/Class required fields before first validation
			// Screen readers require this attribute to be present before the initial submission http://www.w3.org/TR/WCAG-TECHS/ARIA2.html
			$( this.currentForm ).find( "[required], [data-rule-required], .required" ).attr( "aria-required", "true" );
		},

		// http://jqueryvalidation.org/Validator.form/
		form: function() {
			this.checkForm();
			$.extend( this.submitted, this.errorMap );
			this.invalid = $.extend({}, this.errorMap );
			if ( !this.valid() ) {
				$( this.currentForm ).triggerHandler( "invalid-form", [ this ]);
			}
			this.showErrors();
			return this.valid();
		},

		checkForm: function() {
			this.prepareForm();
			for ( var i = 0, elements = ( this.currentElements = this.elements() ); elements[ i ]; i++ ) {
				this.check( elements[ i ] );
			}
			return this.valid();
		},

		// http://jqueryvalidation.org/Validator.element/
		element: function( element ) {
			var cleanElement = this.clean( element ),
				checkElement = this.validationTargetFor( cleanElement ),
				result = true;

			this.lastElement = checkElement;

			if ( checkElement === undefined ) {
				delete this.invalid[ cleanElement.name ];
			} else {
				this.prepareElement( checkElement );
				this.currentElements = $( checkElement );

				result = this.check( checkElement ) !== false;
				if ( result ) {
					delete this.invalid[ checkElement.name ];
				} else {
					this.invalid[ checkElement.name ] = true;
				}
			}
			// Add aria-invalid status for screen readers
			$( element ).attr( "aria-invalid", !result );

			if ( !this.numberOfInvalids() ) {
				// Hide error containers on last error
				this.toHide = this.toHide.add( this.containers );
			}
			this.showErrors();
			return result;
		},

		// http://jqueryvalidation.org/Validator.showErrors/
		showErrors: function( errors ) {
			if ( errors ) {
				// add items to error list and map
				$.extend( this.errorMap, errors );
				this.errorList = [];
				for ( var name in errors ) {
					this.errorList.push({
						message: errors[ name ],
						element: this.findByName( name )[ 0 ]
					});
				}
				// remove items from success list
				this.successList = $.grep( this.successList, function( element ) {
					return !( element.name in errors );
				});
			}
			if ( this.settings.showErrors ) {
				this.settings.showErrors.call( this, this.errorMap, this.errorList );
			} else {
				this.defaultShowErrors();
			}
		},

		// http://jqueryvalidation.org/Validator.resetForm/
		resetForm: function() {
			if ( $.fn.resetForm ) {
				$( this.currentForm ).resetForm();
			}
			this.submitted = {};
			this.lastElement = null;
			this.prepareForm();
			this.hideErrors();
			this.elements()
					.removeClass( this.settings.errorClass )
					.removeData( "previousValue" )
					.removeAttr( "aria-invalid" );
		},

		numberOfInvalids: function() {
			return this.objectLength( this.invalid );
		},

		objectLength: function( obj ) {
			/* jshint unused: false */
			var count = 0,
				i;
			for ( i in obj ) {
				count++;
			}
			return count;
		},

		hideErrors: function() {
			this.hideThese( this.toHide );
		},

		hideThese: function( errors ) {
			errors.not( this.containers ).text( "" );
			this.addWrapper( errors ).hide();
		},

		valid: function() {
			return this.size() === 0;
		},

		size: function() {
			return this.errorList.length;
		},

		focusInvalid: function() {
			if ( this.settings.focusInvalid ) {
				try {
					$( this.findLastActive() || this.errorList.length && this.errorList[ 0 ].element || [])
					.filter( ":visible" )
					.focus()
					// manually trigger focusin event; without it, focusin handler isn't called, findLastActive won't have anything to find
					.trigger( "focusin" );
				} catch ( e ) {
					// ignore IE throwing errors when focusing hidden elements
				}
			}
		},

		findLastActive: function() {
			var lastActive = this.lastActive;
			return lastActive && $.grep( this.errorList, function( n ) {
				return n.element.name === lastActive.name;
			}).length === 1 && lastActive;
		},

		elements: function() {
			var validator = this,
				rulesCache = {};

			// select all valid inputs inside the form (no submit or reset buttons)
			return $( this.currentForm )
			.find( "input, select, textarea" )
			.not( ":submit, :reset, :image, [disabled], [readonly]" )
			.not( this.settings.ignore )
			.filter( function() {
				if ( !this.name && validator.settings.debug && window.console ) {
					console.error( "%o has no name assigned", this );
				}

				// select only the first element for each name, and only those with rules specified
				if ( this.name in rulesCache || !validator.objectLength( $( this ).rules() ) ) {
					return false;
				}

				rulesCache[ this.name ] = true;
				return true;
			});
		},

		clean: function( selector ) {
			return $( selector )[ 0 ];
		},

		errors: function() {
			var errorClass = this.settings.errorClass.split( " " ).join( "." );
			return $( this.settings.errorElement + "." + errorClass, this.errorContext );
		},

		reset: function() {
			this.successList = [];
			this.errorList = [];
			this.errorMap = {};
			this.toShow = $( [] );
			this.toHide = $( [] );
			this.currentElements = $( [] );
		},

		prepareForm: function() {
			this.reset();
			this.toHide = this.errors().add( this.containers );
		},

		prepareElement: function( element ) {
			this.reset();
			this.toHide = this.errorsFor( element );
		},

		elementValue: function( element ) {
			var val,
				$element = $( element ),
				type = element.type;

			if ( type === "radio" || type === "checkbox" ) {
				return $( "input[name='" + element.name + "']:checked" ).val();
			} else if ( type === "number" && typeof element.validity !== "undefined" ) {
				return element.validity.badInput ? false : $element.val();
			}

			val = $element.val();
			if ( typeof val === "string" ) {
				return val.replace(/\r/g, "" );
			}
			return val;
		},

		check: function( element ) {
			element = this.validationTargetFor( this.clean( element ) );

			var rules = $( element ).rules(),
				rulesCount = $.map( rules, function( n, i ) {
					return i;
				}).length,
				dependencyMismatch = false,
				val = this.elementValue( element ),
				result, method, rule;

			for ( method in rules ) {
				rule = { method: method, parameters: rules[ method ] };
				try {

					result = $.validator.methods[ method ].call( this, val, element, rule.parameters );

					// if a method indicates that the field is optional and therefore valid,
					// don't mark it as valid when there are no other rules
					if ( result === "dependency-mismatch" && rulesCount === 1 ) {
						dependencyMismatch = true;
						continue;
					}
					dependencyMismatch = false;

					if ( result === "pending" ) {
						this.toHide = this.toHide.not( this.errorsFor( element ) );
						return;
					}

					if ( !result ) {
						this.formatAndAdd( element, rule );
						return false;
					}
				} catch ( e ) {
					if ( this.settings.debug && window.console ) {
						console.log( "Exception occurred when checking element " + element.id + ", check the '" + rule.method + "' method.", e );
					}
					throw e;
				}
			}
			if ( dependencyMismatch ) {
				return;
			}
			if ( this.objectLength( rules ) ) {
				this.successList.push( element );
			}
			return true;
		},

		// return the custom message for the given element and validation method
		// specified in the element's HTML5 data attribute
		// return the generic message if present and no method specific message is present
		customDataMessage: function( element, method ) {
			return $( element ).data( "msg" + method.charAt( 0 ).toUpperCase() +
				method.substring( 1 ).toLowerCase() ) || $( element ).data( "msg" );
		},

		// return the custom message for the given element name and validation method
		customMessage: function( name, method ) {
			var m = this.settings.messages[ name ];
			return m && ( m.constructor === String ? m : m[ method ]);
		},

		// return the first defined argument, allowing empty strings
		findDefined: function() {
			for ( var i = 0; i < arguments.length; i++) {
				if ( arguments[ i ] !== undefined ) {
					return arguments[ i ];
				}
			}
			return undefined;
		},

		defaultMessage: function( element, method ) {
			return this.findDefined(
				this.customMessage( element.name, method ),
				this.customDataMessage( element, method ),
				// title is never undefined, so handle empty string as undefined
				!this.settings.ignoreTitle && element.title || undefined,
				$.validator.messages[ method ],
				"<strong>Warning: No message defined for " + element.name + "</strong>"
			);
		},

		formatAndAdd: function( element, rule ) {
			var message = this.defaultMessage( element, rule.method ),
				theregex = /\$?\{(\d+)\}/g;
			if ( typeof message === "function" ) {
				message = message.call( this, rule.parameters, element );
			} else if ( theregex.test( message ) ) {
				message = $.validator.format( message.replace( theregex, "{$1}" ), rule.parameters );
			}
			this.errorList.push({
				message: message,
				element: element,
				method: rule.method
			});

			this.errorMap[ element.name ] = message;
			this.submitted[ element.name ] = message;
		},

		addWrapper: function( toToggle ) {
			if ( this.settings.wrapper ) {
				toToggle = toToggle.add( toToggle.parent( this.settings.wrapper ) );
			}
			return toToggle;
		},

		defaultShowErrors: function() {
			var i, elements, error;
			for ( i = 0; this.errorList[ i ]; i++ ) {
				error = this.errorList[ i ];
				if ( this.settings.highlight ) {
					this.settings.highlight.call( this, error.element, this.settings.errorClass, this.settings.validClass );
				}
				this.showLabel( error.element, error.message );
			}
			if ( this.errorList.length ) {
				this.toShow = this.toShow.add( this.containers );
			}
			if ( this.settings.success ) {
				for ( i = 0; this.successList[ i ]; i++ ) {
					this.showLabel( this.successList[ i ] );
				}
			}
			if ( this.settings.unhighlight ) {
				for ( i = 0, elements = this.validElements(); elements[ i ]; i++ ) {
					this.settings.unhighlight.call( this, elements[ i ], this.settings.errorClass, this.settings.validClass );
				}
			}
			this.toHide = this.toHide.not( this.toShow );
			this.hideErrors();
			this.addWrapper( this.toShow ).show();
		},

		validElements: function() {
			return this.currentElements.not( this.invalidElements() );
		},

		invalidElements: function() {
			return $( this.errorList ).map(function() {
				return this.element;
			});
		},

		showLabel: function( element, message ) {
			var place, group, errorID,
				error = this.errorsFor( element ),
				elementID = this.idOrName( element ),
				describedBy = $( element ).attr( "aria-describedby" );
			if ( error.length ) {
				// refresh error/success class
				error.removeClass( this.settings.validClass ).addClass( this.settings.errorClass );
				// replace message on existing label
				error.html( message );
			} else {
				// create error element
				error = $( "<" + this.settings.errorElement + ">" )
					.attr( "id", elementID + "-error" )
					.addClass( this.settings.errorClass )
					.html( message || "" );

				// Maintain reference to the element to be placed into the DOM
				place = error;
				if ( this.settings.wrapper ) {
					// make sure the element is visible, even in IE
					// actually showing the wrapped element is handled elsewhere
					place = error.hide().show().wrap( "<" + this.settings.wrapper + "/>" ).parent();
				}
				if ( this.labelContainer.length ) {
					this.labelContainer.append( place );
				} else if ( this.settings.errorPlacement ) {
					this.settings.errorPlacement( place, $( element ) );
				} else {
					place.insertAfter( element );
				}

				// Link error back to the element
				if ( error.is( "label" ) ) {
					// If the error is a label, then associate using 'for'
					error.attr( "for", elementID );
				} else if ( error.parents( "label[for='" + elementID + "']" ).length === 0 ) {
					// If the element is not a child of an associated label, then it's necessary
					// to explicitly apply aria-describedby

					errorID = error.attr( "id" ).replace( /(:|\.|\[|\])/g, "\\$1");
					// Respect existing non-error aria-describedby
					if ( !describedBy ) {
						describedBy = errorID;
					} else if ( !describedBy.match( new RegExp( "\\b" + errorID + "\\b" ) ) ) {
						// Add to end of list if not already present
						describedBy += " " + errorID;
					}
					$( element ).attr( "aria-describedby", describedBy );

					// If this element is grouped, then assign to all elements in the same group
					group = this.groups[ element.name ];
					if ( group ) {
						$.each( this.groups, function( name, testgroup ) {
							if ( testgroup === group ) {
								$( "[name='" + name + "']", this.currentForm )
									.attr( "aria-describedby", error.attr( "id" ) );
							}
						});
					}
				}
			}
			if ( !message && this.settings.success ) {
				error.text( "" );
				if ( typeof this.settings.success === "string" ) {
					error.addClass( this.settings.success );
				} else {
					this.settings.success( error, element );
				}
			}
			this.toShow = this.toShow.add( error );
		},

		errorsFor: function( element ) {
			var name = this.idOrName( element ),
				describer = $( element ).attr( "aria-describedby" ),
				selector = "label[for='" + name + "'], label[for='" + name + "'] *";

			// aria-describedby should directly reference the error element
			if ( describer ) {
				selector = selector + ", #" + describer.replace( /\s+/g, ", #" );
			}
			return this
				.errors()
				.filter( selector );
		},

		idOrName: function( element ) {
			return this.groups[ element.name ] || ( this.checkable( element ) ? element.name : element.id || element.name );
		},

		validationTargetFor: function( element ) {

			// If radio/checkbox, validate first element in group instead
			if ( this.checkable( element ) ) {
				element = this.findByName( element.name );
			}

			// Always apply ignore filter
			return $( element ).not( this.settings.ignore )[ 0 ];
		},

		checkable: function( element ) {
			return ( /radio|checkbox/i ).test( element.type );
		},

		findByName: function( name ) {
			return $( this.currentForm ).find( "[name='" + name + "']" );
		},

		getLength: function( value, element ) {
			switch ( element.nodeName.toLowerCase() ) {
			case "select":
				return $( "option:selected", element ).length;
			case "input":
				if ( this.checkable( element ) ) {
					return this.findByName( element.name ).filter( ":checked" ).length;
				}
			}
			return value.length;
		},

		depend: function( param, element ) {
			return this.dependTypes[typeof param] ? this.dependTypes[typeof param]( param, element ) : true;
		},

		dependTypes: {
			"boolean": function( param ) {
				return param;
			},
			"string": function( param, element ) {
				return !!$( param, element.form ).length;
			},
			"function": function( param, element ) {
				return param( element );
			}
		},

		optional: function( element ) {
			var val = this.elementValue( element );
			return !$.validator.methods.required.call( this, val, element ) && "dependency-mismatch";
		},

		startRequest: function( element ) {
			if ( !this.pending[ element.name ] ) {
				this.pendingRequest++;
				this.pending[ element.name ] = true;
			}
		},

		stopRequest: function( element, valid ) {
			this.pendingRequest--;
			// sometimes synchronization fails, make sure pendingRequest is never < 0
			if ( this.pendingRequest < 0 ) {
				this.pendingRequest = 0;
			}
			delete this.pending[ element.name ];
			if ( valid && this.pendingRequest === 0 && this.formSubmitted && this.form() ) {
				$( this.currentForm ).submit();
				this.formSubmitted = false;
			} else if (!valid && this.pendingRequest === 0 && this.formSubmitted ) {
				$( this.currentForm ).triggerHandler( "invalid-form", [ this ]);
				this.formSubmitted = false;
			}
		},

		previousValue: function( element ) {
			return $.data( element, "previousValue" ) || $.data( element, "previousValue", {
				old: null,
				valid: true,
				message: this.defaultMessage( element, "remote" )
			});
		}

	},

	classRuleSettings: {
		required: { required: true },
		email: { email: true },
		url: { url: true },
		date: { date: true },
		dateISO: { dateISO: true },
		number: { number: true },
		digits: { digits: true },
		creditcard: { creditcard: true }
	},

	addClassRules: function( className, rules ) {
		if ( className.constructor === String ) {
			this.classRuleSettings[ className ] = rules;
		} else {
			$.extend( this.classRuleSettings, className );
		}
	},

	classRules: function( element ) {
		var rules = {},
			classes = $( element ).attr( "class" );

		if ( classes ) {
			$.each( classes.split( " " ), function() {
				if ( this in $.validator.classRuleSettings ) {
					$.extend( rules, $.validator.classRuleSettings[ this ]);
				}
			});
		}
		return rules;
	},

	attributeRules: function( element ) {
		var rules = {},
			$element = $( element ),
			type = element.getAttribute( "type" ),
			method, value;

		for ( method in $.validator.methods ) {

			// support for <input required> in both html5 and older browsers
			if ( method === "required" ) {
				value = element.getAttribute( method );
				// Some browsers return an empty string for the required attribute
				// and non-HTML5 browsers might have required="" markup
				if ( value === "" ) {
					value = true;
				}
				// force non-HTML5 browsers to return bool
				value = !!value;
			} else {
				value = $element.attr( method );
			}

			// convert the value to a number for number inputs, and for text for backwards compability
			// allows type="date" and others to be compared as strings
			if ( /min|max/.test( method ) && ( type === null || /number|range|text/.test( type ) ) ) {
				value = Number( value );
			}

			if ( value || value === 0 ) {
				rules[ method ] = value;
			} else if ( type === method && type !== "range" ) {
				// exception: the jquery validate 'range' method
				// does not test for the html5 'range' type
				rules[ method ] = true;
			}
		}

		// maxlength may be returned as -1, 2147483647 ( IE ) and 524288 ( safari ) for text inputs
		if ( rules.maxlength && /-1|2147483647|524288/.test( rules.maxlength ) ) {
			delete rules.maxlength;
		}

		return rules;
	},

	dataRules: function( element ) {
		var method, value,
			rules = {}, $element = $( element );
		for ( method in $.validator.methods ) {
			value = $element.data( "rule" + method.charAt( 0 ).toUpperCase() + method.substring( 1 ).toLowerCase() );
			if ( value !== undefined ) {
				rules[ method ] = value;
			}
		}
		return rules;
	},

	staticRules: function( element ) {
		var rules = {},
			validator = $.data( element.form, "validator" );

		if ( validator.settings.rules ) {
			rules = $.validator.normalizeRule( validator.settings.rules[ element.name ] ) || {};
		}
		return rules;
	},

	normalizeRules: function( rules, element ) {
		// handle dependency check
		$.each( rules, function( prop, val ) {
			// ignore rule when param is explicitly false, eg. required:false
			if ( val === false ) {
				delete rules[ prop ];
				return;
			}
			if ( val.param || val.depends ) {
				var keepRule = true;
				switch ( typeof val.depends ) {
				case "string":
					keepRule = !!$( val.depends, element.form ).length;
					break;
				case "function":
					keepRule = val.depends.call( element, element );
					break;
				}
				if ( keepRule ) {
					rules[ prop ] = val.param !== undefined ? val.param : true;
				} else {
					delete rules[ prop ];
				}
			}
		});

		// evaluate parameters
		$.each( rules, function( rule, parameter ) {
			rules[ rule ] = $.isFunction( parameter ) ? parameter( element ) : parameter;
		});

		// clean number parameters
		$.each([ "minlength", "maxlength" ], function() {
			if ( rules[ this ] ) {
				rules[ this ] = Number( rules[ this ] );
			}
		});
		$.each([ "rangelength", "range" ], function() {
			var parts;
			if ( rules[ this ] ) {
				if ( $.isArray( rules[ this ] ) ) {
					rules[ this ] = [ Number( rules[ this ][ 0 ]), Number( rules[ this ][ 1 ] ) ];
				} else if ( typeof rules[ this ] === "string" ) {
					parts = rules[ this ].replace(/[\[\]]/g, "" ).split( /[\s,]+/ );
					rules[ this ] = [ Number( parts[ 0 ]), Number( parts[ 1 ] ) ];
				}
			}
		});

		if ( $.validator.autoCreateRanges ) {
			// auto-create ranges
			if ( rules.min != null && rules.max != null ) {
				rules.range = [ rules.min, rules.max ];
				delete rules.min;
				delete rules.max;
			}
			if ( rules.minlength != null && rules.maxlength != null ) {
				rules.rangelength = [ rules.minlength, rules.maxlength ];
				delete rules.minlength;
				delete rules.maxlength;
			}
		}

		return rules;
	},

	// Converts a simple string to a {string: true} rule, e.g., "required" to {required:true}
	normalizeRule: function( data ) {
		if ( typeof data === "string" ) {
			var transformed = {};
			$.each( data.split( /\s/ ), function() {
				transformed[ this ] = true;
			});
			data = transformed;
		}
		return data;
	},

	// http://jqueryvalidation.org/jQuery.validator.addMethod/
	addMethod: function( name, method, message ) {
		$.validator.methods[ name ] = method;
		$.validator.messages[ name ] = message !== undefined ? message : $.validator.messages[ name ];
		if ( method.length < 3 ) {
			$.validator.addClassRules( name, $.validator.normalizeRule( name ) );
		}
	},

	methods: {

		// http://jqueryvalidation.org/required-method/
		required: function( value, element, param ) {
			// check if dependency is met
			if ( !this.depend( param, element ) ) {
				return "dependency-mismatch";
			}
			if ( element.nodeName.toLowerCase() === "select" ) {
				// could be an array for select-multiple or a string, both are fine this way
				var val = $( element ).val();
				return val && val.length > 0;
			}
			if ( this.checkable( element ) ) {
				return this.getLength( value, element ) > 0;
			}
			return $.trim( value ).length > 0;
		},

		// http://jqueryvalidation.org/email-method/
		email: function( value, element ) {
			// From http://www.whatwg.org/specs/web-apps/current-work/multipage/states-of-the-type-attribute.html#e-mail-state-%28type=email%29
			// Retrieved 2014-01-14
			// If you have a problem with this implementation, report a bug against the above spec
			// Or use custom methods to implement your own email validation
			return this.optional( element ) || /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test( value );
		},

		// http://jqueryvalidation.org/url-method/
		url: function( value, element ) {
			// contributed by Scott Gonzalez: http://projects.scottsplayground.com/iri/
			return this.optional( element ) || /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test( value );
		},

		// http://jqueryvalidation.org/date-method/
		date: function( value, element ) {
			return this.optional( element ) || !/Invalid|NaN/.test( new Date( value ).toString() );
		},

		// http://jqueryvalidation.org/dateISO-method/
		dateISO: function( value, element ) {
			return this.optional( element ) || /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.test( value );
		},

		// http://jqueryvalidation.org/number-method/
		number: function( value, element ) {
			return this.optional( element ) || /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test( value );
		},

		// http://jqueryvalidation.org/digits-method/
		digits: function( value, element ) {
			return this.optional( element ) || /^\d+$/.test( value );
		},

		// http://jqueryvalidation.org/creditcard-method/
		// based on http://en.wikipedia.org/wiki/Luhn/
		creditcard: function( value, element ) {
			if ( this.optional( element ) ) {
				return "dependency-mismatch";
			}
			// accept only spaces, digits and dashes
			if ( /[^0-9 \-]+/.test( value ) ) {
				return false;
			}
			var nCheck = 0,
				nDigit = 0,
				bEven = false,
				n, cDigit;

			value = value.replace( /\D/g, "" );

			// Basing min and max length on
			// http://developer.ean.com/general_info/Valid_Credit_Card_Types
			if ( value.length < 13 || value.length > 19 ) {
				return false;
			}

			for ( n = value.length - 1; n >= 0; n--) {
				cDigit = value.charAt( n );
				nDigit = parseInt( cDigit, 10 );
				if ( bEven ) {
					if ( ( nDigit *= 2 ) > 9 ) {
						nDigit -= 9;
					}
				}
				nCheck += nDigit;
				bEven = !bEven;
			}

			return ( nCheck % 10 ) === 0;
		},

		// http://jqueryvalidation.org/minlength-method/
		minlength: function( value, element, param ) {
			var length = $.isArray( value ) ? value.length : this.getLength( value, element );
			return this.optional( element ) || length >= param;
		},

		// http://jqueryvalidation.org/maxlength-method/
		maxlength: function( value, element, param ) {
			var length = $.isArray( value ) ? value.length : this.getLength( value, element );
			return this.optional( element ) || length <= param;
		},

		// http://jqueryvalidation.org/rangelength-method/
		rangelength: function( value, element, param ) {
			var length = $.isArray( value ) ? value.length : this.getLength( value, element );
			return this.optional( element ) || ( length >= param[ 0 ] && length <= param[ 1 ] );
		},

		// http://jqueryvalidation.org/min-method/
		min: function( value, element, param ) {
			return this.optional( element ) || value >= param;
		},

		// http://jqueryvalidation.org/max-method/
		max: function( value, element, param ) {
			return this.optional( element ) || value <= param;
		},

		// http://jqueryvalidation.org/range-method/
		range: function( value, element, param ) {
			return this.optional( element ) || ( value >= param[ 0 ] && value <= param[ 1 ] );
		},

		// http://jqueryvalidation.org/equalTo-method/
		equalTo: function( value, element, param ) {
			// bind to the blur event of the target in order to revalidate whenever the target field is updated
			// TODO find a way to bind the event just once, avoiding the unbind-rebind overhead
			var target = $( param );
			if ( this.settings.onfocusout ) {
				target.unbind( ".validate-equalTo" ).bind( "blur.validate-equalTo", function() {
					$( element ).valid();
				});
			}
			return value === target.val();
		},

		// http://jqueryvalidation.org/remote-method/
		remote: function( value, element, param ) {
			if ( this.optional( element ) ) {
				return "dependency-mismatch";
			}

			var previous = this.previousValue( element ),
				validator, data;

			if (!this.settings.messages[ element.name ] ) {
				this.settings.messages[ element.name ] = {};
			}
			previous.originalMessage = this.settings.messages[ element.name ].remote;
			this.settings.messages[ element.name ].remote = previous.message;

			param = typeof param === "string" && { url: param } || param;

			if ( previous.old === value ) {
				return previous.valid;
			}

			previous.old = value;
			validator = this;
			this.startRequest( element );
			data = {};
			data[ element.name ] = value;
			$.ajax( $.extend( true, {
				url: param,
				mode: "abort",
				port: "validate" + element.name,
				dataType: "json",
				data: data,
				context: validator.currentForm,
				success: function( response ) {
					var valid = response === true || response === "true",
						errors, message, submitted;

					validator.settings.messages[ element.name ].remote = previous.originalMessage;
					if ( valid ) {
						submitted = validator.formSubmitted;
						validator.prepareElement( element );
						validator.formSubmitted = submitted;
						validator.successList.push( element );
						delete validator.invalid[ element.name ];
						validator.showErrors();
					} else {
						errors = {};
						message = response || validator.defaultMessage( element, "remote" );
						errors[ element.name ] = previous.message = $.isFunction( message ) ? message( value ) : message;
						validator.invalid[ element.name ] = true;
						validator.showErrors( errors );
					}
					previous.valid = valid;
					validator.stopRequest( element, valid );
				}
			}, param ) );
			return "pending";
		}

	}

});

$.format = function deprecated() {
	throw "$.format has been deprecated. Please use $.validator.format instead.";
};

// ajax mode: abort
// usage: $.ajax({ mode: "abort"[, port: "uniqueport"]});
// if mode:"abort" is used, the previous request on that port (port can be undefined) is aborted via XMLHttpRequest.abort()

var pendingRequests = {},
	ajax;
// Use a prefilter if available (1.5+)
if ( $.ajaxPrefilter ) {
	$.ajaxPrefilter(function( settings, _, xhr ) {
		var port = settings.port;
		if ( settings.mode === "abort" ) {
			if ( pendingRequests[port] ) {
				pendingRequests[port].abort();
			}
			pendingRequests[port] = xhr;
		}
	});
} else {
	// Proxy ajax
	ajax = $.ajax;
	$.ajax = function( settings ) {
		var mode = ( "mode" in settings ? settings : $.ajaxSettings ).mode,
			port = ( "port" in settings ? settings : $.ajaxSettings ).port;
		if ( mode === "abort" ) {
			if ( pendingRequests[port] ) {
				pendingRequests[port].abort();
			}
			pendingRequests[port] = ajax.apply(this, arguments);
			return pendingRequests[port];
		}
		return ajax.apply(this, arguments);
	};
}

// provides delegate(type: String, delegate: Selector, handler: Callback) plugin for easier event delegation
// handler is only called when $(event.target).is(delegate), in the scope of the jquery-object for event.target

$.extend($.fn, {
	validateDelegate: function( delegate, type, handler ) {
		return this.bind(type, function( event ) {
			var target = $(event.target);
			if ( target.is(delegate) ) {
				return handler.apply(target, arguments);
			}
		});
	}
});

}));
///#source 1 1 /JavaScript-Mvc-framework/libs/jquery.validate.unobtrusive.js
/* NUGET: BEGIN LICENSE TEXT
 *
 * Microsoft grants you the right to use these script files for the sole
 * purpose of either: (i) interacting through your browser with the Microsoft
 * website or online service, subject to the applicable licensing or use
 * terms; or (ii) using the files as included with a Microsoft product subject
 * to that product's license terms. Microsoft reserves all other rights to the
 * files not expressly granted by Microsoft, whether by implication, estoppel
 * or otherwise. Insofar as a script file is dual licensed under GPL,
 * Microsoft neither took the code under GPL nor distributes it thereunder but
 * under the terms set out in this paragraph. All notices and licenses
 * below are for informational purposes only.
 *
 * NUGET: END LICENSE TEXT */
/*!
** Unobtrusive validation support library for jQuery and jQuery Validate
** Copyright (C) Microsoft Corporation. All rights reserved.
*/

/*jslint white: true, browser: true, onevar: true, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, strict: false */
/*global document: false, jQuery: false */

(function ($) {
    var $jQval = $.validator,
        adapters,
        data_validation = "unobtrusiveValidation";

    function setValidationValues(options, ruleName, value) {
        options.rules[ruleName] = value;
        if (options.message) {
            options.messages[ruleName] = options.message;
        }
    }

    function splitAndTrim(value) {
        return value.replace(/^\s+|\s+$/g, "").split(/\s*,\s*/g);
    }

    function escapeAttributeValue(value) {
        // As mentioned on http://api.jquery.com/category/selectors/
        return value.replace(/([!"#$%&'()*+,./:;<=>?@\[\\\]^`{|}~])/g, "\\$1");
    }

    function getModelPrefix(fieldName) {
        return fieldName.substr(0, fieldName.lastIndexOf(".") + 1);
    }

    function appendModelPrefix(value, prefix) {
        if (value.indexOf("*.") === 0) {
            value = value.replace("*.", prefix);
        }
        return value;
    }

    function onError(error, inputElement) {  // 'this' is the form element
        var container = $(this).find("[data-valmsg-for='" + escapeAttributeValue(inputElement[0].name) + "']"),
            replaceAttrValue = container.attr("data-valmsg-replace"),
            replace = replaceAttrValue ? $.parseJSON(replaceAttrValue) !== false : null;

        container.removeClass("field-validation-valid").addClass("field-validation-error");
        error.data("unobtrusiveContainer", container);

        if (replace) {
            container.empty();
            error.removeClass("input-validation-error").appendTo(container);
        }
        else {
            error.hide();
        }
    }

    function onErrors(event, validator) {  // 'this' is the form element
        var container = $(this).find("[data-valmsg-summary=true]"),
            list = container.find("ul");

        if (list && list.length && validator.errorList.length) {
            list.empty();
            container.addClass("validation-summary-errors").removeClass("validation-summary-valid");

            $.each(validator.errorList, function () {
                $("<li />").html(this.message).appendTo(list);
            });
        }
    }

    function onSuccess(error) {  // 'this' is the form element
        var container = error.data("unobtrusiveContainer"),
            replaceAttrValue = container.attr("data-valmsg-replace"),
            replace = replaceAttrValue ? $.parseJSON(replaceAttrValue) : null;

        if (container) {
            container.addClass("field-validation-valid").removeClass("field-validation-error");
            error.removeData("unobtrusiveContainer");

            if (replace) {
                container.empty();
            }
        }
    }

    function onReset(event) {  // 'this' is the form element
        var $form = $(this);
        $form.data("validator").resetForm();
        $form.find(".validation-summary-errors")
            .addClass("validation-summary-valid")
            .removeClass("validation-summary-errors");
        $form.find(".field-validation-error")
            .addClass("field-validation-valid")
            .removeClass("field-validation-error")
            .removeData("unobtrusiveContainer")
            .find(">*")  // If we were using valmsg-replace, get the underlying error
                .removeData("unobtrusiveContainer");
    }

    function validationInfo(form) {
        var $form = $(form),
            result = $form.data(data_validation),
            onResetProxy = $.proxy(onReset, form),
            defaultOptions = $jQval.unobtrusive.options || {},
            execInContext = function (name, args) {
                var func = defaultOptions[name];
                func && $.isFunction(func) && func.apply(form, args);
            }

        if (!result) {
            result = {
                options: {  // options structure passed to jQuery Validate's validate() method
                    errorClass: defaultOptions.errorClass || "input-validation-error",
                    errorElement: defaultOptions.errorElement || "span",
                    errorPlacement: function () {
                        onError.apply(form, arguments);
                        execInContext("errorPlacement", arguments);
                    },
                    invalidHandler: function () {
                        onErrors.apply(form, arguments);
                        execInContext("invalidHandler", arguments);
                    },
                    messages: {},
                    rules: {},
                    success: function () {
                        onSuccess.apply(form, arguments);
                        execInContext("success", arguments);
                    }
                },
                attachValidation: function () {
                    $form
                        .off("reset." + data_validation, onResetProxy)
                        .on("reset." + data_validation, onResetProxy)
                        .validate(this.options);
                },
                validate: function () {  // a validation function that is called by unobtrusive Ajax
                    $form.validate();
                    return $form.valid();
                }
            };
            $form.data(data_validation, result);
        }

        return result;
    }

    $jQval.unobtrusive = {
        adapters: [],

        parseElement: function (element, skipAttach) {
            /// <summary>
            /// Parses a single HTML element for unobtrusive validation attributes.
            /// </summary>
            /// <param name="element" domElement="true">The HTML element to be parsed.</param>
            /// <param name="skipAttach" type="Boolean">[Optional] true to skip attaching the
            /// validation to the form. If parsing just this single element, you should specify true.
            /// If parsing several elements, you should specify false, and manually attach the validation
            /// to the form when you are finished. The default is false.</param>
            var $element = $(element),
                form = $element.parents("form")[0],
                valInfo, rules, messages;

            if (!form) {  // Cannot do client-side validation without a form
                return;
            }

            valInfo = validationInfo(form);
            valInfo.options.rules[element.name] = rules = {};
            valInfo.options.messages[element.name] = messages = {};

            $.each(this.adapters, function () {
                var prefix = "data-val-" + this.name,
                    message = $element.attr(prefix),
                    paramValues = {};

                if (message !== undefined) {  // Compare against undefined, because an empty message is legal (and falsy)
                    prefix += "-";

                    $.each(this.params, function () {
                        paramValues[this] = $element.attr(prefix + this);
                    });

                    this.adapt({
                        element: element,
                        form: form,
                        message: message,
                        params: paramValues,
                        rules: rules,
                        messages: messages
                    });
                }
            });

            $.extend(rules, { "__dummy__": true });

            if (!skipAttach) {
                valInfo.attachValidation();
            }
        },

        parse: function (selector) {
            /// <summary>
            /// Parses all the HTML elements in the specified selector. It looks for input elements decorated
            /// with the [data-val=true] attribute value and enables validation according to the data-val-*
            /// attribute values.
            /// </summary>
            /// <param name="selector" type="String">Any valid jQuery selector.</param>

            // $forms includes all forms in selector's DOM hierarchy (parent, children and self) that have at least one
            // element with data-val=true
            var $selector = $(selector),
                $forms = $selector.parents()
                                  .addBack()
                                  .filter("form")
                                  .add($selector.find("form"))
                                  .has("[data-val=true]");

            $selector.find("[data-val=true]").each(function () {
                $jQval.unobtrusive.parseElement(this, true);
            });

            $forms.each(function () {
                var info = validationInfo(this);
                if (info) {
                    info.attachValidation();
                }
            });
        }
    };

    adapters = $jQval.unobtrusive.adapters;

    adapters.add = function (adapterName, params, fn) {
        /// <summary>Adds a new adapter to convert unobtrusive HTML into a jQuery Validate validation.</summary>
        /// <param name="adapterName" type="String">The name of the adapter to be added. This matches the name used
        /// in the data-val-nnnn HTML attribute (where nnnn is the adapter name).</param>
        /// <param name="params" type="Array" optional="true">[Optional] An array of parameter names (strings) that will
        /// be extracted from the data-val-nnnn-mmmm HTML attributes (where nnnn is the adapter name, and
        /// mmmm is the parameter name).</param>
        /// <param name="fn" type="Function">The function to call, which adapts the values from the HTML
        /// attributes into jQuery Validate rules and/or messages.</param>
        /// <returns type="jQuery.validator.unobtrusive.adapters" />
        if (!fn) {  // Called with no params, just a function
            fn = params;
            params = [];
        }
        this.push({ name: adapterName, params: params, adapt: fn });
        return this;
    };

    adapters.addBool = function (adapterName, ruleName) {
        /// <summary>Adds a new adapter to convert unobtrusive HTML into a jQuery Validate validation, where
        /// the jQuery Validate validation rule has no parameter values.</summary>
        /// <param name="adapterName" type="String">The name of the adapter to be added. This matches the name used
        /// in the data-val-nnnn HTML attribute (where nnnn is the adapter name).</param>
        /// <param name="ruleName" type="String" optional="true">[Optional] The name of the jQuery Validate rule. If not provided, the value
        /// of adapterName will be used instead.</param>
        /// <returns type="jQuery.validator.unobtrusive.adapters" />
        return this.add(adapterName, function (options) {
            setValidationValues(options, ruleName || adapterName, true);
        });
    };

    adapters.addMinMax = function (adapterName, minRuleName, maxRuleName, minMaxRuleName, minAttribute, maxAttribute) {
        /// <summary>Adds a new adapter to convert unobtrusive HTML into a jQuery Validate validation, where
        /// the jQuery Validate validation has three potential rules (one for min-only, one for max-only, and
        /// one for min-and-max). The HTML parameters are expected to be named -min and -max.</summary>
        /// <param name="adapterName" type="String">The name of the adapter to be added. This matches the name used
        /// in the data-val-nnnn HTML attribute (where nnnn is the adapter name).</param>
        /// <param name="minRuleName" type="String">The name of the jQuery Validate rule to be used when you only
        /// have a minimum value.</param>
        /// <param name="maxRuleName" type="String">The name of the jQuery Validate rule to be used when you only
        /// have a maximum value.</param>
        /// <param name="minMaxRuleName" type="String">The name of the jQuery Validate rule to be used when you
        /// have both a minimum and maximum value.</param>
        /// <param name="minAttribute" type="String" optional="true">[Optional] The name of the HTML attribute that
        /// contains the minimum value. The default is "min".</param>
        /// <param name="maxAttribute" type="String" optional="true">[Optional] The name of the HTML attribute that
        /// contains the maximum value. The default is "max".</param>
        /// <returns type="jQuery.validator.unobtrusive.adapters" />
        return this.add(adapterName, [minAttribute || "min", maxAttribute || "max"], function (options) {
            var min = options.params.min,
                max = options.params.max;

            if (min && max) {
                setValidationValues(options, minMaxRuleName, [min, max]);
            }
            else if (min) {
                setValidationValues(options, minRuleName, min);
            }
            else if (max) {
                setValidationValues(options, maxRuleName, max);
            }
        });
    };

    adapters.addSingleVal = function (adapterName, attribute, ruleName) {
        /// <summary>Adds a new adapter to convert unobtrusive HTML into a jQuery Validate validation, where
        /// the jQuery Validate validation rule has a single value.</summary>
        /// <param name="adapterName" type="String">The name of the adapter to be added. This matches the name used
        /// in the data-val-nnnn HTML attribute(where nnnn is the adapter name).</param>
        /// <param name="attribute" type="String">[Optional] The name of the HTML attribute that contains the value.
        /// The default is "val".</param>
        /// <param name="ruleName" type="String" optional="true">[Optional] The name of the jQuery Validate rule. If not provided, the value
        /// of adapterName will be used instead.</param>
        /// <returns type="jQuery.validator.unobtrusive.adapters" />
        return this.add(adapterName, [attribute || "val"], function (options) {
            setValidationValues(options, ruleName || adapterName, options.params[attribute]);
        });
    };

    $jQval.addMethod("__dummy__", function (value, element, params) {
        return true;
    });

    $jQval.addMethod("regex", function (value, element, params) {
        var match;
        if (this.optional(element)) {
            return true;
        }

        match = new RegExp(params).exec(value);
        return (match && (match.index === 0) && (match[0].length === value.length));
    });

    $jQval.addMethod("nonalphamin", function (value, element, nonalphamin) {
        var match;
        if (nonalphamin) {
            match = value.match(/\W/g);
            match = match && match.length >= nonalphamin;
        }
        return match;
    });

    if ($jQval.methods.extension) {
        adapters.addSingleVal("accept", "mimtype");
        adapters.addSingleVal("extension", "extension");
    } else {
        // for backward compatibility, when the 'extension' validation method does not exist, such as with versions
        // of JQuery Validation plugin prior to 1.10, we should use the 'accept' method for
        // validating the extension, and ignore mime-type validations as they are not supported.
        adapters.addSingleVal("extension", "extension", "accept");
    }

    adapters.addSingleVal("regex", "pattern");
    adapters.addBool("creditcard").addBool("date").addBool("digits").addBool("email").addBool("number").addBool("url");
    adapters.addMinMax("length", "minlength", "maxlength", "rangelength").addMinMax("range", "min", "max", "range");
    adapters.addMinMax("minlength", "minlength").addMinMax("maxlength", "minlength", "maxlength");
    adapters.add("equalto", ["other"], function (options) {
        var prefix = getModelPrefix(options.element.name),
            other = options.params.other,
            fullOtherName = appendModelPrefix(other, prefix),
            element = $(options.form).find(":input").filter("[name='" + escapeAttributeValue(fullOtherName) + "']")[0];

        setValidationValues(options, "equalTo", element);
    });
    adapters.add("required", function (options) {
        // jQuery Validate equates "required" with "mandatory" for checkbox elements
        if (options.element.tagName.toUpperCase() !== "INPUT" || options.element.type.toUpperCase() !== "CHECKBOX") {
            setValidationValues(options, "required", true);
        }
    });
    adapters.add("remote", ["url", "type", "additionalfields"], function (options) {
        var value = {
            url: options.params.url,
            type: options.params.type || "GET",
            data: {}
        },
            prefix = getModelPrefix(options.element.name);

        $.each(splitAndTrim(options.params.additionalfields || options.element.name), function (i, fieldName) {
            var paramName = appendModelPrefix(fieldName, prefix);
            value.data[paramName] = function () {
                return $(options.form).find(":input").filter("[name='" + escapeAttributeValue(paramName) + "']").val();
            };
        });

        setValidationValues(options, "remote", value);
    });
    adapters.add("password", ["min", "nonalphamin", "regex"], function (options) {
        if (options.params.min) {
            setValidationValues(options, "minlength", options.params.min);
        }
        if (options.params.nonalphamin) {
            setValidationValues(options, "nonalphamin", options.params.nonalphamin);
        }
        if (options.params.regex) {
            setValidationValues(options, "regex", options.params.regex);
        }
    });

    $(function () {
        $jQval.unobtrusive.parse(document);
    });
}(jQuery));
///#source 1 1 /JavaScript-Mvc-framework/libs/moment.js
// moment.js
// version : 2.8.3
// authors : Tim Wood, Iskren Chernev, Moment.js contributors
// license : MIT
// momentjs.com

(function (undefined) {
    /************************************
        Constants
    ************************************/

    var moment,
        VERSION = '2.8.3',
        // the global-scope this is NOT the global object in Node.js
        globalScope = typeof global !== 'undefined' ? global : this,
        oldGlobalMoment,
        round = Math.round,
        hasOwnProperty = Object.prototype.hasOwnProperty,
        i,

        YEAR = 0,
        MONTH = 1,
        DATE = 2,
        HOUR = 3,
        MINUTE = 4,
        SECOND = 5,
        MILLISECOND = 6,

        // internal storage for locale config files
        locales = {},

        // extra moment internal properties (plugins register props here)
        momentProperties = [],

        // check for nodeJS
        hasModule = (typeof module !== 'undefined' && module.exports),

        // ASP.NET json date format regex
        aspNetJsonRegex = /^\/?Date\((\-?\d+)/i,
        aspNetTimeSpanJsonRegex = /(\-)?(?:(\d*)\.)?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?)?/,

        // from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
        // somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
        isoDurationRegex = /^(-)?P(?:(?:([0-9,.]*)Y)?(?:([0-9,.]*)M)?(?:([0-9,.]*)D)?(?:T(?:([0-9,.]*)H)?(?:([0-9,.]*)M)?(?:([0-9,.]*)S)?)?|([0-9,.]*)W)$/,

        // format tokens
        formattingTokens = /(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Q|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|S{1,4}|X|zz?|ZZ?|.)/g,
        localFormattingTokens = /(\[[^\[]*\])|(\\)?(LT|LL?L?L?|l{1,4})/g,

        // parsing token regexes
        parseTokenOneOrTwoDigits = /\d\d?/, // 0 - 99
        parseTokenOneToThreeDigits = /\d{1,3}/, // 0 - 999
        parseTokenOneToFourDigits = /\d{1,4}/, // 0 - 9999
        parseTokenOneToSixDigits = /[+\-]?\d{1,6}/, // -999,999 - 999,999
        parseTokenDigits = /\d+/, // nonzero number of digits
        parseTokenWord = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i, // any word (or two) characters or numbers including two/three word month in arabic.
        parseTokenTimezone = /Z|[\+\-]\d\d:?\d\d/gi, // +00:00 -00:00 +0000 -0000 or Z
        parseTokenT = /T/i, // T (ISO separator)
        parseTokenTimestampMs = /[\+\-]?\d+(\.\d{1,3})?/, // 123456789 123456789.123
        parseTokenOrdinal = /\d{1,2}/,

        //strict parsing regexes
        parseTokenOneDigit = /\d/, // 0 - 9
        parseTokenTwoDigits = /\d\d/, // 00 - 99
        parseTokenThreeDigits = /\d{3}/, // 000 - 999
        parseTokenFourDigits = /\d{4}/, // 0000 - 9999
        parseTokenSixDigits = /[+-]?\d{6}/, // -999,999 - 999,999
        parseTokenSignedNumber = /[+-]?\d+/, // -inf - inf

        // iso 8601 regex
        // 0000-00-00 0000-W00 or 0000-W00-0 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000 or +00)
        isoRegex = /^\s*(?:[+-]\d{6}|\d{4})-(?:(\d\d-\d\d)|(W\d\d$)|(W\d\d-\d)|(\d\d\d))((T| )(\d\d(:\d\d(:\d\d(\.\d+)?)?)?)?([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/,

        isoFormat = 'YYYY-MM-DDTHH:mm:ssZ',

        isoDates = [
            ['YYYYYY-MM-DD', /[+-]\d{6}-\d{2}-\d{2}/],
            ['YYYY-MM-DD', /\d{4}-\d{2}-\d{2}/],
            ['GGGG-[W]WW-E', /\d{4}-W\d{2}-\d/],
            ['GGGG-[W]WW', /\d{4}-W\d{2}/],
            ['YYYY-DDD', /\d{4}-\d{3}/]
        ],

        // iso time formats and regexes
        isoTimes = [
            ['HH:mm:ss.SSSS', /(T| )\d\d:\d\d:\d\d\.\d+/],
            ['HH:mm:ss', /(T| )\d\d:\d\d:\d\d/],
            ['HH:mm', /(T| )\d\d:\d\d/],
            ['HH', /(T| )\d\d/]
        ],

        // timezone chunker '+10:00' > ['10', '00'] or '-1530' > ['-15', '30']
        parseTimezoneChunker = /([\+\-]|\d\d)/gi,

        // getter and setter names
        proxyGettersAndSetters = 'Date|Hours|Minutes|Seconds|Milliseconds'.split('|'),
        unitMillisecondFactors = {
            'Milliseconds' : 1,
            'Seconds' : 1e3,
            'Minutes' : 6e4,
            'Hours' : 36e5,
            'Days' : 864e5,
            'Months' : 2592e6,
            'Years' : 31536e6
        },

        unitAliases = {
            ms : 'millisecond',
            s : 'second',
            m : 'minute',
            h : 'hour',
            d : 'day',
            D : 'date',
            w : 'week',
            W : 'isoWeek',
            M : 'month',
            Q : 'quarter',
            y : 'year',
            DDD : 'dayOfYear',
            e : 'weekday',
            E : 'isoWeekday',
            gg: 'weekYear',
            GG: 'isoWeekYear'
        },

        camelFunctions = {
            dayofyear : 'dayOfYear',
            isoweekday : 'isoWeekday',
            isoweek : 'isoWeek',
            weekyear : 'weekYear',
            isoweekyear : 'isoWeekYear'
        },

        // format function strings
        formatFunctions = {},

        // default relative time thresholds
        relativeTimeThresholds = {
            s: 45,  // seconds to minute
            m: 45,  // minutes to hour
            h: 22,  // hours to day
            d: 26,  // days to month
            M: 11   // months to year
        },

        // tokens to ordinalize and pad
        ordinalizeTokens = 'DDD w W M D d'.split(' '),
        paddedTokens = 'M D H h m s w W'.split(' '),

        formatTokenFunctions = {
            M    : function () {
                return this.month() + 1;
            },
            MMM  : function (format) {
                return this.localeData().monthsShort(this, format);
            },
            MMMM : function (format) {
                return this.localeData().months(this, format);
            },
            D    : function () {
                return this.date();
            },
            DDD  : function () {
                return this.dayOfYear();
            },
            d    : function () {
                return this.day();
            },
            dd   : function (format) {
                return this.localeData().weekdaysMin(this, format);
            },
            ddd  : function (format) {
                return this.localeData().weekdaysShort(this, format);
            },
            dddd : function (format) {
                return this.localeData().weekdays(this, format);
            },
            w    : function () {
                return this.week();
            },
            W    : function () {
                return this.isoWeek();
            },
            YY   : function () {
                return leftZeroFill(this.year() % 100, 2);
            },
            YYYY : function () {
                return leftZeroFill(this.year(), 4);
            },
            YYYYY : function () {
                return leftZeroFill(this.year(), 5);
            },
            YYYYYY : function () {
                var y = this.year(), sign = y >= 0 ? '+' : '-';
                return sign + leftZeroFill(Math.abs(y), 6);
            },
            gg   : function () {
                return leftZeroFill(this.weekYear() % 100, 2);
            },
            gggg : function () {
                return leftZeroFill(this.weekYear(), 4);
            },
            ggggg : function () {
                return leftZeroFill(this.weekYear(), 5);
            },
            GG   : function () {
                return leftZeroFill(this.isoWeekYear() % 100, 2);
            },
            GGGG : function () {
                return leftZeroFill(this.isoWeekYear(), 4);
            },
            GGGGG : function () {
                return leftZeroFill(this.isoWeekYear(), 5);
            },
            e : function () {
                return this.weekday();
            },
            E : function () {
                return this.isoWeekday();
            },
            a    : function () {
                return this.localeData().meridiem(this.hours(), this.minutes(), true);
            },
            A    : function () {
                return this.localeData().meridiem(this.hours(), this.minutes(), false);
            },
            H    : function () {
                return this.hours();
            },
            h    : function () {
                return this.hours() % 12 || 12;
            },
            m    : function () {
                return this.minutes();
            },
            s    : function () {
                return this.seconds();
            },
            S    : function () {
                return toInt(this.milliseconds() / 100);
            },
            SS   : function () {
                return leftZeroFill(toInt(this.milliseconds() / 10), 2);
            },
            SSS  : function () {
                return leftZeroFill(this.milliseconds(), 3);
            },
            SSSS : function () {
                return leftZeroFill(this.milliseconds(), 3);
            },
            Z    : function () {
                var a = -this.zone(),
                    b = '+';
                if (a < 0) {
                    a = -a;
                    b = '-';
                }
                return b + leftZeroFill(toInt(a / 60), 2) + ':' + leftZeroFill(toInt(a) % 60, 2);
            },
            ZZ   : function () {
                var a = -this.zone(),
                    b = '+';
                if (a < 0) {
                    a = -a;
                    b = '-';
                }
                return b + leftZeroFill(toInt(a / 60), 2) + leftZeroFill(toInt(a) % 60, 2);
            },
            z : function () {
                return this.zoneAbbr();
            },
            zz : function () {
                return this.zoneName();
            },
            X    : function () {
                return this.unix();
            },
            Q : function () {
                return this.quarter();
            }
        },

        deprecations = {},

        lists = ['months', 'monthsShort', 'weekdays', 'weekdaysShort', 'weekdaysMin'];

    // Pick the first defined of two or three arguments. dfl comes from
    // default.
    function dfl(a, b, c) {
        switch (arguments.length) {
            case 2: return a != null ? a : b;
            case 3: return a != null ? a : b != null ? b : c;
            default: throw new Error('Implement me');
        }
    }

    function hasOwnProp(a, b) {
        return hasOwnProperty.call(a, b);
    }

    function defaultParsingFlags() {
        // We need to deep clone this object, and es5 standard is not very
        // helpful.
        return {
            empty : false,
            unusedTokens : [],
            unusedInput : [],
            overflow : -2,
            charsLeftOver : 0,
            nullInput : false,
            invalidMonth : null,
            invalidFormat : false,
            userInvalidated : false,
            iso: false
        };
    }

    function printMsg(msg) {
        if (moment.suppressDeprecationWarnings === false &&
                typeof console !== 'undefined' && console.warn) {
            console.warn('Deprecation warning: ' + msg);
        }
    }

    function deprecate(msg, fn) {
        var firstTime = true;
        return extend(function () {
            if (firstTime) {
                printMsg(msg);
                firstTime = false;
            }
            return fn.apply(this, arguments);
        }, fn);
    }

    function deprecateSimple(name, msg) {
        if (!deprecations[name]) {
            printMsg(msg);
            deprecations[name] = true;
        }
    }

    function padToken(func, count) {
        return function (a) {
            return leftZeroFill(func.call(this, a), count);
        };
    }
    function ordinalizeToken(func, period) {
        return function (a) {
            return this.localeData().ordinal(func.call(this, a), period);
        };
    }

    while (ordinalizeTokens.length) {
        i = ordinalizeTokens.pop();
        formatTokenFunctions[i + 'o'] = ordinalizeToken(formatTokenFunctions[i], i);
    }
    while (paddedTokens.length) {
        i = paddedTokens.pop();
        formatTokenFunctions[i + i] = padToken(formatTokenFunctions[i], 2);
    }
    formatTokenFunctions.DDDD = padToken(formatTokenFunctions.DDD, 3);


    /************************************
        Constructors
    ************************************/

    function Locale() {
    }

    // Moment prototype object
    function Moment(config, skipOverflow) {
        if (skipOverflow !== false) {
            checkOverflow(config);
        }
        copyConfig(this, config);
        this._d = new Date(+config._d);
    }

    // Duration Constructor
    function Duration(duration) {
        var normalizedInput = normalizeObjectUnits(duration),
            years = normalizedInput.year || 0,
            quarters = normalizedInput.quarter || 0,
            months = normalizedInput.month || 0,
            weeks = normalizedInput.week || 0,
            days = normalizedInput.day || 0,
            hours = normalizedInput.hour || 0,
            minutes = normalizedInput.minute || 0,
            seconds = normalizedInput.second || 0,
            milliseconds = normalizedInput.millisecond || 0;

        // representation for dateAddRemove
        this._milliseconds = +milliseconds +
            seconds * 1e3 + // 1000
            minutes * 6e4 + // 1000 * 60
            hours * 36e5; // 1000 * 60 * 60
        // Because of dateAddRemove treats 24 hours as different from a
        // day when working around DST, we need to store them separately
        this._days = +days +
            weeks * 7;
        // It is impossible translate months into days without knowing
        // which months you are are talking about, so we have to store
        // it separately.
        this._months = +months +
            quarters * 3 +
            years * 12;

        this._data = {};

        this._locale = moment.localeData();

        this._bubble();
    }

    /************************************
        Helpers
    ************************************/


    function extend(a, b) {
        for (var i in b) {
            if (hasOwnProp(b, i)) {
                a[i] = b[i];
            }
        }

        if (hasOwnProp(b, 'toString')) {
            a.toString = b.toString;
        }

        if (hasOwnProp(b, 'valueOf')) {
            a.valueOf = b.valueOf;
        }

        return a;
    }

    function copyConfig(to, from) {
        var i, prop, val;

        if (typeof from._isAMomentObject !== 'undefined') {
            to._isAMomentObject = from._isAMomentObject;
        }
        if (typeof from._i !== 'undefined') {
            to._i = from._i;
        }
        if (typeof from._f !== 'undefined') {
            to._f = from._f;
        }
        if (typeof from._l !== 'undefined') {
            to._l = from._l;
        }
        if (typeof from._strict !== 'undefined') {
            to._strict = from._strict;
        }
        if (typeof from._tzm !== 'undefined') {
            to._tzm = from._tzm;
        }
        if (typeof from._isUTC !== 'undefined') {
            to._isUTC = from._isUTC;
        }
        if (typeof from._offset !== 'undefined') {
            to._offset = from._offset;
        }
        if (typeof from._pf !== 'undefined') {
            to._pf = from._pf;
        }
        if (typeof from._locale !== 'undefined') {
            to._locale = from._locale;
        }

        if (momentProperties.length > 0) {
            for (i in momentProperties) {
                prop = momentProperties[i];
                val = from[prop];
                if (typeof val !== 'undefined') {
                    to[prop] = val;
                }
            }
        }

        return to;
    }

    function absRound(number) {
        if (number < 0) {
            return Math.ceil(number);
        } else {
            return Math.floor(number);
        }
    }

    // left zero fill a number
    // see http://jsperf.com/left-zero-filling for performance comparison
    function leftZeroFill(number, targetLength, forceSign) {
        var output = '' + Math.abs(number),
            sign = number >= 0;

        while (output.length < targetLength) {
            output = '0' + output;
        }
        return (sign ? (forceSign ? '+' : '') : '-') + output;
    }

    function positiveMomentsDifference(base, other) {
        var res = {milliseconds: 0, months: 0};

        res.months = other.month() - base.month() +
            (other.year() - base.year()) * 12;
        if (base.clone().add(res.months, 'M').isAfter(other)) {
            --res.months;
        }

        res.milliseconds = +other - +(base.clone().add(res.months, 'M'));

        return res;
    }

    function momentsDifference(base, other) {
        var res;
        other = makeAs(other, base);
        if (base.isBefore(other)) {
            res = positiveMomentsDifference(base, other);
        } else {
            res = positiveMomentsDifference(other, base);
            res.milliseconds = -res.milliseconds;
            res.months = -res.months;
        }

        return res;
    }

    // TODO: remove 'name' arg after deprecation is removed
    function createAdder(direction, name) {
        return function (val, period) {
            var dur, tmp;
            //invert the arguments, but complain about it
            if (period !== null && !isNaN(+period)) {
                deprecateSimple(name, 'moment().' + name  + '(period, number) is deprecated. Please use moment().' + name + '(number, period).');
                tmp = val; val = period; period = tmp;
            }

            val = typeof val === 'string' ? +val : val;
            dur = moment.duration(val, period);
            addOrSubtractDurationFromMoment(this, dur, direction);
            return this;
        };
    }

    function addOrSubtractDurationFromMoment(mom, duration, isAdding, updateOffset) {
        var milliseconds = duration._milliseconds,
            days = duration._days,
            months = duration._months;
        updateOffset = updateOffset == null ? true : updateOffset;

        if (milliseconds) {
            mom._d.setTime(+mom._d + milliseconds * isAdding);
        }
        if (days) {
            rawSetter(mom, 'Date', rawGetter(mom, 'Date') + days * isAdding);
        }
        if (months) {
            rawMonthSetter(mom, rawGetter(mom, 'Month') + months * isAdding);
        }
        if (updateOffset) {
            moment.updateOffset(mom, days || months);
        }
    }

    // check if is an array
    function isArray(input) {
        return Object.prototype.toString.call(input) === '[object Array]';
    }

    function isDate(input) {
        return Object.prototype.toString.call(input) === '[object Date]' ||
            input instanceof Date;
    }

    // compare two arrays, return the number of differences
    function compareArrays(array1, array2, dontConvert) {
        var len = Math.min(array1.length, array2.length),
            lengthDiff = Math.abs(array1.length - array2.length),
            diffs = 0,
            i;
        for (i = 0; i < len; i++) {
            if ((dontConvert && array1[i] !== array2[i]) ||
                (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))) {
                diffs++;
            }
        }
        return diffs + lengthDiff;
    }

    function normalizeUnits(units) {
        if (units) {
            var lowered = units.toLowerCase().replace(/(.)s$/, '$1');
            units = unitAliases[units] || camelFunctions[lowered] || lowered;
        }
        return units;
    }

    function normalizeObjectUnits(inputObject) {
        var normalizedInput = {},
            normalizedProp,
            prop;

        for (prop in inputObject) {
            if (hasOwnProp(inputObject, prop)) {
                normalizedProp = normalizeUnits(prop);
                if (normalizedProp) {
                    normalizedInput[normalizedProp] = inputObject[prop];
                }
            }
        }

        return normalizedInput;
    }

    function makeList(field) {
        var count, setter;

        if (field.indexOf('week') === 0) {
            count = 7;
            setter = 'day';
        }
        else if (field.indexOf('month') === 0) {
            count = 12;
            setter = 'month';
        }
        else {
            return;
        }

        moment[field] = function (format, index) {
            var i, getter,
                method = moment._locale[field],
                results = [];

            if (typeof format === 'number') {
                index = format;
                format = undefined;
            }

            getter = function (i) {
                var m = moment().utc().set(setter, i);
                return method.call(moment._locale, m, format || '');
            };

            if (index != null) {
                return getter(index);
            }
            else {
                for (i = 0; i < count; i++) {
                    results.push(getter(i));
                }
                return results;
            }
        };
    }

    function toInt(argumentForCoercion) {
        var coercedNumber = +argumentForCoercion,
            value = 0;

        if (coercedNumber !== 0 && isFinite(coercedNumber)) {
            if (coercedNumber >= 0) {
                value = Math.floor(coercedNumber);
            } else {
                value = Math.ceil(coercedNumber);
            }
        }

        return value;
    }

    function daysInMonth(year, month) {
        return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    }

    function weeksInYear(year, dow, doy) {
        return weekOfYear(moment([year, 11, 31 + dow - doy]), dow, doy).week;
    }

    function daysInYear(year) {
        return isLeapYear(year) ? 366 : 365;
    }

    function isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    }

    function checkOverflow(m) {
        var overflow;
        if (m._a && m._pf.overflow === -2) {
            overflow =
                m._a[MONTH] < 0 || m._a[MONTH] > 11 ? MONTH :
                m._a[DATE] < 1 || m._a[DATE] > daysInMonth(m._a[YEAR], m._a[MONTH]) ? DATE :
                m._a[HOUR] < 0 || m._a[HOUR] > 23 ? HOUR :
                m._a[MINUTE] < 0 || m._a[MINUTE] > 59 ? MINUTE :
                m._a[SECOND] < 0 || m._a[SECOND] > 59 ? SECOND :
                m._a[MILLISECOND] < 0 || m._a[MILLISECOND] > 999 ? MILLISECOND :
                -1;

            if (m._pf._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {
                overflow = DATE;
            }

            m._pf.overflow = overflow;
        }
    }

    function isValid(m) {
        if (m._isValid == null) {
            m._isValid = !isNaN(m._d.getTime()) &&
                m._pf.overflow < 0 &&
                !m._pf.empty &&
                !m._pf.invalidMonth &&
                !m._pf.nullInput &&
                !m._pf.invalidFormat &&
                !m._pf.userInvalidated;

            if (m._strict) {
                m._isValid = m._isValid &&
                    m._pf.charsLeftOver === 0 &&
                    m._pf.unusedTokens.length === 0;
            }
        }
        return m._isValid;
    }

    function normalizeLocale(key) {
        return key ? key.toLowerCase().replace('_', '-') : key;
    }

    // pick the locale from the array
    // try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
    // substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
    function chooseLocale(names) {
        var i = 0, j, next, locale, split;

        while (i < names.length) {
            split = normalizeLocale(names[i]).split('-');
            j = split.length;
            next = normalizeLocale(names[i + 1]);
            next = next ? next.split('-') : null;
            while (j > 0) {
                locale = loadLocale(split.slice(0, j).join('-'));
                if (locale) {
                    return locale;
                }
                if (next && next.length >= j && compareArrays(split, next, true) >= j - 1) {
                    //the next array item is better than a shallower substring of this one
                    break;
                }
                j--;
            }
            i++;
        }
        return null;
    }

    function loadLocale(name) {
        var oldLocale = null;
        if (!locales[name] && hasModule) {
            try {
                oldLocale = moment.locale();
                require('./locale/' + name);
                // because defineLocale currently also sets the global locale, we want to undo that for lazy loaded locales
                moment.locale(oldLocale);
            } catch (e) { }
        }
        return locales[name];
    }

    // Return a moment from input, that is local/utc/zone equivalent to model.
    function makeAs(input, model) {
        return model._isUTC ? moment(input).zone(model._offset || 0) :
            moment(input).local();
    }

    /************************************
        Locale
    ************************************/


    extend(Locale.prototype, {

        set : function (config) {
            var prop, i;
            for (i in config) {
                prop = config[i];
                if (typeof prop === 'function') {
                    this[i] = prop;
                } else {
                    this['_' + i] = prop;
                }
            }
        },

        _months : 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
        months : function (m) {
            return this._months[m.month()];
        },

        _monthsShort : 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
        monthsShort : function (m) {
            return this._monthsShort[m.month()];
        },

        monthsParse : function (monthName) {
            var i, mom, regex;

            if (!this._monthsParse) {
                this._monthsParse = [];
            }

            for (i = 0; i < 12; i++) {
                // make the regex if we don't have it already
                if (!this._monthsParse[i]) {
                    mom = moment.utc([2000, i]);
                    regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
                    this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
                }
                // test the regex
                if (this._monthsParse[i].test(monthName)) {
                    return i;
                }
            }
        },

        _weekdays : 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
        weekdays : function (m) {
            return this._weekdays[m.day()];
        },

        _weekdaysShort : 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
        weekdaysShort : function (m) {
            return this._weekdaysShort[m.day()];
        },

        _weekdaysMin : 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
        weekdaysMin : function (m) {
            return this._weekdaysMin[m.day()];
        },

        weekdaysParse : function (weekdayName) {
            var i, mom, regex;

            if (!this._weekdaysParse) {
                this._weekdaysParse = [];
            }

            for (i = 0; i < 7; i++) {
                // make the regex if we don't have it already
                if (!this._weekdaysParse[i]) {
                    mom = moment([2000, 1]).day(i);
                    regex = '^' + this.weekdays(mom, '') + '|^' + this.weekdaysShort(mom, '') + '|^' + this.weekdaysMin(mom, '');
                    this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
                }
                // test the regex
                if (this._weekdaysParse[i].test(weekdayName)) {
                    return i;
                }
            }
        },

        _longDateFormat : {
            LT : 'h:mm A',
            L : 'MM/DD/YYYY',
            LL : 'MMMM D, YYYY',
            LLL : 'MMMM D, YYYY LT',
            LLLL : 'dddd, MMMM D, YYYY LT'
        },
        longDateFormat : function (key) {
            var output = this._longDateFormat[key];
            if (!output && this._longDateFormat[key.toUpperCase()]) {
                output = this._longDateFormat[key.toUpperCase()].replace(/MMMM|MM|DD|dddd/g, function (val) {
                    return val.slice(1);
                });
                this._longDateFormat[key] = output;
            }
            return output;
        },

        isPM : function (input) {
            // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
            // Using charAt should be more compatible.
            return ((input + '').toLowerCase().charAt(0) === 'p');
        },

        _meridiemParse : /[ap]\.?m?\.?/i,
        meridiem : function (hours, minutes, isLower) {
            if (hours > 11) {
                return isLower ? 'pm' : 'PM';
            } else {
                return isLower ? 'am' : 'AM';
            }
        },

        _calendar : {
            sameDay : '[Today at] LT',
            nextDay : '[Tomorrow at] LT',
            nextWeek : 'dddd [at] LT',
            lastDay : '[Yesterday at] LT',
            lastWeek : '[Last] dddd [at] LT',
            sameElse : 'L'
        },
        calendar : function (key, mom) {
            var output = this._calendar[key];
            return typeof output === 'function' ? output.apply(mom) : output;
        },

        _relativeTime : {
            future : 'in %s',
            past : '%s ago',
            s : 'a few seconds',
            m : 'a minute',
            mm : '%d minutes',
            h : 'an hour',
            hh : '%d hours',
            d : 'a day',
            dd : '%d days',
            M : 'a month',
            MM : '%d months',
            y : 'a year',
            yy : '%d years'
        },

        relativeTime : function (number, withoutSuffix, string, isFuture) {
            var output = this._relativeTime[string];
            return (typeof output === 'function') ?
                output(number, withoutSuffix, string, isFuture) :
                output.replace(/%d/i, number);
        },

        pastFuture : function (diff, output) {
            var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
            return typeof format === 'function' ? format(output) : format.replace(/%s/i, output);
        },

        ordinal : function (number) {
            return this._ordinal.replace('%d', number);
        },
        _ordinal : '%d',

        preparse : function (string) {
            return string;
        },

        postformat : function (string) {
            return string;
        },

        week : function (mom) {
            return weekOfYear(mom, this._week.dow, this._week.doy).week;
        },

        _week : {
            dow : 0, // Sunday is the first day of the week.
            doy : 6  // The week that contains Jan 1st is the first week of the year.
        },

        _invalidDate: 'Invalid date',
        invalidDate: function () {
            return this._invalidDate;
        }
    });

    /************************************
        Formatting
    ************************************/


    function removeFormattingTokens(input) {
        if (input.match(/\[[\s\S]/)) {
            return input.replace(/^\[|\]$/g, '');
        }
        return input.replace(/\\/g, '');
    }

    function makeFormatFunction(format) {
        var array = format.match(formattingTokens), i, length;

        for (i = 0, length = array.length; i < length; i++) {
            if (formatTokenFunctions[array[i]]) {
                array[i] = formatTokenFunctions[array[i]];
            } else {
                array[i] = removeFormattingTokens(array[i]);
            }
        }

        return function (mom) {
            var output = '';
            for (i = 0; i < length; i++) {
                output += array[i] instanceof Function ? array[i].call(mom, format) : array[i];
            }
            return output;
        };
    }

    // format date using native date object
    function formatMoment(m, format) {
        if (!m.isValid()) {
            return m.localeData().invalidDate();
        }

        format = expandFormat(format, m.localeData());

        if (!formatFunctions[format]) {
            formatFunctions[format] = makeFormatFunction(format);
        }

        return formatFunctions[format](m);
    }

    function expandFormat(format, locale) {
        var i = 5;

        function replaceLongDateFormatTokens(input) {
            return locale.longDateFormat(input) || input;
        }

        localFormattingTokens.lastIndex = 0;
        while (i >= 0 && localFormattingTokens.test(format)) {
            format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
            localFormattingTokens.lastIndex = 0;
            i -= 1;
        }

        return format;
    }


    /************************************
        Parsing
    ************************************/


    // get the regex to find the next token
    function getParseRegexForToken(token, config) {
        var a, strict = config._strict;
        switch (token) {
        case 'Q':
            return parseTokenOneDigit;
        case 'DDDD':
            return parseTokenThreeDigits;
        case 'YYYY':
        case 'GGGG':
        case 'gggg':
            return strict ? parseTokenFourDigits : parseTokenOneToFourDigits;
        case 'Y':
        case 'G':
        case 'g':
            return parseTokenSignedNumber;
        case 'YYYYYY':
        case 'YYYYY':
        case 'GGGGG':
        case 'ggggg':
            return strict ? parseTokenSixDigits : parseTokenOneToSixDigits;
        case 'S':
            if (strict) {
                return parseTokenOneDigit;
            }
            /* falls through */
        case 'SS':
            if (strict) {
                return parseTokenTwoDigits;
            }
            /* falls through */
        case 'SSS':
            if (strict) {
                return parseTokenThreeDigits;
            }
            /* falls through */
        case 'DDD':
            return parseTokenOneToThreeDigits;
        case 'MMM':
        case 'MMMM':
        case 'dd':
        case 'ddd':
        case 'dddd':
            return parseTokenWord;
        case 'a':
        case 'A':
            return config._locale._meridiemParse;
        case 'X':
            return parseTokenTimestampMs;
        case 'Z':
        case 'ZZ':
            return parseTokenTimezone;
        case 'T':
            return parseTokenT;
        case 'SSSS':
            return parseTokenDigits;
        case 'MM':
        case 'DD':
        case 'YY':
        case 'GG':
        case 'gg':
        case 'HH':
        case 'hh':
        case 'mm':
        case 'ss':
        case 'ww':
        case 'WW':
            return strict ? parseTokenTwoDigits : parseTokenOneOrTwoDigits;
        case 'M':
        case 'D':
        case 'd':
        case 'H':
        case 'h':
        case 'm':
        case 's':
        case 'w':
        case 'W':
        case 'e':
        case 'E':
            return parseTokenOneOrTwoDigits;
        case 'Do':
            return parseTokenOrdinal;
        default :
            a = new RegExp(regexpEscape(unescapeFormat(token.replace('\\', '')), 'i'));
            return a;
        }
    }

    function timezoneMinutesFromString(string) {
        string = string || '';
        var possibleTzMatches = (string.match(parseTokenTimezone) || []),
            tzChunk = possibleTzMatches[possibleTzMatches.length - 1] || [],
            parts = (tzChunk + '').match(parseTimezoneChunker) || ['-', 0, 0],
            minutes = +(parts[1] * 60) + toInt(parts[2]);

        return parts[0] === '+' ? -minutes : minutes;
    }

    // function to convert string input to date
    function addTimeToArrayFromToken(token, input, config) {
        var a, datePartArray = config._a;

        switch (token) {
        // QUARTER
        case 'Q':
            if (input != null) {
                datePartArray[MONTH] = (toInt(input) - 1) * 3;
            }
            break;
        // MONTH
        case 'M' : // fall through to MM
        case 'MM' :
            if (input != null) {
                datePartArray[MONTH] = toInt(input) - 1;
            }
            break;
        case 'MMM' : // fall through to MMMM
        case 'MMMM' :
            a = config._locale.monthsParse(input);
            // if we didn't find a month name, mark the date as invalid.
            if (a != null) {
                datePartArray[MONTH] = a;
            } else {
                config._pf.invalidMonth = input;
            }
            break;
        // DAY OF MONTH
        case 'D' : // fall through to DD
        case 'DD' :
            if (input != null) {
                datePartArray[DATE] = toInt(input);
            }
            break;
        case 'Do' :
            if (input != null) {
                datePartArray[DATE] = toInt(parseInt(input, 10));
            }
            break;
        // DAY OF YEAR
        case 'DDD' : // fall through to DDDD
        case 'DDDD' :
            if (input != null) {
                config._dayOfYear = toInt(input);
            }

            break;
        // YEAR
        case 'YY' :
            datePartArray[YEAR] = moment.parseTwoDigitYear(input);
            break;
        case 'YYYY' :
        case 'YYYYY' :
        case 'YYYYYY' :
            datePartArray[YEAR] = toInt(input);
            break;
        // AM / PM
        case 'a' : // fall through to A
        case 'A' :
            config._isPm = config._locale.isPM(input);
            break;
        // 24 HOUR
        case 'H' : // fall through to hh
        case 'HH' : // fall through to hh
        case 'h' : // fall through to hh
        case 'hh' :
            datePartArray[HOUR] = toInt(input);
            break;
        // MINUTE
        case 'm' : // fall through to mm
        case 'mm' :
            datePartArray[MINUTE] = toInt(input);
            break;
        // SECOND
        case 's' : // fall through to ss
        case 'ss' :
            datePartArray[SECOND] = toInt(input);
            break;
        // MILLISECOND
        case 'S' :
        case 'SS' :
        case 'SSS' :
        case 'SSSS' :
            datePartArray[MILLISECOND] = toInt(('0.' + input) * 1000);
            break;
        // UNIX TIMESTAMP WITH MS
        case 'X':
            config._d = new Date(parseFloat(input) * 1000);
            break;
        // TIMEZONE
        case 'Z' : // fall through to ZZ
        case 'ZZ' :
            config._useUTC = true;
            config._tzm = timezoneMinutesFromString(input);
            break;
        // WEEKDAY - human
        case 'dd':
        case 'ddd':
        case 'dddd':
            a = config._locale.weekdaysParse(input);
            // if we didn't get a weekday name, mark the date as invalid
            if (a != null) {
                config._w = config._w || {};
                config._w['d'] = a;
            } else {
                config._pf.invalidWeekday = input;
            }
            break;
        // WEEK, WEEK DAY - numeric
        case 'w':
        case 'ww':
        case 'W':
        case 'WW':
        case 'd':
        case 'e':
        case 'E':
            token = token.substr(0, 1);
            /* falls through */
        case 'gggg':
        case 'GGGG':
        case 'GGGGG':
            token = token.substr(0, 2);
            if (input) {
                config._w = config._w || {};
                config._w[token] = toInt(input);
            }
            break;
        case 'gg':
        case 'GG':
            config._w = config._w || {};
            config._w[token] = moment.parseTwoDigitYear(input);
        }
    }

    function dayOfYearFromWeekInfo(config) {
        var w, weekYear, week, weekday, dow, doy, temp;

        w = config._w;
        if (w.GG != null || w.W != null || w.E != null) {
            dow = 1;
            doy = 4;

            // TODO: We need to take the current isoWeekYear, but that depends on
            // how we interpret now (local, utc, fixed offset). So create
            // a now version of current config (take local/utc/offset flags, and
            // create now).
            weekYear = dfl(w.GG, config._a[YEAR], weekOfYear(moment(), 1, 4).year);
            week = dfl(w.W, 1);
            weekday = dfl(w.E, 1);
        } else {
            dow = config._locale._week.dow;
            doy = config._locale._week.doy;

            weekYear = dfl(w.gg, config._a[YEAR], weekOfYear(moment(), dow, doy).year);
            week = dfl(w.w, 1);

            if (w.d != null) {
                // weekday -- low day numbers are considered next week
                weekday = w.d;
                if (weekday < dow) {
                    ++week;
                }
            } else if (w.e != null) {
                // local weekday -- counting starts from begining of week
                weekday = w.e + dow;
            } else {
                // default to begining of week
                weekday = dow;
            }
        }
        temp = dayOfYearFromWeeks(weekYear, week, weekday, doy, dow);

        config._a[YEAR] = temp.year;
        config._dayOfYear = temp.dayOfYear;
    }

    // convert an array to a date.
    // the array should mirror the parameters below
    // note: all values past the year are optional and will default to the lowest possible value.
    // [year, month, day , hour, minute, second, millisecond]
    function dateFromConfig(config) {
        var i, date, input = [], currentDate, yearToUse;

        if (config._d) {
            return;
        }

        currentDate = currentDateArray(config);

        //compute day of the year from weeks and weekdays
        if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
            dayOfYearFromWeekInfo(config);
        }

        //if the day of the year is set, figure out what it is
        if (config._dayOfYear) {
            yearToUse = dfl(config._a[YEAR], currentDate[YEAR]);

            if (config._dayOfYear > daysInYear(yearToUse)) {
                config._pf._overflowDayOfYear = true;
            }

            date = makeUTCDate(yearToUse, 0, config._dayOfYear);
            config._a[MONTH] = date.getUTCMonth();
            config._a[DATE] = date.getUTCDate();
        }

        // Default to current date.
        // * if no year, month, day of month are given, default to today
        // * if day of month is given, default month and year
        // * if month is given, default only year
        // * if year is given, don't default anything
        for (i = 0; i < 3 && config._a[i] == null; ++i) {
            config._a[i] = input[i] = currentDate[i];
        }

        // Zero out whatever was not defaulted, including time
        for (; i < 7; i++) {
            config._a[i] = input[i] = (config._a[i] == null) ? (i === 2 ? 1 : 0) : config._a[i];
        }

        config._d = (config._useUTC ? makeUTCDate : makeDate).apply(null, input);
        // Apply timezone offset from input. The actual zone can be changed
        // with parseZone.
        if (config._tzm != null) {
            config._d.setUTCMinutes(config._d.getUTCMinutes() + config._tzm);
        }
    }

    function dateFromObject(config) {
        var normalizedInput;

        if (config._d) {
            return;
        }

        normalizedInput = normalizeObjectUnits(config._i);
        config._a = [
            normalizedInput.year,
            normalizedInput.month,
            normalizedInput.day,
            normalizedInput.hour,
            normalizedInput.minute,
            normalizedInput.second,
            normalizedInput.millisecond
        ];

        dateFromConfig(config);
    }

    function currentDateArray(config) {
        var now = new Date();
        if (config._useUTC) {
            return [
                now.getUTCFullYear(),
                now.getUTCMonth(),
                now.getUTCDate()
            ];
        } else {
            return [now.getFullYear(), now.getMonth(), now.getDate()];
        }
    }

    // date from string and format string
    function makeDateFromStringAndFormat(config) {
        if (config._f === moment.ISO_8601) {
            parseISO(config);
            return;
        }

        config._a = [];
        config._pf.empty = true;

        // This array is used to make a Date, either with `new Date` or `Date.UTC`
        var string = '' + config._i,
            i, parsedInput, tokens, token, skipped,
            stringLength = string.length,
            totalParsedInputLength = 0;

        tokens = expandFormat(config._f, config._locale).match(formattingTokens) || [];

        for (i = 0; i < tokens.length; i++) {
            token = tokens[i];
            parsedInput = (string.match(getParseRegexForToken(token, config)) || [])[0];
            if (parsedInput) {
                skipped = string.substr(0, string.indexOf(parsedInput));
                if (skipped.length > 0) {
                    config._pf.unusedInput.push(skipped);
                }
                string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
                totalParsedInputLength += parsedInput.length;
            }
            // don't parse if it's not a known token
            if (formatTokenFunctions[token]) {
                if (parsedInput) {
                    config._pf.empty = false;
                }
                else {
                    config._pf.unusedTokens.push(token);
                }
                addTimeToArrayFromToken(token, parsedInput, config);
            }
            else if (config._strict && !parsedInput) {
                config._pf.unusedTokens.push(token);
            }
        }

        // add remaining unparsed input length to the string
        config._pf.charsLeftOver = stringLength - totalParsedInputLength;
        if (string.length > 0) {
            config._pf.unusedInput.push(string);
        }

        // handle am pm
        if (config._isPm && config._a[HOUR] < 12) {
            config._a[HOUR] += 12;
        }
        // if is 12 am, change hours to 0
        if (config._isPm === false && config._a[HOUR] === 12) {
            config._a[HOUR] = 0;
        }

        dateFromConfig(config);
        checkOverflow(config);
    }

    function unescapeFormat(s) {
        return s.replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (matched, p1, p2, p3, p4) {
            return p1 || p2 || p3 || p4;
        });
    }

    // Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
    function regexpEscape(s) {
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    // date from string and array of format strings
    function makeDateFromStringAndArray(config) {
        var tempConfig,
            bestMoment,

            scoreToBeat,
            i,
            currentScore;

        if (config._f.length === 0) {
            config._pf.invalidFormat = true;
            config._d = new Date(NaN);
            return;
        }

        for (i = 0; i < config._f.length; i++) {
            currentScore = 0;
            tempConfig = copyConfig({}, config);
            if (config._useUTC != null) {
                tempConfig._useUTC = config._useUTC;
            }
            tempConfig._pf = defaultParsingFlags();
            tempConfig._f = config._f[i];
            makeDateFromStringAndFormat(tempConfig);

            if (!isValid(tempConfig)) {
                continue;
            }

            // if there is any input that was not parsed add a penalty for that format
            currentScore += tempConfig._pf.charsLeftOver;

            //or tokens
            currentScore += tempConfig._pf.unusedTokens.length * 10;

            tempConfig._pf.score = currentScore;

            if (scoreToBeat == null || currentScore < scoreToBeat) {
                scoreToBeat = currentScore;
                bestMoment = tempConfig;
            }
        }

        extend(config, bestMoment || tempConfig);
    }

    // date from iso format
    function parseISO(config) {
        var i, l,
            string = config._i,
            match = isoRegex.exec(string);

        if (match) {
            config._pf.iso = true;
            for (i = 0, l = isoDates.length; i < l; i++) {
                if (isoDates[i][1].exec(string)) {
                    // match[5] should be 'T' or undefined
                    config._f = isoDates[i][0] + (match[6] || ' ');
                    break;
                }
            }
            for (i = 0, l = isoTimes.length; i < l; i++) {
                if (isoTimes[i][1].exec(string)) {
                    config._f += isoTimes[i][0];
                    break;
                }
            }
            if (string.match(parseTokenTimezone)) {
                config._f += 'Z';
            }
            makeDateFromStringAndFormat(config);
        } else {
            config._isValid = false;
        }
    }

    // date from iso format or fallback
    function makeDateFromString(config) {
        parseISO(config);
        if (config._isValid === false) {
            delete config._isValid;
            moment.createFromInputFallback(config);
        }
    }

    function map(arr, fn) {
        var res = [], i;
        for (i = 0; i < arr.length; ++i) {
            res.push(fn(arr[i], i));
        }
        return res;
    }

    function makeDateFromInput(config) {
        var input = config._i, matched;
        if (input === undefined) {
            config._d = new Date();
        } else if (isDate(input)) {
            config._d = new Date(+input);
        } else if ((matched = aspNetJsonRegex.exec(input)) !== null) {
            config._d = new Date(+matched[1]);
        } else if (typeof input === 'string') {
            makeDateFromString(config);
        } else if (isArray(input)) {
            config._a = map(input.slice(0), function (obj) {
                return parseInt(obj, 10);
            });
            dateFromConfig(config);
        } else if (typeof(input) === 'object') {
            dateFromObject(config);
        } else if (typeof(input) === 'number') {
            // from milliseconds
            config._d = new Date(input);
        } else {
            moment.createFromInputFallback(config);
        }
    }

    function makeDate(y, m, d, h, M, s, ms) {
        //can't just apply() to create a date:
        //http://stackoverflow.com/questions/181348/instantiating-a-javascript-object-by-calling-prototype-constructor-apply
        var date = new Date(y, m, d, h, M, s, ms);

        //the date constructor doesn't accept years < 1970
        if (y < 1970) {
            date.setFullYear(y);
        }
        return date;
    }

    function makeUTCDate(y) {
        var date = new Date(Date.UTC.apply(null, arguments));
        if (y < 1970) {
            date.setUTCFullYear(y);
        }
        return date;
    }

    function parseWeekday(input, locale) {
        if (typeof input === 'string') {
            if (!isNaN(input)) {
                input = parseInt(input, 10);
            }
            else {
                input = locale.weekdaysParse(input);
                if (typeof input !== 'number') {
                    return null;
                }
            }
        }
        return input;
    }

    /************************************
        Relative Time
    ************************************/


    // helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
    function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
        return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
    }

    function relativeTime(posNegDuration, withoutSuffix, locale) {
        var duration = moment.duration(posNegDuration).abs(),
            seconds = round(duration.as('s')),
            minutes = round(duration.as('m')),
            hours = round(duration.as('h')),
            days = round(duration.as('d')),
            months = round(duration.as('M')),
            years = round(duration.as('y')),

            args = seconds < relativeTimeThresholds.s && ['s', seconds] ||
                minutes === 1 && ['m'] ||
                minutes < relativeTimeThresholds.m && ['mm', minutes] ||
                hours === 1 && ['h'] ||
                hours < relativeTimeThresholds.h && ['hh', hours] ||
                days === 1 && ['d'] ||
                days < relativeTimeThresholds.d && ['dd', days] ||
                months === 1 && ['M'] ||
                months < relativeTimeThresholds.M && ['MM', months] ||
                years === 1 && ['y'] || ['yy', years];

        args[2] = withoutSuffix;
        args[3] = +posNegDuration > 0;
        args[4] = locale;
        return substituteTimeAgo.apply({}, args);
    }


    /************************************
        Week of Year
    ************************************/


    // firstDayOfWeek       0 = sun, 6 = sat
    //                      the day of the week that starts the week
    //                      (usually sunday or monday)
    // firstDayOfWeekOfYear 0 = sun, 6 = sat
    //                      the first week is the week that contains the first
    //                      of this day of the week
    //                      (eg. ISO weeks use thursday (4))
    function weekOfYear(mom, firstDayOfWeek, firstDayOfWeekOfYear) {
        var end = firstDayOfWeekOfYear - firstDayOfWeek,
            daysToDayOfWeek = firstDayOfWeekOfYear - mom.day(),
            adjustedMoment;


        if (daysToDayOfWeek > end) {
            daysToDayOfWeek -= 7;
        }

        if (daysToDayOfWeek < end - 7) {
            daysToDayOfWeek += 7;
        }

        adjustedMoment = moment(mom).add(daysToDayOfWeek, 'd');
        return {
            week: Math.ceil(adjustedMoment.dayOfYear() / 7),
            year: adjustedMoment.year()
        };
    }

    //http://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
    function dayOfYearFromWeeks(year, week, weekday, firstDayOfWeekOfYear, firstDayOfWeek) {
        var d = makeUTCDate(year, 0, 1).getUTCDay(), daysToAdd, dayOfYear;

        d = d === 0 ? 7 : d;
        weekday = weekday != null ? weekday : firstDayOfWeek;
        daysToAdd = firstDayOfWeek - d + (d > firstDayOfWeekOfYear ? 7 : 0) - (d < firstDayOfWeek ? 7 : 0);
        dayOfYear = 7 * (week - 1) + (weekday - firstDayOfWeek) + daysToAdd + 1;

        return {
            year: dayOfYear > 0 ? year : year - 1,
            dayOfYear: dayOfYear > 0 ?  dayOfYear : daysInYear(year - 1) + dayOfYear
        };
    }

    /************************************
        Top Level Functions
    ************************************/

    function makeMoment(config) {
        var input = config._i,
            format = config._f;

        config._locale = config._locale || moment.localeData(config._l);

        if (input === null || (format === undefined && input === '')) {
            return moment.invalid({nullInput: true});
        }

        if (typeof input === 'string') {
            config._i = input = config._locale.preparse(input);
        }

        if (moment.isMoment(input)) {
            return new Moment(input, true);
        } else if (format) {
            if (isArray(format)) {
                makeDateFromStringAndArray(config);
            } else {
                makeDateFromStringAndFormat(config);
            }
        } else {
            makeDateFromInput(config);
        }

        return new Moment(config);
    }

    moment = function (input, format, locale, strict) {
        var c;

        if (typeof(locale) === 'boolean') {
            strict = locale;
            locale = undefined;
        }
        // object construction must be done this way.
        // https://github.com/moment/moment/issues/1423
        c = {};
        c._isAMomentObject = true;
        c._i = input;
        c._f = format;
        c._l = locale;
        c._strict = strict;
        c._isUTC = false;
        c._pf = defaultParsingFlags();

        return makeMoment(c);
    };

    moment.suppressDeprecationWarnings = false;

    moment.createFromInputFallback = deprecate(
        'moment construction falls back to js Date. This is ' +
        'discouraged and will be removed in upcoming major ' +
        'release. Please refer to ' +
        'https://github.com/moment/moment/issues/1407 for more info.',
        function (config) {
            config._d = new Date(config._i);
        }
    );

    // Pick a moment m from moments so that m[fn](other) is true for all
    // other. This relies on the function fn to be transitive.
    //
    // moments should either be an array of moment objects or an array, whose
    // first element is an array of moment objects.
    function pickBy(fn, moments) {
        var res, i;
        if (moments.length === 1 && isArray(moments[0])) {
            moments = moments[0];
        }
        if (!moments.length) {
            return moment();
        }
        res = moments[0];
        for (i = 1; i < moments.length; ++i) {
            if (moments[i][fn](res)) {
                res = moments[i];
            }
        }
        return res;
    }

    moment.min = function () {
        var args = [].slice.call(arguments, 0);

        return pickBy('isBefore', args);
    };

    moment.max = function () {
        var args = [].slice.call(arguments, 0);

        return pickBy('isAfter', args);
    };

    // creating with utc
    moment.utc = function (input, format, locale, strict) {
        var c;

        if (typeof(locale) === 'boolean') {
            strict = locale;
            locale = undefined;
        }
        // object construction must be done this way.
        // https://github.com/moment/moment/issues/1423
        c = {};
        c._isAMomentObject = true;
        c._useUTC = true;
        c._isUTC = true;
        c._l = locale;
        c._i = input;
        c._f = format;
        c._strict = strict;
        c._pf = defaultParsingFlags();

        return makeMoment(c).utc();
    };

    // creating with unix timestamp (in seconds)
    moment.unix = function (input) {
        return moment(input * 1000);
    };

    // duration
    moment.duration = function (input, key) {
        var duration = input,
            // matching against regexp is expensive, do it on demand
            match = null,
            sign,
            ret,
            parseIso,
            diffRes;

        if (moment.isDuration(input)) {
            duration = {
                ms: input._milliseconds,
                d: input._days,
                M: input._months
            };
        } else if (typeof input === 'number') {
            duration = {};
            if (key) {
                duration[key] = input;
            } else {
                duration.milliseconds = input;
            }
        } else if (!!(match = aspNetTimeSpanJsonRegex.exec(input))) {
            sign = (match[1] === '-') ? -1 : 1;
            duration = {
                y: 0,
                d: toInt(match[DATE]) * sign,
                h: toInt(match[HOUR]) * sign,
                m: toInt(match[MINUTE]) * sign,
                s: toInt(match[SECOND]) * sign,
                ms: toInt(match[MILLISECOND]) * sign
            };
        } else if (!!(match = isoDurationRegex.exec(input))) {
            sign = (match[1] === '-') ? -1 : 1;
            parseIso = function (inp) {
                // We'd normally use ~~inp for this, but unfortunately it also
                // converts floats to ints.
                // inp may be undefined, so careful calling replace on it.
                var res = inp && parseFloat(inp.replace(',', '.'));
                // apply sign while we're at it
                return (isNaN(res) ? 0 : res) * sign;
            };
            duration = {
                y: parseIso(match[2]),
                M: parseIso(match[3]),
                d: parseIso(match[4]),
                h: parseIso(match[5]),
                m: parseIso(match[6]),
                s: parseIso(match[7]),
                w: parseIso(match[8])
            };
        } else if (typeof duration === 'object' &&
                ('from' in duration || 'to' in duration)) {
            diffRes = momentsDifference(moment(duration.from), moment(duration.to));

            duration = {};
            duration.ms = diffRes.milliseconds;
            duration.M = diffRes.months;
        }

        ret = new Duration(duration);

        if (moment.isDuration(input) && hasOwnProp(input, '_locale')) {
            ret._locale = input._locale;
        }

        return ret;
    };

    // version number
    moment.version = VERSION;

    // default format
    moment.defaultFormat = isoFormat;

    // constant that refers to the ISO standard
    moment.ISO_8601 = function () {};

    // Plugins that add properties should also add the key here (null value),
    // so we can properly clone ourselves.
    moment.momentProperties = momentProperties;

    // This function will be called whenever a moment is mutated.
    // It is intended to keep the offset in sync with the timezone.
    moment.updateOffset = function () {};

    // This function allows you to set a threshold for relative time strings
    moment.relativeTimeThreshold = function (threshold, limit) {
        if (relativeTimeThresholds[threshold] === undefined) {
            return false;
        }
        if (limit === undefined) {
            return relativeTimeThresholds[threshold];
        }
        relativeTimeThresholds[threshold] = limit;
        return true;
    };

    moment.lang = deprecate(
        'moment.lang is deprecated. Use moment.locale instead.',
        function (key, value) {
            return moment.locale(key, value);
        }
    );

    // This function will load locale and then set the global locale.  If
    // no arguments are passed in, it will simply return the current global
    // locale key.
    moment.locale = function (key, values) {
        var data;
        if (key) {
            if (typeof(values) !== 'undefined') {
                data = moment.defineLocale(key, values);
            }
            else {
                data = moment.localeData(key);
            }

            if (data) {
                moment.duration._locale = moment._locale = data;
            }
        }

        return moment._locale._abbr;
    };

    moment.defineLocale = function (name, values) {
        if (values !== null) {
            values.abbr = name;
            if (!locales[name]) {
                locales[name] = new Locale();
            }
            locales[name].set(values);

            // backwards compat for now: also set the locale
            moment.locale(name);

            return locales[name];
        } else {
            // useful for testing
            delete locales[name];
            return null;
        }
    };

    moment.langData = deprecate(
        'moment.langData is deprecated. Use moment.localeData instead.',
        function (key) {
            return moment.localeData(key);
        }
    );

    // returns locale data
    moment.localeData = function (key) {
        var locale;

        if (key && key._locale && key._locale._abbr) {
            key = key._locale._abbr;
        }

        if (!key) {
            return moment._locale;
        }

        if (!isArray(key)) {
            //short-circuit everything else
            locale = loadLocale(key);
            if (locale) {
                return locale;
            }
            key = [key];
        }

        return chooseLocale(key);
    };

    // compare moment object
    moment.isMoment = function (obj) {
        return obj instanceof Moment ||
            (obj != null && hasOwnProp(obj, '_isAMomentObject'));
    };

    // for typechecking Duration objects
    moment.isDuration = function (obj) {
        return obj instanceof Duration;
    };

    for (i = lists.length - 1; i >= 0; --i) {
        makeList(lists[i]);
    }

    moment.normalizeUnits = function (units) {
        return normalizeUnits(units);
    };

    moment.invalid = function (flags) {
        var m = moment.utc(NaN);
        if (flags != null) {
            extend(m._pf, flags);
        }
        else {
            m._pf.userInvalidated = true;
        }

        return m;
    };

    moment.parseZone = function () {
        return moment.apply(null, arguments).parseZone();
    };

    moment.parseTwoDigitYear = function (input) {
        return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
    };

    /************************************
        Moment Prototype
    ************************************/


    extend(moment.fn = Moment.prototype, {

        clone : function () {
            return moment(this);
        },

        valueOf : function () {
            return +this._d + ((this._offset || 0) * 60000);
        },

        unix : function () {
            return Math.floor(+this / 1000);
        },

        toString : function () {
            return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
        },

        toDate : function () {
            return this._offset ? new Date(+this) : this._d;
        },

        toISOString : function () {
            var m = moment(this).utc();
            if (0 < m.year() && m.year() <= 9999) {
                return formatMoment(m, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
            } else {
                return formatMoment(m, 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
            }
        },

        toArray : function () {
            var m = this;
            return [
                m.year(),
                m.month(),
                m.date(),
                m.hours(),
                m.minutes(),
                m.seconds(),
                m.milliseconds()
            ];
        },

        isValid : function () {
            return isValid(this);
        },

        isDSTShifted : function () {
            if (this._a) {
                return this.isValid() && compareArrays(this._a, (this._isUTC ? moment.utc(this._a) : moment(this._a)).toArray()) > 0;
            }

            return false;
        },

        parsingFlags : function () {
            return extend({}, this._pf);
        },

        invalidAt: function () {
            return this._pf.overflow;
        },

        utc : function (keepLocalTime) {
            return this.zone(0, keepLocalTime);
        },

        local : function (keepLocalTime) {
            if (this._isUTC) {
                this.zone(0, keepLocalTime);
                this._isUTC = false;

                if (keepLocalTime) {
                    this.add(this._dateTzOffset(), 'm');
                }
            }
            return this;
        },

        format : function (inputString) {
            var output = formatMoment(this, inputString || moment.defaultFormat);
            return this.localeData().postformat(output);
        },

        add : createAdder(1, 'add'),

        subtract : createAdder(-1, 'subtract'),

        diff : function (input, units, asFloat) {
            var that = makeAs(input, this),
                zoneDiff = (this.zone() - that.zone()) * 6e4,
                diff, output, daysAdjust;

            units = normalizeUnits(units);

            if (units === 'year' || units === 'month') {
                // average number of days in the months in the given dates
                diff = (this.daysInMonth() + that.daysInMonth()) * 432e5; // 24 * 60 * 60 * 1000 / 2
                // difference in months
                output = ((this.year() - that.year()) * 12) + (this.month() - that.month());
                // adjust by taking difference in days, average number of days
                // and dst in the given months.
                daysAdjust = (this - moment(this).startOf('month')) -
                    (that - moment(that).startOf('month'));
                // same as above but with zones, to negate all dst
                daysAdjust -= ((this.zone() - moment(this).startOf('month').zone()) -
                        (that.zone() - moment(that).startOf('month').zone())) * 6e4;
                output += daysAdjust / diff;
                if (units === 'year') {
                    output = output / 12;
                }
            } else {
                diff = (this - that);
                output = units === 'second' ? diff / 1e3 : // 1000
                    units === 'minute' ? diff / 6e4 : // 1000 * 60
                    units === 'hour' ? diff / 36e5 : // 1000 * 60 * 60
                    units === 'day' ? (diff - zoneDiff) / 864e5 : // 1000 * 60 * 60 * 24, negate dst
                    units === 'week' ? (diff - zoneDiff) / 6048e5 : // 1000 * 60 * 60 * 24 * 7, negate dst
                    diff;
            }
            return asFloat ? output : absRound(output);
        },

        from : function (time, withoutSuffix) {
            return moment.duration({to: this, from: time}).locale(this.locale()).humanize(!withoutSuffix);
        },

        fromNow : function (withoutSuffix) {
            return this.from(moment(), withoutSuffix);
        },

        calendar : function (time) {
            // We want to compare the start of today, vs this.
            // Getting start-of-today depends on whether we're zone'd or not.
            var now = time || moment(),
                sod = makeAs(now, this).startOf('day'),
                diff = this.diff(sod, 'days', true),
                format = diff < -6 ? 'sameElse' :
                    diff < -1 ? 'lastWeek' :
                    diff < 0 ? 'lastDay' :
                    diff < 1 ? 'sameDay' :
                    diff < 2 ? 'nextDay' :
                    diff < 7 ? 'nextWeek' : 'sameElse';
            return this.format(this.localeData().calendar(format, this));
        },

        isLeapYear : function () {
            return isLeapYear(this.year());
        },

        isDST : function () {
            return (this.zone() < this.clone().month(0).zone() ||
                this.zone() < this.clone().month(5).zone());
        },

        day : function (input) {
            var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
            if (input != null) {
                input = parseWeekday(input, this.localeData());
                return this.add(input - day, 'd');
            } else {
                return day;
            }
        },

        month : makeAccessor('Month', true),

        startOf : function (units) {
            units = normalizeUnits(units);
            // the following switch intentionally omits break keywords
            // to utilize falling through the cases.
            switch (units) {
            case 'year':
                this.month(0);
                /* falls through */
            case 'quarter':
            case 'month':
                this.date(1);
                /* falls through */
            case 'week':
            case 'isoWeek':
            case 'day':
                this.hours(0);
                /* falls through */
            case 'hour':
                this.minutes(0);
                /* falls through */
            case 'minute':
                this.seconds(0);
                /* falls through */
            case 'second':
                this.milliseconds(0);
                /* falls through */
            }

            // weeks are a special case
            if (units === 'week') {
                this.weekday(0);
            } else if (units === 'isoWeek') {
                this.isoWeekday(1);
            }

            // quarters are also special
            if (units === 'quarter') {
                this.month(Math.floor(this.month() / 3) * 3);
            }

            return this;
        },

        endOf: function (units) {
            units = normalizeUnits(units);
            return this.startOf(units).add(1, (units === 'isoWeek' ? 'week' : units)).subtract(1, 'ms');
        },

        isAfter: function (input, units) {
            units = normalizeUnits(typeof units !== 'undefined' ? units : 'millisecond');
            if (units === 'millisecond') {
                input = moment.isMoment(input) ? input : moment(input);
                return +this > +input;
            } else {
                return +this.clone().startOf(units) > +moment(input).startOf(units);
            }
        },

        isBefore: function (input, units) {
            units = normalizeUnits(typeof units !== 'undefined' ? units : 'millisecond');
            if (units === 'millisecond') {
                input = moment.isMoment(input) ? input : moment(input);
                return +this < +input;
            } else {
                return +this.clone().startOf(units) < +moment(input).startOf(units);
            }
        },

        isSame: function (input, units) {
            units = normalizeUnits(units || 'millisecond');
            if (units === 'millisecond') {
                input = moment.isMoment(input) ? input : moment(input);
                return +this === +input;
            } else {
                return +this.clone().startOf(units) === +makeAs(input, this).startOf(units);
            }
        },

        min: deprecate(
                 'moment().min is deprecated, use moment.min instead. https://github.com/moment/moment/issues/1548',
                 function (other) {
                     other = moment.apply(null, arguments);
                     return other < this ? this : other;
                 }
         ),

        max: deprecate(
                'moment().max is deprecated, use moment.max instead. https://github.com/moment/moment/issues/1548',
                function (other) {
                    other = moment.apply(null, arguments);
                    return other > this ? this : other;
                }
        ),

        // keepLocalTime = true means only change the timezone, without
        // affecting the local hour. So 5:31:26 +0300 --[zone(2, true)]-->
        // 5:31:26 +0200 It is possible that 5:31:26 doesn't exist int zone
        // +0200, so we adjust the time as needed, to be valid.
        //
        // Keeping the time actually adds/subtracts (one hour)
        // from the actual represented time. That is why we call updateOffset
        // a second time. In case it wants us to change the offset again
        // _changeInProgress == true case, then we have to adjust, because
        // there is no such time in the given timezone.
        zone : function (input, keepLocalTime) {
            var offset = this._offset || 0,
                localAdjust;
            if (input != null) {
                if (typeof input === 'string') {
                    input = timezoneMinutesFromString(input);
                }
                if (Math.abs(input) < 16) {
                    input = input * 60;
                }
                if (!this._isUTC && keepLocalTime) {
                    localAdjust = this._dateTzOffset();
                }
                this._offset = input;
                this._isUTC = true;
                if (localAdjust != null) {
                    this.subtract(localAdjust, 'm');
                }
                if (offset !== input) {
                    if (!keepLocalTime || this._changeInProgress) {
                        addOrSubtractDurationFromMoment(this,
                                moment.duration(offset - input, 'm'), 1, false);
                    } else if (!this._changeInProgress) {
                        this._changeInProgress = true;
                        moment.updateOffset(this, true);
                        this._changeInProgress = null;
                    }
                }
            } else {
                return this._isUTC ? offset : this._dateTzOffset();
            }
            return this;
        },

        zoneAbbr : function () {
            return this._isUTC ? 'UTC' : '';
        },

        zoneName : function () {
            return this._isUTC ? 'Coordinated Universal Time' : '';
        },

        parseZone : function () {
            if (this._tzm) {
                this.zone(this._tzm);
            } else if (typeof this._i === 'string') {
                this.zone(this._i);
            }
            return this;
        },

        hasAlignedHourOffset : function (input) {
            if (!input) {
                input = 0;
            }
            else {
                input = moment(input).zone();
            }

            return (this.zone() - input) % 60 === 0;
        },

        daysInMonth : function () {
            return daysInMonth(this.year(), this.month());
        },

        dayOfYear : function (input) {
            var dayOfYear = round((moment(this).startOf('day') - moment(this).startOf('year')) / 864e5) + 1;
            return input == null ? dayOfYear : this.add((input - dayOfYear), 'd');
        },

        quarter : function (input) {
            return input == null ? Math.ceil((this.month() + 1) / 3) : this.month((input - 1) * 3 + this.month() % 3);
        },

        weekYear : function (input) {
            var year = weekOfYear(this, this.localeData()._week.dow, this.localeData()._week.doy).year;
            return input == null ? year : this.add((input - year), 'y');
        },

        isoWeekYear : function (input) {
            var year = weekOfYear(this, 1, 4).year;
            return input == null ? year : this.add((input - year), 'y');
        },

        week : function (input) {
            var week = this.localeData().week(this);
            return input == null ? week : this.add((input - week) * 7, 'd');
        },

        isoWeek : function (input) {
            var week = weekOfYear(this, 1, 4).week;
            return input == null ? week : this.add((input - week) * 7, 'd');
        },

        weekday : function (input) {
            var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
            return input == null ? weekday : this.add(input - weekday, 'd');
        },

        isoWeekday : function (input) {
            // behaves the same as moment#day except
            // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
            // as a setter, sunday should belong to the previous week.
            return input == null ? this.day() || 7 : this.day(this.day() % 7 ? input : input - 7);
        },

        isoWeeksInYear : function () {
            return weeksInYear(this.year(), 1, 4);
        },

        weeksInYear : function () {
            var weekInfo = this.localeData()._week;
            return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
        },

        get : function (units) {
            units = normalizeUnits(units);
            return this[units]();
        },

        set : function (units, value) {
            units = normalizeUnits(units);
            if (typeof this[units] === 'function') {
                this[units](value);
            }
            return this;
        },

        // If passed a locale key, it will set the locale for this
        // instance.  Otherwise, it will return the locale configuration
        // variables for this instance.
        locale : function (key) {
            var newLocaleData;

            if (key === undefined) {
                return this._locale._abbr;
            } else {
                newLocaleData = moment.localeData(key);
                if (newLocaleData != null) {
                    this._locale = newLocaleData;
                }
                return this;
            }
        },

        lang : deprecate(
            'moment().lang() is deprecated. Use moment().localeData() instead.',
            function (key) {
                if (key === undefined) {
                    return this.localeData();
                } else {
                    return this.locale(key);
                }
            }
        ),

        localeData : function () {
            return this._locale;
        },

        _dateTzOffset : function () {
            // On Firefox.24 Date#getTimezoneOffset returns a floating point.
            // https://github.com/moment/moment/pull/1871
            return Math.round(this._d.getTimezoneOffset() / 15) * 15;
        }
    });

    function rawMonthSetter(mom, value) {
        var dayOfMonth;

        // TODO: Move this out of here!
        if (typeof value === 'string') {
            value = mom.localeData().monthsParse(value);
            // TODO: Another silent failure?
            if (typeof value !== 'number') {
                return mom;
            }
        }

        dayOfMonth = Math.min(mom.date(),
                daysInMonth(mom.year(), value));
        mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);
        return mom;
    }

    function rawGetter(mom, unit) {
        return mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]();
    }

    function rawSetter(mom, unit, value) {
        if (unit === 'Month') {
            return rawMonthSetter(mom, value);
        } else {
            return mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);
        }
    }

    function makeAccessor(unit, keepTime) {
        return function (value) {
            if (value != null) {
                rawSetter(this, unit, value);
                moment.updateOffset(this, keepTime);
                return this;
            } else {
                return rawGetter(this, unit);
            }
        };
    }

    moment.fn.millisecond = moment.fn.milliseconds = makeAccessor('Milliseconds', false);
    moment.fn.second = moment.fn.seconds = makeAccessor('Seconds', false);
    moment.fn.minute = moment.fn.minutes = makeAccessor('Minutes', false);
    // Setting the hour should keep the time, because the user explicitly
    // specified which hour he wants. So trying to maintain the same hour (in
    // a new timezone) makes sense. Adding/subtracting hours does not follow
    // this rule.
    moment.fn.hour = moment.fn.hours = makeAccessor('Hours', true);
    // moment.fn.month is defined separately
    moment.fn.date = makeAccessor('Date', true);
    moment.fn.dates = deprecate('dates accessor is deprecated. Use date instead.', makeAccessor('Date', true));
    moment.fn.year = makeAccessor('FullYear', true);
    moment.fn.years = deprecate('years accessor is deprecated. Use year instead.', makeAccessor('FullYear', true));

    // add plural methods
    moment.fn.days = moment.fn.day;
    moment.fn.months = moment.fn.month;
    moment.fn.weeks = moment.fn.week;
    moment.fn.isoWeeks = moment.fn.isoWeek;
    moment.fn.quarters = moment.fn.quarter;

    // add aliased format methods
    moment.fn.toJSON = moment.fn.toISOString;

    /************************************
        Duration Prototype
    ************************************/


    function daysToYears (days) {
        // 400 years have 146097 days (taking into account leap year rules)
        return days * 400 / 146097;
    }

    function yearsToDays (years) {
        // years * 365 + absRound(years / 4) -
        //     absRound(years / 100) + absRound(years / 400);
        return years * 146097 / 400;
    }

    extend(moment.duration.fn = Duration.prototype, {

        _bubble : function () {
            var milliseconds = this._milliseconds,
                days = this._days,
                months = this._months,
                data = this._data,
                seconds, minutes, hours, years = 0;

            // The following code bubbles up values, see the tests for
            // examples of what that means.
            data.milliseconds = milliseconds % 1000;

            seconds = absRound(milliseconds / 1000);
            data.seconds = seconds % 60;

            minutes = absRound(seconds / 60);
            data.minutes = minutes % 60;

            hours = absRound(minutes / 60);
            data.hours = hours % 24;

            days += absRound(hours / 24);

            // Accurately convert days to years, assume start from year 0.
            years = absRound(daysToYears(days));
            days -= absRound(yearsToDays(years));

            // 30 days to a month
            // TODO (iskren): Use anchor date (like 1st Jan) to compute this.
            months += absRound(days / 30);
            days %= 30;

            // 12 months -> 1 year
            years += absRound(months / 12);
            months %= 12;

            data.days = days;
            data.months = months;
            data.years = years;
        },

        abs : function () {
            this._milliseconds = Math.abs(this._milliseconds);
            this._days = Math.abs(this._days);
            this._months = Math.abs(this._months);

            this._data.milliseconds = Math.abs(this._data.milliseconds);
            this._data.seconds = Math.abs(this._data.seconds);
            this._data.minutes = Math.abs(this._data.minutes);
            this._data.hours = Math.abs(this._data.hours);
            this._data.months = Math.abs(this._data.months);
            this._data.years = Math.abs(this._data.years);

            return this;
        },

        weeks : function () {
            return absRound(this.days() / 7);
        },

        valueOf : function () {
            return this._milliseconds +
              this._days * 864e5 +
              (this._months % 12) * 2592e6 +
              toInt(this._months / 12) * 31536e6;
        },

        humanize : function (withSuffix) {
            var output = relativeTime(this, !withSuffix, this.localeData());

            if (withSuffix) {
                output = this.localeData().pastFuture(+this, output);
            }

            return this.localeData().postformat(output);
        },

        add : function (input, val) {
            // supports only 2.0-style add(1, 's') or add(moment)
            var dur = moment.duration(input, val);

            this._milliseconds += dur._milliseconds;
            this._days += dur._days;
            this._months += dur._months;

            this._bubble();

            return this;
        },

        subtract : function (input, val) {
            var dur = moment.duration(input, val);

            this._milliseconds -= dur._milliseconds;
            this._days -= dur._days;
            this._months -= dur._months;

            this._bubble();

            return this;
        },

        get : function (units) {
            units = normalizeUnits(units);
            return this[units.toLowerCase() + 's']();
        },

        as : function (units) {
            var days, months;
            units = normalizeUnits(units);

            if (units === 'month' || units === 'year') {
                days = this._days + this._milliseconds / 864e5;
                months = this._months + daysToYears(days) * 12;
                return units === 'month' ? months : months / 12;
            } else {
                // handle milliseconds separately because of floating point math errors (issue #1867)
                days = this._days + yearsToDays(this._months / 12);
                switch (units) {
                    case 'week': return days / 7 + this._milliseconds / 6048e5;
                    case 'day': return days + this._milliseconds / 864e5;
                    case 'hour': return days * 24 + this._milliseconds / 36e5;
                    case 'minute': return days * 24 * 60 + this._milliseconds / 6e4;
                    case 'second': return days * 24 * 60 * 60 + this._milliseconds / 1000;
                    // Math.floor prevents floating point math errors here
                    case 'millisecond': return Math.floor(days * 24 * 60 * 60 * 1000) + this._milliseconds;
                    default: throw new Error('Unknown unit ' + units);
                }
            }
        },

        lang : moment.fn.lang,
        locale : moment.fn.locale,

        toIsoString : deprecate(
            'toIsoString() is deprecated. Please use toISOString() instead ' +
            '(notice the capitals)',
            function () {
                return this.toISOString();
            }
        ),

        toISOString : function () {
            // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
            var years = Math.abs(this.years()),
                months = Math.abs(this.months()),
                days = Math.abs(this.days()),
                hours = Math.abs(this.hours()),
                minutes = Math.abs(this.minutes()),
                seconds = Math.abs(this.seconds() + this.milliseconds() / 1000);

            if (!this.asSeconds()) {
                // this is the same as C#'s (Noda) and python (isodate)...
                // but not other JS (goog.date)
                return 'P0D';
            }

            return (this.asSeconds() < 0 ? '-' : '') +
                'P' +
                (years ? years + 'Y' : '') +
                (months ? months + 'M' : '') +
                (days ? days + 'D' : '') +
                ((hours || minutes || seconds) ? 'T' : '') +
                (hours ? hours + 'H' : '') +
                (minutes ? minutes + 'M' : '') +
                (seconds ? seconds + 'S' : '');
        },

        localeData : function () {
            return this._locale;
        }
    });

    moment.duration.fn.toString = moment.duration.fn.toISOString;

    function makeDurationGetter(name) {
        moment.duration.fn[name] = function () {
            return this._data[name];
        };
    }

    for (i in unitMillisecondFactors) {
        if (hasOwnProp(unitMillisecondFactors, i)) {
            makeDurationGetter(i.toLowerCase());
        }
    }

    moment.duration.fn.asMilliseconds = function () {
        return this.as('ms');
    };
    moment.duration.fn.asSeconds = function () {
        return this.as('s');
    };
    moment.duration.fn.asMinutes = function () {
        return this.as('m');
    };
    moment.duration.fn.asHours = function () {
        return this.as('h');
    };
    moment.duration.fn.asDays = function () {
        return this.as('d');
    };
    moment.duration.fn.asWeeks = function () {
        return this.as('weeks');
    };
    moment.duration.fn.asMonths = function () {
        return this.as('M');
    };
    moment.duration.fn.asYears = function () {
        return this.as('y');
    };

    /************************************
        Default Locale
    ************************************/


    // Set default locale, other locale will inherit from English.
    moment.locale('en', {
        ordinal : function (number) {
            var b = number % 10,
                output = (toInt(number % 100 / 10) === 1) ? 'th' :
                (b === 1) ? 'st' :
                (b === 2) ? 'nd' :
                (b === 3) ? 'rd' : 'th';
            return number + output;
        }
    });

    /* EMBED_LOCALES */

    /************************************
        Exposing Moment
    ************************************/

    function makeGlobal(shouldDeprecate) {
        /*global ender:false */
        if (typeof ender !== 'undefined') {
            return;
        }
        oldGlobalMoment = globalScope.moment;
        if (shouldDeprecate) {
            globalScope.moment = deprecate(
                    'Accessing Moment through the global scope is ' +
                    'deprecated, and will be removed in an upcoming ' +
                    'release.',
                    moment);
        } else {
            globalScope.moment = moment;
        }
    }

    // CommonJS module is defined
    if (hasModule) {
        module.exports = moment;
    } else if (typeof define === 'function' && define.amd) {
        define('moment', function (require, exports, module) {
            if (module.config && module.config() && module.config().noGlobal === true) {
                // release the global variable
                globalScope.moment = oldGlobalMoment;
            }

            return moment;
        });
        makeGlobal(true);
    } else {
        makeGlobal();
    }
}).call(this);
///#source 1 1 /JavaScript-Mvc-framework/libs/bootstrap-datetimepicker.js
/*
// version : 3.1.3
=========================================================
bootstrap-datetimepicker.js
https://github.com/Eonasdan/bootstrap-datetimepicker
=========================================================
The MIT License (MIT)

Copyright (c) 2014 Jonathan Peterson

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/
;
(function (root, factory) {
    "use strict";
    if (typeof define === "function" && define.amd) {
        // AMD is used - Register as an anonymous module.
        define(["jquery", "moment"], factory);
    } else if (typeof exports === "object") {
        factory(require("jquery"), require("moment"));
    } else {
        // Neither AMD or CommonJS used. Use global variables.
        if (!jQuery) {
            throw new Error("bootstrap-datetimepicker requires jQuery to be loaded first");
        }
        if (!moment) {
            throw new Error("bootstrap-datetimepicker requires moment.js to be loaded first");
        }
        factory(root.jQuery, moment);
    }
}(this, function ($, moment) {
    "use strict";
    if (typeof moment === "undefined") {
        throw new Error("momentjs is required");
    }

    var dpgId = 0,

        DateTimePicker = function (element, options) {
            var defaults = $.fn.datetimepicker.defaults,

                icons = {
                    time: "glyphicon glyphicon-time",
                    date: "fa fa-calendar",
                    up: "glyphicon glyphicon-chevron-up",
                    down: "glyphicon glyphicon-chevron-down"
                },

                picker = this,
                errored = false,
                dDate,

                init = function () {
                    var icon = false, localeData, rInterval;
                    picker.options = $.extend({}, defaults, options);
                    picker.options.icons = $.extend({}, icons, picker.options.icons);

                    picker.element = $(element);

                    dataToOptions();

                    if (!(picker.options.pickTime || picker.options.pickDate)) {
                        throw new Error("Must choose at least one picker");
                    }

                    picker.id = dpgId++;
                    moment.locale(picker.options.language);
                    picker.date = moment();
                    picker.unset = false;
                    picker.isInput = picker.element.is("input");
                    picker.component = false;

                    if (picker.element.hasClass("input-group")) {
                        if (picker.element.find(".datepickerbutton").size() === 0) { //in case there is more then one 'input-group-addon' Issue #48
                            picker.component = picker.element.find("[class^=\"input-group-\"]");
                        } else {
                            picker.component = picker.element.find(".datepickerbutton");
                        }
                    }
                    picker.format = picker.options.format;

                    localeData = moment().localeData();

                    if (!picker.format) {
                        picker.format = (picker.options.pickDate ? localeData.longDateFormat("L") : "");
                        if (picker.options.pickDate && picker.options.pickTime) {
                            picker.format += " ";
                        }
                        picker.format += (picker.options.pickTime ? localeData.longDateFormat("LT") : "");
                        if (picker.options.useSeconds) {
                            if (localeData.longDateFormat("LT").indexOf(" A") !== -1) {
                                picker.format = picker.format.split(" A")[0] + ":ss A";
                            } else {
                                picker.format += ":ss";
                            }
                        }
                    }
                    picker.use24hours = (picker.format.toLowerCase().indexOf("a") < 0 && picker.format.indexOf("h") < 0);

                    if (picker.component) {
                        icon = picker.component.find("span");
                    }

                    if (picker.options.pickTime) {
                        if (icon) {
                            icon.addClass(picker.options.icons.time);
                        }
                    }
                    if (picker.options.pickDate) {
                        if (icon) {
                            icon.removeClass(picker.options.icons.time);
                            icon.addClass(picker.options.icons.date);
                        }
                    }

                    picker.options.widgetParent =
                        typeof picker.options.widgetParent === "string" && picker.options.widgetParent ||
                        picker.element.parents().filter(function () {
                            return "scroll" === $(this).css("overflow-y");
                        }).get(0) ||
                        "body";

                    picker.widget = $(getTemplate()).appendTo(picker.options.widgetParent);

                    picker.minViewMode = picker.options.minViewMode || 0;
                    if (typeof picker.minViewMode === "string") {
                        switch (picker.minViewMode) {
                            case "months":
                                picker.minViewMode = 1;
                                break;
                            case "years":
                                picker.minViewMode = 2;
                                break;
                            default:
                                picker.minViewMode = 0;
                                break;
                        }
                    }
                    picker.viewMode = picker.options.viewMode || 0;
                    if (typeof picker.viewMode === "string") {
                        switch (picker.viewMode) {
                            case "months":
                                picker.viewMode = 1;
                                break;
                            case "years":
                                picker.viewMode = 2;
                                break;
                            default:
                                picker.viewMode = 0;
                                break;
                        }
                    }

                    picker.viewMode = Math.max(picker.viewMode, picker.minViewMode);

                    picker.options.disabledDates = indexGivenDates(picker.options.disabledDates);
                    picker.options.enabledDates = indexGivenDates(picker.options.enabledDates);

                    picker.startViewMode = picker.viewMode;
                    picker.setMinDate(picker.options.minDate);
                    picker.setMaxDate(picker.options.maxDate);
                    fillDow();
                    fillMonths();
                    fillHours();
                    fillMinutes();
                    fillSeconds();
                    update();
                    showMode();
                    if (!getPickerInput().prop("disabled")) {
                        attachDatePickerEvents();
                    }
                    if (picker.options.defaultDate !== "" && getPickerInput().val() === "") {
                        picker.setValue(picker.options.defaultDate);
                    }
                    if (picker.options.minuteStepping !== 1) {
                        rInterval = picker.options.minuteStepping;
                        picker.date.minutes((Math.round(picker.date.minutes() / rInterval) * rInterval) % 60).seconds(0);
                    }
                },

                getPickerInput = function () {
                    var input;

                    if (picker.isInput) {
                        return picker.element;
                    }
                    input = picker.element.find(".datepickerinput");
                    if (input.size() === 0) {
                        input = picker.element.find("input");
                    } else if (!input.is("input")) {
                        throw new Error("CSS class \"datepickerinput\" cannot be applied to non input element");
                    }
                    return input;
                },

                dataToOptions = function () {
                    var eData;
                    if (picker.element.is("input")) {
                        eData = picker.element.data();
                    } else {
                        eData = picker.element.find("input").data();
                    }
                    //if (eData === undefined) {
                    //    return;
                    //}
                    if (eData.dateFormat !== undefined) {
                        picker.options.format = eData.dateFormat;
                    }
                    if (eData.datePickdate !== undefined) {
                        picker.options.pickDate = eData.datePickdate;
                    }
                    if (eData.datePicktime !== undefined) {
                        picker.options.pickTime = eData.datePicktime;
                    }
                    if (eData.dateUseminutes !== undefined) {
                        picker.options.useMinutes = eData.dateUseminutes;
                    }
                    if (eData.dateUseseconds !== undefined) {
                        picker.options.useSeconds = eData.dateUseseconds;
                    }
                    if (eData.dateUsecurrent !== undefined) {
                        picker.options.useCurrent = eData.dateUsecurrent;
                    }
                    if (eData.calendarWeeks !== undefined) {
                        picker.options.calendarWeeks = eData.calendarWeeks;
                    }
                    if (eData.dateMinutestepping !== undefined) {
                        picker.options.minuteStepping = eData.dateMinutestepping;
                    }
                    if (eData.dateMindate !== undefined) {
                        picker.options.minDate = eData.dateMindate;
                    }
                    if (eData.dateMaxdate !== undefined) {
                        picker.options.maxDate = eData.dateMaxdate;
                    }
                    if (eData.dateShowtoday !== undefined) {
                        picker.options.showToday = eData.dateShowtoday;
                    }
                    if (eData.dateCollapse !== undefined) {
                        picker.options.collapse = eData.dateCollapse;
                    }
                    if (eData.dateLanguage !== undefined) {
                        picker.options.language = eData.dateLanguage;
                    }
                    if (eData.dateDefaultdate !== undefined) {
                        picker.options.defaultDate = eData.dateDefaultdate;
                    }
                    if (eData.dateDisableddates !== undefined) {
                        picker.options.disabledDates = eData.dateDisableddates;
                    }
                    if (eData.dateEnableddates !== undefined) {
                        picker.options.enabledDates = eData.dateEnableddates;
                    }
                    if (eData.dateIcons !== undefined) {
                        picker.options.icons = eData.dateIcons;
                    }
                    if (eData.dateUsestrict !== undefined) {
                        picker.options.useStrict = eData.dateUsestrict;
                    }
                    if (eData.dateDirection !== undefined) {
                        picker.options.direction = eData.dateDirection;
                    }
                    if (eData.dateSidebyside !== undefined) {
                        picker.options.sideBySide = eData.dateSidebyside;
                    }
                    if (eData.dateDaysofweekdisabled !== undefined) {
                        picker.options.daysOfWeekDisabled = eData.dateDaysofweekdisabled;
                    }
                },

                place = function () {
                    var position = "absolute",
                        offset = picker.component ? picker.component.offset() : picker.element.offset(),
                        $window = $(window),
                        placePosition;

                    picker.width = picker.component ? picker.component.outerWidth() : picker.element.outerWidth();
                    offset.top = offset.top + picker.element.outerHeight() + 10;

                    if (picker.options.direction === "up") {
                        placePosition = "top";
                    } else if (picker.options.direction === "bottom") {
                        placePosition = "bottom";
                    } else if (picker.options.direction === "auto") {
                        if (offset.top + picker.widget.height() > $window.height() + $window.scrollTop() && picker.widget.height() + picker.element.outerHeight() < offset.top) {
                            placePosition = "top";
                        } else {
                            placePosition = "bottom";
                        }
                    }
                    if (placePosition === "top") {
                        offset.bottom = $window.height() - offset.top + picker.element.outerHeight() + 3;
                        picker.widget.addClass("top").removeClass("bottom");
                    } else {
                        offset.top += 1;
                        picker.widget.addClass("bottom").removeClass("top");
                    }

                    if (picker.options.width !== undefined) {
                        picker.widget.width(picker.options.width);
                    }

                    if (picker.options.orientation === "left") {
                        picker.widget.addClass("left-oriented");
                        offset.left = offset.left - picker.widget.width() + 20;
                    }

                    if (isInFixed()) {
                        position = "fixed";
                        offset.top -= $window.scrollTop();
                        offset.left -= $window.scrollLeft();
                    }

                    if ($window.width() < offset.left + picker.widget.outerWidth()) {
                        offset.right = $window.width() - offset.left - picker.width;
                        offset.left = "auto";
                        picker.widget.addClass("pull-right");
                    } else {
                        offset.right = "auto";
                        picker.widget.removeClass("pull-right");
                    }

                    if (placePosition === "top") {
                        picker.widget.css({
                            position: position,
                            bottom: offset.bottom,
                            top: "auto",
                            left: offset.left,
                            right: offset.right
                        });
                    } else {
                        picker.widget.css({
                            position: position,
                            top: offset.top,
                            bottom: "auto",
                            left: offset.left,
                            right: offset.right
                        });
                    }
                },

                notifyChange = function (oldDate, eventType) {
                    if (moment(picker.date).isSame(moment(oldDate)) && !errored) {
                        return;
                    }
                    errored = false;
                    picker.element.trigger({
                        type: "dp.change",
                        date: moment(picker.date),
                        oldDate: moment(oldDate)
                    });

                    if (eventType !== "change") {
                        picker.element.change();
                    }
                },

                notifyError = function (date) {
                    errored = true;
                    picker.element.trigger({
                        type: "dp.error",
                        date: moment(date, picker.format, picker.options.useStrict)
                    });
                },

                update = function (newDate) {
                    moment.locale(picker.options.language);
                    var dateStr = newDate;
                    if (!dateStr) {
                        dateStr = getPickerInput().val();
                        if (dateStr) {
                            picker.date = moment(dateStr, picker.format, picker.options.useStrict);
                        }
                        if (!picker.date) {
                            picker.date = moment();
                        }
                    }
                    picker.viewDate = moment(picker.date).startOf("month");
                    fillDate();
                    fillTime();
                },

                fillDow = function () {
                    moment.locale(picker.options.language);
                    var html = $("<tr>"), weekdaysMin = moment.weekdaysMin(), i;
                    if (picker.options.calendarWeeks === true) {
                        html.append("<th class=\"cw\">#</th>");
                    }
                    if (moment().localeData()._week.dow === 0) { // starts on Sunday
                        for (i = 0; i < 7; i++) {
                            html.append("<th class=\"dow\">" + weekdaysMin[i] + "</th>");
                        }
                    } else {
                        for (i = 1; i < 8; i++) {
                            if (i === 7) {
                                html.append("<th class=\"dow\">" + weekdaysMin[0] + "</th>");
                            } else {
                                html.append("<th class=\"dow\">" + weekdaysMin[i] + "</th>");
                            }
                        }
                    }
                    picker.widget.find(".datepicker-days thead").append(html);
                },

                fillMonths = function () {
                    moment.locale(picker.options.language);
                    var html = "", i, monthsShort = moment.monthsShort();
                    for (i = 0; i < 12; i++) {
                        html += "<span class=\"month\">" + monthsShort[i] + "</span>";
                    }
                    picker.widget.find(".datepicker-months td").append(html);
                },

                fillDate = function () {
                    if (!picker.options.pickDate) {
                        return;
                    }
                    moment.locale(picker.options.language);
                    var year = picker.viewDate.year(),
                        month = picker.viewDate.month(),
                        startYear = picker.options.minDate.year(),
                        startMonth = picker.options.minDate.month(),
                        endYear = picker.options.maxDate.year(),
                        endMonth = picker.options.maxDate.month(),
                        currentDate,
                        prevMonth,
                        nextMonth,
                        html = [],
                        row,
                        clsName,
                        i,
                        days,
                        yearCont,
                        currentYear,
                        months = moment.months();

                    picker.widget.find(".datepicker-days").find(".disabled").removeClass("disabled");
                    picker.widget.find(".datepicker-months").find(".disabled").removeClass("disabled");
                    picker.widget.find(".datepicker-years").find(".disabled").removeClass("disabled");

                    picker.widget.find(".datepicker-days th:eq(1)").text(
                        months[month] + " " + year);

                    prevMonth = moment(picker.viewDate, picker.format, picker.options.useStrict).subtract(1, "months");
                    days = prevMonth.daysInMonth();
                    prevMonth.date(days).startOf("week");
                    if ((year === startYear && month <= startMonth) || year < startYear) {
                        picker.widget.find(".datepicker-days th:eq(0)").addClass("disabled");
                    }
                    if ((year === endYear && month >= endMonth) || year > endYear) {
                        picker.widget.find(".datepicker-days th:eq(2)").addClass("disabled");
                    }

                    nextMonth = moment(prevMonth).add(42, "d");
                    while (prevMonth.isBefore(nextMonth)) {
                        if (prevMonth.weekday() === moment().startOf("week").weekday()) {
                            row = $("<tr>");
                            html.push(row);
                            if (picker.options.calendarWeeks === true) {
                                row.append("<td class=\"cw\">" + prevMonth.week() + "</td>");
                            }
                        }
                        clsName = "";
                        if (prevMonth.year() < year || (prevMonth.year() === year && prevMonth.month() < month)) {
                            clsName += " old";
                        } else if (prevMonth.year() > year || (prevMonth.year() === year && prevMonth.month() > month)) {
                            clsName += " new";
                        }
                        if (prevMonth.isSame(moment({ y: picker.date.year(), M: picker.date.month(), d: picker.date.date() }))) {
                            clsName += " active";
                        }
                        if (isInDisableDates(prevMonth, "day") || !isInEnableDates(prevMonth)) {
                            clsName += " disabled";
                        }
                        if (picker.options.showToday === true) {
                            if (prevMonth.isSame(moment(), "day")) {
                                clsName += " today";
                            }
                        }
                        if (picker.options.daysOfWeekDisabled) {
                            for (i = 0; i < picker.options.daysOfWeekDisabled.length; i++) {
                                if (prevMonth.day() === picker.options.daysOfWeekDisabled[i]) {
                                    clsName += " disabled";
                                    break;
                                }
                            }
                        }
                        row.append("<td class=\"day" + clsName + "\">" + prevMonth.date() + "</td>");

                        currentDate = prevMonth.date();
                        prevMonth.add(1, "d");

                        if (currentDate === prevMonth.date()) {
                            prevMonth.add(1, "d");
                        }
                    }
                    picker.widget.find(".datepicker-days tbody").empty().append(html);
                    currentYear = picker.date.year();
                    months = picker.widget.find(".datepicker-months").find("th:eq(1)").text(year).end().find("span").removeClass("active");
                    if (currentYear === year) {
                        months.eq(picker.date.month()).addClass("active");
                    }
                    if (year - 1 < startYear) {
                        picker.widget.find(".datepicker-months th:eq(0)").addClass("disabled");
                    }
                    if (year + 1 > endYear) {
                        picker.widget.find(".datepicker-months th:eq(2)").addClass("disabled");
                    }
                    for (i = 0; i < 12; i++) {
                        if ((year === startYear && startMonth > i) || (year < startYear)) {
                            $(months[i]).addClass("disabled");
                        } else if ((year === endYear && endMonth < i) || (year > endYear)) {
                            $(months[i]).addClass("disabled");
                        }
                    }

                    html = "";
                    year = parseInt(year / 10, 10) * 10;
                    yearCont = picker.widget.find(".datepicker-years").find(
                        "th:eq(1)").text(year + "-" + (year + 9)).parents("table").find("td");
                    picker.widget.find(".datepicker-years").find("th").removeClass("disabled");
                    if (startYear > year) {
                        picker.widget.find(".datepicker-years").find("th:eq(0)").addClass("disabled");
                    }
                    if (endYear < year + 9) {
                        picker.widget.find(".datepicker-years").find("th:eq(2)").addClass("disabled");
                    }
                    year -= 1;
                    for (i = -1; i < 11; i++) {
                        html += "<span class=\"year" + (i === -1 || i === 10 ? " old" : "") + (currentYear === year ? " active" : "") + ((year < startYear || year > endYear) ? " disabled" : "") + "\">" + year + "</span>";
                        year += 1;
                    }
                    yearCont.html(html);
                },

                fillHours = function () {
                    moment.locale(picker.options.language);
                    var table = picker.widget.find(".timepicker .timepicker-hours table"), html = "", current, i, j;
                    table.parent().hide();
                    if (picker.use24hours) {
                        current = 0;
                        for (i = 0; i < 6; i += 1) {
                            html += "<tr>";
                            for (j = 0; j < 4; j += 1) {
                                html += "<td class=\"hour\">" + padLeft(current.toString()) + "</td>";
                                current++;
                            }
                            html += "</tr>";
                        }
                    } else {
                        current = 1;
                        for (i = 0; i < 3; i += 1) {
                            html += "<tr>";
                            for (j = 0; j < 4; j += 1) {
                                html += "<td class=\"hour\">" + padLeft(current.toString()) + "</td>";
                                current++;
                            }
                            html += "</tr>";
                        }
                    }
                    table.html(html);
                },

                fillMinutes = function () {
                    var table = picker.widget.find(".timepicker .timepicker-minutes table"), html = "", current = 0, i, j, step = picker.options.minuteStepping;
                    table.parent().hide();
                    if (step === 1) {
                        step = 5;
                    }
                    for (i = 0; i < Math.ceil(60 / step / 4) ; i++) {
                        html += "<tr>";
                        for (j = 0; j < 4; j += 1) {
                            if (current < 60) {
                                html += "<td class=\"minute\">" + padLeft(current.toString()) + "</td>";
                                current += step;
                            } else {
                                html += "<td></td>";
                            }
                        }
                        html += "</tr>";
                    }
                    table.html(html);
                },

                fillSeconds = function () {
                    var table = picker.widget.find(".timepicker .timepicker-seconds table"), html = "", current = 0, i, j;
                    table.parent().hide();
                    for (i = 0; i < 3; i++) {
                        html += "<tr>";
                        for (j = 0; j < 4; j += 1) {
                            html += "<td class=\"second\">" + padLeft(current.toString()) + "</td>";
                            current += 5;
                        }
                        html += "</tr>";
                    }
                    table.html(html);
                },

                fillTime = function () {
                    if (!picker.date) {
                        return;
                    }
                    var timeComponents = picker.widget.find(".timepicker span[data-time-component]"),
                        hour = picker.date.hours(),
                        period = picker.date.format("A");
                    if (!picker.use24hours) {
                        if (hour === 0) {
                            hour = 12;
                        } else if (hour !== 12) {
                            hour = hour % 12;
                        }
                        picker.widget.find(".timepicker [data-action=togglePeriod]").text(period);
                    }
                    timeComponents.filter("[data-time-component=hours]").text(padLeft(hour));
                    timeComponents.filter("[data-time-component=minutes]").text(padLeft(picker.date.minutes()));
                    timeComponents.filter("[data-time-component=seconds]").text(padLeft(picker.date.second()));
                },

                click = function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    picker.unset = false;
                    var target = $(e.target).closest("span, td, th"), month, year, step, day, oldDate = moment(picker.date);
                    if (target.length === 1) {
                        if (!target.is(".disabled")) {
                            switch (target[0].nodeName.toLowerCase()) {
                                case "th":
                                    switch (target[0].className) {
                                        case "picker-switch":
                                            showMode(1);
                                            break;
                                        case "prev":
                                        case "next":
                                            step = dpGlobal.modes[picker.viewMode].navStep;
                                            if (target[0].className === "prev") {
                                                step = step * -1;
                                            }
                                            picker.viewDate.add(step, dpGlobal.modes[picker.viewMode].navFnc);
                                            fillDate();
                                            break;
                                    }
                                    break;
                                case "span":
                                    if (target.is(".month")) {
                                        month = target.parent().find("span").index(target);
                                        picker.viewDate.month(month);
                                    } else {
                                        year = parseInt(target.text(), 10) || 0;
                                        picker.viewDate.year(year);
                                    }
                                    if (picker.viewMode === picker.minViewMode) {
                                        picker.date = moment({
                                            y: picker.viewDate.year(),
                                            M: picker.viewDate.month(),
                                            d: picker.viewDate.date(),
                                            h: picker.date.hours(),
                                            m: picker.date.minutes(),
                                            s: picker.date.seconds()
                                        });
                                        set();
                                        notifyChange(oldDate, e.type);
                                    }
                                    showMode(-1);
                                    fillDate();
                                    break;
                                case "td":
                                    if (target.is(".day")) {
                                        day = parseInt(target.text(), 10) || 1;
                                        month = picker.viewDate.month();
                                        year = picker.viewDate.year();
                                        if (target.is(".old")) {
                                            if (month === 0) {
                                                month = 11;
                                                year -= 1;
                                            } else {
                                                month -= 1;
                                            }
                                        } else if (target.is(".new")) {
                                            if (month === 11) {
                                                month = 0;
                                                year += 1;
                                            } else {
                                                month += 1;
                                            }
                                        }
                                        picker.date = moment({
                                            y: year,
                                            M: month,
                                            d: day,
                                            h: picker.date.hours(),
                                            m: picker.date.minutes(),
                                            s: picker.date.seconds()
                                        }
                                        );
                                        picker.viewDate = moment({
                                            y: year,
                                            M: month,
                                            d: Math.min(28, day)
                                        });
                                        fillDate();
                                        set();
                                        notifyChange(oldDate, e.type);
                                    }
                                    break;
                            }
                        }
                    }
                },

                actions = {
                    incrementHours: function () {
                        checkDate("add", "hours", 1);
                    },

                    incrementMinutes: function () {
                        checkDate("add", "minutes", picker.options.minuteStepping);
                    },

                    incrementSeconds: function () {
                        checkDate("add", "seconds", 1);
                    },

                    decrementHours: function () {
                        checkDate("subtract", "hours", 1);
                    },

                    decrementMinutes: function () {
                        checkDate("subtract", "minutes", picker.options.minuteStepping);
                    },

                    decrementSeconds: function () {
                        checkDate("subtract", "seconds", 1);
                    },

                    togglePeriod: function () {
                        var hour = picker.date.hours();
                        if (hour >= 12) {
                            hour -= 12;
                        } else {
                            hour += 12;
                        }
                        picker.date.hours(hour);
                    },

                    showPicker: function () {
                        picker.widget.find(".timepicker > div:not(.timepicker-picker)").hide();
                        picker.widget.find(".timepicker .timepicker-picker").show();
                    },

                    showHours: function () {
                        picker.widget.find(".timepicker .timepicker-picker").hide();
                        picker.widget.find(".timepicker .timepicker-hours").show();
                    },

                    showMinutes: function () {
                        picker.widget.find(".timepicker .timepicker-picker").hide();
                        picker.widget.find(".timepicker .timepicker-minutes").show();
                    },

                    showSeconds: function () {
                        picker.widget.find(".timepicker .timepicker-picker").hide();
                        picker.widget.find(".timepicker .timepicker-seconds").show();
                    },

                    selectHour: function (e) {
                        var hour = parseInt($(e.target).text(), 10);
                        if (!picker.use24hours) {
                            if (picker.date.hours() >= 12) {
                                if (hour !== 12) {
                                    hour += 12;
                                }
                            } else {
                                if (hour === 12) {
                                    hour = 0;
                                }
                            }
                        }
                        picker.date.hours(hour);
                        actions.showPicker.call(picker);
                    },

                    selectMinute: function (e) {
                        picker.date.minutes(parseInt($(e.target).text(), 10));
                        actions.showPicker.call(picker);
                    },

                    selectSecond: function (e) {
                        picker.date.seconds(parseInt($(e.target).text(), 10));
                        actions.showPicker.call(picker);
                    }
                },

                doAction = function (e) {
                    var oldDate = moment(picker.date),
                        action = $(e.currentTarget).data("action"),
                        rv = actions[action].apply(picker, arguments);
                    stopEvent(e);
                    if (!picker.date) {
                        picker.date = moment({ y: 1970 });
                    }
                    set();
                    fillTime();
                    notifyChange(oldDate, e.type);
                    return rv;
                },

                stopEvent = function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                },

                keydown = function (e) {
                    if (e.keyCode === 27) { // allow escape to hide picker
                        picker.hide();
                    }
                },

                change = function (e) {
                    moment.locale(picker.options.language);
                    var input = $(e.target), oldDate = moment(picker.date), newDate = moment(input.val(), picker.format, picker.options.useStrict);
                    if (newDate.isValid() && !isInDisableDates(newDate) && isInEnableDates(newDate)) {
                        update();
                        picker.setValue(newDate);
                        notifyChange(oldDate, e.type);
                        set();
                    } else {
                        picker.viewDate = oldDate;
                        picker.unset = true;
                        notifyChange(oldDate, e.type);
                        notifyError(newDate);
                    }
                },

                showMode = function (dir) {
                    if (dir) {
                        picker.viewMode = Math.max(picker.minViewMode, Math.min(2, picker.viewMode + dir));
                    }
                    picker.widget.find(".datepicker > div").hide().filter(".datepicker-" + dpGlobal.modes[picker.viewMode].clsName).show();
                },

                attachDatePickerEvents = function () {
                    var $this, $parent, expanded, closed, collapseData;
                    picker.widget.on("click", ".datepicker *", $.proxy(click, this)); // this handles date picker clicks
                    picker.widget.on("click", "[data-action]", $.proxy(doAction, this)); // this handles time picker clicks
                    picker.widget.on("mousedown", $.proxy(stopEvent, this));
                    picker.element.on("keydown", $.proxy(keydown, this));
                    if (picker.options.pickDate && picker.options.pickTime) {
                        picker.widget.on("click.togglePicker", ".accordion-toggle", function (e) {
                            e.stopPropagation();
                            $this = $(this);
                            $parent = $this.closest("ul");
                            expanded = $parent.find(".in");
                            closed = $parent.find(".collapse:not(.in)");

                            if (expanded && expanded.length) {
                                collapseData = expanded.data("collapse");
                                if (collapseData && collapseData.transitioning) {
                                    return;
                                }
                                expanded.collapse("hide");
                                closed.collapse("show");
                                $this.find("span").toggleClass(picker.options.icons.time + " " + picker.options.icons.date);
                                if (picker.component) {
                                    picker.component.find("span").toggleClass(picker.options.icons.time + " " + picker.options.icons.date);
                                }
                            }
                        });
                    }
                    if (picker.isInput) {
                        picker.element.on({
                            'click': $.proxy(picker.show, this),
                            'focus': $.proxy(picker.show, this),
                            'change': $.proxy(change, this),
                            'blur': $.proxy(picker.hide, this)
                        });
                    } else {
                        picker.element.on({
                            'change': $.proxy(change, this)
                        }, "input");
                        if (picker.component) {
                            picker.component.on("click", $.proxy(picker.show, this));
                            picker.component.on("mousedown", $.proxy(stopEvent, this));
                        } else {
                            picker.element.on("click", $.proxy(picker.show, this));
                        }
                    }
                },

                attachDatePickerGlobalEvents = function () {
                    $(window).on(
                        "resize.datetimepicker" + picker.id, $.proxy(place, this));
                    if (!picker.isInput) {
                        $(document).on(
                            "mousedown.datetimepicker" + picker.id, $.proxy(picker.hide, this));
                    }
                },

                detachDatePickerEvents = function () {
                    picker.widget.off("click", ".datepicker *", picker.click);
                    picker.widget.off("click", "[data-action]");
                    picker.widget.off("mousedown", picker.stopEvent);
                    if (picker.options.pickDate && picker.options.pickTime) {
                        picker.widget.off("click.togglePicker");
                    }
                    if (picker.isInput) {
                        picker.element.off({
                            'focus': picker.show,
                            'change': change,
                            'click': picker.show,
                            'blur': picker.hide
                        });
                    } else {
                        picker.element.off({
                            'change': change
                        }, "input");
                        if (picker.component) {
                            picker.component.off("click", picker.show);
                            picker.component.off("mousedown", picker.stopEvent);
                        } else {
                            picker.element.off("click", picker.show);
                        }
                    }
                },

                detachDatePickerGlobalEvents = function () {
                    $(window).off("resize.datetimepicker" + picker.id);
                    if (!picker.isInput) {
                        $(document).off("mousedown.datetimepicker" + picker.id);
                    }
                },

                isInFixed = function () {
                    if (picker.element) {
                        var parents = picker.element.parents(), inFixed = false, i;
                        for (i = 0; i < parents.length; i++) {
                            if ($(parents[i]).css("position") === "fixed") {
                                inFixed = true;
                                break;
                            }
                        }
                        return inFixed;
                    } else {
                        return false;
                    }
                },

                set = function () {
                    moment.locale(picker.options.language);
                    var formatted = "";
                    if (!picker.unset) {
                        formatted = moment(picker.date).format(picker.format);
                    }
                    getPickerInput().val(formatted);
                    picker.element.data("date", formatted);
                    if (!picker.options.pickTime) {
                        picker.hide();
                    }
                },

                checkDate = function (direction, unit, amount) {
                    moment.locale(picker.options.language);
                    var newDate;
                    if (direction === "add") {
                        newDate = moment(picker.date);
                        if (newDate.hours() === 23) {
                            newDate.add(amount, unit);
                        }
                        newDate.add(amount, unit);
                    } else {
                        newDate = moment(picker.date).subtract(amount, unit);
                    }
                    if (isInDisableDates(moment(newDate.subtract(amount, unit))) || isInDisableDates(newDate)) {
                        notifyError(newDate.format(picker.format));
                        return;
                    }

                    if (direction === "add") {
                        picker.date.add(amount, unit);
                    } else {
                        picker.date.subtract(amount, unit);
                    }
                    picker.unset = false;
                },

                isInDisableDates = function (date, timeUnit) {
                    moment.locale(picker.options.language);
                    var maxDate = moment(picker.options.maxDate, picker.format, picker.options.useStrict),
                        minDate = moment(picker.options.minDate, picker.format, picker.options.useStrict);

                    if (timeUnit) {
                        maxDate = maxDate.endOf(timeUnit);
                        minDate = minDate.startOf(timeUnit);
                    }

                    if (date.isAfter(maxDate) || date.isBefore(minDate)) {
                        return true;
                    }
                    if (picker.options.disabledDates === false) {
                        return false;
                    }
                    return picker.options.disabledDates[date.format("YYYY-MM-DD")] === true;
                },
                isInEnableDates = function (date) {
                    moment.locale(picker.options.language);
                    if (picker.options.enabledDates === false) {
                        return true;
                    }
                    return picker.options.enabledDates[date.format("YYYY-MM-DD")] === true;
                },

                indexGivenDates = function (givenDatesArray) {
                    // Store given enabledDates and disabledDates as keys.
                    // This way we can check their existence in O(1) time instead of looping through whole array.
                    // (for example: picker.options.enabledDates['2014-02-27'] === true)
                    var givenDatesIndexed = {}, givenDatesCount = 0, i;
                    for (i = 0; i < givenDatesArray.length; i++) {
                        if (moment.isMoment(givenDatesArray[i]) || givenDatesArray[i] instanceof Date) {
                            dDate = moment(givenDatesArray[i]);
                        } else {
                            dDate = moment(givenDatesArray[i], picker.format, picker.options.useStrict);
                        }
                        if (dDate.isValid()) {
                            givenDatesIndexed[dDate.format("YYYY-MM-DD")] = true;
                            givenDatesCount++;
                        }
                    }
                    if (givenDatesCount > 0) {
                        return givenDatesIndexed;
                    }
                    return false;
                },

                padLeft = function (string) {
                    string = string.toString();
                    if (string.length >= 2) {
                        return string;
                    }
                    return "0" + string;
                },

                getTemplate = function () {
                    var
                        headTemplate =
                            "<thead>" +
                                "<tr>" +
                                "<th class=\"prev\">&lsaquo;</th><th colspan=\"" + (picker.options.calendarWeeks ? "6" : "5") + "\" class=\"picker-switch\"></th><th class=\"next\">&rsaquo;</th>" +
                                "</tr>" +
                                "</thead>",
                        contTemplate =
                            "<tbody><tr><td colspan=\"" + (picker.options.calendarWeeks ? "8" : "7") + "\"></td></tr></tbody>",
                        template = "<div class=\"datepicker-days\">" +
                            "<table class=\"table-condensed\">" + headTemplate + "<tbody></tbody></table>" +
                            "</div>" +
                            "<div class=\"datepicker-months\">" +
                            "<table class=\"table-condensed\">" + headTemplate + contTemplate + "</table>" +
                            "</div>" +
                            "<div class=\"datepicker-years\">" +
                            "<table class=\"table-condensed\">" + headTemplate + contTemplate + "</table>" +
                            "</div>",
                        ret = "";
                    if (picker.options.pickDate && picker.options.pickTime) {
                        ret = "<div class=\"bootstrap-datetimepicker-widget" + (picker.options.sideBySide ? " timepicker-sbs" : "") + (picker.use24hours ? " usetwentyfour" : "") + " dropdown-menu\" style=\"z-index:9999 !important;\">";
                        if (picker.options.sideBySide) {
                            ret += "<div class=\"row\">" +
                                "<div class=\"col-sm-6 datepicker\">" + template + "</div>" +
                                "<div class=\"col-sm-6 timepicker\">" + tpGlobal.getTemplate() + "</div>" +
                                "</div>";
                        } else {
                            ret += "<ul class=\"list-unstyled\">" +
                                "<li" + (picker.options.collapse ? " class=\"collapse in\"" : "") + ">" +
                                "<div class=\"datepicker\">" + template + "</div>" +
                                "</li>" +
                                "<li class=\"picker-switch accordion-toggle\"><a class=\"btn\" style=\"width:100%\"><span class=\"" + picker.options.icons.time + "\"></span></a></li>" +
                                "<li" + (picker.options.collapse ? " class=\"collapse\"" : "") + ">" +
                                "<div class=\"timepicker\">" + tpGlobal.getTemplate() + "</div>" +
                                "</li>" +
                                "</ul>";
                        }
                        ret += "</div>";
                        return ret;
                    }
                    if (picker.options.pickTime) {
                        return (
                            "<div class=\"bootstrap-datetimepicker-widget dropdown-menu\">" +
                                "<div class=\"timepicker\">" + tpGlobal.getTemplate() + "</div>" +
                                "</div>"
                        );
                    }
                    return (
                        "<div class=\"bootstrap-datetimepicker-widget dropdown-menu\">" +
                            "<div class=\"datepicker\">" + template + "</div>" +
                            "</div>"
                    );
                },

                dpGlobal = {
                    modes: [
                        {
                            clsName: "days",
                            navFnc: "month",
                            navStep: 1
                        },
                        {
                            clsName: "months",
                            navFnc: "year",
                            navStep: 1
                        },
                        {
                            clsName: "years",
                            navFnc: "year",
                            navStep: 10
                        }
                    ]
                },

                tpGlobal = {
                    hourTemplate: "<span data-action=\"showHours\"   data-time-component=\"hours\"   class=\"timepicker-hour\"></span>",
                    minuteTemplate: "<span data-action=\"showMinutes\" data-time-component=\"minutes\" class=\"timepicker-minute\"></span>",
                    secondTemplate: "<span data-action=\"showSeconds\"  data-time-component=\"seconds\" class=\"timepicker-second\"></span>"
                };

            tpGlobal.getTemplate = function () {
                return (
                    "<div class=\"timepicker-picker\">" +
                        "<table class=\"table-condensed\">" +
                        "<tr>" +
                        "<td><a href=\"#\" class=\"btn\" data-action=\"incrementHours\"><span class=\"" + picker.options.icons.up + "\"></span></a></td>" +
                        "<td class=\"separator\"></td>" +
                        "<td>" + (picker.options.useMinutes ? "<a href=\"#\" class=\"btn\" data-action=\"incrementMinutes\"><span class=\"" + picker.options.icons.up + "\"></span></a>" : "") + "</td>" +
                        (picker.options.useSeconds ?
                            "<td class=\"separator\"></td><td><a href=\"#\" class=\"btn\" data-action=\"incrementSeconds\"><span class=\"" + picker.options.icons.up + "\"></span></a></td>" : "") +
                        (picker.use24hours ? "" : "<td class=\"separator\"></td>") +
                        "</tr>" +
                        "<tr>" +
                        "<td>" + tpGlobal.hourTemplate + "</td> " +
                        "<td class=\"separator\">:</td>" +
                        "<td>" + (picker.options.useMinutes ? tpGlobal.minuteTemplate : "<span class=\"timepicker-minute\">00</span>") + "</td> " +
                        (picker.options.useSeconds ?
                            "<td class=\"separator\">:</td><td>" + tpGlobal.secondTemplate + "</td>" : "") +
                        (picker.use24hours ? "" : "<td class=\"separator\"></td>" +
                            "<td><button type=\"button\" class=\"btn btn-primary\" data-action=\"togglePeriod\"></button></td>") +
                        "</tr>" +
                        "<tr>" +
                        "<td><a href=\"#\" class=\"btn\" data-action=\"decrementHours\"><span class=\"" + picker.options.icons.down + "\"></span></a></td>" +
                        "<td class=\"separator\"></td>" +
                        "<td>" + (picker.options.useMinutes ? "<a href=\"#\" class=\"btn\" data-action=\"decrementMinutes\"><span class=\"" + picker.options.icons.down + "\"></span></a>" : "") + "</td>" +
                        (picker.options.useSeconds ?
                            "<td class=\"separator\"></td><td><a href=\"#\" class=\"btn\" data-action=\"decrementSeconds\"><span class=\"" + picker.options.icons.down + "\"></span></a></td>" : "") +
                        (picker.use24hours ? "" : "<td class=\"separator\"></td>") +
                        "</tr>" +
                        "</table>" +
                        "</div>" +
                        "<div class=\"timepicker-hours\" data-action=\"selectHour\">" +
                        "<table class=\"table-condensed\"></table>" +
                        "</div>" +
                        "<div class=\"timepicker-minutes\" data-action=\"selectMinute\">" +
                        "<table class=\"table-condensed\"></table>" +
                        "</div>" +
                        (picker.options.useSeconds ?
                            "<div class=\"timepicker-seconds\" data-action=\"selectSecond\"><table class=\"table-condensed\"></table></div>" : "")
                );
            };

            picker.destroy = function () {
                detachDatePickerEvents();
                detachDatePickerGlobalEvents();
                picker.widget.remove();
                picker.element.removeData("DateTimePicker");
                if (picker.component) {
                    picker.component.removeData("DateTimePicker");
                }
            };

            picker.show = function (e) {
                if (getPickerInput().prop("disabled")) {
                    return;
                }
                if (picker.options.useCurrent) {
                    if (getPickerInput().val() === "") {
                        if (picker.options.minuteStepping !== 1) {
                            var mDate = moment(),
                                rInterval = picker.options.minuteStepping;
                            mDate.minutes((Math.round(mDate.minutes() / rInterval) * rInterval) % 60).seconds(0);
                            picker.setValue(mDate.format(picker.format));
                        } else {
                            picker.setValue(moment().format(picker.format));
                        }
                        notifyChange("", e.type);
                    }
                }
                // if this is a click event on the input field and picker is already open don't hide it
                if (e && e.type === "click" && picker.isInput && picker.widget.hasClass("picker-open")) {
                    return;
                }
                if (picker.widget.hasClass("picker-open")) {
                    picker.widget.hide();
                    picker.widget.removeClass("picker-open");
                } else {
                    picker.widget.show();
                    picker.widget.addClass("picker-open");
                }
                picker.height = picker.component ? picker.component.outerHeight() : picker.element.outerHeight();
                place();
                picker.element.trigger({
                    type: "dp.show",
                    date: moment(picker.date)
                });
                attachDatePickerGlobalEvents();
                if (e) {
                    stopEvent(e);
                }
            };

            picker.disable = function () {
                var input = getPickerInput();
                if (input.prop("disabled")) {
                    return;
                }
                input.prop("disabled", true);
                detachDatePickerEvents();
            };

            picker.enable = function () {
                var input = getPickerInput();
                if (!input.prop("disabled")) {
                    return;
                }
                input.prop("disabled", false);
                attachDatePickerEvents();
            };

            picker.hide = function () {
                // Ignore event if in the middle of a picker transition
                var collapse = picker.widget.find(".collapse"), i, collapseData;
                for (i = 0; i < collapse.length; i++) {
                    collapseData = collapse.eq(i).data("collapse");
                    if (collapseData && collapseData.transitioning) {
                        return;
                    }
                }
                picker.widget.hide();
                picker.widget.removeClass("picker-open");
                picker.viewMode = picker.startViewMode;
                showMode();
                picker.element.trigger({
                    type: "dp.hide",
                    date: moment(picker.date)
                });
                detachDatePickerGlobalEvents();
            };

            picker.setValue = function (newDate) {
                moment.locale(picker.options.language);
                if (!newDate) {
                    picker.unset = true;
                    set();
                } else {
                    picker.unset = false;
                }
                if (!moment.isMoment(newDate)) {
                    newDate = (newDate instanceof Date) ? moment(newDate) : moment(newDate, picker.format, picker.options.useStrict);
                } else {
                    newDate = newDate.locale(picker.options.language);
                }
                if (newDate.isValid()) {
                    picker.date = newDate;
                    set();
                    picker.viewDate = moment({ y: picker.date.year(), M: picker.date.month() });
                    fillDate();
                    fillTime();
                } else {
                    notifyError(newDate);
                }
            };

            picker.getDate = function () {
                if (picker.unset) {
                    return null;
                }
                return moment(picker.date);
            };

            picker.setDate = function (date) {
                var oldDate = moment(picker.date);
                if (!date) {
                    picker.setValue(null);
                } else {
                    picker.setValue(date);
                }
                notifyChange(oldDate, "function");
            };

            picker.setDisabledDates = function (dates) {
                picker.options.disabledDates = indexGivenDates(dates);
                if (picker.viewDate) {
                    update();
                }
            };

            picker.setEnabledDates = function (dates) {
                picker.options.enabledDates = indexGivenDates(dates);
                if (picker.viewDate) {
                    update();
                }
            };

            picker.setMaxDate = function (date) {
                if (date === undefined) {
                    return;
                }
                if (moment.isMoment(date) || date instanceof Date) {
                    picker.options.maxDate = moment(date);
                } else {
                    picker.options.maxDate = moment(date, picker.format, picker.options.useStrict);
                }
                if (picker.viewDate) {
                    update();
                }
            };

            picker.setMinDate = function (date) {
                if (date === undefined) {
                    return;
                }
                if (moment.isMoment(date) || date instanceof Date) {
                    picker.options.minDate = moment(date);
                } else {
                    picker.options.minDate = moment(date, picker.format, picker.options.useStrict);
                }
                if (picker.viewDate) {
                    update();
                }
            };

            init();
        };

    $.fn.datetimepicker = function (options) {
        return this.each(function () {
            var $this = $(this),
                data = $this.data("DateTimePicker");
            if (!data) {
                $this.data("DateTimePicker", new DateTimePicker(this, options));
            }
        });
    };

    $.fn.datetimepicker.defaults = {
        format: false,
        pickDate: true,
        pickTime: true,
        useMinutes: true,
        useSeconds: false,
        useCurrent: true,
        calendarWeeks: false,
        minuteStepping: 1,
        minDate: moment({ y: 1900 }),
        maxDate: moment().add(100, "y"),
        showToday: true,
        collapse: true,
        language: moment.locale(),
        defaultDate: "",
        disabledDates: false,
        enabledDates: false,
        icons: {},
        useStrict: false,
        direction: "auto",
        sideBySide: false,
        daysOfWeekDisabled: [],
        widgetParent: false
    };
}));
///#source 1 1 /JavaScript-Mvc-framework/libs/bootstrap-select.js
/*
 * Bootstrap-select v1.9.3 (http://silviomoreto.github.io/bootstrap-select)
 *
 * Copyright 2013-2015 bootstrap-select
 * Licensed under MIT (https://github.com/silviomoreto/bootstrap-select/blob/master/LICENSE)
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module unless amdModuleId is set
        define(["jquery"], function (a0) {
            return (factory(a0));
        });
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(require("jquery"));
    } else {
        factory(jQuery);
    }
}(this, function (jQuery) {

    (function ($) {
        'use strict';

        //<editor-fold desc="Shims">
        if (!String.prototype.includes) {
            (function () {
                'use strict'; // needed to support `apply`/`call` with `undefined`/`null`
                var toString = {}.toString;
                var defineProperty = (function () {
                    // IE 8 only supports `Object.defineProperty` on DOM elements
                    try {
                        var object = {};
                        var $defineProperty = Object.defineProperty;
                        var result = $defineProperty(object, object, object) && $defineProperty;
                    } catch (error) {
                    }
                    return result;
                }());
                var indexOf = ''.indexOf;
                var includes = function (search) {
                    if (this == null) {
                        throw new TypeError();
                    }
                    var string = String(this);
                    if (search && toString.call(search) == '[object RegExp]') {
                        throw new TypeError();
                    }
                    var stringLength = string.length;
                    var searchString = String(search);
                    var searchLength = searchString.length;
                    var position = arguments.length > 1 ? arguments[1] : undefined;
                    // `ToInteger`
                    var pos = position ? Number(position) : 0;
                    if (pos != pos) { // better `isNaN`
                        pos = 0;
                    }
                    var start = Math.min(Math.max(pos, 0), stringLength);
                    // Avoid the `indexOf` call if no match is possible
                    if (searchLength + start > stringLength) {
                        return false;
                    }
                    return indexOf.call(string, searchString, pos) != -1;
                };
                if (defineProperty) {
                    defineProperty(String.prototype, 'includes', {
                        'value': includes,
                        'configurable': true,
                        'writable': true
                    });
                } else {
                    String.prototype.includes = includes;
                }
            }());
        }

        if (!String.prototype.startsWith) {
            (function () {
                'use strict'; // needed to support `apply`/`call` with `undefined`/`null`
                var defineProperty = (function () {
                    // IE 8 only supports `Object.defineProperty` on DOM elements
                    try {
                        var object = {};
                        var $defineProperty = Object.defineProperty;
                        var result = $defineProperty(object, object, object) && $defineProperty;
                    } catch (error) {
                    }
                    return result;
                }());
                var toString = {}.toString;
                var startsWith = function (search) {
                    if (this == null) {
                        throw new TypeError();
                    }
                    var string = String(this);
                    if (search && toString.call(search) == '[object RegExp]') {
                        throw new TypeError();
                    }
                    var stringLength = string.length;
                    var searchString = String(search);
                    var searchLength = searchString.length;
                    var position = arguments.length > 1 ? arguments[1] : undefined;
                    // `ToInteger`
                    var pos = position ? Number(position) : 0;
                    if (pos != pos) { // better `isNaN`
                        pos = 0;
                    }
                    var start = Math.min(Math.max(pos, 0), stringLength);
                    // Avoid the `indexOf` call if no match is possible
                    if (searchLength + start > stringLength) {
                        return false;
                    }
                    var index = -1;
                    while (++index < searchLength) {
                        if (string.charCodeAt(start + index) != searchString.charCodeAt(index)) {
                            return false;
                        }
                    }
                    return true;
                };
                if (defineProperty) {
                    defineProperty(String.prototype, 'startsWith', {
                        'value': startsWith,
                        'configurable': true,
                        'writable': true
                    });
                } else {
                    String.prototype.startsWith = startsWith;
                }
            }());
        }

        if (!Object.keys) {
            Object.keys = function (
              o, // object
              k, // key
              r  // result array
              ) {
                // initialize object and result
                r = [];
                // iterate over object keys
                for (k in o)
                    // fill result array with non-prototypical keys
                    r.hasOwnProperty.call(o, k) && r.push(k);
                // return result
                return r;
            };
        }

        $.fn.triggerNative = function (eventName) {
            var el = this[0],
                event;

            if (el.dispatchEvent) {
                if (typeof Event === 'function') {
                    // For modern browsers
                    event = new Event(eventName, {
                        bubbles: true
                    });
                } else {
                    // For IE since it doesn't support Event constructor
                    event = document.createEvent('Event');
                    event.initEvent(eventName, true, false);
                }

                el.dispatchEvent(event);
            } else {
                if (el.fireEvent) {
                    event = document.createEventObject();
                    event.eventType = eventName;
                    el.fireEvent('on' + eventName, event);
                }

                this.trigger(eventName);
            }
        };
        //</editor-fold>

        // Case insensitive contains search
        $.expr[':'].icontains = function (obj, index, meta) {
            var $obj = $(obj);
            var haystack = ($obj.data('tokens') || $obj.text()).toUpperCase();
            return haystack.includes(meta[3].toUpperCase());
        };

        // Case insensitive begins search
        $.expr[':'].ibegins = function (obj, index, meta) {
            var $obj = $(obj);
            var haystack = ($obj.data('tokens') || $obj.text()).toUpperCase();
            return haystack.startsWith(meta[3].toUpperCase());
        };

        // Case and accent insensitive contains search
        $.expr[':'].aicontains = function (obj, index, meta) {
            var $obj = $(obj);
            var haystack = ($obj.data('tokens') || $obj.data('normalizedText') || $obj.text()).toUpperCase();
            return haystack.includes(meta[3].toUpperCase());
        };

        // Case and accent insensitive begins search
        $.expr[':'].aibegins = function (obj, index, meta) {
            var $obj = $(obj);
            var haystack = ($obj.data('tokens') || $obj.data('normalizedText') || $obj.text()).toUpperCase();
            return haystack.startsWith(meta[3].toUpperCase());
        };

        /**
         * Remove all diatrics from the given text.
         * @access private
         * @param {String} text
         * @returns {String}
         */
        function normalizeToBase(text) {
            var rExps = [
              { re: /[\xC0-\xC6]/g, ch: "A" },
              { re: /[\xE0-\xE6]/g, ch: "a" },
              { re: /[\xC8-\xCB]/g, ch: "E" },
              { re: /[\xE8-\xEB]/g, ch: "e" },
              { re: /[\xCC-\xCF]/g, ch: "I" },
              { re: /[\xEC-\xEF]/g, ch: "i" },
              { re: /[\xD2-\xD6]/g, ch: "O" },
              { re: /[\xF2-\xF6]/g, ch: "o" },
              { re: /[\xD9-\xDC]/g, ch: "U" },
              { re: /[\xF9-\xFC]/g, ch: "u" },
              { re: /[\xC7-\xE7]/g, ch: "c" },
              { re: /[\xD1]/g, ch: "N" },
              { re: /[\xF1]/g, ch: "n" }
            ];
            $.each(rExps, function () {
                text = text.replace(this.re, this.ch);
            });
            return text;
        }


        function htmlEscape(html) {
            var escapeMap = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#x27;',
                '`': '&#x60;'
            };
            var source = '(?:' + Object.keys(escapeMap).join('|') + ')',
                testRegexp = new RegExp(source),
                replaceRegexp = new RegExp(source, 'g'),
                string = html == null ? '' : '' + html;
            return testRegexp.test(string) ? string.replace(replaceRegexp, function (match) {
                return escapeMap[match];
            }) : string;
        }

        var Selectpicker = function (element, options, e) {
            if (e) {
                e.stopPropagation();
                e.preventDefault();
            }

            this.$element = $(element);
            this.$newElement = null;
            this.$button = null;
            this.$menu = null;
            this.$lis = null;
            this.options = options;

            // If we have no title yet, try to pull it from the html title attribute (jQuery doesnt' pick it up as it's not a
            // data-attribute)
            if (this.options.title === null) {
                this.options.title = this.$element.attr('title');
            }

            //Expose public methods
            this.val = Selectpicker.prototype.val;
            this.render = Selectpicker.prototype.render;
            this.refresh = Selectpicker.prototype.refresh;
            this.setStyle = Selectpicker.prototype.setStyle;
            this.selectAll = Selectpicker.prototype.selectAll;
            this.deselectAll = Selectpicker.prototype.deselectAll;
            this.destroy = Selectpicker.prototype.destroy;
            this.remove = Selectpicker.prototype.remove;
            this.show = Selectpicker.prototype.show;
            this.hide = Selectpicker.prototype.hide;

            this.init();
        };

        Selectpicker.VERSION = '1.9.3';

        // part of this is duplicated in i18n/defaults-en_US.js. Make sure to update both.
        Selectpicker.DEFAULTS = {
            noneSelectedText: 'Nothing selected',
            noneResultsText: 'No results matched {0}',
            countSelectedText: function (numSelected, numTotal) {
                return (numSelected == 1) ? "{0} item selected" : "{0} items selected";
            },
            maxOptionsText: function (numAll, numGroup) {
                return [
                  (numAll == 1) ? 'Limit reached ({n} item max)' : 'Limit reached ({n} items max)',
                  (numGroup == 1) ? 'Group limit reached ({n} item max)' : 'Group limit reached ({n} items max)'
                ];
            },
            selectAllText: 'Select All',
            deselectAllText: 'Deselect All',
            doneButton: false,
            doneButtonText: 'Close',
            multipleSeparator: ', ',
            styleBase: 'btn',
            style: 'btn-default',
            size: 'auto',
            title: null,
            selectedTextFormat: 'values',
            width: false,
            container: false,
            hideDisabled: false,
            showSubtext: false,
            showIcon: true,
            showContent: true,
            dropupAuto: true,
            header: false,
            liveSearch: false,
            liveSearchPlaceholder: null,
            liveSearchNormalize: false,
            liveSearchStyle: 'contains',
            actionsBox: false,
            iconBase: 'glyphicon',
            tickIcon: 'glyphicon-ok',
            template: {
                caret: '<span class="caret"></span>'
            },
            maxOptions: false,
            mobile: false,
            selectOnTab: false,
            dropdownAlignRight: false
        };

        Selectpicker.prototype = {

            constructor: Selectpicker,

            init: function () {
                var that = this,
                    id = this.$element.attr('id');

                // store originalIndex (key) and newIndex (value) in this.liObj for fast accessibility
                // allows us to do this.$lis.eq(that.liObj[index]) instead of this.$lis.filter('[data-original-index="' + index + '"]')
                this.liObj = {};
                this.multiple = this.$element.prop('multiple');
                this.autofocus = this.$element.prop('autofocus');
                this.$newElement = this.createView();
                this.$element
                  .after(this.$newElement)
                  .appendTo(this.$newElement);
                this.$button = this.$newElement.children('button');
                this.$menu = this.$newElement.children('.dropdown-menu');
                this.$menuInner = this.$menu.children('.inner');
                this.$searchbox = this.$menu.find('input');

                if (this.options.dropdownAlignRight)
                    this.$menu.addClass('dropdown-menu-right');

                if (typeof id !== 'undefined') {
                    this.$button.attr('data-id', id);
                    $('label[for="' + id + '"]').click(function (e) {
                        e.preventDefault();
                        that.$button.focus();
                    });
                }

                this.checkDisabled();
                this.clickListener();
                if (this.options.liveSearch) this.liveSearchListener();
                this.render();
                this.setStyle();
                this.setWidth();
                if (this.options.container) this.selectPosition();
                this.$menu.data('this', this);
                this.$newElement.data('this', this);
                if (this.options.mobile) this.mobile();

                this.$newElement.on({
                    'hide.bs.dropdown': function (e) {
                        that.$element.trigger('hide.bs.select', e);
                    },
                    'hidden.bs.dropdown': function (e) {
                        that.$element.trigger('hidden.bs.select', e);
                    },
                    'show.bs.dropdown': function (e) {
                        that.$element.trigger('show.bs.select', e);
                    },
                    'shown.bs.dropdown': function (e) {
                        that.$element.trigger('shown.bs.select', e);
                    }
                });

                if (that.$element[0].hasAttribute('required')) {
                    this.$element.on('invalid', function () {
                        that.$button
                          .addClass('bs-invalid')
                          .focus();

                        that.$element.on({
                            'focus.bs.select': function () {
                                that.$button.focus();
                                that.$element.off('focus.bs.select');
                            },
                            'shown.bs.select': function () {
                                that.$element
                                  .val(that.$element.val()) // set the value to hide the validation message in Chrome when menu is opened
                                  .off('shown.bs.select');
                            },
                            'rendered.bs.select': function () {
                                // if select is no longer invalid, remove the bs-invalid class
                                if (this.validity.valid) that.$button.removeClass('bs-invalid');
                                that.$element.off('rendered.bs.select');
                            }
                        });

                    });
                }

                setTimeout(function () {
                    that.$element.trigger('loaded.bs.select');
                });
            },

            createDropdown: function () {
                // Options
                // If we are multiple, then add the show-tick class by default
                var multiple = this.multiple ? ' show-tick' : '',
                    inputGroup = this.$element.parent().hasClass('input-group') ? ' input-group-btn' : '',
                    autofocus = this.autofocus ? ' autofocus' : '';
                // Elements
                var header = this.options.header ? '<div class="popover-title"><button type="button" class="close" aria-hidden="true">&times;</button>' + this.options.header + '</div>' : '';
                var searchbox = this.options.liveSearch ?
                '<div class="bs-searchbox">' +
                '<input type="text" class="form-control" autocomplete="off"' +
                (null === this.options.liveSearchPlaceholder ? '' : ' placeholder="' + htmlEscape(this.options.liveSearchPlaceholder) + '"') + '>' +
                '</div>'
                    : '';
                var actionsbox = this.multiple && this.options.actionsBox ?
                '<div class="bs-actionsbox">' +
                '<div class="btn-group btn-group-sm btn-block">' +
                '<button type="button" class="actions-btn bs-select-all btn btn-default">' +
                this.options.selectAllText +
                '</button>' +
                '<button type="button" class="actions-btn bs-deselect-all btn btn-default">' +
                this.options.deselectAllText +
                '</button>' +
                '</div>' +
                '</div>'
                    : '';
                var donebutton = this.multiple && this.options.doneButton ?
                '<div class="bs-donebutton">' +
                '<div class="btn-group btn-block">' +
                '<button type="button" class="btn btn-sm btn-default">' +
                this.options.doneButtonText +
                '</button>' +
                '</div>' +
                '</div>'
                    : '';
                var drop =
                    '<div class="btn-group bootstrap-select' + multiple + inputGroup + '">' +
                    '<button type="button" class="' + this.options.styleBase + ' dropdown-toggle" data-toggle="dropdown"' + autofocus + '>' +
                    '<span class="filter-option pull-left"></span>&nbsp;' +
                    '<span class="bs-caret">' +
                    this.options.template.caret +
                    '</span>' +
                    '</button>' +
                    '<div class="dropdown-menu open">' +
                    header +
                    searchbox +
                    actionsbox +
                    '<ul class="dropdown-menu inner" role="menu">' +
                    '</ul>' +
                    donebutton +
                    '</div>' +
                    '</div>';

                return $(drop);
            },

            createView: function () {
                var $drop = this.createDropdown(),
                    li = this.createLi();

                $drop.find('ul')[0].innerHTML = li;
                return $drop;
            },

            reloadLi: function () {
                //Remove all children.
                this.destroyLi();
                //Re build
                var li = this.createLi();
                this.$menuInner[0].innerHTML = li;
            },

            destroyLi: function () {
                this.$menu.find('li').remove();
            },

            createLi: function () {
                var that = this,
                    _li = [],
                    optID = 0,
                    titleOption = document.createElement('option'),
                    liIndex = -1; // increment liIndex whenever a new <li> element is created to ensure liObj is correct

                // Helper functions
                /**
                 * @param content
                 * @param [index]
                 * @param [classes]
                 * @param [optgroup]
                 * @returns {string}
                 */
                var generateLI = function (content, index, classes, optgroup) {
                    return '<li' +
                        ((typeof classes !== 'undefined' & '' !== classes) ? ' class="' + classes + '"' : '') +
                        ((typeof index !== 'undefined' & null !== index) ? ' data-original-index="' + index + '"' : '') +
                        ((typeof optgroup !== 'undefined' & null !== optgroup) ? 'data-optgroup="' + optgroup + '"' : '') +
                        '>' + content + '</li>';
                };

                /**
                 * @param text
                 * @param [classes]
                 * @param [inline]
                 * @param [tokens]
                 * @returns {string}
                 */
                var generateA = function (text, classes, inline, tokens) {
                    return '<a tabindex="0"' +
                        (typeof classes !== 'undefined' ? ' class="' + classes + '"' : '') +
                        (typeof inline !== 'undefined' ? ' style="' + inline + '"' : '') +
                        (that.options.liveSearchNormalize ? ' data-normalized-text="' + normalizeToBase(htmlEscape(text)) + '"' : '') +
                        (typeof tokens !== 'undefined' || tokens !== null ? ' data-tokens="' + tokens + '"' : '') +
                        '>' + text +
                        '<span class="' + that.options.iconBase + ' ' + that.options.tickIcon + ' check-mark"></span>' +
                        '</a>';
                };

                if (this.options.title && !this.multiple) {
                    // this option doesn't create a new <li> element, but does add a new option, so liIndex is decreased
                    // since liObj is recalculated on every refresh, liIndex needs to be decreased even if the titleOption is already appended
                    liIndex--;

                    if (!this.$element.find('.bs-title-option').length) {
                        // Use native JS to prepend option (faster)
                        var element = this.$element[0];
                        titleOption.className = 'bs-title-option';
                        titleOption.appendChild(document.createTextNode(this.options.title));
                        titleOption.value = '';
                        element.insertBefore(titleOption, element.firstChild);
                        // Check if selected attribute is already set on an option. If not, select the titleOption option.
                        if ($(element.options[element.selectedIndex]).attr('selected') === undefined) titleOption.selected = true;
                    }
                }

                this.$element.find('option').each(function (index) {
                    var $this = $(this);

                    liIndex++;

                    if ($this.hasClass('bs-title-option')) return;

                    // Get the class and text for the option
                    var optionClass = this.className || '',
                        inline = this.style.cssText,
                        text = $this.data('content') ? $this.data('content') : $this.html(),
                        tokens = $this.data('tokens') ? $this.data('tokens') : null,
                        subtext = typeof $this.data('subtext') !== 'undefined' ? '<small class="text-muted">' + $this.data('subtext') + '</small>' : '',
                        icon = typeof $this.data('icon') !== 'undefined' ? '<span class="' + that.options.iconBase + ' ' + $this.data('icon') + '"></span> ' : '',
                        isDisabled = this.disabled || (this.parentNode.tagName === 'OPTGROUP' && this.parentNode.disabled);

                    if (icon !== '' && isDisabled) {
                        icon = '<span>' + icon + '</span>';
                    }

                    if (that.options.hideDisabled && isDisabled) {
                        liIndex--;
                        return;
                    }

                    if (!$this.data('content')) {
                        // Prepend any icon and append any subtext to the main text.
                        text = icon + '<span class="text">' + text + subtext + '</span>';
                    }

                    if (this.parentNode.tagName === 'OPTGROUP' && $this.data('divider') !== true) {
                        var optGroupClass = ' ' + this.parentNode.className || '';

                        if ($this.index() === 0) { // Is it the first option of the optgroup?
                            optID += 1;

                            // Get the opt group label
                            var label = this.parentNode.label,
                                labelSubtext = typeof $this.parent().data('subtext') !== 'undefined' ? '<small class="text-muted">' + $this.parent().data('subtext') + '</small>' : '',
                                labelIcon = $this.parent().data('icon') ? '<span class="' + that.options.iconBase + ' ' + $this.parent().data('icon') + '"></span> ' : '';

                            label = labelIcon + '<span class="text">' + label + labelSubtext + '</span>';

                            if (index !== 0 && _li.length > 0) { // Is it NOT the first option of the select && are there elements in the dropdown?
                                liIndex++;
                                _li.push(generateLI('', null, 'divider', optID + 'div'));
                            }
                            liIndex++;
                            _li.push(generateLI(label, null, 'dropdown-header' + optGroupClass, optID));
                        }
                        _li.push(generateLI(generateA(text, 'opt ' + optionClass + optGroupClass, inline, tokens), index, '', optID));
                    } else if ($this.data('divider') === true) {
                        _li.push(generateLI('', index, 'divider'));
                    } else if ($this.data('hidden') === true) {
                        _li.push(generateLI(generateA(text, optionClass, inline, tokens), index, 'hidden is-hidden'));
                    } else {
                        if (this.previousElementSibling && this.previousElementSibling.tagName === 'OPTGROUP') {
                            liIndex++;
                            _li.push(generateLI('', null, 'divider', optID + 'div'));
                        }
                        _li.push(generateLI(generateA(text, optionClass, inline, tokens), index));
                    }

                    that.liObj[index] = liIndex;
                });

                //If we are not multiple, we don't have a selected item, and we don't have a title, select the first element so something is set in the button
                if (!this.multiple && this.$element.find('option:selected').length === 0 && !this.options.title) {
                    this.$element.find('option').eq(0).prop('selected', true).attr('selected', 'selected');
                }

                return _li.join('');
            },

            findLis: function () {
                if (this.$lis == null) this.$lis = this.$menu.find('li');
                return this.$lis;
            },

            /**
             * @param [updateLi] defaults to true
             */
            render: function (updateLi) {
                var that = this,
                    notDisabled;

                //Update the LI to match the SELECT
                if (updateLi !== false) {
                    this.$element.find('option').each(function (index) {
                        var $lis = that.findLis().eq(that.liObj[index]);

                        that.setDisabled(index, this.disabled || this.parentNode.tagName === 'OPTGROUP' && this.parentNode.disabled, $lis);
                        that.setSelected(index, this.selected, $lis);
                    });
                }

                this.tabIndex();

                var selectedItems = this.$element.find('option').map(function () {
                    if (this.selected) {
                        if (that.options.hideDisabled && (this.disabled || this.parentNode.tagName === 'OPTGROUP' && this.parentNode.disabled)) return;

                        var $this = $(this),
                            icon = $this.data('icon') && that.options.showIcon ? '<i class="' + that.options.iconBase + ' ' + $this.data('icon') + '"></i> ' : '',
                            subtext;

                        if (that.options.showSubtext && $this.data('subtext') && !that.multiple) {
                            subtext = ' <small class="text-muted">' + $this.data('subtext') + '</small>';
                        } else {
                            subtext = '';
                        }
                        if (typeof $this.attr('title') !== 'undefined') {
                            return $this.attr('title');
                        } else if ($this.data('content') && that.options.showContent) {
                            return $this.data('content');
                        } else {
                            return icon + $this.html() + subtext;
                        }
                    }
                }).toArray();

                //Fixes issue in IE10 occurring when no default option is selected and at least one option is disabled
                //Convert all the values into a comma delimited string
                var title = !this.multiple ? selectedItems[0] : selectedItems.join(this.options.multipleSeparator);

                //If this is multi select, and the selectText type is count, the show 1 of 2 selected etc..
                if (this.multiple && this.options.selectedTextFormat.indexOf('count') > -1) {
                    var max = this.options.selectedTextFormat.split('>');
                    if ((max.length > 1 && selectedItems.length > max[1]) || (max.length == 1 && selectedItems.length >= 2)) {
                        notDisabled = this.options.hideDisabled ? ', [disabled]' : '';
                        var totalCount = this.$element.find('option').not('[data-divider="true"], [data-hidden="true"]' + notDisabled).length,
                            tr8nText = (typeof this.options.countSelectedText === 'function') ? this.options.countSelectedText(selectedItems.length, totalCount) : this.options.countSelectedText;
                        title = tr8nText.replace('{0}', selectedItems.length.toString()).replace('{1}', totalCount.toString());
                    }
                }

                if (this.options.title == undefined) {
                    this.options.title = this.$element.attr('title');
                }

                if (this.options.selectedTextFormat == 'static') {
                    title = this.options.title;
                }

                //If we dont have a title, then use the default, or if nothing is set at all, use the not selected text
                if (!title) {
                    title = typeof this.options.title !== 'undefined' ? this.options.title : this.options.noneSelectedText;
                }

                //strip all html-tags and trim the result
                this.$button.attr('title', $.trim(title.replace(/<[^>]*>?/g, '')));
                this.$button.children('.filter-option').html(title);

                this.$element.trigger('rendered.bs.select');
            },

            /**
             * @param [style]
             * @param [status]
             */
            setStyle: function (style, status) {
                if (this.$element.attr('class')) {
                    this.$newElement.addClass(this.$element.attr('class').replace(/selectpicker|mobile-device|bs-select-hidden|validate\[.*\]/gi, ''));
                }

                var buttonClass = style ? style : this.options.style;

                if (status == 'add') {
                    this.$button.addClass(buttonClass);
                } else if (status == 'remove') {
                    this.$button.removeClass(buttonClass);
                } else {
                    this.$button.removeClass(this.options.style);
                    this.$button.addClass(buttonClass);
                }
            },

            liHeight: function (refresh) {
                if (!refresh && (this.options.size === false || this.sizeInfo)) return;

                var newElement = document.createElement('div'),
                    menu = document.createElement('div'),
                    menuInner = document.createElement('ul'),
                    divider = document.createElement('li'),
                    li = document.createElement('li'),
                    a = document.createElement('a'),
                    text = document.createElement('span'),
                    header = this.options.header && this.$menu.find('.popover-title').length > 0 ? this.$menu.find('.popover-title')[0].cloneNode(true) : null,
                    search = this.options.liveSearch ? document.createElement('div') : null,
                    actions = this.options.actionsBox && this.multiple && this.$menu.find('.bs-actionsbox').length > 0 ? this.$menu.find('.bs-actionsbox')[0].cloneNode(true) : null,
                    doneButton = this.options.doneButton && this.multiple && this.$menu.find('.bs-donebutton').length > 0 ? this.$menu.find('.bs-donebutton')[0].cloneNode(true) : null;

                text.className = 'text';
                newElement.className = this.$menu[0].parentNode.className + ' open';
                menu.className = 'dropdown-menu open';
                menuInner.className = 'dropdown-menu inner';
                divider.className = 'divider';

                text.appendChild(document.createTextNode('Inner text'));
                a.appendChild(text);
                li.appendChild(a);
                menuInner.appendChild(li);
                menuInner.appendChild(divider);
                if (header) menu.appendChild(header);
                if (search) {
                    // create a span instead of input as creating an input element is slower
                    var input = document.createElement('span');
                    search.className = 'bs-searchbox';
                    input.className = 'form-control';
                    search.appendChild(input);
                    menu.appendChild(search);
                }
                if (actions) menu.appendChild(actions);
                menu.appendChild(menuInner);
                if (doneButton) menu.appendChild(doneButton);
                newElement.appendChild(menu);

                document.body.appendChild(newElement);

                var liHeight = a.offsetHeight,
                    headerHeight = header ? header.offsetHeight : 0,
                    searchHeight = search ? search.offsetHeight : 0,
                    actionsHeight = actions ? actions.offsetHeight : 0,
                    doneButtonHeight = doneButton ? doneButton.offsetHeight : 0,
                    dividerHeight = $(divider).outerHeight(true),
                    // fall back to jQuery if getComputedStyle is not supported
                    menuStyle = typeof getComputedStyle === 'function' ? getComputedStyle(menu) : false,
                    $menu = menuStyle ? null : $(menu),
                    menuPadding = parseInt(menuStyle ? menuStyle.paddingTop : $menu.css('paddingTop')) +
                                  parseInt(menuStyle ? menuStyle.paddingBottom : $menu.css('paddingBottom')) +
                                  parseInt(menuStyle ? menuStyle.borderTopWidth : $menu.css('borderTopWidth')) +
                                  parseInt(menuStyle ? menuStyle.borderBottomWidth : $menu.css('borderBottomWidth')),
                    menuExtras = menuPadding +
                                  parseInt(menuStyle ? menuStyle.marginTop : $menu.css('marginTop')) +
                                  parseInt(menuStyle ? menuStyle.marginBottom : $menu.css('marginBottom')) + 2;

                document.body.removeChild(newElement);

                this.sizeInfo = {
                    liHeight: liHeight,
                    headerHeight: headerHeight,
                    searchHeight: searchHeight,
                    actionsHeight: actionsHeight,
                    doneButtonHeight: doneButtonHeight,
                    dividerHeight: dividerHeight,
                    menuPadding: menuPadding,
                    menuExtras: menuExtras
                };
            },

            setSize: function () {
                this.findLis();
                this.liHeight();

                if (this.options.header) this.$menu.css('padding-top', 0);
                if (this.options.size === false) return;

                var that = this,
                    $menu = this.$menu,
                    $menuInner = this.$menuInner,
                    $window = $(window),
                    selectHeight = this.$newElement[0].offsetHeight,
                    liHeight = this.sizeInfo['liHeight'],
                    headerHeight = this.sizeInfo['headerHeight'],
                    searchHeight = this.sizeInfo['searchHeight'],
                    actionsHeight = this.sizeInfo['actionsHeight'],
                    doneButtonHeight = this.sizeInfo['doneButtonHeight'],
                    divHeight = this.sizeInfo['dividerHeight'],
                    menuPadding = this.sizeInfo['menuPadding'],
                    menuExtras = this.sizeInfo['menuExtras'],
                    notDisabled = this.options.hideDisabled ? '.disabled' : '',
                    menuHeight,
                    getHeight,
                    selectOffsetTop,
                    selectOffsetBot,
                    posVert = function () {
                        selectOffsetTop = that.$newElement.offset().top - $window.scrollTop();
                        selectOffsetBot = $window.height() - selectOffsetTop - selectHeight;
                    };

                posVert();

                if (this.options.size === 'auto') {
                    var getSize = function () {
                        var minHeight,
                            hasClass = function (className, include) {
                                return function (element) {
                                    if (include) {
                                        return (element.classList ? element.classList.contains(className) : $(element).hasClass(className));
                                    } else {
                                        return !(element.classList ? element.classList.contains(className) : $(element).hasClass(className));
                                    }
                                };
                            },
                            lis = that.$menuInner[0].getElementsByTagName('li'),
                            lisVisible = Array.prototype.filter ? Array.prototype.filter.call(lis, hasClass('hidden', false)) : that.$lis.not('.hidden'),
                            optGroup = Array.prototype.filter ? Array.prototype.filter.call(lisVisible, hasClass('dropdown-header', true)) : lisVisible.filter('.dropdown-header');

                        posVert();
                        menuHeight = selectOffsetBot - menuExtras;

                        if (that.options.container) {
                            if (!$menu.data('height')) $menu.data('height', $menu.height());
                            getHeight = $menu.data('height');
                        } else {
                            getHeight = $menu.height();
                        }

                        if (that.options.dropupAuto) {
                            that.$newElement.toggleClass('dropup', selectOffsetTop > selectOffsetBot && (menuHeight - menuExtras) < getHeight);
                        }
                        if (that.$newElement.hasClass('dropup')) {
                            menuHeight = selectOffsetTop - menuExtras;
                        }

                        if ((lisVisible.length + optGroup.length) > 3) {
                            minHeight = liHeight * 3 + menuExtras - 2;
                        } else {
                            minHeight = 0;
                        }

                        $menu.css({
                            'max-height': menuHeight + 'px',
                            'overflow': 'hidden',
                            'min-height': minHeight + headerHeight + searchHeight + actionsHeight + doneButtonHeight + 'px'
                        });
                        $menuInner.css({
                            'max-height': menuHeight - headerHeight - searchHeight - actionsHeight - doneButtonHeight - menuPadding + 'px',
                            'overflow-y': 'auto',
                            'min-height': Math.max(minHeight - menuPadding, 0) + 'px'
                        });
                    };
                    getSize();
                    this.$searchbox.off('input.getSize propertychange.getSize').on('input.getSize propertychange.getSize', getSize);
                    $window.off('resize.getSize scroll.getSize').on('resize.getSize scroll.getSize', getSize);
                } else if (this.options.size && this.options.size != 'auto' && this.$lis.not(notDisabled).length > this.options.size) {
                    var optIndex = this.$lis.not('.divider').not(notDisabled).children().slice(0, this.options.size).last().parent().index(),
                        divLength = this.$lis.slice(0, optIndex + 1).filter('.divider').length;
                    menuHeight = liHeight * this.options.size + divLength * divHeight + menuPadding;

                    if (that.options.container) {
                        if (!$menu.data('height')) $menu.data('height', $menu.height());
                        getHeight = $menu.data('height');
                    } else {
                        getHeight = $menu.height();
                    }

                    if (that.options.dropupAuto) {
                        //noinspection JSUnusedAssignment
                        this.$newElement.toggleClass('dropup', selectOffsetTop > selectOffsetBot && (menuHeight - menuExtras) < getHeight);
                    }
                    $menu.css({
                        'max-height': menuHeight + headerHeight + searchHeight + actionsHeight + doneButtonHeight + 'px',
                        'overflow': 'hidden',
                        'min-height': ''
                    });
                    $menuInner.css({
                        'max-height': menuHeight - menuPadding + 'px',
                        'overflow-y': 'auto',
                        'min-height': ''
                    });
                }
            },

            setWidth: function () {
                if (this.options.width === 'auto') {
                    this.$menu.css('min-width', '0');

                    // Get correct width if element is hidden
                    var $selectClone = this.$menu.parent().clone().appendTo('body'),
                        $selectClone2 = this.options.container ? this.$newElement.clone().appendTo('body') : $selectClone,
                        ulWidth = $selectClone.children('.dropdown-menu').outerWidth(),
                        btnWidth = $selectClone2.css('width', 'auto').children('button').outerWidth();

                    $selectClone.remove();
                    $selectClone2.remove();

                    // Set width to whatever's larger, button title or longest option
                    this.$newElement.css('width', Math.max(ulWidth, btnWidth) + 'px');
                } else if (this.options.width === 'fit') {
                    // Remove inline min-width so width can be changed from 'auto'
                    this.$menu.css('min-width', '');
                    this.$newElement.css('width', '').addClass('fit-width');
                } else if (this.options.width) {
                    // Remove inline min-width so width can be changed from 'auto'
                    this.$menu.css('min-width', '');
                    this.$newElement.css('width', this.options.width);
                } else {
                    // Remove inline min-width/width so width can be changed
                    this.$menu.css('min-width', '');
                    this.$newElement.css('width', '');
                }
                // Remove fit-width class if width is changed programmatically
                if (this.$newElement.hasClass('fit-width') && this.options.width !== 'fit') {
                    this.$newElement.removeClass('fit-width');
                }
            },

            selectPosition: function () {
                this.$bsContainer = $('<div class="bs-container" />');

                var that = this,
                    pos,
                    actualHeight,
                    getPlacement = function ($element) {
                        that.$bsContainer.addClass($element.attr('class').replace(/form-control|fit-width/gi, '')).toggleClass('dropup', $element.hasClass('dropup'));
                        pos = $element.offset();
                        actualHeight = $element.hasClass('dropup') ? 0 : $element[0].offsetHeight;
                        that.$bsContainer.css({
                            'top': pos.top + actualHeight,
                            'left': pos.left,
                            'width': $element[0].offsetWidth
                        });
                    };

                this.$button.on('click', function () {
                    var $this = $(this);

                    if (that.isDisabled()) {
                        return;
                    }

                    getPlacement(that.$newElement);

                    that.$bsContainer
                      .appendTo(that.options.container)
                      .toggleClass('open', !$this.hasClass('open'))
                      .append(that.$menu);
                });

                $(window).on('resize scroll', function () {
                    getPlacement(that.$newElement);
                });

                this.$element.on('hide.bs.select', function () {
                    that.$menu.data('height', that.$menu.height());
                    that.$bsContainer.detach();
                });
            },

            setSelected: function (index, selected, $lis) {
                if (!$lis) {
                    $lis = this.findLis().eq(this.liObj[index]);
                }

                $lis.toggleClass('selected', selected);
            },

            setDisabled: function (index, disabled, $lis) {
                if (!$lis) {
                    $lis = this.findLis().eq(this.liObj[index]);
                }

                if (disabled) {
                    $lis.addClass('disabled').children('a').attr('href', '#').attr('tabindex', -1);
                } else {
                    $lis.removeClass('disabled').children('a').removeAttr('href').attr('tabindex', 0);
                }
            },

            isDisabled: function () {
                return this.$element[0].disabled;
            },

            checkDisabled: function () {
                var that = this;

                if (this.isDisabled()) {
                    this.$newElement.addClass('disabled');
                    this.$button.addClass('disabled').attr('tabindex', -1);
                } else {
                    if (this.$button.hasClass('disabled')) {
                        this.$newElement.removeClass('disabled');
                        this.$button.removeClass('disabled');
                    }

                    if (this.$button.attr('tabindex') == -1 && !this.$element.data('tabindex')) {
                        this.$button.removeAttr('tabindex');
                    }
                }

                this.$button.click(function () {
                    return !that.isDisabled();
                });
            },

            tabIndex: function () {
                if (this.$element.data('tabindex') !== this.$element.attr('tabindex') &&
                  (this.$element.attr('tabindex') !== -98 && this.$element.attr('tabindex') !== '-98')) {
                    this.$element.data('tabindex', this.$element.attr('tabindex'));
                    this.$button.attr('tabindex', this.$element.data('tabindex'));
                }

                this.$element.attr('tabindex', -98);
            },

            clickListener: function () {
                var that = this,
                    $document = $(document);

                this.$newElement.on('touchstart.dropdown', '.dropdown-menu', function (e) {
                    e.stopPropagation();
                });

                $document.data('spaceSelect', false);

                this.$button.on('keyup', function (e) {
                    if (/(32)/.test(e.keyCode.toString(10)) && $document.data('spaceSelect')) {
                        e.preventDefault();
                        $document.data('spaceSelect', false);
                    }
                });

                this.$button.on('click', function () {
                    that.setSize();
                    that.$element.on('shown.bs.select', function () {
                        if (!that.options.liveSearch && !that.multiple) {
                            that.$menuInner.find('.selected a').focus();
                        } else if (!that.multiple) {
                            var selectedIndex = that.liObj[that.$element[0].selectedIndex];

                            if (typeof selectedIndex !== 'number' || that.options.size === false) return;

                            // scroll to selected option
                            var offset = that.$lis.eq(selectedIndex)[0].offsetTop - that.$menuInner[0].offsetTop;
                            offset = offset - that.$menuInner[0].offsetHeight / 2 + that.sizeInfo.liHeight / 2;
                            that.$menuInner[0].scrollTop = offset;
                        }
                    });
                });

                this.$menuInner.on('click', 'li a', function (e) {
                    var $this = $(this),
                        clickedIndex = $this.parent().data('originalIndex'),
                        prevValue = that.$element.val(),
                        prevIndex = that.$element.prop('selectedIndex');

                    // Don't close on multi choice menu
                    if (that.multiple) {
                        e.stopPropagation();
                    }

                    e.preventDefault();

                    //Don't run if we have been disabled
                    if (!that.isDisabled() && !$this.parent().hasClass('disabled')) {
                        var $options = that.$element.find('option'),
                            $option = $options.eq(clickedIndex),
                            state = $option.prop('selected'),
                            $optgroup = $option.parent('optgroup'),
                            maxOptions = that.options.maxOptions,
                            maxOptionsGrp = $optgroup.data('maxOptions') || false;

                        if (!that.multiple) { // Deselect all others if not multi select box
                            $options.prop('selected', false);
                            $option.prop('selected', true);
                            that.$menuInner.find('.selected').removeClass('selected');
                            that.setSelected(clickedIndex, true);
                        } else { // Toggle the one we have chosen if we are multi select.
                            $option.prop('selected', !state);
                            that.setSelected(clickedIndex, !state);
                            $this.blur();

                            if (maxOptions !== false || maxOptionsGrp !== false) {
                                var maxReached = maxOptions < $options.filter(':selected').length,
                                    maxReachedGrp = maxOptionsGrp < $optgroup.find('option:selected').length;

                                if ((maxOptions && maxReached) || (maxOptionsGrp && maxReachedGrp)) {
                                    if (maxOptions && maxOptions == 1) {
                                        $options.prop('selected', false);
                                        $option.prop('selected', true);
                                        that.$menuInner.find('.selected').removeClass('selected');
                                        that.setSelected(clickedIndex, true);
                                    } else if (maxOptionsGrp && maxOptionsGrp == 1) {
                                        $optgroup.find('option:selected').prop('selected', false);
                                        $option.prop('selected', true);
                                        var optgroupID = $this.parent().data('optgroup');
                                        that.$menuInner.find('[data-optgroup="' + optgroupID + '"]').removeClass('selected');
                                        that.setSelected(clickedIndex, true);
                                    } else {
                                        var maxOptionsArr = (typeof that.options.maxOptionsText === 'function') ?
                                                that.options.maxOptionsText(maxOptions, maxOptionsGrp) : that.options.maxOptionsText,
                                            maxTxt = maxOptionsArr[0].replace('{n}', maxOptions),
                                            maxTxtGrp = maxOptionsArr[1].replace('{n}', maxOptionsGrp),
                                            $notify = $('<div class="notify"></div>');
                                        // If {var} is set in array, replace it
                                        /** @deprecated */
                                        if (maxOptionsArr[2]) {
                                            maxTxt = maxTxt.replace('{var}', maxOptionsArr[2][maxOptions > 1 ? 0 : 1]);
                                            maxTxtGrp = maxTxtGrp.replace('{var}', maxOptionsArr[2][maxOptionsGrp > 1 ? 0 : 1]);
                                        }

                                        $option.prop('selected', false);

                                        that.$menu.append($notify);

                                        if (maxOptions && maxReached) {
                                            $notify.append($('<div>' + maxTxt + '</div>'));
                                            that.$element.trigger('maxReached.bs.select');
                                        }

                                        if (maxOptionsGrp && maxReachedGrp) {
                                            $notify.append($('<div>' + maxTxtGrp + '</div>'));
                                            that.$element.trigger('maxReachedGrp.bs.select');
                                        }

                                        setTimeout(function () {
                                            that.setSelected(clickedIndex, false);
                                        }, 10);

                                        $notify.delay(750).fadeOut(300, function () {
                                            $(this).remove();
                                        });
                                    }
                                }
                            }
                        }

                        if (!that.multiple) {
                            that.$button.focus();
                        } else if (that.options.liveSearch) {
                            that.$searchbox.focus();
                        }

                        // Trigger select 'change'
                        if ((prevValue != that.$element.val() && that.multiple) || (prevIndex != that.$element.prop('selectedIndex') && !that.multiple)) {
                            that.$element.triggerNative('change');
                            // $option.prop('selected') is current option state (selected/unselected). state is previous option state.
                            that.$element.trigger('changed.bs.select', [clickedIndex, $option.prop('selected'), state]);
                        }
                    }
                });

                this.$menu.on('click', 'li.disabled a, .popover-title, .popover-title :not(.close)', function (e) {
                    if (e.currentTarget == this) {
                        e.preventDefault();
                        e.stopPropagation();
                        if (that.options.liveSearch && !$(e.target).hasClass('close')) {
                            that.$searchbox.focus();
                        } else {
                            that.$button.focus();
                        }
                    }
                });

                this.$menuInner.on('click', '.divider, .dropdown-header', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (that.options.liveSearch) {
                        that.$searchbox.focus();
                    } else {
                        that.$button.focus();
                    }
                });

                this.$menu.on('click', '.popover-title .close', function () {
                    that.$button.click();
                });

                this.$searchbox.on('click', function (e) {
                    e.stopPropagation();
                });

                this.$menu.on('click', '.actions-btn', function (e) {
                    if (that.options.liveSearch) {
                        that.$searchbox.focus();
                    } else {
                        that.$button.focus();
                    }

                    e.preventDefault();
                    e.stopPropagation();

                    if ($(this).hasClass('bs-select-all')) {
                        that.selectAll();
                    } else {
                        that.deselectAll();
                    }
                    that.$element.triggerNative('change');
                });

                this.$element.change(function () {
                    that.render(false);
                });
            },

            liveSearchListener: function () {
                var that = this,
                    $no_results = $('<li class="no-results"></li>');

                this.$button.on('click.dropdown.data-api touchstart.dropdown.data-api', function () {
                    that.$menuInner.find('.active').removeClass('active');
                    if (!!that.$searchbox.val()) {
                        that.$searchbox.val('');
                        that.$lis.not('.is-hidden').removeClass('hidden');
                        if (!!$no_results.parent().length) $no_results.remove();
                    }
                    if (!that.multiple) that.$menuInner.find('.selected').addClass('active');
                    setTimeout(function () {
                        that.$searchbox.focus();
                    }, 10);
                });

                this.$searchbox.on('click.dropdown.data-api focus.dropdown.data-api touchend.dropdown.data-api', function (e) {
                    e.stopPropagation();
                });

                this.$searchbox.on('input propertychange', function () {
                    if (that.$searchbox.val()) {
                        var $searchBase = that.$lis.not('.is-hidden').removeClass('hidden').children('a');
                        if (that.options.liveSearchNormalize) {
                            $searchBase = $searchBase.not(':a' + that._searchStyle() + '("' + normalizeToBase(that.$searchbox.val()) + '")');
                        } else {
                            $searchBase = $searchBase.not(':' + that._searchStyle() + '("' + that.$searchbox.val() + '")');
                        }
                        $searchBase.parent().addClass('hidden');

                        that.$lis.filter('.dropdown-header').each(function () {
                            var $this = $(this),
                                optgroup = $this.data('optgroup');

                            if (that.$lis.filter('[data-optgroup=' + optgroup + ']').not($this).not('.hidden').length === 0) {
                                $this.addClass('hidden');
                                that.$lis.filter('[data-optgroup=' + optgroup + 'div]').addClass('hidden');
                            }
                        });

                        var $lisVisible = that.$lis.not('.hidden');

                        // hide divider if first or last visible, or if followed by another divider
                        $lisVisible.each(function (index) {
                            var $this = $(this);

                            if ($this.hasClass('divider') && (
                              $this.index() === $lisVisible.first().index() ||
                              $this.index() === $lisVisible.last().index() ||
                              $lisVisible.eq(index + 1).hasClass('divider'))) {
                                $this.addClass('hidden');
                            }
                        });

                        if (!that.$lis.not('.hidden, .no-results').length) {
                            if (!!$no_results.parent().length) {
                                $no_results.remove();
                            }
                            $no_results.html(that.options.noneResultsText.replace('{0}', '"' + htmlEscape(that.$searchbox.val()) + '"')).show();
                            that.$menuInner.append($no_results);
                        } else if (!!$no_results.parent().length) {
                            $no_results.remove();
                        }
                    } else {
                        that.$lis.not('.is-hidden').removeClass('hidden');
                        if (!!$no_results.parent().length) {
                            $no_results.remove();
                        }
                    }

                    that.$lis.filter('.active').removeClass('active');
                    if (that.$searchbox.val()) that.$lis.not('.hidden, .divider, .dropdown-header').eq(0).addClass('active').children('a').focus();
                    $(this).focus();
                });
            },

            _searchStyle: function () {
                var styles = {
                    begins: 'ibegins',
                    startsWith: 'ibegins'
                };

                return styles[this.options.liveSearchStyle] || 'icontains';
            },

            val: function (value) {
                if (typeof value !== 'undefined') {
                    this.$element.val(value);
                    this.render();

                    return this.$element;
                } else {
                    return this.$element.val();
                }
            },

            changeAll: function (status) {
                if (typeof status === 'undefined') status = true;

                this.findLis();

                var $options = this.$element.find('option'),
                    $lisVisible = this.$lis.not('.divider, .dropdown-header, .disabled, .hidden').toggleClass('selected', status),
                    lisVisLen = $lisVisible.length,
                    selectedOptions = [];

                for (var i = 0; i < lisVisLen; i++) {
                    var origIndex = $lisVisible[i].getAttribute('data-original-index');
                    selectedOptions[selectedOptions.length] = $options.eq(origIndex)[0];
                }

                $(selectedOptions).prop('selected', status);

                this.render(false);
            },

            selectAll: function () {
                return this.changeAll(true);
            },

            deselectAll: function () {
                return this.changeAll(false);
            },

            keydown: function (e) {
                var $this = $(this),
                    $parent = $this.is('input') ? $this.parent().parent() : $this.parent(),
                    $items,
                    that = $parent.data('this'),
                    index,
                    next,
                    first,
                    last,
                    prev,
                    nextPrev,
                    prevIndex,
                    isActive,
                    selector = ':not(.disabled, .hidden, .dropdown-header, .divider)',
                    keyCodeMap = {
                        32: ' ',
                        48: '0',
                        49: '1',
                        50: '2',
                        51: '3',
                        52: '4',
                        53: '5',
                        54: '6',
                        55: '7',
                        56: '8',
                        57: '9',
                        59: ';',
                        65: 'a',
                        66: 'b',
                        67: 'c',
                        68: 'd',
                        69: 'e',
                        70: 'f',
                        71: 'g',
                        72: 'h',
                        73: 'i',
                        74: 'j',
                        75: 'k',
                        76: 'l',
                        77: 'm',
                        78: 'n',
                        79: 'o',
                        80: 'p',
                        81: 'q',
                        82: 'r',
                        83: 's',
                        84: 't',
                        85: 'u',
                        86: 'v',
                        87: 'w',
                        88: 'x',
                        89: 'y',
                        90: 'z',
                        96: '0',
                        97: '1',
                        98: '2',
                        99: '3',
                        100: '4',
                        101: '5',
                        102: '6',
                        103: '7',
                        104: '8',
                        105: '9'
                    };

                if (that.options.liveSearch) $parent = $this.parent().parent();

                if (that.options.container) $parent = that.$menu;

                $items = $('[role=menu] li', $parent);

                isActive = that.$newElement.hasClass('open');

                if (!isActive && (e.keyCode >= 48 && e.keyCode <= 57 || e.keyCode >= 96 && e.keyCode <= 105 || e.keyCode >= 65 && e.keyCode <= 90)) {
                    if (!that.options.container) {
                        that.setSize();
                        that.$menu.parent().addClass('open');
                        isActive = true;
                    } else {
                        that.$button.trigger('click');
                    }
                    that.$searchbox.focus();
                }

                if (that.options.liveSearch) {
                    if (/(^9$|27)/.test(e.keyCode.toString(10)) && isActive && that.$menu.find('.active').length === 0) {
                        e.preventDefault();
                        that.$menu.parent().removeClass('open');
                        if (that.options.container) that.$newElement.removeClass('open');
                        that.$button.focus();
                    }
                    // $items contains li elements when liveSearch is enabled
                    $items = $('[role=menu] li' + selector, $parent);
                    if (!$this.val() && !/(38|40)/.test(e.keyCode.toString(10))) {
                        if ($items.filter('.active').length === 0) {
                            $items = that.$menuInner.find('li');
                            if (that.options.liveSearchNormalize) {
                                $items = $items.filter(':a' + that._searchStyle() + '(' + normalizeToBase(keyCodeMap[e.keyCode]) + ')');
                            } else {
                                $items = $items.filter(':' + that._searchStyle() + '(' + keyCodeMap[e.keyCode] + ')');
                            }
                        }
                    }
                }

                if (!$items.length) return;

                if (/(38|40)/.test(e.keyCode.toString(10))) {
                    index = $items.index($items.find('a').filter(':focus').parent());
                    first = $items.filter(selector).first().index();
                    last = $items.filter(selector).last().index();
                    next = $items.eq(index).nextAll(selector).eq(0).index();
                    prev = $items.eq(index).prevAll(selector).eq(0).index();
                    nextPrev = $items.eq(next).prevAll(selector).eq(0).index();

                    if (that.options.liveSearch) {
                        $items.each(function (i) {
                            if (!$(this).hasClass('disabled')) {
                                $(this).data('index', i);
                            }
                        });
                        index = $items.index($items.filter('.active'));
                        first = $items.first().data('index');
                        last = $items.last().data('index');
                        next = $items.eq(index).nextAll().eq(0).data('index');
                        prev = $items.eq(index).prevAll().eq(0).data('index');
                        nextPrev = $items.eq(next).prevAll().eq(0).data('index');
                    }

                    prevIndex = $this.data('prevIndex');

                    if (e.keyCode == 38) {
                        if (that.options.liveSearch) index--;
                        if (index != nextPrev && index > prev) index = prev;
                        if (index < first) index = first;
                        if (index == prevIndex) index = last;
                    } else if (e.keyCode == 40) {
                        if (that.options.liveSearch) index++;
                        if (index == -1) index = 0;
                        if (index != nextPrev && index < next) index = next;
                        if (index > last) index = last;
                        if (index == prevIndex) index = first;
                    }

                    $this.data('prevIndex', index);

                    if (!that.options.liveSearch) {
                        $items.eq(index).children('a').focus();
                    } else {
                        e.preventDefault();
                        if (!$this.hasClass('dropdown-toggle')) {
                            $items.removeClass('active').eq(index).addClass('active').children('a').focus();
                            $this.focus();
                        }
                    }

                } else if (!$this.is('input')) {
                    var keyIndex = [],
                        count,
                        prevKey;

                    $items.each(function () {
                        if (!$(this).hasClass('disabled')) {
                            if ($.trim($(this).children('a').text().toLowerCase()).substring(0, 1) == keyCodeMap[e.keyCode]) {
                                keyIndex.push($(this).index());
                            }
                        }
                    });

                    count = $(document).data('keycount');
                    count++;
                    $(document).data('keycount', count);

                    prevKey = $.trim($(':focus').text().toLowerCase()).substring(0, 1);

                    if (prevKey != keyCodeMap[e.keyCode]) {
                        count = 1;
                        $(document).data('keycount', count);
                    } else if (count >= keyIndex.length) {
                        $(document).data('keycount', 0);
                        if (count > keyIndex.length) count = 1;
                    }

                    $items.eq(keyIndex[count - 1]).children('a').focus();
                }

                // Select focused option if "Enter", "Spacebar" or "Tab" (when selectOnTab is true) are pressed inside the menu.
                if ((/(13|32)/.test(e.keyCode.toString(10)) || (/(^9$)/.test(e.keyCode.toString(10)) && that.options.selectOnTab)) && isActive) {
                    if (!/(32)/.test(e.keyCode.toString(10))) e.preventDefault();
                    if (!that.options.liveSearch) {
                        var elem = $(':focus');
                        elem.click();
                        // Bring back focus for multiselects
                        elem.focus();
                        // Prevent screen from scrolling if the user hit the spacebar
                        e.preventDefault();
                        // Fixes spacebar selection of dropdown items in FF & IE
                        $(document).data('spaceSelect', true);
                    } else if (!/(32)/.test(e.keyCode.toString(10))) {
                        that.$menuInner.find('.active a').click();
                        $this.focus();
                    }
                    $(document).data('keycount', 0);
                }

                if ((/(^9$|27)/.test(e.keyCode.toString(10)) && isActive && (that.multiple || that.options.liveSearch)) || (/(27)/.test(e.keyCode.toString(10)) && !isActive)) {
                    that.$menu.parent().removeClass('open');
                    if (that.options.container) that.$newElement.removeClass('open');
                    that.$button.focus();
                }
            },

            mobile: function () {
                this.$element.addClass('mobile-device');
            },

            refresh: function () {
                this.$lis = null;
                this.liObj = {};
                this.reloadLi();
                this.render();
                this.checkDisabled();
                this.liHeight(true);
                this.setStyle();
                this.setWidth();
                if (this.$lis) this.$searchbox.trigger('propertychange');

                this.$element.trigger('refreshed.bs.select');
            },

            hide: function () {
                this.$newElement.hide();
            },

            show: function () {
                this.$newElement.show();
            },

            remove: function () {
                this.$newElement.remove();
                this.$element.remove();
            },

            destroy: function () {
                this.$newElement.remove();

                if (this.$bsContainer) {
                    this.$bsContainer.remove();
                } else {
                    this.$menu.remove();
                }

                this.$element
                  .off('.bs.select')
                  .removeData('selectpicker')
                  .removeClass('bs-select-hidden selectpicker');
            }
        };

        // SELECTPICKER PLUGIN DEFINITION
        // ==============================
        function Plugin(option, event) {
            // get the args of the outer function..
            var args = arguments;
            // The arguments of the function are explicitly re-defined from the argument list, because the shift causes them
            // to get lost/corrupted in android 2.3 and IE9 #715 #775
            var _option = option,
                _event = event;
            [].shift.apply(args);

            var value;
            var chain = this.each(function () {
                var $this = $(this);
                if ($this.is('select')) {
                    var data = $this.data('selectpicker'),
                        options = typeof _option == 'object' && _option;

                    if (!data) {
                        var config = $.extend({}, Selectpicker.DEFAULTS, $.fn.selectpicker.defaults || {}, $this.data(), options);
                        config.template = $.extend({}, Selectpicker.DEFAULTS.template, ($.fn.selectpicker.defaults ? $.fn.selectpicker.defaults.template : {}), $this.data().template, options.template);
                        $this.data('selectpicker', (data = new Selectpicker(this, config, _event)));
                    } else if (options) {
                        for (var i in options) {
                            if (options.hasOwnProperty(i)) {
                                data.options[i] = options[i];
                            }
                        }
                    }

                    if (typeof _option == 'string') {
                        if (data[_option] instanceof Function) {
                            value = data[_option].apply(data, args);
                        } else {
                            value = data.options[_option];
                        }
                    }
                }
            });

            if (typeof value !== 'undefined') {
                //noinspection JSUnusedAssignment
                return value;
            } else {
                return chain;
            }
        }

        var old = $.fn.selectpicker;
        $.fn.selectpicker = Plugin;
        $.fn.selectpicker.Constructor = Selectpicker;

        // SELECTPICKER NO CONFLICT
        // ========================
        $.fn.selectpicker.noConflict = function () {
            $.fn.selectpicker = old;
            return this;
        };

        $(document)
            .data('keycount', 0)
            .on('keydown.bs.select', '.bootstrap-select [data-toggle=dropdown], .bootstrap-select [role="menu"], .bs-searchbox input', Selectpicker.prototype.keydown)
            .on('focusin.modal', '.bootstrap-select [data-toggle=dropdown], .bootstrap-select [role="menu"], .bs-searchbox input', function (e) {
                e.stopPropagation();
            });

        // SELECTPICKER DATA-API
        // =====================
        $(window).on('load.bs.select.data-api', function () {
            $('.selectpicker').each(function () {
                var $selectpicker = $(this);
                Plugin.call($selectpicker, $selectpicker.data());
            })
        });
    })(jQuery);


}));

///#source 1 1 /JavaScript-Mvc-framework/libs/bootstrap-table.js
/**
 * @author zhixin wen <wenzhixin2010@gmail.com>
 * version: 1.3.0
 * https://github.com/wenzhixin/bootstrap-table/
 */

!function ($) {

    'use strict';

    // TOOLS DEFINITION
    // ======================

    // it only does '%s', and return '' when arguments are undefined
    var sprintf = function(str) {
        var args = arguments,
            flag = true,
            i = 1;

        str = str.replace(/%s/g, function () {
            var arg = args[i++];

            if (typeof arg === 'undefined') {
                flag = false;
                return '';
            }
            return arg;
        });
        if (flag) {
            return str;
        }
        return '';
    };

    var getPropertyFromOther = function (list, from, to, value) {
        var result = '';
        $.each(list, function (i, item) {
            if (item[from] === value) {
                result = item[to];
                return false;
            }
            return true;
        });
        return result;
    };

    var getFieldIndex = function (columns, field) {
        var index = -1;

        $.each(columns, function (i, column) {
            if (column.field === field) {
                index = i;
                return false;
            }
            return true;
        });
        return index;
    };

    var getScrollBarWidth = function () {
        var inner = $('<p/>').addClass('fixed-table-scroll-inner'),
            outer = $('<div/>').addClass('fixed-table-scroll-outer'),
            w1, w2;

        outer.append(inner);
        $('body').append(outer);

        w1 = inner[0].offsetWidth;
        outer.css('overflow', 'scroll');
        w2 = inner[0].offsetWidth;

        if (w1 == w2) {
            w2 = outer[0].clientWidth;
        }

        outer.remove();
        return w1 - w2;
    };

    var calculateObjectValue = function (self, name, args, defaultValue) {
        if (typeof name === 'string') {
            // support obj.func1.func2
            var names = name.split('.');

            if (names.length > 1) {
                name = window;
                $.each(names, function (i, f) {
                    name = name[f];
                });
            } else {
                name = window[name];
            }
        }
        if (typeof name === 'object') {
            return name;
        }
        if (typeof name === 'function') {
            return name.apply(self, args);
        }
        return defaultValue;
    };

    // BOOTSTRAP TABLE CLASS DEFINITION
    // ======================

    var BootstrapTable = function (el, options) {
        this.options = options;
        this.$el = $(el);
        this.$el_ = this.$el.clone();
        this.timeoutId_ = 0;

        this.init();
    };

    BootstrapTable.DEFAULTS = {
        classes: 'table table-hover',
        height: undefined,
        undefinedText: '-',
        sortName: undefined,
        sortOrder: 'asc',
        striped: false,
        columns: [],
        data: [],
        method: 'get',
        url: undefined,
        cache: true,
        contentType: 'application/json',
        queryParams: function (params) {return params;},
        queryParamsType: 'limit', // undefined
        responseHandler: function (res) {return res;},
        pagination: false,
        sidePagination: 'client', // client or server
        totalRows: 0, // server side need to set
        pageNumber: 1,
        pageSize: 10,
        pageList: [10, 25, 50, 100],
        search: false,
        selectItemName: 'btSelectItem',
        showHeader: true,
        showColumns: false,
        showRefresh: false,
        showToggle: false,
        minimumCountColumns: 1,
        idField: undefined,
        cardView: false,
        clickToSelect: false,
        singleSelect: false,
        toolbar: undefined,
        checkboxHeader: true,
        sortable: true,
        maintainSelected: false,

        rowStyle: function (row, index) {return {};},

        formatLoadingMessage: function () {
            return 'Loading, please wait…';
        },
        formatRecordsPerPage: function (pageNumber) {
            return sprintf('%s records per page', pageNumber);
        },
        formatShowingRows: function (pageFrom, pageTo, totalRows) {
            return sprintf('Showing %s to %s of %s rows', pageFrom, pageTo, totalRows);
        },
        formatSearch: function () {
            return 'Search';
        },
        formatNoMatches: function () {
            return 'No matching records found';
        },
        formatRefresh: function () {
            return 'Refresh';
        },
        formatToggle: function () {
            return 'Toggle';
        },
        formatColumns: function () {
            return 'Columns';
        },

        onAll: function (name, args) {return false;},
        onClickRow: function (item, $element) {return false;},
        onDblClickRow: function (item, $element) {return false;},
        onSort: function (name, order) {return false;},
        onCheck: function (row) {return false;},
        onUncheck: function (row) {return false;},
        onCheckAll: function () {return false;},
        onUncheckAll: function () {return false;},
        onLoadSuccess: function (data) {return false;},
        onLoadError: function (status) {return false;},
        onColumnSwitch: function (field, checked) {return false;}
    };

    BootstrapTable.COLUMN_DEFAULTS = {
        radio: false,
        checkbox: false,
        checkboxEnabled: true,
        field: undefined,
        title: undefined,
        'class': undefined,
        align: undefined, // left, right, center
        halign: undefined, // left, right, center
        valign: undefined, // top, middle, bottom
        width: undefined,
        sortable: false,
        order: 'asc', // asc, desc
        visible: true,
        switchable: true,
        clickToSelect: true,
        formatter: undefined,
        events: undefined,
        sorter: undefined,
        cellStyle: undefined
    };

    BootstrapTable.EVENTS = {
        'all.bs.table': 'onAll',
        'click-row.bs.table': 'onClickRow',
        'dbl-click-row.bs.table': 'onDblClickRow',
        'sort.bs.table': 'onSort',
        'check.bs.table': 'onCheck',
        'uncheck.bs.table': 'onUncheck',
        'check-all.bs.table': 'onCheckAll',
        'uncheck-all.bs.table': 'onUncheckAll',
        'load-success.bs.table': 'onLoadSuccess',
        'load-error.bs.table': 'onLoadError',
        'column-switch.bs.table': 'onColumnSwitch'
    };

    BootstrapTable.prototype.init = function () {
        this.initContainer();
        this.initTable();
        this.initHeader();
        this.initData();
        this.initToolbar();
        this.initPagination();
        this.initBody();
        this.initServer();
    };

    BootstrapTable.prototype.initContainer = function () {
        this.$container = $([
            '<div class="bootstrap-table">',
                '<div class="fixed-table-toolbar"></div>',
                '<div class="fixed-table-container">',
                    '<div class="fixed-table-header"><table></table></div>',
                    '<div class="fixed-table-body">',
                        '<div class="fixed-table-loading">',
                            this.options.formatLoadingMessage(),
                        '</div>',
                    '</div>',
                    '<div class="fixed-table-pagination"></div>',
                '</div>',
            '</div>'].join(''));

        this.$container.insertAfter(this.$el);
        this.$container.find('.fixed-table-body').append(this.$el);
        this.$container.after('<div class="clearfix"></div>');
        this.$loading = this.$container.find('.fixed-table-loading');

        this.$el.addClass(this.options.classes);
        if (this.options.striped) {
            this.$el.addClass('table-striped');
        }
    };

    BootstrapTable.prototype.initTable = function () {
        var that = this,
            columns = [],
            data = [];

        this.$header = this.$el.find('thead');
        if (!this.$header.length) {
            this.$header = $('<thead></thead>').appendTo(this.$el);
        }
        if (!this.$header.find('tr').length) {
            this.$header.append('<tr></tr>');
        }
        this.$header.find('th').each(function () {
            var column = $.extend({}, {
                title: $(this).html(),
                'class': $(this).attr('class')
            }, $(this).data());

            columns.push(column);
        });
        this.options.columns = $.extend([], columns, this.options.columns);
        $.each(this.options.columns, function (i, column) {
            that.options.columns[i] = $.extend({}, BootstrapTable.COLUMN_DEFAULTS,
                {field: i}, column); // when field is undefined, use index instead
        });

        // if options.data is setting, do not process tbody data
        if (this.options.data.length) {
            return;
        }

        this.$el.find('tbody tr').each(function () {
            var row = {};
            $(this).find('td').each(function (i) {
                row[that.options.columns[i].field] = $(this).html();
            });
            data.push(row);
        });
        this.options.data = data;
    };

    BootstrapTable.prototype.initHeader = function () {
        var that = this,
            visibleColumns = [],
            html = [];

        this.header = {
            fields: [],
            styles: [],
            classes: [],
            formatters: [],
            events: [],
            sorters: [],
            cellStyles: [],
            clickToSelects: []
        };
        $.each(this.options.columns, function (i, column) {
            var text = '',
                style = '',
                class_ = sprintf(' class="%s"', column['class']),
                order = that.options.sortOrder || column.order;

            if (!column.visible) {
                return;
            }

            style = sprintf('text-align: %s; ', column.halign ? column.halign : column.align);
            style += sprintf('vertical-align: %s; ', column.valign);
            style += sprintf('width: %spx; ', column.checkbox || column.radio ? 36 : column.width);

            visibleColumns.push(column);
            that.header.fields.push(column.field);
            that.header.styles.push(style);
            that.header.classes.push(class_);
            that.header.formatters.push(column.formatter);
            that.header.events.push(column.events);
            that.header.sorters.push(column.sorter);
            that.header.cellStyles.push(column.cellStyle);
            that.header.clickToSelects.push(column.clickToSelect);

            html.push('<th',
                column.checkbox || column.radio ?
                    sprintf(' class="bs-checkbox %s"', column['class'] || '') :
                    class_,
                sprintf(' style="%s"', style),
                '>');
            html.push(sprintf('<div class="th-inner %s">', that.options.sortable && column.sortable ?
                'sortable' : ''));

            text = column.title;
            if (that.options.sortName === column.field && that.options.sortable && column.sortable) {
                text += that.getCaretHtml();
            }

            if (column.checkbox) {
                if (!that.options.singleSelect && that.options.checkboxHeader) {
                    text = '<input name="btSelectAll" type="checkbox" />';
                }
                that.header.stateField = column.field;
            }
            if (column.radio) {
                text = '';
                that.header.stateField = column.field;
                that.options.singleSelect = true;
            }

            html.push(text);
            html.push('</div>');
            html.push('<div class="fht-cell"></div>');
            html.push('</th>');
        });

        this.$header.find('tr').html(html.join(''));
        this.$header.find('th').each(function (i) {
            $(this).data(visibleColumns[i]);
        });
        this.$container.off('click', 'th').on('click', 'th', function (event) {
            if (that.options.sortable && $(this).data().sortable) {
                that.onSort(event);
            }
        });

        if (!this.options.showHeader || this.options.cardView) {
            this.$header.hide();
            this.$container.find('.fixed-table-header').hide();
            this.$loading.css('top', 0);
        } else {
            this.$header.show();
            this.$container.find('.fixed-table-header').show();
            this.$loading.css('top', '37px');
        }

        this.$selectAll = this.$header.find('[name="btSelectAll"]');
        this.$container.off('click', '[name="btSelectAll"]')
            .on('click', '[name="btSelectAll"]', function () {
                var checked = $(this).prop('checked');
                that[checked ? 'checkAll' : 'uncheckAll']();
            });
    };

    BootstrapTable.prototype.initData = function (data, append) {
        if (append) {
            this.data = this.data.concat(data);
        } else {
            this.data = data || this.options.data;
        }
        this.options.data = this.data;

        if (this.options.sidePagination === 'server') {
            return;
        }
        this.initSort();
    };

    BootstrapTable.prototype.initSort = function () {
        var that = this,
            name = this.options.sortName,
            order = this.options.sortOrder === 'desc' ? -1 : 1,
            index = $.inArray(this.options.sortName, this.header.fields);

        if (index !== -1) {
            this.data.sort(function (a, b) {
                var aa = a[name],
                    bb = b[name],
                    value = calculateObjectValue(that.header, that.header.sorters[index], [aa, bb]);

                if (value !== undefined) {
                    return order * value;
                }

                // Fix #161: undefined or null string sort bug.
                if (aa === null) {
                    aa = '';
                }
                if (bb === null) {
                    bb = '';
                }

                if (aa === bb) {
                    return 0;
                }
                if (aa < bb) {
                    return order * -1;
                }
                return order;
            });
        }
    };

    BootstrapTable.prototype.onSort = function (event) {
        var $this = $(event.currentTarget),
            $this_ = this.$header.find('th').eq($this.index());

        this.$header.add(this.$header_).find('span.order').remove();

        if (this.options.sortName === $this.data('field')) {
            this.options.sortOrder = this.options.sortOrder === 'asc' ? 'desc' : 'asc';
        } else {
            this.options.sortName = $this.data('field');
            this.options.sortOrder = $this.data('order') === 'asc' ? 'desc' : 'asc';
        }
        this.trigger('sort', this.options.sortName, this.options.sortOrder);

        $this.add($this_).data('order', this.options.sortOrder)
            .find('.th-inner').append(this.getCaretHtml());

        if (this.options.sidePagination === 'server') {
            this.initServer();
            return;
        }
        this.initSort();
        this.initBody();
    };

    BootstrapTable.prototype.initToolbar = function () {
        var that = this,
            html = [],
            timeoutId = 0,
            $keepOpen,
            $search,
            switchableCount = 0;

        this.$toolbar = this.$container.find('.fixed-table-toolbar').html('');

        if (typeof this.options.toolbar === 'string') {
            $('<div class="bars pull-left"></div>')
                .appendTo(this.$toolbar)
                .append($(this.options.toolbar));
        }

        // showColumns, showToggle, showRefresh
        html = ['<div class="columns btn-group pull-right">'];

        if (this.options.showRefresh) {
            html.push(sprintf('<button class="btn btn-default" type="button" name="refresh" title="%s">',
                this.options.formatRefresh()),
                '<i class="glyphicon glyphicon-refresh icon-refresh"></i>',
                '</button>');
        }

        if (this.options.showToggle) {
            html.push(sprintf('<button class="btn btn-default" type="button" name="toggle" title="%s">',
                this.options.formatToggle()),
                '<i class="glyphicon glyphicon glyphicon-list-alt icon-list-alt"></i>',
                '</button>');
        }

        if (this.options.showColumns) {
            html.push(sprintf('<div class="keep-open %s" title="%s">',
                this.options.showRefresh || this.options.showToggle ? 'btn-group' : '',
                this.options.formatColumns()),
                '<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">',
                '<i class="glyphicon glyphicon-th icon-th"></i>',
                ' <span class="caret"></span>',
                '</button>',
                '<ul class="dropdown-menu" role="menu">');

            $.each(this.options.columns, function (i, column) {
                if (column.radio || column.checkbox) {
                    return;
                }
                var checked = column.visible ? ' checked="checked"' : '';

                if (column.switchable) {
                    html.push(sprintf('<li>' +
                        '<label><input type="checkbox" data-field="%s" value="%s"%s> %s</label>' +
                        '</li>', column.field, i, checked, column.title));
                    switchableCount++;
                }
            });
            html.push('</ul>',
                '</div>');
        }

        html.push('</div>');

        if (html.length > 2) {
            this.$toolbar.append(html.join(''));
        }

        if (this.options.showRefresh) {
            this.$toolbar.find('button[name="refresh"]')
                .off('click').on('click', $.proxy(this.refresh, this));
        }

        if (this.options.showToggle) {
            this.$toolbar.find('button[name="toggle"]')
                .off('click').on('click', function () {
                    that.options.cardView = !that.options.cardView;
                    that.initHeader();
                    that.initBody();
                });
        }

        if (this.options.showColumns) {
            $keepOpen = this.$toolbar.find('.keep-open');

            if (switchableCount <= this.options.minimumCountColumns) {
                $keepOpen.find('input').prop('disabled', true);
            }

            $keepOpen.find('li').off('click').on('click', function (event) {
                event.stopImmediatePropagation();
            });
            $keepOpen.find('input').off('click').on('click', function () {
                var $this = $(this);

                that.toggleColumn($this.val(), $this.prop('checked'), false);
                that.trigger('column-switch', $(this).data('field'), $this.prop('checked'));
            });
        }

        if (this.options.search) {
            html = [];
            html.push(
                '<div class="pull-right search">',
                    sprintf('<input class="form-control" type="text" placeholder="%s">',
                        this.options.formatSearch()),
                '</div>');

            this.$toolbar.append(html.join(''));
            $search = this.$toolbar.find('.search input');
            $search.off('keyup').on('keyup', function (event) {
                clearTimeout(timeoutId); // doesn't matter if it's 0
                timeoutId = setTimeout(function () {
                    that.onSearch(event);
                }, 500); // 500ms
            });
        }
    };

    BootstrapTable.prototype.onSearch = function (event) {
        var text = $.trim($(event.currentTarget).val());

        // trim search input
        $(event.currentTarget).val(text);

        if (text === this.searchText) {
            return;
        }
        this.searchText = text;

        this.options.pageNumber = 1;
        this.initSearch();
        this.updatePagination();
    };

    BootstrapTable.prototype.initSearch = function () {
        var that = this;

        if (this.options.sidePagination !== 'server') {
            var s = this.searchText && this.searchText.toLowerCase();

            this.data = s ? $.grep(this.options.data, function (item, i) {
                key = $.isNumeric(key) ? parseInt(key, 10) : key;
                for (var key in item) {
                    var value = item[key];

                    // Fix #142: search use formated data
                    value = calculateObjectValue(that.header,
                        that.header.formatters[$.inArray(key, that.header.fields)],
                        [value, item, i], value);

                    if ($.inArray(key, that.header.fields) !== -1 &&
                        (typeof value === 'string' ||
                        typeof value === 'number') &&
                        (value + '').toLowerCase().indexOf(s) !== -1) {
                        return true;
                    }
                }
                return false;
            }) : this.options.data;
        }
    };

    BootstrapTable.prototype.initPagination = function () {
        this.$pagination = this.$container.find('.fixed-table-pagination');

        if (!this.options.pagination) {
            return;
        }
        var that = this,
            html = [],
            i, from, to,
            $pageList,
            $first, $pre,
            $next, $last,
            $number,
            data = this.searchText ? this.data : this.options.data;

        if (this.options.sidePagination !== 'server') {
            this.options.totalRows = data.length;
        }

        this.totalPages = 0;
        if (this.options.totalRows) {
            this.totalPages = ~~((this.options.totalRows - 1) / this.options.pageSize) + 1;
        }
        if (this.totalPages > 0 && this.options.pageNumber > this.totalPages) {
            this.options.pageNumber = this.totalPages;
        }

        this.pageFrom = (this.options.pageNumber - 1) * this.options.pageSize + 1;
        this.pageTo = this.options.pageNumber * this.options.pageSize;
        if (this.pageTo > this.options.totalRows) {
            this.pageTo = this.options.totalRows;
        }

        html.push(
            '<div class="pull-left pagination-detail">',
                '<span class="pagination-info">',
                    this.options.formatShowingRows(this.pageFrom, this.pageTo, this.options.totalRows),
                '</span>');

        html.push('<span class="page-list">');

        var pageNumber = [
            '<span class="btn-group dropup">',
            '<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">',
            '<span class="page-size">',
            this.options.pageSize,
            '</span>',
            ' <span class="caret"></span>',
            '</button>',
            '<ul class="dropdown-menu" role="menu">'],
            pageList = this.options.pageList;

        if (typeof this.options.pageList === 'string') {
            var list = this.options.pageList.slice(1, -1).replace(/ /g, '').split(',');

            pageList = [];
            $.each(list, function (i, value) {
                pageList.push(+value);
            });
        }

        $.each(pageList, function (i, page) {
            var active = page === that.options.pageSize ? ' class="active"' : '';
            pageNumber.push(sprintf('<li%s><a href="javascript:void(0)">%s</a></li>', active, page));
        });
        pageNumber.push('</ul></span>');

        html.push(this.options.formatRecordsPerPage(pageNumber.join('')));
        html.push('</span>');

        html.push('</div>',
            '<div class="pull-right pagination">',
                '<ul class="pagination">',
                    '<li class="page-first"><a href="javascript:void(0)">&lt;&lt;</a></li>',
                    '<li class="page-pre"><a href="javascript:void(0)">&lt;</a></li>');

        if (this.totalPages < 5) {
            from = 1;
            to = this.totalPages;
        } else {
            from = this.options.pageNumber - 2;
            to = from + 4;
            if (from < 1) {
                from = 1;
                to = 5;
            }
            if (to > this.totalPages) {
                to = this.totalPages;
                from = to - 4;
            }
        }
        for (i = from; i <= to; i++) {
            html.push('<li class="page-number' + (i === this.options.pageNumber ? ' active' : '') + '">',
                '<a href="javascript:void(0)">', i ,'</a>',
                '</li>');
        }

        html.push(
                    '<li class="page-next"><a href="javascript:void(0)">&gt;</a></li>',
                    '<li class="page-last"><a href="javascript:void(0)">&gt;&gt;</a></li>',
                '</ul>',
            '</div>');

        this.$pagination.html(html.join(''));

        $pageList = this.$pagination.find('.page-list a');
        $first = this.$pagination.find('.page-first');
        $pre = this.$pagination.find('.page-pre');
        $next = this.$pagination.find('.page-next');
        $last = this.$pagination.find('.page-last');
        $number = this.$pagination.find('.page-number');

        if (this.options.pageNumber <= 1) {
            $first.addClass('disabled');
            $pre.addClass('disabled');
        }
        if (this.options.pageNumber >= this.totalPages) {
            $next.addClass('disabled');
            $last.addClass('disabled');
        }
        $pageList.off('click').on('click', $.proxy(this.onPageListChange, this));
        $first.off('click').on('click', $.proxy(this.onPageFirst, this));
        $pre.off('click').on('click', $.proxy(this.onPagePre, this));
        $next.off('click').on('click', $.proxy(this.onPageNext, this));
        $last.off('click').on('click', $.proxy(this.onPageLast, this));
        $number.off('click').on('click', $.proxy(this.onPageNumber, this));
    };

    BootstrapTable.prototype.updatePagination = function () {
        if (!this.options.maintainSelected) {
            this.resetRows();
        }

        this.initPagination();
        if (this.options.sidePagination === 'server') {
            this.initServer();
        } else {
            this.initBody();
        }
    };

    BootstrapTable.prototype.onPageListChange = function (event) {
        var $this = $(event.currentTarget);

        $this.parent().addClass('active').siblings().removeClass('active');
        this.options.pageSize = +$this.text();
        this.$toolbar.find('.page-size').text(this.options.pageSize);
        this.updatePagination();
    };

    BootstrapTable.prototype.onPageFirst = function () {
        this.options.pageNumber = 1;
        this.updatePagination();
    };

    BootstrapTable.prototype.onPagePre = function () {
        this.options.pageNumber--;
        this.updatePagination();
    };

    BootstrapTable.prototype.onPageNext = function () {
        this.options.pageNumber++;
        this.updatePagination();
    };

    BootstrapTable.prototype.onPageLast = function () {
        this.options.pageNumber = this.totalPages;
        this.updatePagination();
    };

    BootstrapTable.prototype.onPageNumber = function (event) {
        if (this.options.pageNumber === +$(event.currentTarget).text()) {
            return;
        }
        this.options.pageNumber = +$(event.currentTarget).text();
        this.updatePagination();
    };

    BootstrapTable.prototype.initBody = function (fixedScroll) {
        var that = this,
            html = [],
            data = this.getData();

        this.$body = this.$el.find('tbody');
        if (!this.$body.length) {
            this.$body = $('<tbody></tbody>').appendTo(this.$el);
        }

        if (this.options.sidePagination === 'server') {
            data = this.data;
        }

        if (!this.options.pagination || this.options.sidePagination === 'server') {
            this.pageFrom = 1;
            this.pageTo = data.length;
        }

        for (var i = this.pageFrom - 1; i < this.pageTo; i++) {
            var item = data[i],
                style = {},
                csses = [];

            style = calculateObjectValue(this.options, this.options.rowStyle, [item, i], style);

            if (style && style.css) {
                for (var key in style.css) {
                    csses.push(key + ': ' + style.css[key]);
                }
            }

            html.push('<tr',
                sprintf(' class="%s"', style.classes),
                sprintf(' data-index="%s"', i),
                '>'
            );

            if (this.options.cardView) {
                html.push(sprintf('<td colspan="%s">', this.header.fields.length));
            }

            $.each(this.header.fields, function (j, field) {
                var text = '',
                    value = item[field],
                    type = '',
                    cellStyle = {},
                    class_ = that.header.classes[j];
                    style = sprintf('style="%s"', csses.concat(that.header.styles[j]).join('; '));

                value = calculateObjectValue(that.header,
                    that.header.formatters[j], [value, item, i], value);

                cellStyle = calculateObjectValue(that.header,
                    that.header.cellStyles[j], [value, item, i], cellStyle);
                if (cellStyle.classes) {
                    class_ = sprintf(' class="%s"', cellStyle.classes);
                }
                if (cellStyle.css) {
                    csses = [];
                    for (var key in cellStyle.css) {
                        csses.push(key + ': ' + cellStyle.css[key]);
                    }
                    style = sprintf('style="%s"', csses.concat(that.header.styles[j]).join('; '));
                }

                if (that.options.columns[j].checkbox || that.options.columns[j].radio) {
                    //if card view mode bypass
                    if (that.options.cardView) {
                        return true;
                    }

                    type = that.options.columns[j].checkbox ? 'checkbox' : type;
                    type = that.options.columns[j].radio ? 'radio' : type;

                    text = ['<td class="bs-checkbox">',
                        '<input' +
                            sprintf(' data-index="%s"', i) +
                            sprintf(' name="%s"', that.options.selectItemName) +
                            sprintf(' type="%s"', type) +
                            sprintf(' value="%s"', item[that.options.idField]) +
                            sprintf(' checked="%s"', +value === 1 ||
                                (value && value.checked) ? 'checked' : undefined) +
                            sprintf(' disabled="%s"', !that.options.columns[j].checkboxEnabled ||
                                (value && value.disabled) ? 'disabled' : undefined) +
                            ' />',
                        '</td>'].join('');
                } else {
                    value = typeof value === 'undefined' ? that.options.undefinedText : value;

                    text = that.options.cardView ?
                        ['<div class="card-view">',
                            that.options.showHeader ? sprintf('<span class="title" %s>%s</span>', style,
                                getPropertyFromOther(that.options.columns, 'field', 'title', field)) : '',
                            sprintf('<span class="value">%s</span>', value),
                            '</div>'].join('') :
                        [sprintf('<td%s %s>', class_, style),
                            value,
                            '</td>'].join('');
                }

                html.push(text);
            });

            if (this.options.cardView) {
                html.push('</td>');
            }

            html.push('</tr>');
        }

        // show no records
        if (!html.length) {
            html.push('<tr class="no-records-found">',
                sprintf('<td colspan="%s">%s</td>', this.header.fields.length, this.options.formatNoMatches()),
                '</tr>');
        }

        this.$body.html(html.join(''));

        if (!fixedScroll) {
            this.$container.find('.fixed-table-body').scrollTop(0);
        }

        // click to select by column
        this.$body.find('> tr > td').off('click').on('click', function () {
            var $tr = $(this).parent();
            that.trigger('click-row', that.data[$tr.data('index')], $tr);
            // if click to select - then trigger the checkbox/radio click
            if (that.options.clickToSelect) {
                if (that.header.clickToSelects[$tr.children().index($(this))]) {
                    $tr.find(sprintf('[name="%s"]',
                        that.options.selectItemName)).trigger('click');
                }
            }
        });
        this.$body.find('tr').off('dblclick').on('dblclick', function () {
            that.trigger('dbl-click-row', that.data[$(this).data('index')], $(this));
        });

        this.$selectItem = this.$body.find(sprintf('[name="%s"]', this.options.selectItemName));
        this.$selectItem.off('click').on('click', function (event) {
            event.stopImmediatePropagation();

            // radio trigger click event bug!
            if ($(this).is(':radio')) {
                $(this).prop('checked', true);
            }

            var checkAll = that.$selectItem.filter(':enabled').length ===
                    that.$selectItem.filter(':enabled').filter(':checked').length,
                checked = $(this).prop('checked'),
                row = that.data[$(this).data('index')];

            that.$selectAll.add(that.$selectAll_).prop('checked', checkAll);
            row[that.header.stateField] = checked;
            that.trigger(checked ? 'check' : 'uncheck', row);

            if (that.options.singleSelect) {
                that.$selectItem.not(this).each(function () {
                    that.data[$(this).data('index')][that.header.stateField] = false;
                });
                that.$selectItem.filter(':checked').not(this).prop('checked', false);
            }

            that.updateSelected();
        });

        $.each(this.header.events, function (i, events) {
            if (!events) {
                return;
            }
            // fix bug, if events is defined with namespace
            if (typeof events === 'string') {
                events = calculateObjectValue(null, events);
            }
            for (var key in events) {
                that.$body.find('tr').each(function () {
                    var $tr = $(this),
                        $td = $tr.find('td').eq(i),
                        index = key.indexOf(' '),
                        name = key.substring(0, index),
                        el = key.substring(index + 1),
                        func = events[key];

                    $td.find(el).off(name).on(name, function (e) {
                        var index = $tr.data('index'),
                            row = that.data[index],
                            value = row[that.header.fields[i]];

                        func(e, value, row, index);
                    });
                });
            }
        });

        this.updateSelected();
        this.resetView();
    };

    BootstrapTable.prototype.initServer = function (silent) {
        var that = this,
            data = {},
            params = {
                pageSize: this.options.pageSize,
                pageNumber: this.options.pageNumber,
                searchText: this.searchText,
                sortName: this.options.sortName,
                sortOrder: this.options.sortOrder
            };

        if (!this.options.url) {
            return;
        }

        if (this.options.queryParamsType === 'limit') {
            params = {
                limit: params.pageSize,
                offset: params.pageSize * (params.pageNumber - 1),
                search: params.searchText,
                sort: params.sortName,
                order: params.sortOrder
            };
        }
        data = calculateObjectValue(this.options, this.options.queryParams, [params], data);

        // false to stop request
        if (data === false) {
            return;
        }

        if (!silent) {
            this.$loading.show();
        }

        $.ajax({
            type: this.options.method,
            url: this.options.url,
            data: data,
            cache: this.options.cache,
            contentType: this.options.contentType,
            dataType: 'json',
            success: function (res) {
                res = calculateObjectValue(that.options, that.options.responseHandler, [res], res);

                var data = res;

                if (that.options.sidePagination === 'server') {
                    that.options.totalRows = res.total;
                    data = res.rows;
                }
                that.load(data);
                that.trigger('load-success', data);
            },
            error: function (res) {
                that.trigger('load-error', res.status);
            },
            complete: function () {
                if (!silent) {
                    that.$loading.hide();
                }
            }
        });
    };

    BootstrapTable.prototype.getCaretHtml = function () {
        return ['<span class="order' + (this.options.sortOrder === 'desc' ? '' : ' dropup') + '">',
                '<span class="caret" style="margin: 10px 5px;"></span>',
            '</span>'].join('');
    };

    BootstrapTable.prototype.updateSelected = function () {
        this.$selectItem.each(function () {
            $(this).parents('tr')[$(this).prop('checked') ? 'addClass' : 'removeClass']('selected');
        });
    };

    BootstrapTable.prototype.updateRows = function (checked) {
        var that = this;

        this.$selectItem.each(function () {
            that.data[$(this).data('index')][that.header.stateField] = checked;
        });
    };

    BootstrapTable.prototype.resetRows = function () {
        var that = this;

        $.each(this.data, function (i, row) {
            that.$selectAll.prop('checked', false);
            that.$selectItem.prop('checked', false);
            row[that.header.stateField] = false;
        });
    };

    BootstrapTable.prototype.trigger = function (name) {
        var args = Array.prototype.slice.call(arguments, 1);

        name += '.bs.table';
        this.options[BootstrapTable.EVENTS[name]].apply(this.options, args);
        this.$el.trigger($.Event(name), args);

        this.options.onAll(name, args);
        this.$el.trigger($.Event('all.bs.table'), [name, args]);
    };

    BootstrapTable.prototype.resetHeader = function () {
        var that = this,
            $fixedHeader = this.$container.find('.fixed-table-header'),
            $fixedBody = this.$container.find('.fixed-table-body'),
            scrollWidth = this.$el.width() > $fixedBody.width() ? getScrollBarWidth() : 0;

        // fix #61: the hidden table reset header bug.
        if (this.$el.is(':hidden')) {
            clearTimeout(this.timeoutId_); // doesn't matter if it's 0
            this.timeoutId_ = setTimeout($.proxy(this.resetHeader, this), 100); // 100ms
            return;
        }

        this.$header_ = this.$header.clone(true, true);
        this.$selectAll_ = this.$header_.find('[name="btSelectAll"]');

        // fix bug: get $el.css('width') error sometime (height = 500)
        setTimeout(function () {
            $fixedHeader.css({
                'height': '37px',
                'border-bottom': '1px solid #dddddd',
                'margin-right': scrollWidth
            }).find('table').css('width', that.$el.css('width'))
                .html('').attr('class', that.$el.attr('class'))
                .append(that.$header_);

            // fix bug: $.data() is not working as expected after $.append()
            that.$header.find('th').each(function (i) {
                that.$header_.find('th').eq(i).data($(this).data());
            });

            that.$body.find('tr:first-child:not(.no-records-found) > *').each(function(i) {
                that.$header_.find('div.fht-cell').eq(i).width($(this).innerWidth());
            });

            that.$el.css('margin-top', -that.$header.height());

            // horizontal scroll event
            $fixedBody.off('scroll').on('scroll', function () {
                $fixedHeader.scrollLeft($(this).scrollLeft());
            });
        });
    };

    BootstrapTable.prototype.toggleColumn = function (index, checked, needUpdate) {
        if (index === -1) {
            return;
        }
        this.options.columns[index].visible = checked;
        this.initHeader();
        this.initSearch();
        this.initPagination();
        this.initBody();

        if (this.options.showColumns) {
            var $items = this.$toolbar.find('.keep-open input').prop('disabled', false);

            if (needUpdate) {
                $items.filter(sprintf('[value="%s"]', index)).prop('checked', checked);
            }

            if ($items.filter(':checked').length <= this.options.minimumCountColumns) {
                $items.filter(':checked').prop('disabled', true);
            }
        }
    };

    // PUBLIC FUNCTION DEFINITION
    // =======================

    BootstrapTable.prototype.resetView = function (params) {
        var that = this,
            header = this.header;

        if (params && params.height) {
            this.options.height = params.height;
        }

        this.$selectAll.prop('checked', this.$selectItem.length > 0 &&
            this.$selectItem.length === this.$selectItem.filter(':checked').length);

        if (this.options.height) {
            var toolbarHeight = +this.$toolbar.children().outerHeight(true),
                paginationHeight = +this.$pagination.children().outerHeight(true),
                height = this.options.height - toolbarHeight - paginationHeight;

            this.$container.find('.fixed-table-container').css('height', height + 'px');
        }

        if (this.options.cardView) {
            // remove the element css
            that.$el.css('margin-top', '0');
            that.$container.find('.fixed-table-container').css('padding-bottom', '0');
            return;
        }

        if (this.options.showHeader && this.options.height) {
            this.resetHeader();
        }

        if (this.options.height && this.options.showHeader) {
            this.$container.find('.fixed-table-container').css('padding-bottom', '37px');
        }
    };

    BootstrapTable.prototype.getData = function () {
        return this.searchText ? this.data : this.options.data;
    };

    BootstrapTable.prototype.load = function (data) {
        this.initData(data);
        this.initSearch();
        this.initPagination();
        this.initBody();
    };

    BootstrapTable.prototype.append = function (data) {
        this.initData(data, true);
        this.initSearch();
        this.initPagination();
        this.initBody(true);
    };

    BootstrapTable.prototype.remove = function (params) {
        var len = this.options.data.length,
            i, row;

        if (!params.hasOwnProperty('field') || !params.hasOwnProperty('values')) {
            return;
        }

        for (i = len - 1; i >= 0; i--) {
            row = this.options.data[i];

            if (!row.hasOwnProperty(params.field)) {
                return;
            }
            if ($.inArray(row[params.field], params.values) !== -1) {
                this.options.data.splice(i, 1);
            }
        }

        if (len === this.options.data.length) {
            return;
        }

        this.initSearch();
        this.initPagination();
        this.initBody(true);
    };

    BootstrapTable.prototype.updateRow = function (params) {
        if (!params.hasOwnProperty('index') || !params.hasOwnProperty('row')) {
            return;
        }
        $.extend(this.data[params.index], params.row);
        this.initBody();
    };

    BootstrapTable.prototype.mergeCells = function (options) {
        var row = options.index,
            col = $.inArray(options.field, this.header.fields),
            rowspan = options.rowspan || 1,
            colspan = options.colspan || 1,
            i, j,
            $tr = this.$body.find('tr'),
            $td = $tr.eq(row).find('td').eq(col);

        if (row < 0 || col < 0 || row >= this.data.length) {
            return;
        }

        for (i = row; i < row + rowspan; i++) {
            for (j = col; j < col + colspan; j++) {
                $tr.eq(i).find('td').eq(j).hide();
            }
        }

        $td.attr('rowspan', rowspan).attr('colspan', colspan)
            .show(10, $.proxy(this.resetView, this));
    };

    BootstrapTable.prototype.getSelections = function () {
        var that = this;

        return $.grep(this.data, function (row) {
            return row[that.header.stateField];
        });
    };

    BootstrapTable.prototype.checkAll = function () {
        this.$selectAll.add(this.$selectAll_).prop('checked', true);
        this.$selectItem.filter(':enabled').prop('checked', true);
        this.updateRows(true);
        this.updateSelected();
        this.trigger('check-all');
    };

    BootstrapTable.prototype.uncheckAll = function () {
        this.$selectAll.add(this.$selectAll_).prop('checked', false);
        this.$selectItem.filter(':enabled').prop('checked', false);
        this.updateRows(false);
        this.updateSelected();
        this.trigger('uncheck-all');
    };

    BootstrapTable.prototype.destroy = function () {
        this.$el.insertBefore(this.$container);
        $(this.options.toolbar).insertBefore(this.$el);
        this.$container.next().remove();
        this.$container.remove();
        this.$el.html(this.$el_.html())
            .attr('class', this.$el_.attr('class') || ''); // reset the class
    };

    BootstrapTable.prototype.showLoading = function () {
        this.$loading.show();
    };

    BootstrapTable.prototype.hideLoading = function () {
        this.$loading.hide();
    };

    BootstrapTable.prototype.refresh = function (params) {
        if (params && params.url) {
            this.options.url = params.url;
        }
        this.initServer(params && params.silent);
    };

    BootstrapTable.prototype.showColumn = function (field) {
        this.toggleColumn(getFieldIndex(this.options.columns, field), true, true);
    };

    BootstrapTable.prototype.hideColumn = function (field) {
        this.toggleColumn(getFieldIndex(this.options.columns, field), false, true);
    };


    // BOOTSTRAP TABLE PLUGIN DEFINITION
    // =======================

    var allowedMethods = [
        'getSelections', 'getData',
        'load', 'append', 'remove',
        'updateRow',
        'mergeCells',
        'checkAll', 'uncheckAll',
        'refresh',
        'resetView',
        'destroy',
        'showLoading', 'hideLoading',
        'showColumn', 'hideColumn'
    ];

    $.fn.bootstrapTable = function (option, _relatedTarget) {
        var value;

        this.each(function () {
            var $this = $(this),
                data = $this.data('bootstrap.table'),
                options = $.extend({}, BootstrapTable.DEFAULTS, $this.data(),
                    typeof option === 'object' && option);

            if (typeof option === 'string') {
                if ($.inArray(option, allowedMethods) < 0) {
                    throw "Unknown method: " + option;
                }

                if (!data) {
                    return;
                }

                value = data[option](_relatedTarget);

                if (option === 'destroy') {
                    $this.removeData('bootstrap.table');
                }
            }

            if (!data) {
                $this.data('bootstrap.table', (data = new BootstrapTable(this, options)));
            }
        });

        return typeof value === 'undefined' ? this : value;
    };

    $.fn.bootstrapTable.Constructor = BootstrapTable;
    $.fn.bootstrapTable.defaults = BootstrapTable.DEFAULTS;
    $.fn.bootstrapTable.columnDefaults = BootstrapTable.COLUMN_DEFAULTS;
    $.fn.bootstrapTable.methods = allowedMethods;

    // BOOTSTRAP TABLE INIT
    // =======================

    $(function () {
        $('[data-toggle="table"]').bootstrapTable();
    });

}(jQuery);

///#source 1 1 /JavaScript-Mvc-framework/libs/bootstrap-table-filter.js
!function ($) {

    'use strict';

    // TOOLS DEFINITION
    // ======================
    var rowLabel = function (el) {
        return typeof el === 'object' ? el.label : el;
    };
    var rowId = function (el) {
        return typeof el === 'object' ? el.id : el;
    };
    var getOptionData = function ($option) {
        var val = false;
        var name;
        var data = {}, cnt = 0;
        var $chck = $option.find('.filter-enabled');
        $(':input', $option).each(function () {
            var $this = $(this);
            if ($this.is($chck)) {
                return;
            }
            name = $this.attr('data-name');
            if (name) {
                data[name] = $this.val();
            }
            val = $this.val();
            cnt++;
        });
        return $.isEmptyObject(data) ? val : data;
    };


    // FILTER CLASS DEFINITION
    // ======================

    var BootstrapTableFilter = function (el, options) {
        this.options = options;
        this.$el = $(el);
        this.$el_ = this.$el.clone();
        this.timeoutId_ = 0;
        this.filters = {};

        this.init();
    };

    BootstrapTableFilter.DEFAULTS = {
        filters: [],
        connectTo: false,

        onAll: function (name, args) {
            return false;
        },
        onFilterChanged: function (data) {
            return false;
        },
        onResetView: function () {
            return false;
        },
        onAddFilter: function (filter) {
            return false;
        },
        onRemoveFilter: function (field) {
            return false;
        },
        onEnableFilter: function (field) {
            return false;
        },
        onDisableFilter: function (field) {
            return false;
        },
        onSelectFilterOption: function (field, option, data) {
            return false;
        },
        onUnselectFilterOption: function (field, option) {
            return false;
        },
        onDataChanged: function (data) {
            return false;
        },
        onSubmit: function (data) {
            return false;
        },
    };

    BootstrapTableFilter.EVENTS = {
        'all.bs.table.filter': 'onAll',
        'reset.bs.table.filter': 'onResetView',
        'add-filter.bs.table.filter': 'onAddFilter',
        'remove-filter.bs.table.filter': 'onRemoveFilter',
        'enable-filter.bs.table.filter': 'onEnableFilter',
        'disable-filter.bs.table.filter': 'onDisableFilter',
        'select-filter-option.bs.table.filter': 'onSelectFilterOption',
        'unselect-filter-option.bs.table.filter': 'onUnselectFilterOption',
        'data-changed.bs.table.filter': 'onDataChanged',
        'submit.bs.table.filter': 'onSubmit'
    };

    BootstrapTableFilter.FILTER_SOURCES = {
        range: {
            search: false,
            rows: [
                { id: 'lte', label: 'Less than <input class="form-control" type="text">' },
                { id: 'gte', label: 'More than <input class="form-control" type="text">' },
                { id: 'eq', label: 'Equals <input class="form-control" type="text">' }
            ],
            check: function (filterData, value) {
                if (typeof filterData.lte !== 'undefined' && parseInt(value) > parseInt(filterData.lte)) {
                    return false;
                }
                if (typeof filterData.gte !== 'undefined' && parseInt(value) < parseInt(filterData.gte)) {
                    return false;
                }
                if (typeof filterData.eq !== 'undefined' && parseInt(value) != parseInt(filterData.eq)) {
                    return false;
                }
                return true;
            }
        },
        ajaxSelect: {
            search: true,
            rows: [],
            rowsCallback: function (filter, searchPhrase) {
                var that = this;
                $.ajax(filter.source, { dataType: 'json', data: { q: searchPhrase } })
                .done(function (data) {
                    that.clearFilterOptions(filter.field);
                    that.fillFilterOptions(filter.field, data);
                });
            }
        },
        select: {
            search: true,
            rows: [],
            rowsCallback: function (filter, searchPhrase) {
                var vals = filter.values;
                var label;
                if (searchPhrase.length) {
                    vals = vals.filter(function (el) {
                        return rowLabel(el).indexOf(searchPhrase) > -1
                    });
                }
                this.clearFilterOptions(filter.field);
                this.fillFilterOptions(filter.field, vals.slice(0, 20));
            }
        }
    };

    BootstrapTableFilter.EXTERNALS = [];

    BootstrapTableFilter.prototype.init = function () {
        this.initContainer();
        this.initMainButton();
        this.initFilters();
        this.initRefreshButton();
        this.initFilterSelector();
        this.initExternals();
    };

    BootstrapTableFilter.prototype.initContainer = function () {
        var that = this;
        this.$toolbar = $([
            '<div class="btn-toolbar">',
                '<div class="btn-group btn-group-filter-main">',
                    '<button type="button" class="btn btn-default dropdown-toggle btn-filter" data-toggle="dropdown">',
                        '<span class="glyphicon glyphicon-filter"></span>',
                    '</button>',
                    '<ul class="dropdown-menu" role="menu">',
                    '</ul>',
                '</div>',
                '<div class="btn-group btn-group-filters">',
                '</div>',
                '<div class="btn-group btn-group-filter-refresh">',
                    '<button type="button" class="btn btn-default btn-primary btn-refresh" data-toggle="dropdown">',
                        '<span class="glyphicon glyphicon-repeat"></span>',
                    '</button>',
                '</div>',
            '</div>'
        ].join(''));
        this.$toolbar.appendTo(this.$el);
        this.$filters = this.$toolbar.find('.btn-group-filters');

        this.$toolbar.delegate('.btn-group-filters li', 'click', function (e) {
            e.stopImmediatePropagation();
        });

        this.$toolbar.delegate('.btn-group-filters li .filter-enabled', 'click', function (e) {
            var $chck = $(this);
            var field = $chck.closest('[data-filter-field]').attr('data-filter-field');
            var $option = $chck.closest('[data-val]');
            var option = $option.attr('data-val');
            if ($chck.prop('checked')) {
                var data = getOptionData($option);
                that.selectFilterOption(field, option, data);
            }
            else {
                that.unselectFilterOption(field, option);
            }
            e.stopImmediatePropagation();
        });
        this.$toolbar.delegate('.btn-group-filters li :input:not(.filter-enabled)', 'click change', function (e) {
            var $inp = $(this);
            var field = $inp.closest('[data-filter-field]').attr('data-filter-field');
            var $option = $inp.closest('[data-val]');
            var option = $option.attr('data-val');
            var $chck = $option.find('.filter-enabled');
            if ($inp.val()) {
                var data = getOptionData($option);
                that.selectFilterOption(field, option, data);
                $chck.prop('checked', true);
            }
            else {
                that.unselectFilterOption(field, option);
                $chck.prop('checked', false);
            }
            e.stopImmediatePropagation();
        });
        this.$toolbar.delegate('.search-values', 'keyup', function (e) {
            var $this = $(this);
            var phrase = $this.val();
            var field = $this.closest('[data-filter-field]').attr('data-filter-field');
            var filter = that.getFilter(field);
            var fType = that.getFilterType(filter);
            if (fType.rowsCallback) {
                fType.rowsCallback.call(that, filter, phrase);
            }
        });
    };

    BootstrapTableFilter.prototype.initMainButton = function () {
        this.$button = this.$toolbar.find('.btn-filter');
        this.$buttonList = this.$button.parent().find('.dropdown-menu');
        this.$button.dropdown();
    };

    BootstrapTableFilter.prototype.initRefreshButton = function () {
        var that = this;
        this.$refreshButton = this.$toolbar.find('.btn-refresh');
        this.$refreshButton.click(function (e) {
            that.trigger('submit', that.getData());
        });
    };

    BootstrapTableFilter.prototype.initFilters = function () {
        var that = this;
        this.$buttonList.append('<li class="remove-filters"><a href="javascript:void(0)"><span class="glyphicon glyphicon-remove"></span> Remove all filters</a></li>');
        this.$buttonList.append('<li class="divider"></li>');
        $.each(this.options.filters, function (i, filter) {
            that.addFilter(filter);
        });
        this.$toolbar.delegate('.remove-filters *', 'click', function () {
            $.each(that.filters, function (i, filter) {
                that.disableFilter(filter.field)
            });
        });
    };

    BootstrapTableFilter.prototype.initFilterSelector = function () {
        var that = this;
        var applyFilter = function ($chck) {
            var filterField = $chck.closest('[data-filter-field]').attr('data-filter-field');
            if ($chck.prop('checked')) {
                that.enableFilter(filterField);
            }
            else {
                that.disableFilter(filterField);
            }
        };
        this.$buttonList.delegate('li :input[type=checkbox]', 'click', function (e) {
            applyFilter($(this));
            e.stopImmediatePropagation();
        });
        this.$buttonList.delegate('li, li a', 'click', function (e) {
            var $chck = $(':input[type=checkbox]', this);
            if ($chck.length) {
                $chck.prop('checked', !$chck.is(':checked'));
                applyFilter($chck);
                e.stopImmediatePropagation();
            }
            var $inp = $(':input[type=text]', this);
            if ($inp.length) {
                $inp.focus();
            }
        });
    };

    BootstrapTableFilter.prototype.initExternals = function () {
        var that = this;
        $.each(BootstrapTableFilter.EXTERNALS, function (i, ext) {
            ext.call(that);
        });
    }

    BootstrapTableFilter.prototype.getFilter = function (field) {
        if (typeof this.filters[field] === 'undefined') {
            throw 'Invalid filter ' + field;
        }
        return this.filters[field];
    };
    BootstrapTableFilter.prototype.getFilterType = function (field, type) {
        if (field) {
            var filter = typeof field === 'object' ? field : this.getFilter(field);
            type = filter.type;
        }
        if (typeof BootstrapTableFilter.FILTER_SOURCES[type] === 'undefined') {
            throw 'Invalid filter type ' + type;
        }
        var ret = BootstrapTableFilter.FILTER_SOURCES[type];
        if (typeof ret.extend !== 'undefined') {
            ret = $.extend({}, ret, this.getFilterType(null, ret.extend));
        }
        return ret;
    };
    BootstrapTableFilter.prototype.checkFilterTypeValue = function (filterType, filterData, value) {
        if (typeof filterType.check === 'function') {
            return filterType.check(filterData, value);
        }
        else {
            if (typeof filterData._values !== 'undefined') {
                return $.inArray(value, filterData._values) >= 0;
            }
        }
    };

    BootstrapTableFilter.prototype.clearFilterOptions = function (field) {
        var filter = this.getFilter(field);
        filter.$dropdownList.find('li:not(.static)').remove();
    };

    BootstrapTableFilter.prototype.fillFilterOptions = function (field, data, cls) {
        var that = this;
        var filter = this.getFilter(field);
        cls = cls || '';
        var option, checked;
        $.each(data, function (i, row) {
            option = rowId(row);
            checked = that.isSelected(field, option);
            filter.$dropdownList.append($('<li data-val="' + option + '" class="' + cls + '"><a href="javascript:void(0)"><input type="checkbox" class="filter-enabled"' + (checked ? ' checked' : '') + '> ' + rowLabel(row) + '</a></li>'));
        });
    };

    BootstrapTableFilter.prototype.trigger = function (name) {
        var args = Array.prototype.slice.call(arguments, 1);

        name += '.bs.table.filter';
        if (typeof BootstrapTableFilter.EVENTS[name] === 'undefined') {
            throw 'Unknown event ' + name;
        }
        this.options[BootstrapTableFilter.EVENTS[name]].apply(this.options, args);
        this.$el.trigger($.Event(name), args);

        this.options.onAll(name, args);
        this.$el.trigger($.Event('all.bs.table.filter'), [name, args]);
    };

    // PUBLIC FUNCTION DEFINITION
    // =======================

    BootstrapTableFilter.prototype.resetView = function () {
        this.$el.html();
        this.init();
        this.trigger('reset');
    };

    BootstrapTableFilter.prototype.addFilter = function (filter) {
        this.filters[filter.field] = filter;
        this.$buttonList.append('<li data-filter-field="' + filter.field + '"><a href="javascript:void(0)"><input type="checkbox"> ' + filter.label + '</a></li>');

        this.trigger('add-filter', filter);
        if (typeof filter.enabled !== 'undefined' && filter.enabled) {
            this.enableFilter(filter.field);
        }
    };

    BootstrapTableFilter.prototype.removeFilter = function (field) {
        this.disableFilter(field);
        this.$buttonList.find('[data-filter-field=' + field + ']').remove();
        this.trigger('remove-filter', field);
    };

    BootstrapTableFilter.prototype.enableFilter = function (field) {
        var filter = this.getFilter(field);
        var $filterDropdown = $([
            '<div class="btn-group" data-filter-field="' + field + '">',
                '<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">',
                    filter.label,
                    ' <span class="caret"></span>',
                '</button>',
                '<ul class="dropdown-menu" role="menu">',
                '</ul>',
            '</div>'
        ].join(''));
        $filterDropdown.appendTo(this.$filters);
        filter.$dropdown = $filterDropdown;
        filter.$dropdownList = $filterDropdown.find('.dropdown-menu');
        filter.enabled = true;

        this.$buttonList.find('[data-filter-field=' + field + '] input[type=checkbox]').prop('checked', true);

        var fType = this.getFilterType(filter);
        if (fType.search) {
            filter.$dropdownList.append($('<li class="static"><span><input type="text" class="form-control search-values" placeholder="Search"></span></li>'));
            filter.$dropdownList.append($('<li class="static divider"></li>'));
        }
        if (fType.rows) {
            this.fillFilterOptions(field, fType.rows, 'static');
        }
        if (fType.rowsCallback) {
            fType.rowsCallback.call(this, filter, '');
        }
        this.trigger('enable-filter', filter);
    };

    BootstrapTableFilter.prototype.disableFilter = function (field) {
        var filter = this.getFilter(field);
        this.$buttonList.find('[data-filter-field=' + field + '] input[type=checkbox]').prop('checked', false);
        filter.enabled = false;
        if (filter.$dropdown) {
            filter.$dropdown.remove();
            delete filter.$dropdown;
            this.trigger('disable-filter', filter);
        }
    };

    BootstrapTableFilter.prototype.selectFilterOption = function (field, option, data) {
        var filter = this.getFilter(field);
        if (typeof filter.selectedOptions === 'undefined')
            filter.selectedOptions = {};
        if (data) {
            filter.selectedOptions[option] = data;
        }
        else {
            if (typeof filter.selectedOptions._values === 'undefined') {
                filter.selectedOptions._values = [];
            }
            filter.selectedOptions._values.push(option);
        }
        this.trigger('select-filter-option', field, option, data);
    };

    BootstrapTableFilter.prototype.unselectFilterOption = function (field, option) {
        var filter = this.getFilter(field);
        if (typeof filter.selectedOptions !== 'undefined' && typeof filter.selectedOptions[option] !== 'undefined') {
            delete filter.selectedOptions[option];
        }
        if (typeof filter.selectedOptions !== 'undefined' && typeof filter.selectedOptions._values !== 'undefined') {
            filter.selectedOptions._values = filter.selectedOptions._values.filter(function (item) {
                return item != option
            });
            if (filter.selectedOptions._values.length == 0) {
                delete filter.selectedOptions._values;
            }
            if ($.isEmptyObject(filter.selectedOptions)) {
                delete filter.selectedOptions;
            }
        }
        this.trigger('unselect-filter-option', field, option);
    };

    BootstrapTableFilter.prototype.isSelected = function (field, option, value) {
        var filter = this.getFilter(field);
        if (typeof filter.selectedOptions !== 'undefined') {
            if (typeof filter.selectedOptions[option] !== 'undefined') {
                if (value ? (filter.selectedOptions[option] == value) : filter.selectedOptions[option]) {
                    return true
                }
            }
            if (typeof filter.selectedOptions._values !== 'undefined') {
                if (filter.selectedOptions._values.indexOf(option.toString()) > -1) {
                    return true;
                }
            }
        }
        return false;
    };

    BootstrapTableFilter.prototype.getData = function () {
        var that = this;
        var ret = {};
        $.each(that.filters, function (field, filter) {
            if (filter.enabled) {
                if (typeof filter.selectedOptions !== 'undefined') {
                    ret[field] = filter.selectedOptions;
                }
            }
        });
        return ret;
    };

    // BOOTSTRAP FILTER TABLE PLUGIN DEFINITION
    // =======================

    $.fn.bootstrapTableFilter = function (option, _relatedTarget) {
        BootstrapTableFilter.externals = this.externals;

        var allowedMethods = [
            'addFilter', 'removeFilter',
            'enableFilter', 'disableFilter',
            'selectFilterOption', 'unselectFilterOption',
            'getData', 'isSelected',
            'resetView'
        ],
        value;

        this.each(function () {
            var $this = $(this),
                data = $this.data('bootstrap.tableFilter'),
                options = $.extend(
                    {}, BootstrapTableFilter.DEFAULTS, $this.data(),
                    typeof option === 'object' && option
                );

            if (typeof option === 'string') {
                if ($.inArray(option, allowedMethods) < 0) {
                    throw "Unknown method: " + option;
                }

                if (!data) {
                    return;
                }

                value = data[option](_relatedTarget);

                if (option === 'destroy') {
                    $this.removeData('bootstrap.tableFilter');
                }
            }

            if (!data) {
                $this.data('bootstrap.tableFilter', (data = new BootstrapTableFilter(this, options)));
            }
        });

        return typeof value === 'undefined' ? this : value;
    };

    $.fn.bootstrapTableFilter.Constructor = BootstrapTableFilter;
    $.fn.bootstrapTableFilter.defaults = BootstrapTableFilter.DEFAULTS;
    $.fn.bootstrapTableFilter.columnDefaults = BootstrapTableFilter.COLUMN_DEFAULTS;
    $.fn.bootstrapTableFilter.externals = BootstrapTableFilter.EXTERNALS;

    // BOOTSTRAP TABLE FILTER INIT
    // =======================

    $(function () {
        $('[data-toggle="tableFilter"]').bootstrapTableFilter();
    });

}(jQuery);

!function ($) {

    'use strict';

    var filterData = {};
    var bootstrapTableFilter;
    var serverUrl;

    var getTypeByValues = function (vals, useAjax) {
        var typeFloat = true, typeInt = true;
        $.each(vals, function (i, val) {
            if (typeInt && (parseInt(val) != val)) {
                typeInt = false;
            }
            if (typeFloat && (parseFloat(val) != val)) {
                typeFloat = false;
            }
        });
        if (typeInt || typeFloat) {
            return { type: 'range' };
        }
        if (useAjax) {
            return { type: 'selectAjax', source: 'XXXXX' }
        }
        return { type: 'select' };
    };
    var getCols = function (cols, data, useAjax) {
        var ret = {};
        $.each(cols, function (i, col) {
            ret[col.field] = {
                field: col.field,
                label: col.title,
                values: []
            };
        });
        $.each(data, function (i, row) {
            $.each(ret, function (field, filter) {
                if (ret[field].values.indexOf(row[field]) < 0) {
                    ret[field].values.push(row[field]);
                }
            });
        });
        $.each(ret, function (field, def) {
            ret[field] = $.extend(ret[field], getTypeByValues(def.values));
        });
        return ret;
    };
    var rowFilter = function (item, i) {
        var filterType;
        var ret = true;
        $.each(item, function (field, value) {
            filterType = false;
            try {
                filterType = bootstrapTableFilter.getFilterType(field);
                if (filterType && typeof filterData[field] !== 'undefined') {
                    ret = ret && bootstrapTableFilter.checkFilterTypeValue(filterType, filterData[field], value);
                }
            }
            catch (e) { }
        });
        return ret;
    };

    $.fn.bootstrapTableFilter.externals.push(function () {
        if (this.options.connectTo) {
            bootstrapTableFilter = this;
            var $bootstrapTable = $(this.options.connectTo);
            var data = $bootstrapTable.bootstrapTable('getData');
            var cols = $bootstrapTable.bootstrapTable('getColumns');
            var dataSourceServer = false;
            var filters = getCols(cols, data, dataSourceServer);

            $.each(filters, function (field, filter) {
                bootstrapTableFilter.addFilter(filter);
            });
            serverUrl = $bootstrapTable.bootstrapTable('getServerUrl');
            if (serverUrl) {
                this.$el.on('submit.bs.table.filter', function () {
                    filterData = bootstrapTableFilter.getData();
                    var delimiter = serverUrl.indexOf('?') < 0 ? '?' : '&';
                    var url = serverUrl + delimiter + 'filter=' + encodeURIComponent(JSON.stringify(filterData));
                    //                    console.log(url);
                    $bootstrapTable.bootstrapTable('updateSearch');
                });
            }
            else {
                $bootstrapTable.bootstrapTable('registerSearchCallback', rowFilter);
                this.$el.on('submit.bs.table.filter', function () {
                    filterData = bootstrapTableFilter.getData();
                    $bootstrapTable.bootstrapTable('updateSearch');
                });
            }
        }
    });

}(jQuery);

/**
 * @author zhixin wen <wenzhixin2010@gmail.com>
 * extensions: https://github.com/lukaskral/bootstrap-table-filter
 */

!function ($) {

    'use strict';

    $.extend($.fn.bootstrapTable.defaults, {
        showFilter: false
    });

    var BootstrapTable = $.fn.bootstrapTable.Constructor,
        _init = BootstrapTable.prototype.init,
        _initSearch = BootstrapTable.prototype.initSearch;

    BootstrapTable.prototype.init = function () {
        _init.apply(this, Array.prototype.slice.apply(arguments));

        var that = this;
        this.$el.on('load-success.bs.table', function () {
            if (that.options.showFilter) {
                $(that.options.toolbar).bootstrapTableFilter({
                    connectTo: that.$el
                });
            }
        });
    };

    BootstrapTable.prototype.initSearch = function () {
        _initSearch.apply(this, Array.prototype.slice.apply(arguments));

        if (this.options.sidePagination !== 'server') {
            if (typeof this.searchCallback === 'function') {
                this.data = $.grep(this.options.data, this.searchCallback);
            }
        }
    };

    BootstrapTable.prototype.getData = function () {
        return (this.searchText || this.searchCallback) ? this.data : this.options.data;
    };

    BootstrapTable.prototype.getColumns = function () {
        return this.options.columns;
    };

    BootstrapTable.prototype.registerSearchCallback = function (callback) {
        this.searchCallback = callback;
    };

    BootstrapTable.prototype.updateSearch = function () {
        this.options.pageNumber = 1;
        this.initSearch();
        this.updatePagination();
    };

    BootstrapTable.prototype.getServerUrl = function () {
        return (this.options.sidePagination === 'server') ? this.options.url : false;
    };

    $.fn.bootstrapTable.methods.push('getColumns',
        'registerSearchCallback', 'updateSearch',
        'getServerUrl');

}(jQuery);
///#source 1 1 /JavaScript-Mvc-framework/libs/bootstrap-table-export.js
/*jslint adsafe: false, bitwise: true, browser: true, cap: false, css: false,
  debug: false, devel: true, eqeqeq: true, es5: false, evil: false,
  forin: false, fragment: false, immed: true, laxbreak: false, newcap: true,
  nomen: false, on: false, onevar: true, passfail: false, plusplus: true,
  regexp: false, rhino: true, safe: false, strict: false, sub: false,
  undef: true, white: false, widget: false, windows: false */
/*global jQuery: false, window: false */
//"use strict";

/*
 * Original code (c) 2010 Nick Galbreath
 * http://code.google.com/p/stringencoders/source/browse/#svn/trunk/javascript
 *
 * jQuery port (c) 2010 Carlo Zottmann
 * http://github.com/carlo/jquery-base64
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
*/

/* base64 encode/decode compatible with window.btoa/atob
 *
 * window.atob/btoa is a Firefox extension to convert binary data (the "b")
 * to base64 (ascii, the "a").
 *
 * It is also found in Safari and Chrome.  It is not available in IE.
 *
 * if (!window.btoa) window.btoa = $.base64.encode
 * if (!window.atob) window.atob = $.base64.decode
 *
 * The original spec's for atob/btoa are a bit lacking
 * https://developer.mozilla.org/en/DOM/window.atob
 * https://developer.mozilla.org/en/DOM/window.btoa
 *
 * window.btoa and $.base64.encode takes a string where charCodeAt is [0,255]
 * If any character is not [0,255], then an exception is thrown.
 *
 * window.atob and $.base64.decode take a base64-encoded string
 * If the input length is not a multiple of 4, or contains invalid characters
 *   then an exception is thrown.
 */

jQuery.base64 = (function ($) {

    var _PADCHAR = "=",
      _ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
      _VERSION = "1.0";


    function _getbyte64(s, i) {
        // This is oddly fast, except on Chrome/V8.
        // Minimal or no improvement in performance by using a
        // object with properties mapping chars to value (eg. 'A': 0)

        var idx = _ALPHA.indexOf(s.charAt(i));

        if (idx === -1) {
            throw "Cannot decode base64";
        }

        return idx;
    }


    function _decode(s) {
        var pads = 0,
          i,
          b10,
          imax = s.length,
          x = [];

        s = String(s);

        if (imax === 0) {
            return s;
        }

        if (imax % 4 !== 0) {
            throw "Cannot decode base64";
        }

        if (s.charAt(imax - 1) === _PADCHAR) {
            pads = 1;

            if (s.charAt(imax - 2) === _PADCHAR) {
                pads = 2;
            }

            // either way, we want to ignore this last block
            imax -= 4;
        }

        for (i = 0; i < imax; i += 4) {
            b10 = (_getbyte64(s, i) << 18) | (_getbyte64(s, i + 1) << 12) | (_getbyte64(s, i + 2) << 6) | _getbyte64(s, i + 3);
            x.push(String.fromCharCode(b10 >> 16, (b10 >> 8) & 0xff, b10 & 0xff));
        }

        switch (pads) {
            case 1:
                b10 = (_getbyte64(s, i) << 18) | (_getbyte64(s, i + 1) << 12) | (_getbyte64(s, i + 2) << 6);
                x.push(String.fromCharCode(b10 >> 16, (b10 >> 8) & 0xff));
                break;

            case 2:
                b10 = (_getbyte64(s, i) << 18) | (_getbyte64(s, i + 1) << 12);
                x.push(String.fromCharCode(b10 >> 16));
                break;
        }

        return x.join("");
    }


    function _getbyte(s, i) {
        var x = s.charCodeAt(i);

        if (x > 255) {
            throw "INVALID_CHARACTER_ERR: DOM Exception 5";
        }

        return x;
    }


    function _encode(s) {
        if (arguments.length !== 1) {
            throw "SyntaxError: exactly one argument required";
        }

        s = String(s);

        var i,
          b10,
          x = [],
          imax = s.length - s.length % 3;

        if (s.length === 0) {
            return s;
        }

        for (i = 0; i < imax; i += 3) {
            b10 = (_getbyte(s, i) << 16) | (_getbyte(s, i + 1) << 8) | _getbyte(s, i + 2);
            x.push(_ALPHA.charAt(b10 >> 18));
            x.push(_ALPHA.charAt((b10 >> 12) & 0x3F));
            x.push(_ALPHA.charAt((b10 >> 6) & 0x3f));
            x.push(_ALPHA.charAt(b10 & 0x3f));
        }

        switch (s.length - imax) {
            case 1:
                b10 = _getbyte(s, i) << 16;
                x.push(_ALPHA.charAt(b10 >> 18) + _ALPHA.charAt((b10 >> 12) & 0x3F) + _PADCHAR + _PADCHAR);
                break;

            case 2:
                b10 = (_getbyte(s, i) << 16) | (_getbyte(s, i + 1) << 8);
                x.push(_ALPHA.charAt(b10 >> 18) + _ALPHA.charAt((b10 >> 12) & 0x3F) + _ALPHA.charAt((b10 >> 6) & 0x3f) + _PADCHAR);
                break;
        }

        return x.join("");
    }


    return {
        decode: _decode,
        encode: _encode,
        VERSION: _VERSION
    };

}(jQuery));

/*The MIT License (MIT)

Copyright (c) 2014 https://github.com/kayalshri/

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.*/

(function ($) {
    $.fn.extend({
        tableExport: function (options) {
            var defaults = {
                separator: ',',
                ignoreColumn: [],
                tableName: 'yourTableName',
                type: 'csv',
                pdfFontSize: 14,
                pdfLeftMargin: 20,
                escape: 'true',
                htmlContent: 'false',
                consoleLog: 'false'
            };

            var options = $.extend(defaults, options);
            var el = this;

            if (defaults.type == 'csv' || defaults.type == 'txt') {

                // Header
                var tdData = "";
                $(el).find('thead').find('tr').each(function () {
                    tdData += "\n";
                    $(this).filter(':visible').find('th').each(function (index, data) {
                        if ($(this).css('display') != 'none') {
                            if (defaults.ignoreColumn.indexOf(index) == -1) {
                                tdData += '"' + parseString($(this)) + '"' + defaults.separator;
                            }
                        }

                    });
                    tdData = $.trim(tdData);
                    tdData = $.trim(tdData).substring(0, tdData.length - 1);
                });

                // Row vs Column
                $(el).find('tbody').find('tr').each(function () {
                    tdData += "\n";
                    $(this).filter(':visible').find('td').each(function (index, data) {
                        if ($(this).css('display') != 'none') {
                            if (defaults.ignoreColumn.indexOf(index) == -1) {
                                tdData += '"' + parseString($(this)) + '"' + defaults.separator;
                            }
                        }
                    });
                    //tdData = $.trim(tdData);
                    tdData = $.trim(tdData).substring(0, tdData.length - 1);
                });

                //output
                if (defaults.consoleLog == 'true') {
                    console.log(tdData);
                }
                var base64data = "base64," + $.base64.encode(tdData);
                window.open('data:application/' + defaults.type + ';filename=exportData;' + base64data);
            } else if (defaults.type == 'sql') {

                // Header
                var tdData = "INSERT INTO `" + defaults.tableName + "` (";
                $(el).find('thead').find('tr').each(function () {

                    $(this).filter(':visible').find('th').each(function (index, data) {
                        if ($(this).css('display') != 'none') {
                            if (defaults.ignoreColumn.indexOf(index) == -1) {
                                tdData += '`' + parseString($(this)) + '`,';
                            }
                        }

                    });
                    tdData = $.trim(tdData);
                    tdData = $.trim(tdData).substring(0, tdData.length - 1);
                });
                tdData += ") VALUES ";
                // Row vs Column
                $(el).find('tbody').find('tr').each(function () {
                    tdData += "(";
                    $(this).filter(':visible').find('td').each(function (index, data) {
                        if ($(this).css('display') != 'none') {
                            if (defaults.ignoreColumn.indexOf(index) == -1) {
                                tdData += '"' + parseString($(this)) + '",';
                            }
                        }
                    });

                    tdData = $.trim(tdData).substring(0, tdData.length - 1);
                    tdData += "),";
                });
                tdData = $.trim(tdData).substring(0, tdData.length - 1);
                tdData += ";";

                //output
                //console.log(tdData);

                if (defaults.consoleLog == 'true') {
                    console.log(tdData);
                }

                var base64data = "base64," + $.base64.encode(tdData);
                window.open('data:application/sql;filename=exportData;' + base64data);


            } else if (defaults.type == 'json') {

                var jsonHeaderArray = [];
                $(el).find('thead').find('tr').each(function () {
                    var tdData = "";
                    var jsonArrayTd = [];

                    $(this).filter(':visible').find('th').each(function (index, data) {
                        if ($(this).css('display') != 'none') {
                            if (defaults.ignoreColumn.indexOf(index) == -1) {
                                jsonArrayTd.push(parseString($(this)));
                            }
                        }
                    });
                    jsonHeaderArray.push(jsonArrayTd);

                });

                var jsonArray = [];
                $(el).find('tbody').find('tr').each(function () {
                    var tdData = "";
                    var jsonArrayTd = [];

                    $(this).filter(':visible').find('td').each(function (index, data) {
                        if ($(this).css('display') != 'none') {
                            if (defaults.ignoreColumn.indexOf(index) == -1) {
                                jsonArrayTd.push(parseString($(this)));
                            }
                        }
                    });
                    jsonArray.push(jsonArrayTd);

                });

                var jsonExportArray = [];
                jsonExportArray.push({ header: jsonHeaderArray, data: jsonArray });

                //Return as JSON
                //console.log(JSON.stringify(jsonExportArray));

                //Return as Array
                //console.log(jsonExportArray);
                if (defaults.consoleLog == 'true') {
                    console.log(JSON.stringify(jsonExportArray));
                }
                var base64data = "base64," + $.base64.encode(JSON.stringify(jsonExportArray));
                window.open('data:application/json;filename=exportData;' + base64data);
            } else if (defaults.type == 'xml') {

                var xml = '<?xml version="1.0" encoding="utf-8"?>';
                xml += '<tabledata><fields>';

                // Header
                $(el).find('thead').find('tr').each(function () {
                    $(this).filter(':visible').find('th').each(function (index, data) {
                        if ($(this).css('display') != 'none') {
                            if (defaults.ignoreColumn.indexOf(index) == -1) {
                                xml += "<field>" + parseString($(this)) + "</field>";
                            }
                        }
                    });
                });
                xml += '</fields><data>';

                // Row Vs Column
                var rowCount = 1;
                $(el).find('tbody').find('tr').each(function () {
                    xml += '<row id="' + rowCount + '">';
                    var colCount = 0;
                    $(this).filter(':visible').find('td').each(function (index, data) {
                        if ($(this).css('display') != 'none') {
                            if (defaults.ignoreColumn.indexOf(index) == -1) {
                                xml += "<column-" + colCount + ">" + parseString($(this)) + "</column-" + colCount + ">";
                            }
                        }
                        colCount++;
                    });
                    rowCount++;
                    xml += '</row>';
                });
                xml += '</data></tabledata>'

                if (defaults.consoleLog == 'true') {
                    console.log(xml);
                }

                var base64data = "base64," + $.base64.encode(xml);
                window.open('data:application/xml;filename=exportData;' + base64data);

            } else if (defaults.type == 'excel' || defaults.type == 'doc' || defaults.type == 'powerpoint') {
                //console.log($(this).html());
                var excel = "<table>";
                // Header
                $(el).find('thead').find('tr').each(function () {
                    excel += "<tr>";
                    $(this).filter(':visible').find('th').each(function (index, data) {
                        if ($(this).css('display') != 'none') {
                            if (defaults.ignoreColumn.indexOf(index) == -1) {
                                excel += "<td>" + parseString($(this)) + "</td>";
                            }
                        }
                    });
                    excel += '</tr>';

                });


                // Row Vs Column
                var rowCount = 1;
                $(el).find('tbody').find('tr').each(function () {
                    excel += "<tr>";
                    var colCount = 0;
                    $(this).filter(':visible').find('td').each(function (index, data) {
                        if ($(this).css('display') != 'none') {
                            if (defaults.ignoreColumn.indexOf(index) == -1) {
                                excel += "<td>" + parseString($(this)) + "</td>";
                            }
                        }
                        colCount++;
                    });
                    rowCount++;
                    excel += '</tr>';
                });
                excel += '</table>'

                if (defaults.consoleLog == 'true') {
                    console.log(excel);
                }

                var excelFile = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:x='urn:schemas-microsoft-com:office:" + defaults.type + "' xmlns='http://www.w3.org/TR/REC-html40'>";
                excelFile += "<head>";
                excelFile += "<!--[if gte mso 9]>";
                excelFile += "<xml>";
                excelFile += "<x:ExcelWorkbook>";
                excelFile += "<x:ExcelWorksheets>";
                excelFile += "<x:ExcelWorksheet>";
                excelFile += "<x:Name>";
                excelFile += "{worksheet}";
                excelFile += "</x:Name>";
                excelFile += "<x:WorksheetOptions>";
                excelFile += "<x:DisplayGridlines/>";
                excelFile += "</x:WorksheetOptions>";
                excelFile += "</x:ExcelWorksheet>";
                excelFile += "</x:ExcelWorksheets>";
                excelFile += "</x:ExcelWorkbook>";
                excelFile += "</xml>";
                excelFile += "<![endif]-->";
                excelFile += "</head>";
                excelFile += "<body>";
                excelFile += excel;
                excelFile += "</body>";
                excelFile += "</html>";

                var base64data = "base64," + $.base64.encode(excelFile);
                window.open('data:application/vnd.ms-' + defaults.type + ';filename=exportData.doc;' + base64data);

            } else if (defaults.type == 'png') {
                html2canvas($(el), {
                    onrendered: function (canvas) {
                        var img = canvas.toDataURL("image/png");
                        window.open(img);


                    }
                });
            } else if (defaults.type == 'pdf') {

                var doc = new jsPDF('p', 'pt', 'a4', true);
                doc.setFontSize(defaults.pdfFontSize);

                // Header
                var startColPosition = defaults.pdfLeftMargin;
                $(el).find('thead').find('tr').each(function () {
                    $(this).filter(':visible').find('th').each(function (index, data) {
                        if ($(this).css('display') != 'none') {
                            if (defaults.ignoreColumn.indexOf(index) == -1) {
                                var colPosition = startColPosition + (index * 50);
                                doc.text(colPosition, 20, parseString($(this)));
                            }
                        }
                    });
                });


                // Row Vs Column
                var startRowPosition = 20; var page = 1; var rowPosition = 0;
                $(el).find('tbody').find('tr').each(function (index, data) {
                    rowCalc = index + 1;

                    if (rowCalc % 26 == 0) {
                        doc.addPage();
                        page++;
                        startRowPosition = startRowPosition + 10;
                    }
                    rowPosition = (startRowPosition + (rowCalc * 10)) - ((page - 1) * 280);

                    $(this).filter(':visible').find('td').each(function (index, data) {
                        if ($(this).css('display') != 'none') {
                            if (defaults.ignoreColumn.indexOf(index) == -1) {
                                var colPosition = startColPosition + (index * 50);
                                doc.text(colPosition, rowPosition, parseString($(this)));
                            }
                        }

                    });

                });

                // Output as Data URI
                doc.output('datauri');

            }


            function parseString(data) {

                if (defaults.htmlContent == 'true') {
                    content_data = data.html().trim();
                } else {
                    content_data = data.text().trim();
                }

                if (defaults.escape == 'true') {
                    content_data = escape(content_data);
                }



                return content_data;
            }

        }
    });
})(jQuery);


/**
 * @author zhixin wen <wenzhixin2010@gmail.com>
 * extensions: https://github.com/kayalshri/tableExport.jquery.plugin
 */

(function ($) {
    'use strict';

    var TYPE_NAME = {
        json: 'JSON',
        xml: 'XML',
        png: 'PNG',
        csv: 'CSV',
        txt: 'TXT',
        sql: 'SQL',
        doc: 'MS-Word',
        excel: 'Ms-Excel',
        powerpoint: 'Ms-Powerpoint',
        pdf: 'PDF'
    };

    $.extend($.fn.bootstrapTable.defaults, {
        showExport: false,
        // 'json', 'xml', 'png', 'csv', 'txt', 'sql', 'doc', 'excel', 'powerpoint', 'pdf'
        exportTypes: ['json', 'xml', 'csv', 'txt', 'sql', 'excel']
    });

    var BootstrapTable = $.fn.bootstrapTable.Constructor,
        _initToolbar = BootstrapTable.prototype.initToolbar;

    BootstrapTable.prototype.initToolbar = function () {
        _initToolbar.apply(this, Array.prototype.slice.apply(arguments));

        if (this.options.showExport) {
            var that = this,
                $btnGroup = this.$toolbar.find('>.btn-group'),
                $export = $btnGroup.find('div.export');

            if (!$export.length) {
                $export = $([
                    '<div class="export btn-group">',
                        '<button class="btn btn-default dropdown-toggle" ' +
                            'data-toggle="dropdown" type="button">',
                            '<i class="glyphicon glyphicon-export icon-share"></i> ',
                            '<span class="caret"></span>',
                        '</button>',
                        '<ul class="dropdown-menu" role="menu">',
                        '</ul>',
                    '</div>'].join('')).appendTo($btnGroup);

                var $menu = $export.find('.dropdown-menu'),
                    exportTypes = this.options.exportTypes;

                if (typeof this.options.exportTypes === 'string') {
                    var types = this.options.exportTypes.slice(1, -1).replace(/ /g, '').split(',');

                    exportTypes = [];
                    $.each(types, function (i, value) {
                        exportTypes.push(value.slice(1, -1));
                    });
                }
                $.each(exportTypes, function (i, type) {
                    if (TYPE_NAME.hasOwnProperty(type)) {
                        $menu.append(['<li data-type="' + type + '">',
                                '<a href="javascript:void(0)">',
                                    TYPE_NAME[type],
                                '</a>',
                            '</li>'].join(''));
                    }
                });

                $menu.find('li').click(function () {
                    that.$el.tableExport({
                        type: $(this).data('type'),
                        escape: false
                    });
                });
            }
        }
    };
})(jQuery);
///#source 1 1 /JavaScript-Mvc-framework/libs/Tag-it/bootstrap3-typeahead.min.js
!function(a,b){"use strict";"undefined"!=typeof module&&module.exports?module.exports=b(require("jquery")):"function"==typeof define&&define.amd?define(["jquery"],function(a){return b(a)}):b(a.jQuery)}(this,function(a){"use strict";var b=function(b,c){this.$element=a(b),this.options=a.extend({},a.fn.typeahead.defaults,c),this.matcher=this.options.matcher||this.matcher,this.sorter=this.options.sorter||this.sorter,this.select=this.options.select||this.select,this.autoSelect="boolean"==typeof this.options.autoSelect?this.options.autoSelect:!0,this.highlighter=this.options.highlighter||this.highlighter,this.render=this.options.render||this.render,this.updater=this.options.updater||this.updater,this.displayText=this.options.displayText||this.displayText,this.source=this.options.source,this.delay=this.options.delay,this.$menu=a(this.options.menu),this.$appendTo=this.options.appendTo?a(this.options.appendTo):null,this.shown=!1,this.listen(),this.showHintOnFocus="boolean"==typeof this.options.showHintOnFocus?this.options.showHintOnFocus:!1,this.afterSelect=this.options.afterSelect,this.addItem=!1};b.prototype={constructor:b,select:function(){var a=this.$menu.find(".active").data("value");if(this.$element.data("active",a),this.autoSelect||a){var b=this.updater(a);this.$element.val(this.displayText(b)||b).change(),this.afterSelect(b)}return this.hide()},updater:function(a){return a},setSource:function(a){this.source=a},show:function(){var b,c=a.extend({},this.$element.position(),{height:this.$element[0].offsetHeight});return b="function"==typeof this.options.scrollHeight?this.options.scrollHeight.call():this.options.scrollHeight,(this.$appendTo?this.$menu.appendTo(this.$appendTo):this.$menu.insertAfter(this.$element)).css({top:c.top+c.height+b,left:c.left}).show(),this.shown=!0,this},hide:function(){return this.$menu.hide(),this.shown=!1,this},lookup:function(b){if(this.query="undefined"!=typeof b&&null!==b?b:this.$element.val()||"",this.query.length<this.options.minLength)return this.shown?this.hide():this;var c=a.proxy(function(){a.isFunction(this.source)?this.source(this.query,a.proxy(this.process,this)):this.source&&this.process(this.source)},this);clearTimeout(this.lookupWorker),this.lookupWorker=setTimeout(c,this.delay)},process:function(b){var c=this;return b=a.grep(b,function(a){return c.matcher(a)}),b=this.sorter(b),b.length||this.options.addItem?(b.length>0?this.$element.data("active",b[0]):this.$element.data("active",null),this.options.addItem&&b.push(this.options.addItem),"all"==this.options.items?this.render(b).show():this.render(b.slice(0,this.options.items)).show()):this.shown?this.hide():this},matcher:function(a){var b=this.displayText(a);return~b.toLowerCase().indexOf(this.query.toLowerCase())},sorter:function(a){for(var b,c=[],d=[],e=[];b=a.shift();){var f=this.displayText(b);f.toLowerCase().indexOf(this.query.toLowerCase())?~f.indexOf(this.query)?d.push(b):e.push(b):c.push(b)}return c.concat(d,e)},highlighter:function(b){var c,d,e,f,g,h=a("<div></div>"),i=this.query,j=b.toLowerCase().indexOf(i.toLowerCase());if(c=i.length,0===c)return h.text(b).html();for(;j>-1;)d=b.substr(0,j),e=b.substr(j,c),f=b.substr(j+c),g=a("<strong></strong>").text(e),h.append(document.createTextNode(d)).append(g),b=f,j=b.toLowerCase().indexOf(i.toLowerCase());return h.append(document.createTextNode(b)).html()},render:function(b){var c=this,d=this,e=!1;return b=a(b).map(function(b,f){var g=d.displayText(f);return b=a(c.options.item).data("value",f),b.find("a").html(c.highlighter(g)),g==d.$element.val()&&(b.addClass("active"),d.$element.data("active",f),e=!0),b[0]}),this.autoSelect&&!e&&(b.first().addClass("active"),this.$element.data("active",b.first().data("value"))),this.$menu.html(b),this},displayText:function(a){return a.name||a},next:function(b){var c=this.$menu.find(".active").removeClass("active"),d=c.next();d.length||(d=a(this.$menu.find("li")[0])),d.addClass("active")},prev:function(a){var b=this.$menu.find(".active").removeClass("active"),c=b.prev();c.length||(c=this.$menu.find("li").last()),c.addClass("active")},listen:function(){this.$element.on("focus",a.proxy(this.focus,this)).on("blur",a.proxy(this.blur,this)).on("keypress",a.proxy(this.keypress,this)).on("keyup",a.proxy(this.keyup,this)),this.eventSupported("keydown")&&this.$element.on("keydown",a.proxy(this.keydown,this)),this.$menu.on("click",a.proxy(this.click,this)).on("mouseenter","li",a.proxy(this.mouseenter,this)).on("mouseleave","li",a.proxy(this.mouseleave,this))},destroy:function(){this.$element.data("typeahead",null),this.$element.data("active",null),this.$element.off("focus").off("blur").off("keypress").off("keyup"),this.eventSupported("keydown")&&this.$element.off("keydown"),this.$menu.remove()},eventSupported:function(a){var b=a in this.$element;return b||(this.$element.setAttribute(a,"return;"),b="function"==typeof this.$element[a]),b},move:function(a){if(this.shown){switch(a.keyCode){case 9:case 13:case 27:a.preventDefault();break;case 38:if(a.shiftKey)return;a.preventDefault(),this.prev();break;case 40:if(a.shiftKey)return;a.preventDefault(),this.next()}a.stopPropagation()}},keydown:function(b){this.suppressKeyPressRepeat=~a.inArray(b.keyCode,[40,38,9,13,27]),this.shown||40!=b.keyCode?this.move(b):this.lookup()},keypress:function(a){this.suppressKeyPressRepeat||this.move(a)},keyup:function(a){switch(a.keyCode){case 40:case 38:case 16:case 17:case 18:break;case 9:case 13:if(!this.shown)return;this.select();break;case 27:if(!this.shown)return;this.hide();break;default:this.lookup()}a.stopPropagation(),a.preventDefault()},focus:function(a){this.focused||(this.focused=!0,this.options.showHintOnFocus&&this.lookup(""))},blur:function(a){this.focused=!1,!this.mousedover&&this.shown&&this.hide()},click:function(a){a.stopPropagation(),a.preventDefault(),this.select(),this.$element.focus()},mouseenter:function(b){this.mousedover=!0,this.$menu.find(".active").removeClass("active"),a(b.currentTarget).addClass("active")},mouseleave:function(a){this.mousedover=!1,!this.focused&&this.shown&&this.hide()}};var c=a.fn.typeahead;a.fn.typeahead=function(c){var d=arguments;return"string"==typeof c&&"getActive"==c?this.data("active"):this.each(function(){var e=a(this),f=e.data("typeahead"),g="object"==typeof c&&c;f||e.data("typeahead",f=new b(this,g)),"string"==typeof c&&(d.length>1?f[c].apply(f,Array.prototype.slice.call(d,1)):f[c]())})},a.fn.typeahead.defaults={source:[],items:8,menu:'<ul class="typeahead dropdown-menu" role="listbox"></ul>',item:'<li><a href="#" role="option"></a></li>',minLength:1,scrollHeight:0,autoSelect:!0,afterSelect:a.noop,addItem:!1,delay:0},a.fn.typeahead.Constructor=b,a.fn.typeahead.noConflict=function(){return a.fn.typeahead=c,this},a(document).on("focus.typeahead.data-api",'[data-provide="typeahead"]',function(b){var c=a(this);c.data("typeahead")||c.typeahead(c.data())})});
///#source 1 1 /JavaScript-Mvc-framework/libs/Tag-it/bootstrap-tagsinput.js
(function ($) {
  "use strict";

  var defaultOptions = {
    tagClass: function(item) {
      return 'label label-info';
    },
    itemValue: function(item) {
      return item ? item.toString() : item;
    },
    itemText: function(item) {
      return this.itemValue(item);
    },
    freeInput: true,
    addOnBlur: true,
    maxTags: undefined,
    maxChars: undefined,
    confirmKeys: [13, 44],
    onTagExists: function(item, $tag) {
      $tag.hide().fadeIn();
    },
    trimValue: false,
    allowDuplicates: false
  };

  /**
   * Constructor function
   */
  function TagsInput(element, options) {
    this.itemsArray = [];

    this.$element = $(element);
    this.$element.hide();

    this.isSelect = (element.tagName === 'SELECT');
    this.multiple = (this.isSelect && element.hasAttribute('multiple'));
    this.objectItems = options && options.itemValue;
    this.placeholderText = element.hasAttribute('placeholder') ? this.$element.attr('placeholder') : '';
    this.inputSize = Math.max(1, this.placeholderText.length);

    this.$container = $('<div class="bootstrap-tagsinput"></div>');
    this.$input = $('<input type="text" placeholder="' + this.placeholderText + '"/>').appendTo(this.$container);

    this.$element.after(this.$container);

    var inputWidth = (this.inputSize < 3 ? 3 : this.inputSize) + "em";
    this.$input.get(0).style.cssText = "width: " + inputWidth + "";
    this.build(options);
  }

  TagsInput.prototype = {
    constructor: TagsInput,

    /**
     * Adds the given item as a new tag. Pass true to dontPushVal to prevent
     * updating the elements val()
     */
    add: function(item, dontPushVal) {
      var self = this;

      if (self.options.maxTags && self.itemsArray.length >= self.options.maxTags)
        return;

      // Ignore falsey values, except false
      if (item !== false && !item)
        return;

      // Trim value
      if (typeof item === "string" && self.options.trimValue) {
        item = $.trim(item);
      }

      // Throw an error when trying to add an object while the itemValue option was not set
      if (typeof item === "object" && !self.objectItems)
        throw("Can't add objects when itemValue option is not set");

      // Ignore strings only containg whitespace
      if (item.toString().match(/^\s*$/))
        return;

      // If SELECT but not multiple, remove current tag
      if (self.isSelect && !self.multiple && self.itemsArray.length > 0)
        self.remove(self.itemsArray[0]);

      if (typeof item === "string" && this.$element[0].tagName === 'INPUT') {
        var items = item.split(',');
        if (items.length > 1) {
          for (var i = 0; i < items.length; i++) {
            this.add(items[i], true);
          }

          if (!dontPushVal)
            self.pushVal();
          return;
        }
      }

      var itemValue = self.options.itemValue(item),
          itemText = self.options.itemText(item),
          tagClass = self.options.tagClass(item);

      // Ignore items allready added
      var existing = $.grep(self.itemsArray, function(item) { return self.options.itemValue(item) === itemValue; } )[0];
      if (existing && !self.options.allowDuplicates) {
        // Invoke onTagExists
        if (self.options.onTagExists) {
          var $existingTag = $(".tag", self.$container).filter(function() { return $(this).data("item") === existing; });
          self.options.onTagExists(item, $existingTag);
        }
        return;
      }

      // if length greater than limit
      if (self.items().toString().length + item.length + 1 > self.options.maxInputLength)
        return;

      // raise beforeItemAdd arg
      var beforeItemAddEvent = $.Event('beforeItemAdd', { item: item, cancel: false });
      self.$element.trigger(beforeItemAddEvent);
      if (beforeItemAddEvent.cancel)
        return;

      // register item in internal array and map
      self.itemsArray.push(item);

      // add a tag element
      var $tag = $('<span class="tag ' + htmlEncode(tagClass) + '">' + htmlEncode(itemText) + '<span data-role="remove"></span></span>');
      $tag.data('item', item);
      self.findInputWrapper().before($tag);
      $tag.after(' ');

      // add <option /> if item represents a value not present in one of the <select />'s options
      if (self.isSelect && !$('option[value="' + encodeURIComponent(itemValue) + '"]',self.$element)[0]) {
        var $option = $('<option selected>' + htmlEncode(itemText) + '</option>');
        $option.data('item', item);
        $option.attr('value', itemValue);
        self.$element.append($option);
      }

      if (!dontPushVal)
        self.pushVal();

      // Add class when reached maxTags
      if (self.options.maxTags === self.itemsArray.length || self.items().toString().length === self.options.maxInputLength)
        self.$container.addClass('bootstrap-tagsinput-max');

      self.$element.trigger($.Event('itemAdded', { item: item }));
    },

    /**
     * Removes the given item. Pass true to dontPushVal to prevent updating the
     * elements val()
     */
    remove: function(item, dontPushVal) {
      var self = this;

      if (self.objectItems) {
        if (typeof item === "object")
          item = $.grep(self.itemsArray, function(other) { return self.options.itemValue(other) ==  self.options.itemValue(item); } );
        else
          item = $.grep(self.itemsArray, function(other) { return self.options.itemValue(other) ==  item; } );

        item = item[item.length-1];
      }

      if (item) {
        var beforeItemRemoveEvent = $.Event('beforeItemRemove', { item: item, cancel: false });
        self.$element.trigger(beforeItemRemoveEvent);
        if (beforeItemRemoveEvent.cancel)
          return;

        $('.tag', self.$container).filter(function() { return $(this).data('item') === item; }).remove();
        $('option', self.$element).filter(function() { return $(this).data('item') === item; }).remove();
        if($.inArray(item, self.itemsArray) !== -1)
          self.itemsArray.splice($.inArray(item, self.itemsArray), 1);
      }

      if (!dontPushVal)
        self.pushVal();

      // Remove class when reached maxTags
      if (self.options.maxTags > self.itemsArray.length)
        self.$container.removeClass('bootstrap-tagsinput-max');

      self.$element.trigger($.Event('itemRemoved',  { item: item }));
    },

    /**
     * Removes all items
     */
    removeAll: function() {
      var self = this;

      $('.tag', self.$container).remove();
      $('option', self.$element).remove();

      while(self.itemsArray.length > 0)
        self.itemsArray.pop();

      self.pushVal();
    },

    /**
     * Refreshes the tags so they match the text/value of their corresponding
     * item.
     */
    refresh: function() {
      var self = this;
      $('.tag', self.$container).each(function() {
        var $tag = $(this),
            item = $tag.data('item'),
            itemValue = self.options.itemValue(item),
            itemText = self.options.itemText(item),
            tagClass = self.options.tagClass(item);

          // Update tag's class and inner text
          $tag.attr('class', null);
          $tag.addClass('tag ' + htmlEncode(tagClass));
          $tag.contents().filter(function() {
            return this.nodeType == 3;
          })[0].nodeValue = htmlEncode(itemText);

          if (self.isSelect) {
            var option = $('option', self.$element).filter(function() { return $(this).data('item') === item; });
            option.attr('value', itemValue);
          }
      });
    },

    /**
     * Returns the items added as tags
     */
    items: function() {
      return this.itemsArray;
    },

    /**
     * Assembly value by retrieving the value of each item, and set it on the
     * element.
     */
    pushVal: function() {
      var self = this,
          val = $.map(self.items(), function(item) {
            return self.options.itemValue(item).toString();
          });

      self.$element.val(val, true).trigger('change');
    },

    /**
     * Initializes the tags input behaviour on the element
     */
    build: function(options) {
      var self = this;

      self.options = $.extend({}, defaultOptions, options);
      // When itemValue is set, freeInput should always be false
      if (self.objectItems)
        self.options.freeInput = false;

      makeOptionItemFunction(self.options, 'itemValue');
      makeOptionItemFunction(self.options, 'itemText');
      makeOptionFunction(self.options, 'tagClass');
      
      // Typeahead Bootstrap version 2.3.2
      if (self.options.typeahead) {
        var typeahead = self.options.typeahead || {};

        makeOptionFunction(typeahead, 'source');

        self.$input.typeahead($.extend({}, typeahead, {
          source: function (query, process) {
            function processItems(items) {
              var texts = [];

              for (var i = 0; i < items.length; i++) {
                var text = self.options.itemText(items[i]);
                map[text] = items[i];
                texts.push(text);
              }
              process(texts);
            }

            this.map = {};
            var map = this.map,
                data = typeahead.source(query);

            if ($.isFunction(data.success)) {
              // support for Angular callbacks
              data.success(processItems);
            } else if ($.isFunction(data.then)) {
              // support for Angular promises
              data.then(processItems);
            } else {
              // support for functions and jquery promises
              $.when(data)
               .then(processItems);
            }
          },
          updater: function (text) {
            self.add(this.map[text]);
          },
          matcher: function (text) {
            return (text.toLowerCase().indexOf(this.query.trim().toLowerCase()) !== -1);
          },
          sorter: function (texts) {
            return texts.sort();
          },
          highlighter: function (text) {
            var regex = new RegExp( '(' + this.query + ')', 'gi' );
            return text.replace( regex, "<strong>$1</strong>" );
          }
        }));
      }

      // typeahead.js
      if (self.options.typeaheadjs) {
          var typeaheadjs = self.options.typeaheadjs || {};
          
          self.$input.typeahead(null, typeaheadjs).on('typeahead:selected', $.proxy(function (obj, datum) {
            if (typeaheadjs.valueKey)
              self.add(datum[typeaheadjs.valueKey]);
            else
              self.add(datum);
            self.$input.typeahead('val', '');
          }, self));
      }

      self.$container.on('click', $.proxy(function(event) {
        if (! self.$element.attr('disabled')) {
          self.$input.removeAttr('disabled');
        }
        self.$input.focus();
      }, self));

        if (self.options.addOnBlur && self.options.freeInput) {
          self.$input.on('focusout', $.proxy(function(event) {
              // HACK: only process on focusout when no typeahead opened, to
              //       avoid adding the typeahead text as tag
              if ($('.typeahead, .twitter-typeahead', self.$container).length === 0) {
                self.add(self.$input.val());
                self.$input.val('');
              }
          }, self));
        }
        

      self.$container.on('keydown', 'input', $.proxy(function(event) {
        var $input = $(event.target),
            $inputWrapper = self.findInputWrapper();

        if (self.$element.attr('disabled')) {
          self.$input.attr('disabled', 'disabled');
          return;
        }

        switch (event.which) {
          // BACKSPACE
          case 8:
            if (doGetCaretPosition($input[0]) === 0) {
              var prev = $inputWrapper.prev();
              if (prev) {
                self.remove(prev.data('item'));
              }
            }
            break;

          // DELETE
          case 46:
            if (doGetCaretPosition($input[0]) === 0) {
              var next = $inputWrapper.next();
              if (next) {
                self.remove(next.data('item'));
              }
            }
            break;

          // LEFT ARROW
          case 37:
            // Try to move the input before the previous tag
            var $prevTag = $inputWrapper.prev();
            if ($input.val().length === 0 && $prevTag[0]) {
              $prevTag.before($inputWrapper);
              $input.focus();
            }
            break;
          // RIGHT ARROW
          case 39:
            // Try to move the input after the next tag
            var $nextTag = $inputWrapper.next();
            if ($input.val().length === 0 && $nextTag[0]) {
              $nextTag.after($inputWrapper);
              $input.focus();
            }
            break;
         default:
             // ignore
         }

        // Reset internal input's size
        var textLength = $input.val().length,
            wordSpace = Math.ceil(textLength / 5),
            size = textLength + wordSpace + 1;
        $input.attr('size', Math.max(this.inputSize, $input.val().length));
      }, self));

      self.$container.on('keypress', 'input', $.proxy(function(event) {
         var $input = $(event.target);

         if (self.$element.attr('disabled')) {
            self.$input.attr('disabled', 'disabled');
            return;
         }

         var text = $input.val(),
         maxLengthReached = self.options.maxChars && text.length >= self.options.maxChars;
         if (self.options.freeInput && (keyCombinationInList(event, self.options.confirmKeys) || maxLengthReached)) {
            self.add(maxLengthReached ? text.substr(0, self.options.maxChars) : text);
            $input.val('');
            event.preventDefault();
         }

         // Reset internal input's size
         var textLength = $input.val().length,
            wordSpace = Math.ceil(textLength / 5),
            size = textLength + wordSpace + 1;
         $input.attr('size', Math.max(this.inputSize, $input.val().length));
      }, self));

      // Remove icon clicked
      self.$container.on('click', '[data-role=remove]', $.proxy(function(event) {
        if (self.$element.attr('disabled')) {
          return;
        }
        self.remove($(event.target).closest('.tag').data('item'));
      }, self));

      // Only add existing value as tags when using strings as tags
      if (self.options.itemValue === defaultOptions.itemValue) {
        if (self.$element[0].tagName === 'INPUT') {
            self.add(self.$element.val());
        } else {
          $('option', self.$element).each(function() {
            self.add($(this).attr('value'), true);
          });
        }
      }
    },

    /**
     * Removes all tagsinput behaviour and unregsiter all event handlers
     */
    destroy: function() {
      var self = this;

      // Unbind events
      self.$container.off('keypress', 'input');
      self.$container.off('click', '[role=remove]');

      self.$container.remove();
      self.$element.removeData('tagsinput');
      self.$element.show();
    },

    /**
     * Sets focus on the tagsinput
     */
    focus: function() {
      this.$input.focus();
    },

    /**
     * Returns the internal input element
     */
    input: function() {
      return this.$input;
    },

    /**
     * Returns the element which is wrapped around the internal input. This
     * is normally the $container, but typeahead.js moves the $input element.
     */
    findInputWrapper: function() {
      var elt = this.$input[0],
          container = this.$container[0];
      while(elt && elt.parentNode !== container)
        elt = elt.parentNode;

      return $(elt);
    }
  };

  /**
   * Register JQuery plugin
   */
  $.fn.tagsinput = function(arg1, arg2) {
    var results = [];

    this.each(function() {
      var tagsinput = $(this).data('tagsinput');
      // Initialize a new tags input
      if (!tagsinput) {
          tagsinput = new TagsInput(this, arg1);
          $(this).data('tagsinput', tagsinput);
          results.push(tagsinput);

          if (this.tagName === 'SELECT') {
              $('option', $(this)).attr('selected', 'selected');
          }

          // Init tags from $(this).val()
          $(this).val($(this).val());
      } else if (!arg1 && !arg2) {
          // tagsinput already exists
          // no function, trying to init
          results.push(tagsinput);
      } else if(tagsinput[arg1] !== undefined) {
          // Invoke function on existing tags input
          var retVal = tagsinput[arg1](arg2);
          if (retVal !== undefined)
              results.push(retVal);
      }
    });

    if ( typeof arg1 == 'string') {
      // Return the results from the invoked function calls
      return results.length > 1 ? results : results[0];
    } else {
      return results;
    }
  };

  $.fn.tagsinput.Constructor = TagsInput;

  /**
   * Most options support both a string or number as well as a function as
   * option value. This function makes sure that the option with the given
   * key in the given options is wrapped in a function
   */
  function makeOptionItemFunction(options, key) {
    if (typeof options[key] !== 'function') {
      var propertyName = options[key];
      options[key] = function(item) { return item[propertyName]; };
    }
  }
  function makeOptionFunction(options, key) {
    if (typeof options[key] !== 'function') {
      var value = options[key];
      options[key] = function() { return value; };
    }
  }
  /**
   * HtmlEncodes the given value
   */
  var htmlEncodeContainer = $('<div />');
  function htmlEncode(value) {
    if (value) {
      return htmlEncodeContainer.text(value).html();
    } else {
      return '';
    }
  }

  /**
   * Returns the position of the caret in the given input field
   * http://flightschool.acylt.com/devnotes/caret-position-woes/
   */
  function doGetCaretPosition(oField) {
    var iCaretPos = 0;
    if (document.selection) {
      oField.focus ();
      var oSel = document.selection.createRange();
      oSel.moveStart ('character', -oField.value.length);
      iCaretPos = oSel.text.length;
    } else if (oField.selectionStart || oField.selectionStart == '0') {
      iCaretPos = oField.selectionStart;
    }
    return (iCaretPos);
  }

  /**
    * Returns boolean indicates whether user has pressed an expected key combination. 
    * @param object keyPressEvent: JavaScript event object, refer
    *     http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
    * @param object lookupList: expected key combinations, as in:
    *     [13, {which: 188, shiftKey: true}]
    */
  function keyCombinationInList(keyPressEvent, lookupList) {
      var found = false;
      $.each(lookupList, function (index, keyCombination) {
          if (typeof (keyCombination) === 'number' && keyPressEvent.which === keyCombination) {
              found = true;
              return false;
          }

          if (keyPressEvent.which === keyCombination.which) {
              var alt = !keyCombination.hasOwnProperty('altKey') || keyPressEvent.altKey === keyCombination.altKey,
                  shift = !keyCombination.hasOwnProperty('shiftKey') || keyPressEvent.shiftKey === keyCombination.shiftKey,
                  ctrl = !keyCombination.hasOwnProperty('ctrlKey') || keyPressEvent.ctrlKey === keyCombination.ctrlKey;
              if (alt && shift && ctrl) {
                  found = true;
                  return false;
              }
          }
      });

      return found;
  }

  /**
   * Initialize tagsinput behaviour on inputs and selects which have
   * data-role=tagsinput
   */
  $(function() {
    $("input[data-role=tagsinput], select[multiple][data-role=tagsinput]").tagsinput();
  });
})(window.jQuery);

///#source 1 1 /JavaScript-Mvc-framework/libs/jquery.elastic.source.js
/**
*	@name							Elastic
*	@descripton						Elastic is jQuery plugin that grow and shrink your textareas automatically
*	@version						1.6.11
*	@requires						jQuery 1.2.6+
*
*	@author							Jan Jarfalk
*	@author-email					jan.jarfalk@unwrongest.com
*	@author-website					http://www.unwrongest.com
*
*	@licence						MIT License - http://www.opensource.org/licenses/mit-license.php
*/

(function($){ 
	jQuery.fn.extend({  
		elastic: function() {
		
			//	We will create a div clone of the textarea
			//	by copying these attributes from the textarea to the div.
			var mimics = [
				'paddingTop',
				'paddingRight',
				'paddingBottom',
				'paddingLeft',
				'fontSize',
				'lineHeight',
				'fontFamily',
				'width',
				'fontWeight',
				'border-top-width',
				'border-right-width',
				'border-bottom-width',
				'border-left-width',
				'borderTopStyle',
				'borderTopColor',
				'borderRightStyle',
				'borderRightColor',
				'borderBottomStyle',
				'borderBottomColor',
				'borderLeftStyle',
				'borderLeftColor'
				];
			
			return this.each( function() {

				// Elastic only works on textareas
				if ( this.type !== 'textarea' ) {
					return false;
				}
					
			var $textarea	= jQuery(this),
				$twin		= jQuery('<div />').css({
					'position'		: 'absolute',
					'display'		: 'none',
					'word-wrap'		: 'break-word',
					'white-space'	:'pre-wrap'
				}),
				lineHeight	= parseInt($textarea.css('line-height'),10) || parseInt($textarea.css('font-size'),'10'),
				minheight	= parseInt($textarea.css('height'),10) || lineHeight*3,
				maxheight	= parseInt($textarea.css('max-height'),10) || Number.MAX_VALUE,
				goalheight	= 0;
				
				// Opera returns max-height of -1 if not set
				if (maxheight < 0) { maxheight = Number.MAX_VALUE; }
					
				// Append the twin to the DOM
				// We are going to meassure the height of this, not the textarea.
				$twin.appendTo($textarea.parent());
				
				// Copy the essential styles (mimics) from the textarea to the twin
				var i = mimics.length;
				while(i--){
					$twin.css(mimics[i].toString(),$textarea.css(mimics[i].toString()));
				}
				
				// Updates the width of the twin. (solution for textareas with widths in percent)
				function setTwinWidth(){
					var curatedWidth = Math.floor(parseInt($textarea.width(),10));
					if($twin.width() !== curatedWidth){
						$twin.css({'width': curatedWidth + 'px'});
						
						// Update height of textarea
						update(true);
					}
				}
				
				// Sets a given height and overflow state on the textarea
				function setHeightAndOverflow(height, overflow){
				
					var curratedHeight = Math.floor(parseInt(height,10));
					if($textarea.height() !== curratedHeight){
						$textarea.css({'height': curratedHeight + 'px','overflow':overflow});
					}
				}
				
				// This function will update the height of the textarea if necessary 
				function update(forced) {
					
					// Get curated content from the textarea.
					var textareaContent = $textarea.val().replace(/&/g,'&amp;').replace(/ {2}/g, '&nbsp;').replace(/<|>/g, '&gt;').replace(/\n/g, '<br />');
					
					// Compare curated content with curated twin.
					var twinContent = $twin.html().replace(/<br>/ig,'<br />');
					
					if(forced || textareaContent+'&nbsp;' !== twinContent){
					
						// Add an extra white space so new rows are added when you are at the end of a row.
						$twin.html(textareaContent+'&nbsp;');
						
						// Change textarea height if twin plus the height of one line differs more than 3 pixel from textarea height
						if(Math.abs($twin.height() + lineHeight - $textarea.height()) > 3){
							
							var goalheight = $twin.height()+lineHeight;
							if(goalheight >= maxheight) {
								setHeightAndOverflow(maxheight,'auto');
							} else if(goalheight <= minheight) {
								setHeightAndOverflow(minheight,'hidden');
							} else {
								setHeightAndOverflow(goalheight,'hidden');
							}
							
						}
						
					}
					
				}
				
				// Hide scrollbars
				$textarea.css({'overflow':'hidden'});
				
				// Update textarea size on keyup, change, cut and paste
				$textarea.bind('keyup change cut paste', function(){
					update(); 
				});
				
				// Update width of twin if browser or textarea is resized (solution for textareas with widths in percent)
				$(window).bind('resize', setTwinWidth);
				$textarea.bind('resize', setTwinWidth);
				$textarea.bind('update', update);
				
				// Compact textarea on blur
				$textarea.bind('blur',function(){
					if($twin.height() < maxheight){
						if($twin.height() > minheight) {
							$textarea.height($twin.height());
						} else {
							$textarea.height(minheight);
						}
					}
				});
				
				// And this line is to catch the browser paste event
				$textarea.bind('input paste',function(e){ setTimeout( update, 250); });				
				
				// Run update once when elastic is initialized
				update();
				
			});
			
        } 
    }); 
})(jQuery);
///#source 1 1 /JavaScript-Mvc-framework/libs/DevOrgPlugins/developers-organism.dynamicSelect.js
/// <reference path="../jQuery/jquery-2.1.3.js" />
/// <reference path="../jQuery/jquery-2.1.3.intellisense.js" />
/// <reference path="../jQuery/jquery.number.js" />
/// <reference path="../jQuery/jquery.unobtrusive-ajax.js" />
/// <reference path="../jQuery/jquery.validate-vsdoc.js" />
/// <reference path="../jQuery/jquery.validate.js" />
/// <reference path="../jQuery/jquery.validate.unobtrusive.js" />
/// <reference path="../jQuery/moment.js" />
/// <reference path="../jQuery/underscore.js" />
/// <reference path="../jQuery/validation.js" />
/// <reference path="../jQuery/Upload/jquery.fileupload.js" />
/// <reference path="../Bootstrap/bootstrap.js" />
/// <reference path="../Bootstrap/bootstrap-select.js" />
/// <reference path="../Bootstrap/bootstrap-table-export.js" />
/// <reference path="../Bootstrap/bootstrap-table-filter.js" />
/// <reference path="../Bootstrap/bootstrap-datetimepicker.js" />
/// <reference path="../Bootstrap/bootstrap-datepicker.js" />
/// <reference path="../Bootstrap/common-tasks-run-every-page.js" />
/// <reference path="../Bootstrap/modernizr-2.8.3.js" />
/// <reference path="../Bootstrap/respond.js" />
/// <reference path="../Bootstrap/star-rating.js" />
/*
* Version 1.0
* Written by Alim Ul Karim
* Developers Organism
* https://www.facebook.com/DevelopersOrganism
* mailto:info@developers-organism.com
*/
$.devOrg.dynamicSelect = {
    isDependableAttribute: "data-dependable",
    dependablePropertyNameAttribute: "data-dependable-prop-name",
    propertyNameAttribute: "data-prop",
    dynamicSelectClass: "dynamic-select-load",
    urlAttribute: "data-url",
    dataValueAttribute: "data-value",
    isDynamicSelectElementAttribute: "data-dev-dynamic-select",
    additionalCssAttribute: "data-additional-css",
    liveSearchAttribute: "data-live-search",
    isHtmlAttribute: "dev-isHtml",
    isStyledAttribute: "dev-isStyled",
    $dynamicSelectContainerDiv: $("div.dynamic-select-container[data-dynamic-select-container=true]"),
    $allDynamicImmidiaeSelectDivs: null, // will be defined from initialize function
    $dependancySelectsHasNotProcessed: [], //only populated if a dependency combo can't find parent.

    initialize: function (additionalSelector) {
        /// <summary>
        /// select div and push info based on html properties
        /// class="dynamic-select-load"
        ///      data-prop="NameOfThePropertyInDatabase"
        ///      data-dev-dynamic-select="true"
        ///      data-url="where the json is"
        ///      data-value="value for the select"
        ///      data-dependable-prop-name=""
        ///      data-dependable="true/false"
        ///      data-load-auto="true/false"
        /// </summary>
        "use strict";
        if (additionalSelector === undefined) {
            additionalSelector = "";
        }

        var selector = "div." + $.devOrg.dynamicSelect.dynamicSelectClass + "[" + $.devOrg.dynamicSelect.isDynamicSelectElementAttribute + "=true]" + additionalSelector;
        var $dynamicDiv = $(selector);
        // don't use $.devOrg.dynamicSelect type of caching because it is not updated when items are appened ** alim ul karim
        $.devOrg.dynamicSelect.$allDynamicImmidiaeSelectDivs = $dynamicDiv;
        var length = $dynamicDiv.length;


        for (var i = 0; i < length; i++) {
            var $div = $($dynamicDiv[i]);
            var isDependable = $div.attr($.devOrg.dynamicSelect.isDependableAttribute);

            var url = $div.attr(this.urlAttribute);
            if (!_.isEmpty(url) && isDependable === 'false') {
                $.devOrg.dynamicSelect.getJsonProcessSelectDynamicOptions($div, url);
                // dependency will be handled in side the parent when json is reviced in the parent
            }
        }
    },
    isHtmlRequest: function ($div) {
        return $div.attr($.devOrg.dynamicSelect.isHtmlAttribute);
    },
    fixUrlWithSlash: function (url) {
        /// <summary>
        /// if url doesn't contain slash at end
        /// slash will be added
        /// 
        /// </summary>
        /// <param name="url">site.com/ or site.com will return site.com/</param>
        if (!_.isEmpty(url)) {
            var len = url.length;
            var lastChar = url[len - 1];
            if (lastChar !== "/") {
                url += "/";
            }
        }
        return url;
    },
    filterDependableDivByPropName: function (depenablePropName) {
        var findChildSelector = "[" + $.devOrg.dynamicSelect.dependablePropertyNameAttribute + "=" + depenablePropName + "]";
        return $.devOrg.dynamicSelect.$allDynamicImmidiaeSelectDivs.filter(findChildSelector);
    },
    filterDivByPropName: function (propName) {
        var findChildSelector = "[" + $.devOrg.dynamicSelect.propertyNameAttribute + "=" + propName + "]";
        return $.devOrg.dynamicSelect.$allDynamicImmidiaeSelectDivs.filter(findChildSelector);
    },
    getUrlFromDynamicSelectDiv: function ($div) {
        var url = $div.attr($.devOrg.dynamicSelect.urlAttribute);
        url = $.devOrg.dynamicSelect.fixUrlWithSlash(url);
        return url;
    },
    selectFirstItemInSelectAndGetValue: function ($currentSelect) {
        var parentValue = $currentSelect.val();
        if (parentValue === null) {
            $currentSelect.val($currentSelect.find("option:first").val());
            parentValue = $currentSelect.val();
        }
        return parentValue;
    },
    getJsonProcessSelectDynamicOptions: function ($div, url) {
        /// <summary>
        /// 
        /// </summary>
        /// <param name="$div"></param>
        /// <param name="url">given url to get the json</param>
        "use strict";
        var isHtml = $.devOrg.dynamicSelect.isHtmlRequest($div);
        var requestType = "JSON";
        if (isHtml) {
            requestType = "HTML";
        }

        var value = $div.attr($.devOrg.dynamicSelect.dataValueAttribute);
        var liveSearch = $div.attr($.devOrg.dynamicSelect.liveSearchAttribute);
        var additionCss = $div.attr($.devOrg.dynamicSelect.additionalCssAttribute);
        var propName = $div.attr($.devOrg.dynamicSelect.propertyNameAttribute);
        var addAttr = "data-style='" + additionCss + "'" +
                      "data-live-search='" + liveSearch + "'";
        var selectBoxStart = "<select name='" + propName + "' " + addAttr + " class=' form-control' >";
        var selectBoxEnd = "</select>";
        var selectOfParentDiv = "div.form-row-" + propName + ":first";
        var $containerDiv = $(selectOfParentDiv);
        var isStyled = $div.attr($.devOrg.dynamicSelect.isStyledAttribute);

        $.ajax({
            type: "GET",
            dataType: requestType, //json or html
            url: url,
            success: function (response) {
                //console.log(url + " . Data:");
                //console.log(jsonData);
                $containerDiv.hide();
                if (response.length > 0) {
                    //$div.hide();
                    //successfully got  the json
                    var compactSelectHtml = "";
                    if (isHtml === 'false') {
                        response = JSON.parse(response);
                        //json type
                        var options = new Array(response.length + 5);
                        for (var i = 0; i < response.length; i++) { // build options
                            if (!_.isEmpty(value) && (value === response[i].id || response[i].display === value)) {
                                options[i] = ("<option value='" + response[i].id + "' Selected='selected'>" + response[i].display + "</option>");
                            } else {
                                options[i] = ("<option value='" + response[i].id + "'>" + response[i].display + "</option>");
                            }
                        }
                        compactSelectHtml = selectBoxStart + options.join("") + selectBoxEnd;
                        $div.prepend(compactSelectHtml);
                    } else {
                        // html
                        $div.html(response);
                    }

                    //$div.show("slow");
                    $containerDiv.show('slow');
                    // find any of the dependency if exist
                    var $parentSelect = $div.find("select:first");
                    var isItemsExist = $parentSelect.find("option:first").length === 1;
                    $.devOrg.dynamicSelect.selectFirstItemInSelectAndGetValue($parentSelect);

                    if (isStyled === 'true') {
                        $parentSelect.selectpicker();
                    }

                    var $childDiv = $.devOrg.dynamicSelect.filterDependableDivByPropName(propName);
                    var childUrl = $.devOrg.dynamicSelect.getUrlFromDynamicSelectDiv($childDiv);

                    if ($parentSelect.length === 1 && isItemsExist && $childDiv.length === 1) {
                        $parentSelect.change(function () {
                            var $currentSelect = $(this);
                            var parentValue = $currentSelect.val();
                            var tempUrl = childUrl + parentValue;
                            $childDiv.html("");
                            $.devOrg
                                .dynamicSelect
                                .getJsonProcessSelectDynamicOptions(
                                    $childDiv,
                                    tempUrl);
                        }).trigger('change');
                    }

                }
            },
            error: function (xhr, status, error) {
                console.log("Error: Can't retrieved the data from given url : " + url + ". Error : " + error);

            }
        });
    }

}

///#source 1 1 /JavaScript-Mvc-framework/libs/DevOrgPlugins/developers-organism.country-phone.js
/// <reference path="developers-organism.component.js" />
/// <reference path="developers-organism.dynamicSelect.js" />
/// <reference path="developers-organism.upload.js" />
/// <reference path="faster-jQuery.js" />
/// <reference path="WeReviewApps.js" />
/// <reference path="../star-rating.js" />
/// <reference path="../validation.js" />
/// <reference path="../underscore.js" />


$.devOrg.countryTimezonePhoneComponent = {
    countryUrl: "",
    timezoneUrl: "",
    languageUrl: "",
    countryFieldName: "CountryID",

    countryComboSelector: ".form-control.selectpicker.country-combo",
    countryComboDivInnerSelector: ".country-combo-div",
    countryDropDownItemsSelector: "ul.dropdown-menu.inner.selectpicker",
    btnSelector: "button.btn.dropdown-toggle.selectpicker.btn-success.flag-combo",
    isCountryRetriveAsHtml: false,
    getCountryComboOptionsStringFromJson: function (jsonItems, extraHtmlWithEachElement, itemClasses) {
        /// <summary>
        /// Generates and append "option" items to the given $select. 
        /// </summary>
        /// <param name="jsonItems">must contain display and id value for every 'option' item.</param>
        /// <param name="extraHtmlWithEachElement">add the extra html content with option display value</param>
        /// <param name="itemClasses">add classes with each option.</param>
        if (_.isEmpty(itemClasses)) {
            itemClasses = "";
        }
        if (_.isEmpty(extraHtmlWithEachElement)) {
            extraHtmlWithEachElement = "";
        }
        if (jsonItems.length > 0) {
            var length = jsonItems.length;
            var options = new Array(length + 5);
            var selected = " selected='selected' ";
            var optionStarting = "<option class='" + itemClasses;
            var optionEnding = "</option>";
            for (var i = 0; i < length; i++) {
                if (i !== 0 && selected !== "") {
                    selected = ""; //only first one will be selected
                }
                options[i] = optionStarting +
                             jsonItems[i].countryCode +
                             "' title='" + "| " +
                             jsonItems[i].display +
                             "'" +
                             selected +
                             "value='" +
                             jsonItems[i].id +
                             "'>" +
                             extraHtmlWithEachElement +
                             jsonItems[i].display +
                             optionEnding;
            }
            return options.join("");
        }
        return "";
    },
    getCountryWholeComboStringWithJsonItems: function (jsonItems, comboName, comboClass, additionalAttributesWithCombo, extraHtmlWithEachElement, eachOptionItemClasses) {
        /// <summary>
        /// Returns a full country combo/select based on json items
        /// Developer should inject this into document
        /// </summary>
        /// <param name="comboName">Name of the combo/select</param>
        /// <param name="comboClass">By defaul "flag-country-combo flag" will be added with your custom classes for the combo/select</param>
        /// <param name="comboId">Just pass the id or give null, it will automatically formatted</param>
        /// <param name="stringOptionItems">Option items passed as an string</param>
        /// <param name="additionalAttributes">Add additional attributes with the select, however user have to format it. Eg. id='hello' </param>
        /// <param name="jsonItems">must contain display,id,countryCode value for every 'option' item.</param>
        /// <param name="extraHtmlWithEachElement">add the extra html content with option display value</param>
        /// <param name="itemClasses">add classes with each option.</param>
        if (_.isEmpty(eachOptionItemClasses)) {
            eachOptionItemClasses = "flag-country-combo flag ";
        } else {
            eachOptionItemClasses += " flag-country-combo flag ";
        }
        if (_.isEmpty(comboClass)) {
            comboClass = "btn-success country-combo flag-combo fc-af";
        } else {
            comboClass += " country-combo flag-combo fc-af";
        }
        var optionsString = $.devOrg.countryTimezonePhoneComponent.getCountryComboOptionsStringFromJson(jsonItems, extraHtmlWithEachElement, eachOptionItemClasses);
        var comboString = $.devOrg.getComboString(comboName, comboClass, comboName, optionsString, additionalAttributesWithCombo);
        return comboString;
    },
    initialize: function (countryUrl, timeZoneUrl, languageUrl, retriveAsHtml) {
        /// <summary>
        /// Initialize country , timezone and phone number fields
        /// </summary>
        /// <param name="countryUrl"></param>
        /// <param name="timeZoneUrl"></param>
        /// <param name="languageUrl"></param>
        /// <param name="retriveAsHtml">boolean : should retrieve only html or process the json. True means no processing.</param>

        $.devOrg.countryTimezonePhoneComponent.countryUrl = countryUrl;
        $.devOrg.countryTimezonePhoneComponent.timezoneUrl = timeZoneUrl;
        $.devOrg.countryTimezonePhoneComponent.languageUrl = languageUrl;
        $.devOrg.countryTimezonePhoneComponent.isCountryRetriveAsHtml = retriveAsHtml;
        var comboName = $.devOrg.countryTimezonePhoneComponent.countryFieldName;

        var $countryInnerDiv = $($.devOrg.countryTimezonePhoneComponent.countryComboDivInnerSelector);
        //console.log($countryInnerDiv);
        // first generate country
        if ($countryInnerDiv.length > 0) {
            $.ajax({
                method: "Get", // by default "GET"
                url: $.devOrg.countryTimezonePhoneComponent.countryUrl,
                dataType: "text" //, // "Text" , "HTML", "xml", "script" 
            }).done(function (response) {
                //console.log(response);
                var comboString;
                if (retriveAsHtml === false) {
                    comboString = $.devOrg
                        .countryTimezonePhoneComponent
                        .getCountryWholeComboStringWithJsonItems(response, comboName, "", "", ""); //var innerHtmlDiv = $countryInnerDiv.html();
                    //var wholeComboHtmlString = comboString + innerHtmlDiv;
                } else {
                    comboString = response; // html
                }

                $countryInnerDiv.prepend(comboString);
                $countryInnerDiv.find("select:first-child").selectpicker();

                // also make the country combo to select picker
                $.devOrg.countryTimezonePhoneComponent.setupRefreshingCountryFlag();
                //setup other dependables
                $.devOrg.countryTimezonePhoneComponent.setupDependableCombos();

                //console.log(comboString);


            }).fail(function (jqXHR, textStatus, ex) {
                console.log("Request failed: " + ex);
            });

        }
    },
    setupRefreshingCountryFlag: function () {
        $.devOrg.countryFlagRefresh($.devOrg.countryTimezonePhoneComponent.countryComboSelector,
                                    $.devOrg.countryTimezonePhoneComponent.countryDropDownItemsSelector,
                                    $.devOrg.countryTimezonePhoneComponent.btnSelector);


    },
    setupDependableCombos: function () {
        /// <summary>
        /// Phone, Timezone and language
        /// </summary>
        // fix phone code and make country select to slectpicker()
        $.devOrg.countryRelatedToPhone($.devOrg.countryTimezonePhoneComponent.countryComboSelector,
                                        $.devOrg.countryTimezonePhoneComponent.countryDropDownItemsSelector,
                                        $.devOrg.countryTimezonePhoneComponent.btnSelector,
                                        $.devOrg.countryTimezonePhoneComponent.phoneNumberSelector);

        //country dependable load
        // set json { display = "display text", id= "value }
        $.devOrg.smartDependableCombo("select.country-combo", //selecting parent combo
                                      ".timezone-main", // must given : container for the time-zone
                                      ".timezone-combo-div", // must given : where to place the combo inside the container
                                      $.devOrg.countryTimezonePhoneComponent.timezoneUrl, // url
                                      "UserTimeZoneID", //combo-name
                                      "", //id
                                      "btn-success", //class
                                      ""
                                      );
        // set json { display = "display text", id= "value }
        $.devOrg.smartDependableCombo("select.country-combo",   //selecting parent combo
                                      ".language-main",         // must given : container
                                      ".language-combo-div",    // must given : where to place the combo inside the container
                                      $.devOrg.countryTimezonePhoneComponent.languageUrl, // url
                                      "CountryLanguageID", //combo-name
                                      "",//id
                                      "btn-success",//class
                                      ""
                                      );
    }

}
///#source 1 1 /JavaScript-Mvc-framework/libs/DevOrgPlugins/jquery.server-validate.js
/// <reference path="byId.js" />
/// <reference path="bootstrap.js" />
/// <reference path="jquery-2.1.4.js" />
/// <reference path="jquery-2.1.4-vsdoc.js" />
/// <reference path="jquery.validate.min.js" />
/// <reference path="jquery.validate.unobtrusive.js" />
/*!
 * jQuery Server Validate 1.0 
 * (a plugin for ASP.NET MVC or any server side programming language)
 * Code : https://github.com/aukgit/jquery-server-validation
 * 
 * Copyright (c) 2015 by 
 * Md. Alim Ul Karim, Bangladesh, Dhaka.
 * me{at}alimkarim.com
 *
 * Performance test http://jsperf.com/jquery-specific-performance-test-with-non-specific
 * by Md. Alim Ul karim 
 * Date: 19 June 2015
 * Modified Date: 27 June 2015
 */

; (function ($, window, document, undefined) {

    "use strict";
    if (typeof jQuery === 'undefined') {
        throw new Error('serverValidate requires jQuery');
    }
    if (typeof jQuery.validator === "undefined") {
        throw new Error('serverValidate requires jQuery validation plugin & jquery.validate.unobtrusive plugin.');
    }
    var pluginName = "serverValidate",
        $divContainers,
        $selfContainer = null,
        $allInputs = [],
        defaults = {
            crossDomain: true,
            multipleRequests: true,
            checkValidationBeforeSendingRequest: true,
            dontSendSameRequestTwice: true,
            disableInputOnValidation: true,
            focusPersistIfNotValid: true,
            hideOnValidation: false,
            submitMethod: "post", // get or post
            eventsNameSpace: "jq.validate.",
            $directContainer: [],
            eventsObject: null, //this object will collect all the events
            url: "",
            formSelector: "",
            $formElement: [],
            triggerValidationBeforeFormSubmit: true,
            $submitButton: [],
            messages: {
                requesting: "Requesting data..."
            },
            selectors: {
                divContainer: ".form-row",
                validatorContainer: ".validator-container",
                validator: ".validator",
                additionalFields: "[name=__RequestVerificationToken]"
            },
            attributes: {
                url: "data-url",
                isValidate: "data-is-validate",
                submitMethod: "data-submit-method"
            },
            icons: {
                invalid: "validation-icon-invalid fa fa-times",
                valid: "validation-icon-valid fa fa-check",
                spinner: "validation-icon-spinner fa fa-refresh fa-spin-custom",
                error: "validation-icon-error fa fa-exclamation-circle"
            },
            iconsIdPrefixes: {
                invalid: "invalid-mark-",
                valid: "valid-mark-",
                spinner: "validation-spinner-",
                error: "validation-error-"
            },
            response: {
                message: "Field is valid.",
                isValid: true,
                isError: false,
                errorCode: null,
                errorMessage: null
            },
            events: {
                iconCreated: function ($div, $input, $iconContainer) { },
                sameRequestTwice: function ($div, $input, url, previousText) { },
                beforeSendingRequest: function ($div, $input, url) { },
                responseReceived: function ($div, $input, response) { },
                responseProcessed: function ($div, $input, response) { },
                invalidBefore: function ($div, $input, response) { },
                invalidAfter: function ($div, $input, response) { },
                validBefore: function ($div, $input, response) { },
                validAfter: function ($div, $input, response) { },
                onError: function ($div, $input, jqXHR, textStatus, exceptionMessage, url) { }
            }
        };



    // The actual plugin constructor
    var plugin = function ($divElement, $input, settings, additionalFields) {
        /// <summary>
        /// Process the div element and 
        /// </summary>
        /// <param name="$divElement">Processing div</param>
        /// <param name="settings">Settings for that div</param>
        /// <param name="additionalFields">Additional fields array of jquery element reference.</param>
        this.$element = $divElement;
        this._name = pluginName;
        this.$input = $input;
        this.settings = settings;
        this.additionalFields = additionalFields;



        this.events.plugin = this;
        this.events.names.plugin = this;

        this.init($divElement);
    }

    var processAdditionalFields = function ($elementContainer, additionalFields) {
        var addFields = [];
        var $elements = [];
        var isEmpty = $elementContainer === undefined || $elementContainer === null || $elementContainer.length === 0;
        if (!isEmpty) {
            $elements = $elementContainer.find(additionalFields);
        } else {
            $elements = $(additionalFields);
        }
        if ($elements.length > 0) {
            for (var i = 0; i < $elements.length; i++) {
                var $element = $($elements[i]);
                var nameOfElement = $element.attr("name");
                var valueOfElement = $element.attr("value");
                var pushingElement = {
                    name: nameOfElement,
                    value: valueOfElement
                };
                addFields.push(pushingElement);
            }

        }
        return addFields;
    }


    var getSingleSettingItem = function ($input, attribute, settingElement) {
        /// <summary>
        /// 
        /// </summary>
        /// <param name="$input">$input element settings</param>
        /// <param name="attribute"></param>
        /// <param name="settingElement"></param>
        /// <returns type=""></returns>
        var value = $input.attr(attribute);
        if (value !== undefined && value !== null) {
            if (value === "true") {
                return true;
            } else if (value === "false") {
                return false;
            }
            return value;
        } else {
            return settingElement;
        }
    }

    var getSettingfromDiv = function ($input, settings) {
        /// <summary>
        /// Pass settings and it's got overwritten by $div attributes
        /// </summary>
        /// <param name="$input">$implement div with settings</param>
        /// <returns type="setting">returns settings</returns>
        var crossMatch = [
            { setting: "crossDomain", attr: "data-cross-domain" },
            { setting: "url", attr: "data-url" },
            { setting: "multipleRequests", attr: "data-is-multiple-requests" },
            { setting: "hideOnValidation", attr: "data-hide-on-success" },
            { setting: "disableInputOnValidation", attr: "data-disable-on-success" },
            { setting: "focusPersistIfNotValid", attr: "data-focus-on-fail" },
            { setting: "eventsObject", attr: "data-events-object" },
            { setting: "dontSendSameRequestTwice", attr: "data-dont-send-same-twice" },
            { setting: "focusPersistIfNotValid", attr: "data-focus-on-fail" },
            { setting: "formSelector", attr: "data-form-selector" }, // selecting the form
            { setting: "triggerValidationBeforeFormSubmit", attr: "data-trigger-validation-before-form-submit" },
            { setting: "focusPersistIfNotValid", attr: "data-focus-on-fail" },
            { setting: "submitMethod", attr: "data-submit-method" }
        ];
        for (var i = 0; i < crossMatch.length; i++) {
            var config = crossMatch[i];
            settings[config.setting] = getSingleSettingItem($input, config.attr, settings[config.setting]);
        }
        settings.selectors.additionalFields = getSingleSettingItem($input, "data-additional-selectors", settings.selectors.additionalFields);
        settings.messages.requesting = getSingleSettingItem($input, "data-requesting-label", settings.messages.requesting);
        return settings;
    }


    // Avoid Plugin.prototype conflicts
    $.extend(plugin.prototype, {
        isDebugging: false,
        additionalFields: [],
        $element: null,
        $input: null,
        isEmpty: function (variable) {
            return variable === null || variable === undefined || variable.length === 0;
        },
        init: function ($divElement) {

            if (this.isValidForProcessing($divElement)) {
                this.events.bindAllEvents(this);
                this.processDiv(this, $divElement);
            }
        },
        getSettings: function () {
            return this.settings;
        },
        isMultipleRequestAllowed: function () {
            return this.getSettings().multipleRequests;
        },
        isDisableInputOnValidation: function () {
            return this.getSettings().disableInputOnValidation;
        },
        isInputValidationRequirestoSendRequest: function () {
            return this.getSettings().checkValidationBeforeSendingRequest;
        },
        dontSendSameRequestTwice: function () {
            return this.getSettings().dontSendSameRequestTwice;
        },

        events: {
            names: {
                serverProcessStart: "serverProcessStart",
                serverProcessSucceeded: "serverProcessSucceeded",
                serverProcessFailed: "serverProcessFailed",
                serverProcessRunning: "serverProcessRunning",
                serverProcessReturnedAlways: "serverProcessReturnedAlways",
                serverAllRequestComplete: "serverAllRequestComplete",
                hideIcons: "hideIcons",
                createIcon: "createIcon",
                showingSpinnerIcon: "showingSpinnerIcon",
                typingStart: "typingStart",
                getName: function (plugin, nameOfEvent) {
                    var settings = plugin.getSettings(),
                        nameSpace = settings.eventsNameSpace,
                        inputId = plugin.getInputNameOrId(plugin.$input),
                        finalName = nameSpace + inputId + "." + nameOfEvent;
                    //console.log(finalName);
                    return finalName;
                }
            },
            getEventsCommonAttributes: function (plugin, nameOfEvent, additionalAttributes) {
                /// <summary>
                /// Returns a json with a combination of additional json attributes.
                /// event = {
                ///     id: inputId,
                ///     name: $input.attr("name"),
                ///     $input: $input,
                ///     $divContainer: $div,
                ///     eventName: nameOfEvent,
                ///     finalEventName: finalEventName,
                ///     plugin: plugin,
                ///     settings: settings
                /// }
                /// </summary>
                /// <param name="nameOfEvent">Name of the event, eg. serverProcessStart</param>
                /// <param name="additionalAttributes">Json object</param>
                var $div = plugin.$element,
                    $input = plugin.$input,
                    settings = plugin.getSettings(),
                    inputId = plugin.getInputNameOrId(plugin.$input),
                    finalEventName = this.names.getName(plugin, nameOfEvent);

                var event = this[finalEventName];
                if (plugin.isEmpty(event)) {
                    //console.log("Event Created: " + finalEventName);
                    event = {
                        id: inputId,
                        name: $input.attr("name"),
                        $input: $input,
                        $divContainer: $div,
                        eventName: nameOfEvent,
                        finalEventName: finalEventName,
                        plugin: plugin,
                        settings: settings
                    };

                    event = $.extend({}, event, additionalAttributes);

                    this[finalEventName] = event;
                }

                return event;

            },

            bindAllEvents: function (plugin) {
                /// <summary>
                /// Bind all events
                /// </summary>


                var isInTestingMode = plugin.isDebugging,
                    evtNames = this.names,
                    //createIconEvtName = evtNames.getName(evtNames.createIcon),
                    //hideIconEvtName = evtNames.getName(evtNames.hideIcons),
                    serverStartEvtName = evtNames.getName(plugin, evtNames.serverProcessStart),
                    serverSuccessEvtName = evtNames.getName(plugin, evtNames.serverProcessSucceeded),
                    serverFailEvtName = evtNames.getName(plugin, evtNames.serverProcessFailed),
                    serverAlwaysEvtName = evtNames.getName(plugin, evtNames.serverProcessReturnedAlways),
                    serverAllRequestComplete = evtNames.getName(plugin, evtNames.serverAllRequestComplete),
                    ajaxRequestName = pluginName + ".ajaxRequest";


                //bind events
                var $div = plugin.$element,
                    $input = plugin.$input,
                    url = plugin.getUrl(),
                    sendRequest = plugin.sendRequest,
                    settings = plugin.getSettings(),
                    isRequstSent = false,
                    cachedResponse;


                // server events

                // start

                var serverStartEventData = this.getEventsCommonAttributes(plugin, evtNames.serverProcessStart, {
                    url: url
                });
                //serverStartEventData contains a json modifed only the url property.
                //  event = {
                //      id: inputId,
                //      name: $input.attr("name"),
                //      $input: $input,
                //      $divContainer: $div,
                //      eventName: nameOfEvent,
                //      finalEventName: finalEventName,
                //      plugin: plugin,
                //      settings: settings
                //  }
                $input.on(serverStartEvtName, serverStartEventData, function (evt) {
                    //console.log(evt.data.finalEventName);
                    var fields = plugin.concatAdditionalFields($input);
                    sendRequest(plugin, $div, $input, url, fields);
                });


                $div.on(serverStartEvtName, serverStartEventData, function (evt) {
                    //console.log("div: " + evt.data.finalEventName);
                    //$input.trigger(serverStartEvtName);
                });


                // success
                var serverSuccessEventData = this.getEventsCommonAttributes(plugin, evtNames.serverProcessSucceeded, {
                    url: url
                });
                $input.on(serverSuccessEvtName, serverSuccessEventData, function (evt, response) {
                    //console.log(evt.data.finalEventName);
                    cachedResponse = response;
                    if (isInTestingMode) {
                        console.log(response);
                    }
                    evt.data.response = response;
                    plugin.hideAllIcons($div); // hide all the icons
                    plugin.markAsProcessing($div, false);
                    plugin.processResponse($input, response);
                    $div.attr("data-icon-added", "true");
                    //icons show/hide
                    plugin.hideSpinner($input);
                });

                $div.on(serverSuccessEvtName, serverSuccessEventData, function (evt, response) {
                    evt.data.response = cachedResponse;
                    //console.log("div: " + evt.data.finalEventName);
                    //$input.trigger(serverSuccessEvtName, [response]);

                });

                // failed
                var serverFailEventData = this.getEventsCommonAttributes(plugin, evtNames.serverProcessFailed, {
                    url: url
                });
                $input.on(serverFailEvtName, serverFailEventData, function (evt, jqXHR, textStatus, exceptionMessage) {
                    //console.log(evt.data.finalEventName);
                    plugin.hideAllIcons($div); // hide all the icons
                    plugin.hideSpinner($input);
                    plugin.errorProcess($div, $input, jqXHR, textStatus, exceptionMessage, url);
                    //console.log("Request failed: " + exceptionMessage + ". Url : " + url);
                });

                $div.on(serverFailEvtName, serverFailEventData, function (evt, jqXHR, textStatus, exceptionMessage) {
                    //console.log("div: " + evt.data.finalEventName);
                    //$input.trigger(serverFailEvtName, [jqXHR, textStatus, exceptionMessage]);
                });

                // always
                var serverAlwaysEventData = this.getEventsCommonAttributes(plugin, evtNames.serverProcessReturnedAlways, {
                    url: url
                });
                $input.on(serverAlwaysEvtName, serverAlwaysEventData, function (evt) {
                    evt.data.response = cachedResponse;
                    plugin.markAsProcessing($div, false);
                    plugin.hideSpinner($input);

                    //console.log(evt.data.finalEventName);
                    //console.log(evt.data);

                });
                $input.on(serverAllRequestComplete, function (evt) {
                    console.log(serverAllRequestComplete);
                    plugin.hideSpinner($input);
                    //if (settings.triggerValidationBeforeFormSubmit === true && settings.$formElement.length > 0) {
                    //    settings.$formElement.submit();
                    //}
                });
                $div.on(serverAlwaysEvtName, serverAlwaysEventData, function (evt) {
                    //evt.data.response = cachedResponse;
                    //console.log("div: " + evt.data.finalEventName);
                    //$input.trigger(serverAlwaysEvtName);
                });

            }
        },

        getAttributes: function () {
            return this.getSettings().attributes;
        },
        getEvents: function () {
            return this.getSettings().events;
        },
        getIcons: function () {
            return this.getSettings().icons;
        },
        getIdPrefixes: function () {
            return this.getSettings().iconsIdPrefixes;
        },
        getSelectors: function () {
            return this.getSettings().selectors;
        },
        getMessages: function () {
            return this.getSettings().messages;
        },
        isValidForProcessing: function ($div) {
            /// <summary>
            /// if it is valid for processing
            /// </summary>
            /// <param name="$div"></param>
            /// <returns type=""></returns>

            var attrs = this.getAttributes();
            return $div.attr(attrs.isValidate) === "true";
        },
        getInput: function () {
            if (this.isEmpty(this.$input)) {
                var $div = this.$element;
                this.$input = $div.find("input");
            }
            return this.$input;
        },
        getUrl: function () {
            if (this.isEmpty(this._url)) {
                var attrs = this.getAttributes(),
                    $input = this.getInput();

                this._url = $input.attr(attrs.url);
            }
            return this._url;
        },
        processDiv: function (plugin, $div) {
            //var $self = $selfContainer;
            var $input = this.getInput($div),
                url = this.getUrl();
            //this.test();
            this.inputProcessWithBlurEvent(plugin, $div, $input, url);

        },
        test: function () {
            this.showSpinner($input);
        },
        setCurrentTextForNexttimeChecking: function ($input) {
            $input.attr("data-previous-submit", $input.val());
        },
        isPreviousRequestIsSame: function ($div, $input, url) {
            /// <summary>
            /// Returns true/false based if it is the same request twice.
            /// Also called the event sameRequestTwice 
            /// </summary>
            /// <param name="$input"></param>
            /// <returns type="boolean">Returns true/false</returns>
            var previous = $input.attr("data-previous-submit"),
                returnStatement = previous === $input.val(),
                settings = this.getSettings(),
                events = settings.events;
            if (this.isDebugging) {
                console.log("Request is same : " + returnStatement);
            }

            if (returnStatement) {
                if (!this.isEmpty(events.sameRequestTwice)) {
                    events.sameRequestTwice($div, $input, url, previous);
                }
            }
            return returnStatement;
        },
        hideAllIcons: function ($div) {
            var self = this,
                $input = self.getInput();
            $div.removeAttr("data-icon-added");
            self.hideInvalidIcon($input);
            self.hideSpinner($input);
            self.hideErrorIcon($input);
            self.hideErrorIcon($input);
            self.hideValidIcon($input);
        },

        // processing
        inputProcessWithBlurEvent: function (self, $div, $input, url) {
            /// <summary>
            /// Bind keypress event with input and it will trigger server validation event
            /// if every condition from settings meets. 
            /// </summary>
            /// <param name="self" type="type"></param>
            /// <param name="$div" type="type"></param>
            /// <param name="$input" type="type"></param>
            /// <param name="url" type="type"></param>
            var //settings = this.getSettings(),
                isIconsVisible = true,
                eventsNames = self.events.names,
                serverProcessStartEvent = eventsNames.getName(self, eventsNames.serverProcessStart);

            var hideIcons = function () {
                if (isIconsVisible === true) {
                    self.hideAllIcons($div);
                    isIconsVisible = false;
                }
            }
            var blurEvent = function (event, url) {
                var isRequstValid = !self.isInProcessingMode($div) || self.isMultipleRequestAllowed();
                // if we are allowing to send multiple request while one is already being processing in the server.
                if (isRequstValid) {
                    var isDuplicateRequestAllowed = self.dontSendSameRequestTwice() && !self.isPreviousRequestIsSame($div, $input, url);
                    isRequstValid = isDuplicateRequestAllowed || !self.dontSendSameRequestTwice();
                    // check if same request is allowed to send twice.
                    if (isRequstValid) {

                        // if validation request before sending request.
                        var validationRequires = self.isInputValidationRequirestoSendRequest();

                        // is input needed to be valid before send the request.
                        isRequstValid = (validationRequires && $input.valid()) || !validationRequires;

                        if (isRequstValid) {
                            hideIcons();
                            isIconsVisible = true;
                            $input.trigger(serverProcessStartEvent);
                        }
                        if (self.getSettings().focusPersistIfNotValid) {
                            self.focusIfnotValid($input);
                        }
                    }
                }
            };

            var timeOutMethod;
            //$input.on("blur", function (evt) {

            //});

            $input.on("keypress", function (evt, delay) {
                if (!self.isEmpty(timeOutMethod)) {
                    clearTimeout(timeOutMethod);
                }
                if (self.isEmpty(delay)) {
                    delay = 750;
                }
                timeOutMethod = setTimeout(function () {
                    blurEvent(evt, url);
                }, delay);
            });
        },

        focusIfnotValid: function ($input, force) {
            /// <summary>
            /// Focus on the input if not valid.
            /// If forced then focus anyway.
            /// </summary>
            /// <param name="$input"></param>
            /// <param name="force"></param>
            /// <returns type=""></returns>
            if (force === true) {
                $input.focus();
                return;
            }
            if ($input.valid() === false) {
                $input.focus();
            }
        },
        concatAdditionalFields: function ($input) {
            var addFields = this.additionalFields.slice();
            var fields = {
                name: $input.attr("name"),
                value: $input.val()
            };
            addFields.push(fields);
            return addFields;
        },
        getSubmitMethod: function () {
            /// <summary>
            /// Returns submit method is it post or get
            /// </summary>
            /// <param name="$div"></param>
            /// <returns type=""></returns>
            return this.getSettings().submitMethod;
        },
        abortPreviousAjaxRequest: function ($input) {
            /// <summary>
            /// Abort previous ajax request and hide all the icons
            /// </summary>
            /// <returns type=""></returns>
            if (!this.isEmpty(this.ajaxRequest)) {
                var $div = this.$element;
                this.ajaxRequest.abort();
                this.hideAllIcons($div);
                this.showSpinner($input);
                $div.attr("data-icon-added", "true");
            }
        },
        sendRequest: function (self, $div, $input, url, sendingFields) {
            /// <summary>
            /// 
            /// </summary>
            /// <param name="$div"></param>
            /// <param name="$input"></param>
            /// <param name="url"></param>
            /// <param name="sendingFields"></param>
            var method = self.getSubmitMethod($input),
                settings = self.getSettings(),
                isCrossDomain = settings.crossDomain,
                events = settings.events;
            if (!self.isEmpty(events.beforeSendingRequest)) {
                events.beforeSendingRequest($div, $input, url, sendingFields);
            }
            //icons show/hide
            // Abort previous ajax request and hide all the icons
            self.abortPreviousAjaxRequest($input);

            self.markAsProcessing($div, true);
            self.setCurrentTextForNexttimeChecking($input);
            self.hideAllIcons($div); // hide all the icons

            var evtNames = self.events.names,
                successEventName = evtNames.getName(self, evtNames.serverProcessSucceeded),
                failedEventName = evtNames.getName(self, evtNames.serverProcessFailed),
                alwaysEventName = evtNames.getName(self, evtNames.serverProcessReturnedAlways),
                ajaxProperties = {
                    method: method, // by default "GET"
                    url: url,
                    data: sendingFields, // PlainObject or String or Array
                    crossDomain: isCrossDomain,
                    dataType: "json" //, // "Text" , "HTML", "xml", "script" 
                };

            if (isCrossDomain == true) {
                ajaxProperties.dataType = "jsonp";
            }
            self.ajaxRequest = $.ajax(ajaxProperties).done(function (response) {
                $input.trigger(successEventName, [response]);
            }).fail(function (jqXHR, textStatus, exceptionMessage) {
                $input.trigger(failedEventName, [jqXHR, textStatus, exceptionMessage]);
            }).always(function () {
                $input.trigger(alwaysEventName);
            });

        },
        errorProcess: function ($div, $input, jqXHR, textStatus, exceptionMessage, url) {
            var code = jqXHR.status,
                settings = this.getSettings(),
                events = settings.events,
                msg = "";

            if (code === 0) {
                code = 404;
                textStatus = "Requested url doesn't lead to a valid request.";
            }
            msg = "Code " + code + " : " + textStatus;

            //console.log(jqXHR);
            //console.log(textStatus);
            //icons show/hide
            this.showErrorIcon($input, msg);
            if (settings.focusPersistIfNotValid) {
                this.focusIfnotValid($input, true);
            }
            if (!this.isEmpty(events.onError)) {
                events.onError($div, $input, jqXHR, textStatus, exceptionMessage, url);
            }

        },
        markAsProcessing: function ($div, isProcessing) {
            if (this.isDebugging) {

                console.log("Making: " + isProcessing);
            }
            $div.attr("data-is-processing", isProcessing);
        },
        isInProcessingMode: function ($div) {
            var attr = $div.attr("data-is-processing");
            if (this.isDebugging) {
                console.log("is Processing: " + attr);
            }
            return attr === "true";
        },
        getInputNameOrId: function ($input) {
            var id = $input.attr('id');
            if (this.isEmpty(id)) {
                id = $input.attr('name');
            }
            return id;
        },
        setMessageOnIcons: function ($icon, message) {
            var $span = $icon.find("a").attr("title", message)
                .attr("data-original-title", message)
                .find("span");
            $span.attr("title", message)
                .attr("data-display", message);
        },
        createIcons: function ($input, icon, toolTipmessage, idPrefix) {
            /// <summary>
            /// Create icon and return that Icon whole container.
            /// </summary>
            /// <param name="$input">Specific input, this.$input</param>
            /// <param name="icon">Icon class to display(mostly the font-awesome icons). Retrieve from this.getIcons()</param>
            /// <param name="toolTipmessage">Icon's tooltip message.</param>
            /// <param name="idPrefix">Id prefixes for that icon. For spinner this.getPrefixIds().spiner.</param>
            /// <returns type="">Returns created icon object.</returns>
            var id = this.getInputNameOrId($input),
                $validator = this.getValidator(),
                $div = this.$element,
                settings = this.getSettings(),
                events = settings.events,
                wrapperName = this.getWrapperPrefix(),
                finalId = idPrefix + id;

            var html = "<div class='validation-icon-wrapper' id='" + wrapperName + finalId + "'><a data-toggle='tooltip' id='" + finalId + "'" +
                "title='" + toolTipmessage + "' " +
                "data-original-title='" + toolTipmessage + "' " +
                "class='tooltip-show'>" +
                "<span data-display='" + toolTipmessage + "' " +
                "class='" + icon + "' " +
                "title='" + toolTipmessage + "'></span>" +
                "</a></div>";
            $validator.append(html);
            var $created = $.byId(wrapperName + finalId); // get the whole container
            $.byId(finalId).tooltip();
            if (!this.isEmpty(events.iconCreated)) {
                events.iconCreated($div, $input, $created);
            }

            return $created;
        },
        getWrapperPrefix: function () {
            return "wrapper-";
        },
        getValidator: function () {
            /// <summary>
            /// Returns validator div
            /// </summary>
            if (this.isEmpty(this.$validator)) {
                var selectors = this.getSelectors();
                this.$validator = this.$element.find(selectors.validator);
            }
            return this.$validator;
        },
        getCachedIcon: function ($input, iconIdPrefix) {
            /// <summary>
            /// Returns the icon for that specific icon id prefix
            /// If not exist then create one and then return.
            /// </summary>
            /// <param name="$input"></param>
            /// <param name="iconIdPrefix"></param>
            /// <returns type=""></returns>
            var ids = this.getIdPrefixes(),
                id = this.getWrapperPrefix() + // wrapper-
                    iconIdPrefix + // icon 
                    this.getInputNameOrId($input),
                cachedId = "$" + id;
            var $existingIcon = this[cachedId];
            if (this.isEmpty($existingIcon)) {
                // doesn't have the cache icon.
                // icon needs to be created.
                var messages = this.getMessages(),
                    msg = "", // no message except for spinner, others will come from server.
                    icons = this.getIcons(),
                    iconClass = "";
                // set icon classes based on the given id.
                if (iconIdPrefix === ids.spinner) {
                    iconClass = icons.spinner;
                    msg = messages.requesting;
                } else if (iconIdPrefix === ids.valid) {
                    iconClass = icons.valid;
                } else if (iconIdPrefix === ids.invalid) {
                    iconClass = icons.invalid;
                } else if (iconIdPrefix === ids.error) {
                    iconClass = icons.error;
                }
                $existingIcon = this.createIcons($input, iconClass, msg, iconIdPrefix);
                this[cachedId] = $existingIcon;
            }
            return $existingIcon;
        },
        //
        getInvalidIcon: function ($input) {
            /// <summary>
            /// Get invalid a tag.
            /// </summary>
            if (this.isEmpty(this.$invalidMarkIcon)) {
                var ids = this.getIdPrefixes();
                this.$invalidMarkIcon = this.getCachedIcon($input, ids.invalid);
            }
            return this.$invalidMarkIcon;
        },

        getValidIcon: function ($input) {
            /// <summary>
            /// Get valid a tag.
            /// </summary>
            if (this.isEmpty(this.$validMarkIcon)) {
                var ids = this.getIdPrefixes();
                this.$validMarkIcon = this.getCachedIcon($input, ids.valid);
            }
            return this.$validMarkIcon;
        },
        getSpinner: function ($input) {
            /// <summary>
            /// Get spinner's div tag.
            /// </summary>
            if (this.isEmpty(this.$spinner)) {
                var ids = this.getIdPrefixes();
                this.$spinner = this.getCachedIcon($input, ids.spinner);
            }
            return this.$spinner;
        },
        getErrorIcon: function ($input) {
            /// <summary>
            /// Get spinner's div tag.
            /// </summary>
            if (this.isEmpty(this.$errorIcon)) {
                var ids = this.getIdPrefixes();
                this.$errorIcon = this.getCachedIcon($input, ids.error);
            }
            return this.$errorIcon;
        },
        showErrorIcon: function ($input, message) {
            var $icon = this.getErrorIcon($input);
            this.setMessageOnIcons($icon, message);
            this.animateOn($icon);
        },
        showSpinner: function ($input) {
            var $spinner = this.getSpinner($input);
            this.animateOn($spinner);
        },

        showInvalidIcon: function ($input, message) {
            var $markIcon = this.getInvalidIcon($input);
            this.setMessageOnIcons($markIcon, message);
            this.animateOn($markIcon);
        },

        showValidIcon: function ($input, message) {
            var $markIcon = this.getValidIcon($input);
            this.setMessageOnIcons($markIcon, message);
            this.animateOn($markIcon);
        },
        hideValidIcon: function ($input) {
            var $icon = this.getValidIcon($input);
            this.animateOff($icon);
        },
        hideErrorIcon: function ($input) {
            var $icon = this.getErrorIcon($input);
            this.animateOff($icon);
        },
        hideInvalidIcon: function ($input) {
            var $icon = this.getInvalidIcon($input);
            this.animateOff($icon);
        },
        hideSpinner: function ($input) {
            var $spinner = this.getSpinner($input);
            this.animateOff($spinner);
        },
        animateOn: function ($object) {
            $object.removeClass("hide");
        },
        animateOff: function ($object) {
            $object.addClass("hide");
        },

        processResponse: function ($input, response) {
            /// <summary>
            /// 
            /// </summary>
            /// <param name="response"></param>
            /// <returns type=""></returns>
            //response: {
            //        message: "Field is valid.",
            //        isValid: true,
            //        isError: false,
            //        errorCode: null,
            //        errorMessage: null
            //}
            var self = this,
                $div = this.$element,
                settings = this.getSettings(),
                events = settings.events;

            if (!this.isEmpty(events.responseReceived)) {
                events.responseReceived($div, $input, response);
            }
            var responseFormat = settings.response;

            response = $.extend({}, responseFormat, response);
            if (response.isValid) {
                self.validResponse($input, response);
            } else {
                self.inValidResponse($input, response);
            }
            if (!this.isEmpty(events.responseProcessed)) {
                events.responseProcessed($div, $input, response);
            }
        },
        validResponse: function ($input, response) {
            /// <summary>
            /// Process if response has valid = true.
            /// </summary>
            /// <param name="$input"></param>
            /// <param name="response">Response json</param>
            // response is valid
            // spinner is already hidden from sendRequest method.
            //response: {
            //        message: "Field is valid.",
            //        isValid: true,
            //        isError: false,
            //        errorCode: null,
            //        errorMessage: null
            //}
            var isDisableInput = this.isDisableInputOnValidation(),
                events = this.getSettings().events,
                settings = this.getSettings(),
                $div = this.$element,
                validation = true,
                msg = response.message;
            if (!this.isEmpty(events.validBefore)) {
                events.validBefore($div, $input, response);
            }
            this.showValidIcon($input, response.message);

            if (isDisableInput) {
                $input.attr("disabled", "disabled");
            }

            $div.attr("data-server-validated", validation)
                .attr("data-message", msg);
            $input.attr("data-server-validated", validation)
                .attr("data-message", msg);
            $input.removeClass("input-validation-error");
            if (settings.hideOnValidation) {
                $div.attr("data-is-hidden", validation);
                $div.hide('slow');
            }

            if (!this.isEmpty(events.validAfter)) {
                events.validAfter($div, $input, response);
            }
        },
        inValidResponse: function ($input, response) {
            //response: {
            //        message: "Field is valid.",
            //        isValid: true,
            //        isError: false,
            //        errorCode: null,
            //        errorMessage: null
            //}
            var settings = this.getSettings(),
                events = settings.events,
                $div = this.$element,
                validation = false,
                msg = response.message;

            if (!this.isEmpty(events.invalidBefore)) {
                events.invalidBefore($div, $input, response);
            }

            this.showInvalidIcon($input, response.errorMessage);
            $div.attr("data-server-validated", validation)
                .attr("data-message", msg);
            $input.attr("data-server-validated", validation)
                .attr("data-message", msg);
            $input.addClass("input-validation-error");
            if (settings.focusPersistIfNotValid) {
                this.focusIfnotValid($input, true);
            }
            if (!this.isEmpty(events.invalidAfter)) {
                events.invalidAfter($div, $input, response);
            }
        },
        isInvalid: function (plugin) {
            /// <summary>
            /// Returns true/false based on input if the input  invalid.
            /// </summary>
            var $input = plugin.getInput();
            return $input.attr("data-server-validated") !== "true" || !$input.valid();
        },
        sendServerValidationRequestOnlyIfInputInvalidOrNotProcessed: function (plugin) {
            /// <summary>
            /// Only send request to the server if input is not processed or invalid.
            /// </summary>
            /// <param name="plugin" type="type"></param>
            /// <returns type="">Return 1 when trigers validation. Returns 0 when it is already valid.</returns>
            var $input = plugin.getInput();
            if (plugin.isInvalid(plugin) === true) {
                var events = plugin.events,
                  evtNames = events.names,
                  serverProcessStartEventName = evtNames.getName(plugin, evtNames.serverProcessStart);
                // TODO : check the other validation 
                $input.trigger(serverProcessStartEventName); // trigger right away
                return 1;
            }
            return 0;
        },
        getEventNameOfServerAlways: function (plugin) {
            /// <summary>
            /// Send the requst to the server to validate the request.
            /// </summary>
            var events = plugin.events,
                evtNames = events.names,
                serverAlwaysEvtName = evtNames.getName(plugin, evtNames.serverProcessReturnedAlways);

            return serverAlwaysEvtName;
        }
    });

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn.serverValidate = function (options) {
        /// <summary>
        /// expecting a container which contains divs
        /// of .form-row and inside there is a input with
        /// a .validator-container>.validator
        /// </summary>
        /// <param name="options"></param>
        /// <returns type=""></returns>
        $selfContainer = this;
        var isEmptyContainer = $selfContainer === undefined || $selfContainer === null || $selfContainer.length === 0,
           $elementContainer = this,
           settingsTemporary = $.extend({}, defaults, options),
           selectors = settingsTemporary.selectors,
           additionalFieldsSelectorArray = selectors.additionalFields;
        var additionalFields;
        if ($elementContainer.isValidationInit !== true) {
            if (settingsTemporary.$directContainer.length === 0) {
                $divContainers = $elementContainer.find(selectors.divContainer);
                $elementContainer.isValidationInit = true;
            }
        }

        var $containers = null,
            isEmpty = function (variable) {
                return variable === undefined || variable === null || variable.length === 0 || variable === "";
            };
        if (settingsTemporary.$directContainer.length === 0) {
            $containers = $divContainers;
        } else {
            //direct container element selected
            $containers = settingsTemporary.$directContainer;
        }


        var pluginAttacherElements = [];
        var i;
        for (i = 0; i < $containers.length; i++) {
            var $divElement = $($containers[i]),
                settingTemporary2 = $.extend({}, defaults, options);
            if ($divElement.attr("data-is-validate") === "true") {
                var $input = $divElement.find("input");
                var settings = getSettingfromDiv($input, settingTemporary2);

                additionalFields = processAdditionalFields($elementContainer, additionalFieldsSelectorArray);
                $allInputs.push($input);
                var creatingPlugin = new plugin($divElement, $input, settings, additionalFields),
                    pluginAttacher = {
                        plugin: creatingPlugin,
                        additionalFields: additionalFields,
                        $divContainer: $divElement,
                        $input: $input,
                        options: settings
                    };
                pluginAttacherElements.push(pluginAttacher);
            }
        }


        if (isEmptyContainer === false && $containers.length > 0) {
            $selfContainer["plugin." + pluginName] = {
                self: this,
                attachers: pluginAttacherElements
            }
        }
        //form selector
        var $form = settingsTemporary.$formElement;
        if (settingsTemporary.triggerValidationBeforeFormSubmit === true) {
            if ($form.length === 0 && !isEmpty(settingsTemporary.formSelector)) {
                $form = $(settingsTemporary.formSelector);
            }
            if ($form.length > 0 && isEmpty(settingsTemporary.$submitButton)) {
                settingsTemporary.$submitButton = $form.find("button");
            }
        }

        var $submitbtn = settingsTemporary.$submitButton;
        // form events
        // catch form submit event ... 
        var isFormSubmittingRequired = settingsTemporary.triggerValidationBeforeFormSubmit === true && $form.length > 0;

        if (isFormSubmittingRequired) {
            if ($form.length > 0) {
                var allPlugins = pluginAttacherElements,
                    inputsSentForValidationCount = 0,
                    submitFormDirectly = false;

                // fix validation on submit
                $form.removeData("validator").removeData("unobtrusiveValidation");
                $.validator.unobtrusive.parse($form);

                $form.submit(function (e) {
                    if (submitFormDirectly === false) {

                        //pluginAttacherElements[i] = {
                        //    plugin: creatingPlugin,
                        //    additionalFields: additionalFields,
                        //    $divContainer: $divElement,
                        //    $input: $input,
                        //    options: settings
                        //};
                        inputsSentForValidationCount = 0;
                        for (var j = 0; j < allPlugins.length; j++) {
                            var singlePlugin = allPlugins[j];
                            // Updates pluginsCount if request is send to the server.
                            inputsSentForValidationCount += singlePlugin.plugin.sendServerValidationRequestOnlyIfInputInvalidOrNotProcessed(singlePlugin.plugin);
                        }
                        if (inputsSentForValidationCount > 0) {
                            e.preventDefault();
                            $submitbtn.attr("disabled", "disabled");
                        } else {
                            //this.submit();
                        }
                    } else {
                        // submitFormDirectly = true
                        submitFormDirectly = false;
                        this.submit();
                    }
                });

                //attach event for when call is returned from server validation
                for (i = 0; i < allPlugins.length; i++) {
                    var singlePlugin = allPlugins[i].plugin,
                        serverAlwaysCallingEventName = singlePlugin.getEventNameOfServerAlways(singlePlugin),
                        $inputBox = singlePlugin.getInput();
                    //attach event for when call is returned 
                    $inputBox.on(serverAlwaysCallingEventName, function onServerExecutionCameBack() {
                        var $this = $(this);
                        console.log($this);
                        inputsSentForValidationCount = inputsSentForValidationCount - 1; // one done.
                        if (inputsSentForValidationCount === 0) { // when all done.
                            setTimeout(function () {
                                // if all inputs are valid then submit.
                                var allValid = true;
                                for (var j = 0; j < allPlugins.length; j++) {
                                    var singlePluginObject = allPlugins[j].plugin;
                                    if (singlePluginObject.isInvalid(singlePluginObject)) {
                                        allValid = false;
                                    }
                                }
                                if (allValid === true) {
                                    submitFormDirectly = true;
                                    $form.submit();
                                }
                                $submitbtn.removeAttr("disabled", "disabled");
                            }, 500);
                        }
                    });
                }

            }
        }

    };

})(jQuery, window, document);
///#source 1 1 /JavaScript-Mvc-framework/libs/DevOrgPlugins/dev-component-runner.js
/// <reference path="developers-organism.component.js" />
/// <reference path="developers-organism.dynamicSelect.js" />
/// <reference path="developers-organism.upload.js" />
/// <reference path="faster-jQuery.js" />
/// <reference path="WeReviewApps.js" />
/// <reference path="../star-rating.js" />
/// <reference path="../validation.js" />
/// <reference path="../underscore.js" />
/// <reference path="developers-organism.country-phone.js" />
/// <reference path="../ckeditor.js" />

/*!
 * Written by Alim Ul Karim
 * Developers Organism
 * Dated : 14 June 2015
 * Version : 1.2
 * https://www.facebook.com/DevelopersOrganism
 * mailto:info@developers-organism.com
*/

$.devOrg = $.devOrg || {};

$.devOrg.runner = function () {
    $.devOrg.Constants = {
        registerForm: $("form.register-form"),
        userName: "UserName",
        email: "Email",
        phoneNumberSelector: "#Phone",
        slash: "/",
        // "/Validator/"
        validatorCommonUrl: "/Validator/",
        //"/Validator/Username"
        usernameValidationUrl: "/Validator/Username",
        //"/Validator/Email"        
        emailAddressValidationUrl: "/Validator/Email",
        countryJsonUrl: "/Content/Scripts/Data/country-info-select-ready.json", // look like this /Partials/GetTimeZone/CountryID
        timeZoneJsonUrl: "/Partials/GetTimeZone", // look like this /Partials/GetTimeZone/CountryID
        languageJsonUrl: "/Partials/GetLanguage" // look like this /Partials/GetTimeZone/CountryID
    };


    if ($.devOrg.Constants.registerForm.length > 0) {
        // country , timezone, and phone initialize
        //$.devOrg
        //    .countryTimezonePhoneComponent
        //    .initialize($.devOrg.Constants.countryJsonUrl,
        //        $.devOrg.Constants.timeZoneJsonUrl,
        //        $.devOrg.Constants.languageJsonUrl,
        //        true // retrieve as html, to have the processed version  , make it false and change the url.
        //        );

        //$.devOrg.validateInputFromServer("#" + $.devOrg.Constants.userName,
        //                                  $.devOrg.Constants.usernameValidationUrl,
        //                                  $.devOrg.Constants.userName,
        //                                  true,
        //                                  false,
        //                                  3);
        //$.devOrg.validateInputFromServer("#" + $.devOrg.Constants.email,
        //                                  $.devOrg.Constants.emailAddressValidationUrl,
        //                                  $.devOrg.Constants.email,
        //                                  false,
        //                                  false,
        //                                  4);

        $.devOrg.enterToNextTextBox(".register-form", false);
        //$.devOrg.uxFriendlySlide("form.register-form", true);


        //$.devOrg.bootstrapComboSelectbyFindingValue("select.country-combo", '1');

    }


    // make tables look nice with pagination




    ///Implement .rating-5,.rating-10
    $.devOrg.ratingMordernize();
    $.devOrg.bootstrapTabsMordernize(".make-it-tab");


}

$(function () {
    $.devOrg.runner();
});
///#source 1 1 /JavaScript-Mvc-framework/libs/DevOrgPlugins/WeReviewApps.js
/// <reference path="developers-organism.component.js" />
/// <reference path="byId.js" />
/// <reference path="../jquery-2.1.4.intellisense.js" />
/**
 * Written by Alim Ul Karim
 * Developers Organism
 * Written  : 14 Nov 2014
 * Modified : 28 Sep 2015
 */

/// <summary>
/// Were view app plug-in written by Alim Ul Karim
/// </summary>
$.WeReviewApp = {
    ///appForm represents both app-edit and app-posting form
    ///appFormSelector : form.app-editing-page
    $appFormWrapper: [],
    $appForm: [], //$("form.app-editing-page"), // means both editing and posting
    // appFormEdit selector : form.app-edit
    $appFormEdit: [], //$("form.app-edit"),
    // app form post  :form.app-post
    $appFormPost: [], //$("form.app-post"),
    // all input inside form app-port
    $allInputs: [], // $("form.app-post input"),
    ajaxDraftPostUrl: "/App/SaveDraft",
    $appPageUploaderNotifier: $.byId("notify-global-info-second"),
    homePageUrl: "/",
    selectorForUploaderRows: "#collection-uploaders", //"#collection-uploaders .form-row-uploader",
    afterDraftPostRedirectPageUrl: "/",
    /**
     * Uploader container not single uploaders. Single uploaders can be found by 
     * $uploaderContainer.find(".form-row-uploader") will return single uploaders.
     */
    $uploaderContainer: [],
    /**
     * this variable indicates weather there is any change in the form inputs/textarea.
     * It is similar to word file change when it gets dirty it promts for saving message.
     * Likewise if there is any changes in input fields in the form then this variable becomes true 
     * indicating there is change and based on that we should prompt a message to the user to proceed or leave the page.
     */
    appInputChangesExist: false,
    $globalTopErrorLabel: $.byId("notify-global-info-top"),
    $howtoUseUploaderInfoLabel: $.byId("how-to-use-uploader-info"),
    isTesting: false,
    draftSavingFailedErrorMsg: "Sorry couldn't save the draft , possible reason maybe connection lost or your draft buffer is exceeded.",
    numberOfDraftPossible: 10,
    appTitleValidAttrName: "data-server-validated",
    galleryImageUploaderId: 0,
    maxTryInputSubmit: 250,
    sendingDraftNumber: 0,
    writeReviewFormUrl: "/Reviews/GetReviewForm",
    appUrlRetrievalUrl: "/Partials/GetAppUrl",
    reviewSpinnerSelector: "review-requesting-spinner",
    reviewFormContainerSelectorInAppPage: "#write-review-form-container",
    reviewFormSubmitUrl: "/Reviews/Write",
    ///consist of # : "#app-details-page"
    appDetailsPageParentId: "#app-details-page",
    friendlyUrlRegularExpression: "[^A-Za-z0-9_\.~]+",

    getFriendlyUrlSlug: function (str) {
        /// <summary>
        /// Returns friendly url slug from given string
        /// Hello World -> hello-world
        /// </summary>
        /// <param name="str"></param>
        //"[^A-Za-z0-9_\.~]+"
        if (_.isEmpty(str) === false) {
            var regexString = $.WeReviewApp.friendlyUrlRegularExpression;
            str = str.trim();
            var regExp = new RegExp(regexString, "gi");
            return str.replace(regExp, "-");
        } else {
            return "";
        }
    },
    /**
     * single input IFRAME code HTML  to Square
     */
    fixIframeTag: function ($jQueryInputText) {
        //<iframe width="560" height="315" src="//www.youtube.com/embed/ob-P2a6Mrjs" frameborder="0" allowfullscreen></iframe>
        var currentText = $jQueryInputText.val();
        //currentText = currentText.toLowerCase();
        var reg = new RegExp("<iframe", "gi");
        currentText = currentText.replace(reg, "[iframe");
        reg = new RegExp("</iframe>", "gi");
        currentText = currentText.replace(reg, "[/iframe]");
        currentText = currentText.replace(">", "]");
        $jQueryInputText.val(currentText);
    },
    /**
     * single input IFRAME code Square  to HTML
     */
    iframeSquareToActualTag: function ($jQueryInputText) {
        //[iframe width="560" height="315" src="//www.youtube.com/embed/ob-P2a6Mrjs" frameborder="0" allowfullscreen></iframe]
        var currentText = $jQueryInputText.val();
        //currentText = currentText.toLowerCase();
        var reg = new RegExp("\\[iframe", "gi");
        currentText = currentText.replace(reg, "<iframe");
        reg = new RegExp("\\[/iframe\\]", "gi");
        currentText = currentText.replace(reg, "</iframe>");
        currentText = currentText.replace("]", ">");
        $jQueryInputText.val(currentText);
    },



    /**
     * This event is called when form is submitting from app-editing page only.
     * @param {} e 
     * @returns {} 
     */
    appEditingSubmitEvent: function (e) {
        e.preventDefault();
        var self = $.WeReviewApp;
        if (!self.isAppTitleValid()) {
            self.$appPageUploaderNotifier.text("Please validate title to proceed next.");
        }
    },

    /**
     * Covert all url inputs IFRAME code HTML to Square
     */
    fixAllInputIframeDataOrHtmlToSquare: function () {
        var inputSelectors = "input.url-input";
        var self = $.WeReviewApp;
        var inputFields = self.$appForm.find(inputSelectors);
        if (inputFields.length > 0) {
            for (var i = 0; i < inputFields.length; i++) {
                var $eachInputfield = $(inputFields[i]);
                self.fixIframeTag($eachInputfield);
            }
        }
    },
    /**
     * Covert all url inputs IFRAME code Square to HTML
     */
    invertAllInputIframeDataOrSquareToHtml: function () {
        var inputSelectors = "input.url-input";
        var self = $.WeReviewApp;
        var inputFields = self.$appForm.find(inputSelectors);
        if (inputFields.length > 0) {
            for (var i = 0; i < inputFields.length; i++) {
                var $eachInputfield = $(inputFields[i]);
                self.iframeSquareToActualTag($eachInputfield);
            }
        }
    },
    /**
     * get a string regular expression based on parameter
     */
    getAttributeRemoveRegularExpressionFor: function (attributeName) {
        /// <summary>
        /// Returns a string of regular expression to remove attribute from html tag.
        /// Use for removing height and width.
        /// </summary>
        /// <param name="attributeName">Give an html attribute to remove it from the string.</param>
        /// <returns type=""></returns>
        return "(" + attributeName + ".*=.*[\"\"'])([a-zA-Z0-9:;\.\s\(\)\-\,]*)([\"\"'])";
    },

    removeHeightWidthAttributes: function ($jQueryInputText) {
        var currentText = $jQueryInputText.val();
        var self = $.WeReviewApp;
        //currentText = currentText.toLowerCase();
        var heightRegEx = self.getAttributeRemoveRegularExpressionFor("Height");
        var widthRegEx = self.getAttributeRemoveRegularExpressionFor("Width");

        var reg = new RegExp(heightRegEx, "gi");
        currentText = currentText.replace(reg, "");
        reg = new RegExp(widthRegEx, "gi");
        currentText = currentText.replace(reg, "");
        $jQueryInputText.val(currentText);
    },

    fixYouTubeVideoPropertise: function () {
        var inputSelectors = "input.url-input";
        var self = $.WeReviewApp;
        var inputFields = self.$appForm.find(inputSelectors);
        if (inputFields.length > 0) {
            for (var i = 0; i < inputFields.length; i++) {
                var $eachInputfield = $(inputFields[i]);
                self.removeHeightWidthAttributes($eachInputfield);
            }
        }
    },

    /// it doesn't include fixing html inputs
    /// return as ajax response, add methods like success or fail to do something with it.
    ajaxDraftSaveApp: function (e) {
        var self = $.WeReviewApp,
            formData = self.$appForm.serializeArray();

        // ajax post to save draft app
        return $.ajax({
            type: "POST",
            dataType: "JSON",
            url: $.WeReviewApp.ajaxDraftPostUrl,
            data: formData
        }); // ajax end
    },

    beforeUnloadEvent: function () {
        /// <summary>
        /// Only sends to draft if in the app posting page.
        /// </summary>
        /// <returns type=""></returns>
        var self = $.WeReviewApp;
        if (self.appInputChangesExist) {

            if (self.$appFormPost.length > 0) {
                // app posting page
                // send as ajax post
                if (self.sendingDraftNumber <= self.numberOfDraftPossible) {
                    // fix all html inputs
                    self.fixAllInputIframeDataOrHtmlToSquare();

                    self.ajaxDraftSaveApp();
                }

            }// app posting page if else end.


            return "Are you sure you wanted to leave? Your app will be saved as a draft if you leave (you can have up to " + self.numberOfDraftPossible + " draft posts).";
        }
    },
    /**
     * When draft button is clicked from app-posting page.
     */
    appFormDraftBtnClicked: function () {
        var self = $.WeReviewApp;
        self.$appForm.find("#draft-btn").click(function (e) {
            e.preventDefault();
            self.appInputChangesExist = false;
            // fix html input type to relevant square brackets
            // fix all html inputs
            self.fixAllInputIframeDataOrHtmlToSquare();

            //send ajax request to draft save.
            self.ajaxDraftSaveApp()
            .done(function (data) {
                // if successful then move to redirect page.
                window.location.href = self.afterDraftPostRedirectPageUrl;
            })
            .fail(function (jqXhr, textStatus) {
                self.$globalTopErrorLabel.text(self.draftSavingFailedErrorMsg);
            });
        });
    },
    /*
     * This method is related to display contents 
     * when **only** app-editing page is ready (not submitting)
     * For submitting $.WeReviewApp.appEditingSubmitEvent method is called
     */
    appEditingPageOnReady: function () {
        var self = $.WeReviewApp;
        //var $formInputs = self.$appForm.find("select,input[name!=YoutubeEmbedLink]");
        //console.log($formInputs);

        //$.devOrg.validateInputFromServer("#AppName", "/Validator/GetValidUrlEditing", "AppName", false, false, 3, true, " is invalid means that one app is already exist within this exact platform or category. You may change those to get a valid title and url.", null, $formInputs, self.maxTryInputSubmit);

        // stop form submitting the form if any file upload is not done.
        // before app editing submit method
        // this method only calls for app editing page submission only.
        self.$appForm.submit(self.appEditingSubmitEvent); // this is only for editing page only.
        // fix square brackets to html brackets
        self.invertAllInputIframeDataOrSquareToHtml();
    },



    appNameOnBlur: function () {
        /// <summary>
        /// What happens when appname field is blured
        /// Getting tags from app title
        /// </summary>
        /// <returns type=""></returns>
        var self = $.WeReviewApp,
            $anchor = $.byId("app-url-link"),
            $anchorContent = $.byId("app-url-content"),
            //$serverWrapper = $.byId("server-validation-form"),
            //$tokenField = $serverWrapper.find("[name=__RequestVerificationToken]"),
            //token = $tokenField.val(),
            url = self.appUrlRetrievalUrl,
            generateUrl = self.generateAppUrlDisplay,
            $appNameInput = $.byId("AppName"),
            $tagsInput = $.byId("Tags"),
            previousText = null,
            $appUrlSpinner = $.byId("app-url-spinner-icon");
        var currentMethod = null;
        //var $formInputs = self.$appForm.find("select,input[name!=YoutubeEmbedLink]");
        $appNameInput.on("jq.validate.AppName.serverProcessSucceeded", function () {
            $appUrlSpinner.removeClass("hide");
            if (currentMethod !== null) {
                clearTimeout(currentMethod);
            }
            currentMethod = setTimeout(function () {
                var value = $appNameInput.val(),
                    tagsArray = value.split(" "),
                    tagsExistingText = $tagsInput.val(),
                    existingTagsArray = tagsExistingText.split(",");
                // generate app url in the display.
                if (self.isAppTitleValid($appNameInput)) {
                    generateUrl(self, url, value, $anchor, $anchorContent);
                    $appUrlSpinner.addClass("hide");
                }
                if (previousText !== value) {

                    previousText = value;
                    if (!_.isEmpty(value)) {
                        tagsArray.push(value.trim());
                    }
                    if (existingTagsArray.length > 0) {
                        for (var i = 0; i < existingTagsArray.length; i++) {
                            var element = existingTagsArray[i];
                            if (!_.isEmpty(element)) {
                                tagsArray.push(element.trim());
                            }
                        }
                    }
                    var uniqueArray = _.without(_.uniq(tagsArray), "");
                    //console.log(tagsArray);
                    //console.log(uniqueArray);
                    //var tags = uniqueArray.join(",");
                    $tagsInput.tagsinput('removeAll');
                    for (var j = 0; j < uniqueArray.length; j++) {
                        $tagsInput.tagsinput('add', uniqueArray[j]);
                    }
                }

            }, 600);

        });
    },
    generateAppUrlDisplay: function (self, url, appTitle, $anchor, $anchorContent) {
        /// <summary>
        /// Display app url from server, called from appNameOnBlur()
        /// </summary>
        /// <param name="self">$.WeReviewApp</param>
        /// <param name="url">url to get the app titl valid url.</param>
        /// <param name="appTitle">Typed app title from user.</param>
        /// <param name="token">Token</param>
        var data = self.$appForm.serializeArray(),
            combined = [],
            isTesting = 0;
        if (isTesting === 1) {
            for (var i = 1; i < 5; i++) {
                var row = data[i];
                combined.push(row.name + "=" + row.value);
            }
            console.log(combined.join("\n"));
        }
        $.ajax({
            type: "POST",
            dataType: "JSON",
            url: url,
            data: data
        }).done(function (response) {
            var appUrl = response.url;
            $anchorContent.text(appUrl);
            $anchor.attr("href", appUrl);
            //console.log(response);
        }).error(function () {
            $anchorContent.text("Error ! Please be in touch with admin via contact us page.");
            $anchor.attr("href", "");
        }); // ajax end
    },
    /*
     * This method is related to display contents 
     * when **only** app-posting page is ready but not submitting.
     * For submitting $.WeReviewApp.appformPostEvent method is called.
     */
    appPostingPageOnReady: function () {
        var self = $.WeReviewApp;
        $.devOrg.uxFriendlySlide(self.$appForm, true, true);



        ///hiding the uploader on the app loader page for every time before posting a new app.
        // now let's keep all the uploaders visible so comment out the below line.
        self.$uploaderContainer = self.$appForm.find(self.selectorForUploaderRows).hide();

        // stop form submitting the form if any file upload is not done.
        self.$appForm.submit(self.appformPostEvent);

        self.appFormDraftBtnClicked();

    },

    /**
     * App post submitting event from both edit or posting page.
     * @param {} e 
     * @returns {} 
     */
    appformPostEvent: function (e) {
        /// <summary>
        /// this event will raise when a app submit is called or clicked on post at the bottom of the page.
        /// validation for app posting.
        /// </summary>
        /// <param name="e">
        /// Event delegate
        /// </param>

        // ifAnyUploadfails = false means there is no uploader which is invalid.
        var ifAnyUploadfails = false;
        var self = $.WeReviewApp;
        var $x = [];

        var raiseUploaderInvalidMessage = function (failedBoolean) {
            if (failedBoolean) {
                if ($.isEmpty($x)) {
                    $x = $("#dwdwd");
                }
                var $wrapper = $.findCachedId("notify-global-info-second-wrapper");
                self.$appPageUploaderNotifier.text("Please upload all necessary files to proceed next.");
                var animationClass = "shake";
                setTimeout(function () {
                    $wrapper.removeClass(animationClass);
                    setTimeout(function () {
                        $wrapper.addClass(animationClass);
                    }, 500);
                }, 200);
            } else {
                self.$appPageUploaderNotifier.text("");
            }
        }

        var isInvalidateUploader = function ($uploaderx) {
            var idAttr = $uploaderx.attr("data-id"); //always use jquery to get attr
            var loadedValues = $.devOrgUP.getCountOfHowManyFilesUploaded(idAttr);

            if (loadedValues === 0) {
                return true;
            } else {
                return false;
            }
        }

        if (self.$appFormPost.length > 0) {
            e.preventDefault();

            // only check uploader when posting time

            // first check if form is valid or not.
            var visibleInputsExceptFile = self.$allInputs.filter("[type!=file]:visible");
            var len = visibleInputsExceptFile.length;
            if (!self.isAppTitleValid()) {
                self.$globalTopErrorLabel.text("Please fill out the title correctly. It's very important for your app.");
                self.$globalTopErrorLabel.show();
                return;
            }
            var i;
            for (i = 0; i < len; i++) {
                var $singleInput = $(visibleInputsExceptFile[i]);
                if (!$singleInput.valid()) {
                    self.$globalTopErrorLabel.text("Please fill out the required fields.");
                    return; // halt
                }
            }

            self.$globalTopErrorLabel.text("");

            self.$uploaderContainer.show("slow"); // uploaders will be visible here.

            // checking uploaders if valid

            var checkIfUploadersAreValid = function () {
                var $uploaders2 = self.$allInputs.filter("input[type='file']");
                // only validate uploads if any uploader exist.
                var countUploaders = $uploaders2.length;

                for (i = 0; i < countUploaders; i++) {
                    var uploaderHtml = $uploaders2[i];
                    var $uploader = $(uploaderHtml);
                    if (ifAnyUploadfails === false) { // there is no uploader invalid yet.
                        // ifAnyUploadfails = true means uploader is invalid.
                        ifAnyUploadfails = isInvalidateUploader($uploader);
                    }
                }
                // ifAnyUploadfails = true then it raise a invalid message and halt.

                raiseUploaderInvalidMessage(ifAnyUploadfails); // halt happens in the next if-else logic
            }

            checkIfUploadersAreValid();

            // ifAnyUploadfails = true then halt.
            if (!ifAnyUploadfails && self.isAppTitleValid()) {
                // everything is successful
                self.appInputChangesExist = false;

                self.fixAllInputIframeDataOrHtmlToSquare(); //html input to square input . <tag></tag> .. [tag][/tag]
                // all conditions fulfilled so submit the form

                //var data = $.WeReviewApp.$appForm.serialize();
                //console.log(data);
                ////alert(data);
                //$.ajax({
                //    url: $.WeReviewApp.$appForm.attr("action"),
                //    //url: "/App/AppPost",
                //    data: data,
                //    success: function (response) {
                //        console.log(response);
                //    }
                //});

                this.submit(); //previous submission.
            }

        }

    },

    isAppTitleValid: function ($appNameInputTextbox) {
        /// <summary>
        /// Check if the app name or title is valid or not.
        /// </summary>
        /// <param name="$appNameInputTextbox"></param>
        var $appName = $appNameInputTextbox;
        if (_.isEmpty($appNameInputTextbox)) {
            $appName = $("#AppName");
        }
        if ($appName.length > 0) {
            var hasValidAttr = $appName.attr($.WeReviewApp.appTitleValidAttrName);

            if (hasValidAttr && $appName.valid()) {
                return true;
            }
        }
        return false;
    },
    /**
     * App edit or post before action.
     * Determination point of app edit or post.
     */
    routeAppEditingFormAndInitialize: function (e) {
        /// <summary>
        /// Route app editing form and initialize all other methods.
        /// </summary>
        /// <param name="e"></param>
        var self = $.WeReviewApp;
        // routing
        if (self.$appForm.length > 0) {
            self.$howtoUseUploaderInfoLabel.hide(); //hide uploader info label.

            //bind with blur event of AppName
            self.appNameOnBlur();
            var appNameInputServerValidateEventname = "jq.validate.AppName.serverProcessStart";
            var $appNameInput = $.byId("AppName");
            if (self.$appFormPost.length > 0) {
                // app posting
                self.appPostingPageOnReady(); // app creating

                // Only sends to draft if in the app posting page.
                $(window).bind("beforeunload", self.beforeUnloadEvent);
            } else if (self.$appFormEdit.length > 0) {
                // app editing
                self.appEditingPageOnReady(); // app editing
                $appNameInput.trigger(appNameInputServerValidateEventname);
            }

            // .app-editing-page class represent both editing and posting

            // Validate app-name
            $.devOrg.validateTextInputBasedOnRegEx(
                "#AppName",
                "^([A-zZ.]+\\s*)+(\\d*)\\s*([aA-zZ.]+\\s*)+(\\d*)",
                "Sorry your app name is not valid. Valid name example eg. Plant Vs. Zombies v2.");

            $.devOrg.reSetupjQueryValidate(self.$appForm);


            self.$appForm.find("input,textarea").change(function () {
                /// app anything change marked as edited
                self.appInputChangesExist = true;
            });

            self.$appForm.find("select").selectpicker(); // make selectpicker

            // enter to go next
            $.devOrg.enterToNextTextBoxWithoutTags(self.$appForm, true, false); // means both editing and posting



            var triggerAppNameValidateTimeOut,
                appTitleValidate = function () {
                    clearTimeout(triggerAppNameValidateTimeOut);
                    triggerAppNameValidateTimeOut = setTimeout(function () {
                        $appNameInput.trigger(appNameInputServerValidateEventname);
                    }, 500);
                };

            //var events = $appNameInput[0].eventListenerList;
            //console.log($appNameInput);
            //console.log(events);
            //for (var i = 0; i < events.length; i++) {
            //    console.log(events[i].data);
            //}
            //$appNameInput.bind("jq.validate.AppName.serverProcessReturnedAlways", function (evt) {
            //    console.log(evt);
            //});
            // triggering appname blur when change any of these.
            // Because all are related to URL generate.
            $(".selectpicker").change(appTitleValidate);
            // to validate the app-name, triggering blur on app-name field
            $.byId("PlatformVersion").blur(appTitleValidate);
            $.byId("PlatformID").blur(appTitleValidate);
        }
    },


    /**
     * App review : like-dislike functionality
     */
    reviewLikeDisLikeClicked: function () {
        /// <summary>
        /// Views : "~/Views/App/SingleAppDisplay", "~/Views/Partials/ReviewsDisplay"
        /// </summary>

        var $appDetailsPage = $.byId("app-details-page");
        if ($appDetailsPage.length > 0) {
            var $likeBtns = $appDetailsPage.find("a[data-review-like-btn=true]");
            // Views/Reviews/ReviewsDisplay.cshtml contains that id
            var likeUrl = "/Reviews/Like";
            var dislikeUrl = "/Reviews/DisLike";
            // what happens when like or dislike is clicked
            // ajax request send
            var $spinners = null;

            var btnClicked = function ($button, e, url, serializedInputs) {
                e.preventDefault();
                var reviewId = $button.attr("data-review-id");
                var data = serializedInputs + "&reviewId=" + reviewId;
                var sequence = $button.attr("data-sequence");
                var $spinnerForthisLike = $spinners.filter("#spinner-" + sequence);
                var isLikeBtn = $button.attr("data-review-like-btn");
                var $otherA = null;
                //console.log($button);

                //console.log(reviewId);

                if (isLikeBtn) {
                    $otherA = $.byId("review-thumbs-down-click-" + sequence);
                } else {
                    $otherA = $.byId("review-thumbs-up-click-" + sequence);
                }
                $button.hide();
                $spinnerForthisLike.show(); // show spinner until load
                console.log($spinnerForthisLike);

                function errorExecute(jqXhr, textStatus, errorThrown) {
                    $spinnerForthisLike.hide();
                    var $clone = $spinnerForthisLike.clone();
                    var $span = $clone.find("span");
                    var failedMessage = "like/dislike request failed , please refresh page. Reason : " + errorThrown;

                    $span.attr("class", "fa fa-times")
                        .attr("title", failedMessage);
                    $clone.attr("data-original-title", failedMessage)
                        .attr("title", failedMessage)
                        .show();
                    console.log(failedMessage);
                    $spinnerForthisLike.after($clone);
                }

                $.ajax({
                    type: "POST",
                    url: url,
                    data: data,
                    success: function (response) {
                        response = $.parseJSON(response);
                        $spinnerForthisLike.hide();
                        $button.show();
                        $otherA.find("i").removeClass("active");
                        if (response.isDone) {
                            $button.find("i").toggleClass("active");
                        } else if (!response.isDone) {
                            $button.find("i").removeClass("active");
                            //errorExecute(null, "Can't get the right response.", null);
                        }
                    },
                    error: function (jqXhr, textStatus, errorThrown) {
                        errorExecute(jqXhr, textStatus, errorThrown);
                    }
                }); // ajax end
            }
            if ($likeBtns.length > 0) {
                var $disLikeBtns = $.byId("app-details-page").find("a[data-review-dislike-btn=true]");
                var serializedData = $.byId("review-like-dislike-form-submit").serialize();
                $spinners = $(".spinner-for-like").hide(); //like btns
                $likeBtns.click(function (evt) {
                    var $button = $(this);
                    btnClicked($button, evt, likeUrl, serializedData);
                });
                //dislike btns
                $disLikeBtns.click(function (evt) {
                    var $button = $(this);
                    btnClicked($button, evt, dislikeUrl, serializedData);
                });
            }
        }

    },

    suggestedOrReviewLoadmoreBtnLeft: function () {
        var $loadMoreBtn = $("#suggested-load-more-btn");
        var length, $appBox = 0;
        var showAfterCount = 5;
        var $appBoxes;
        var $div;
        var i;
        if ($loadMoreBtn.length > 0) {
            $div = $("#suggested-apps-list-div");
            $appBoxes = $div.find(".appsbox[data-sequence]");
            length = $appBoxes.length;

            for (i = 0; i < length; i++) {
                if (i >= showAfterCount) {
                    $appBox = $($appBoxes[i]);
                    $appBox.hide();
                    $appBox.attr("data-hide", "true");
                }
            }
            if ($loadMoreBtn.is(":hidden") && length > showAfterCount) {
                $loadMoreBtn.show("slow");
            } else if ($loadMoreBtn.is(":visible") && length < showAfterCount) {
                $loadMoreBtn.hide();
            }

            $loadMoreBtn.click(function () {
                var $appBoxesHidden = $appBoxes.filter("[data-hide=true]");
                for (var i = 0; i < length; i++) {
                    $appBox = $($appBoxesHidden[i]);
                    $appBox.show("slow");
                    $appBox.attr("data-hide", "false");
                }
                $loadMoreBtn.hide("slow");
            });
        }

        var $reviewLoadMoreBtn = $("#review-load-more-btn");
        //var reviewShows = 4;
        if ($reviewLoadMoreBtn.length > 0) {
            $div = $("#review-collection");
            $appBoxes = $div.find("div.blogitembox[data-sequence]");
            length = $appBoxes.length;

            for (i = 0; i < length; i++) {
                if (i >= showAfterCount) {
                    $appBox = $($appBoxes[i]);
                    $appBox.hide();
                    $appBox.attr("data-hide", "true");
                }
            }

            if ($reviewLoadMoreBtn.is(":hidden") && length > showAfterCount) {
                $reviewLoadMoreBtn.show("slow");
            } else if ($reviewLoadMoreBtn.is(":visible") && length < showAfterCount) {
                $reviewLoadMoreBtn.hide();
            }

            $reviewLoadMoreBtn.click(function () {
                $appBoxes = $div.find("div.blogitembox[data-sequence][data-hide=true]");
                for (var i = 0; i < length; i++) {
                    $appBox = $($appBoxes[i]);
                    $appBox.show("slow");
                    $appBox.attr("data-hide", "false");
                }
                $reviewLoadMoreBtn.hide("slow");
            });
        }
    },

    fixDateInputs: function () {
        var $dateInputs = $("form input.date-input");
        var $dateInput = null;
        var length = $dateInputs.length;
        var text = null;
        if (length > 0) {
            for (var i = 0; i < length; i++) {
                $dateInput = $($dateInputs[i]);
                text = $dateInput.val();
                if (!_.isEmpty(text)) {
                    text = text.replace(/\-/ig, "/");
                    $dateInput.val(text);
                }
            }
        }
    },

    adminArea: function () {
        /// <summary>
        /// All codes related to admin area
        /// </summary>
        var $adminArea = $.byId("admin-area");
        var i = 0;
        if ($adminArea.length > 0) {
            var controllers = [
                {
                    execute: function category() {
                        // implement this or action.
                        // data-or-action="creare|edit"
                        var $categoryPage = $.byId("app-category-editing-page");
                        if ($categoryPage.length > 0) {
                            var $slug = $.byId("Slug");
                            var $category = $.byId("CategoryName");
                            $category.keyup(function () {
                                var slugString = $.WeReviewApp.getFriendlyUrlSlug($category.val());
                                $slug.val(slugString);
                            });
                        }
                    }
                }
            ];

            for (i = 0; i < controllers.length; i++) {
                controllers[i].execute();
            }
        }
    },

    registerPage: function () {

    },
    initializeAppForms: function () {
        var self = $.WeReviewApp;
        self.$appFormWrapper = $.byId("app-form");
        var $fromWrapper = self.$appFormWrapper;
        if ($fromWrapper.length > 0) {
            var dataType = $fromWrapper.attr("data-type");
            self.$appForm = $fromWrapper.find(".app-editing-page");
            if (dataType === "post") {
                self.$appFormPost = self.$appForm;
                self.$allInputs = self.$appForm.find("input,textarea");
            } else if (dataType === "edit") {
                self.$appFormEdit = self.$appForm;
            }
        }
    },
    /* 
    * hides all uploader at first : $.WeReviewApp.$appForm.find("#collection-uploaders uploader-auto").hide();
    * modify $.WeReviewApp.appInputChangesExist based on user input
    * enter to next line bind : $.devOrg.enterToNextTextBox("form.app-editing-page", true);
    * bind with form submit-> which binds to $.WeReviewApp.appformPostEvent
    * draftbtnClicked : $.WeReviewApp.appFormDraftBtnClicked();
    * binds with beforeunload which binds with $.WeReviewApp.beforeUnloadEvent
    */
    executeActions: function () {
        /// <summary>
        /// Runs every other method.
        /// </summary>
        var self = $.WeReviewApp;
        self.initializeAppForms();
        self.routeAppEditingFormAndInitialize();
        //don't require anymore , it has been called from the fron-end.js script
        //self.frontEndJavaScript();

        //data-last-slide="true"
        //self.askForReviewForm();

        self.suggestedOrReviewLoadmoreBtnLeft();

        self.reviewLikeDisLikeClicked();
        $.byId("developers-organism").addClass("hide");
        // fix date inputs
        self.fixDateInputs();

        // run other pages
        self.adminArea();

    }
};
$(function () {
    // this will call all the other events
    $.WeReviewApp.executeActions();
});

