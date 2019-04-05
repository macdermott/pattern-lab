(function($) {
	$(document).ready(function() {
		(function () {
			if ( typeof NodeList.prototype.forEach === "function" ) return false;
			NodeList.prototype.forEach = Array.prototype.forEach;
		})();
		var pattern = /^\s*(?=.*[1-9])\d*(?:\.\d{1,2})?\s*$/;
		/* Set an object where each key will be the id value of each row and their value an array of money buy amount */
		var moneyBuyRows = {};

		/* Get  website-page url  */
		var url_string = window.location.href;
		var getQueryString = function ( field, url ) {
			var href = url ? url : window.location.href;
			var reg = new RegExp( '[?&]' + field + '=([^&#]*)', 'i' );
			var string = reg.exec(href);
			return string ? string[1] : null;
		};
		
		$('.paragraph--membership-signup').each(function(i) {
			var $thisParagraph = $(this);
			setFormDefaults($thisParagraph, i);
		});

		/* Handle money buy selection */
		$('.paragraph--membership-signup .select-amount-btn').click(function(e) {
			e.preventDefault();
			var $thisBtn = $(this);
			var $thisForm= $thisBtn.closest('form');

			$thisForm.find('select').css("background", "transparent");
			$thisForm.find(".form__field--wrapper").removeClass('active-input');
			$thisForm.find(".form-error").removeClass('show-error');
			$thisForm.find('.select-amount-btn').removeClass("active");
			$thisForm.find("input[name='membership_amount']").val("");
			$(this).addClass("active");

			var $thisBtnParent = $thisBtn.parents(".membership-signup__wrapper-copy--form-money");
			var descriptionCopies = $thisBtnParent.find(".donation-copy").children();
			var position = $thisBtn.data("position");

			moneyBuyDescriptionHandler(descriptionCopies, position);

			var moneyBuySelectedValue = getMoneyBuyValue($thisForm.find('.select-amount-btn.active'));
			setCurrentDataAmount($thisForm, moneyBuySelectedValue);

		});


		/* Watch for action or change on input */
		$(".paragraph--membership-signup input[name='membership_amount']").on("input propertychange click",function(event){
			var $thisInput = $(this);
			var $thisForm = $thisInput.parents('form');
			var amount = $thisInput.val();
			var id = $thisForm.parents(".paragraph--membership-signup").attr('id');

			$thisForm.find(".form__field--wrapper").addClass("active-input");
			$thisForm.find('.select-amount-btn').removeClass("active");
			$thisForm.find('.money-buy--description').removeClass('show-money-buy-copy');
			$thisForm.find('.other-description').addClass('show-money-buy-copy');

			/** Reset current amount to zero  */
			setCurrentDataAmount($thisInput, 0);

			/* Compare money buy value of the row  and amount provided by user if they match highlight both input and money buy box and display appropriate copy */
			if(moneyBuyRows[id].indexOf(amount.toString()) > -1) {
				var index = moneyBuyRows[id].indexOf(amount) + 1;
				$thisForm.find('.select-amount-btn.money-box--' + index ).addClass("active");
				var descriptionCopies = $thisForm.find(".donation-copy").children();
				moneyBuyDescriptionHandler(descriptionCopies, index);
			}

			/* Check if user enters input */
			if (event.type === "input") {
				if (validateAmount(amount) && !isNaN(amount)) {
					$thisForm.find(".form-error").removeClass('show-error');
					setCurrentDataAmount($thisInput, amount);
				} else {
					$thisForm.find(".form-error").addClass('show-error');
					$thisForm.find('.money-buy--description').removeClass('show-money-buy-copy');
					$thisForm.find('.other-description').removeClass('show-money-buy-copy');
					setCurrentDataAmount($thisInput, 0);
				}
			}
		});


		/* Handle change of currency */
		$('.paragraph--membership-signup select').on( "selectmenuchange input propertychange click", function() {
			var $thisSelect = $(this);
			var $thisForm = $thisSelect.parents('form')
			var currency = $thisSelect.find("option:selected").data("currency");
			var givingType = $thisForm.data("giving-type");

			if(givingType.toLowerCase() !== "MONTHLY".toLowerCase()) {
				var currency = $thisForm.find("option:selected").data("currency");
				$thisSelect.closest(".membership-signup__wrapper-copy--form-money").find("#js-currency-label").text(currency);
			}
		});


		/* Handle enter-key keyboard event */
		$(".paragraph--membership-signup input[name='membership_amount']").keypress(function (e) {
			var $thisInput = $(this);
			if (e.which == 13) {
				e.preventDefault();
				var $thisForm = $thisInput.closest('form');
				var inputValue = parseFloat($thisInput.val());
				if(!isNaN(inputValue)) {
					setCurrentDataAmount($thisInput, inputValue);
					handleDatabeforeSubmission($thisForm, inputValue, e);
				} else {
					setCurrentDataAmount($thisInput, 0);
					handleDatabeforeSubmission($thisForm, 0, e);
				}
			}
		});


      // Handle pressing next button event
		$(".paragraph--membership-signup .membership--submit").click(function (e) {
			e.preventDefault();
			var $thisButton = $(this);
			var $thisForm = $thisButton.closest('form');
			var moneyBuySelected = getMoneyBuyValue($thisForm.find('.select-amount-btn.active'));
			var inputValue = parseFloat($thisForm.find("input[name='membership_amount']").val());

			if(!isNaN(moneyBuySelected)){
				setCurrentDataAmount($thisForm, moneyBuySelected);
				handleDatabeforeSubmission($thisForm, moneyBuySelected, e);
			} else if(!isNaN(inputValue)){
				setCurrentDataAmount($thisButton, inputValue);
				handleDatabeforeSubmission($thisForm, inputValue, e);
			} else {
				setCurrentDataAmount($thisButton, 0);
				handleDatabeforeSubmission($thisForm, 0, e);
			}
		});


		/**  FUNCTIONS  */
		function setFormDefaults($thisParagraph, i) {
			var thisID = 'mship-' + i;
			$thisParagraph.attr('id', thisID);
			var $newParagraphWithId = $('#'+ thisID);

			/* Set Box shadow colour */
			var colour = $newParagraphWithId.css("backgroundColor");
			if (colour) {
				$('.img-shadow', $newParagraphWithId).append("<style> " + "#" + thisID + " .img-shadow" + ":before {color:" + colour + "}" + "</style>");
			}

			/** Check giving type before taking decision to hide select tag or not */
			var givingType = $newParagraphWithId.find("form").data("giving-type");
			if(givingType.toLowerCase() === "MONTHLY".toLowerCase()) {
				$newParagraphWithId.find('.form__fieldset').addClass("hide-select-tag");
			}

			var rowIDValue = getQueryString("rowID", url_string);
			var amountValue =  getQueryString("amount", url_string);
			var amount = parseFloat($newParagraphWithId.find(".select-amount-btn.active").text().replace(/\D/g, ""));

			$newParagraphWithId.attr("data-current-amount", amount);
			var position = $newParagraphWithId.find(".select-amount-btn.active").data("position");

			/* Add money buy description && currency */
			var descriptionCopies = $newParagraphWithId.find(".donation-copy").children();

			/* Populate moneybuyrows object with money buy value of each row */
			moneyBuyRows[thisID] =[];
			$newParagraphWithId.find('.select-amount-btn').each(function(i){
				var currentMoneyBuyValue = getMoneyBuyValue($(this));
				moneyBuyRows[thisID].push(currentMoneyBuyValue)

			});

			/* Handle case where users are taken back to cr.com from donation */
			if( url_string.indexOf('&amount=') > -1 && amountValue.length > 0 && rowIDValue.length && url_string.indexOf('&rowID=') > -1  ) {
					$("#" + rowIDValue).find('.select-amount-btn').each(function (i) {
						var currentMoneyBuyValue = getMoneyBuyValue($(this));
						var $thisForm = $(this).parents('form');

						if (currentMoneyBuyValue === amountValue) {
							$("#" + rowIDValue).find('.select-amount-btn').removeClass('active');
							$(this).addClass('active');
							 moneyBuyDescriptionHandler(descriptionCopies, i + 1 );
						} else if (moneyBuyRows[rowIDValue].indexOf(amountValue) === -1 ) {
							$thisForm.find("input[name='membership_amount']").val(amountValue);
							$("#" + rowIDValue).find('.select-amount-btn').removeClass('active');
							$thisForm.find('.form__field--wrapper').addClass("active-input");
							$thisForm.find('.other-description').addClass('show-money-buy-copy');
						}
						document.getElementById(rowIDValue).scrollIntoView({ behavior: 'smooth'});
					})
			} else {
				moneyBuyDescriptionHandler(descriptionCopies, position);
			}
		}

		/** Money buy description handler */
		function moneyBuyDescriptionHandler(descriptions, position) {
			descriptions.each(function (i) {
				$(this).removeClass('show-money-buy-copy');
				if (position === i + 1) {
					$(this).addClass('show-money-buy-copy');
				}
			})
		}

		/** Set value of data current amount */
		function setCurrentDataAmount(selector, amount) {
			selector.parents(".paragraph--membership-signup").attr("data-current-amount", amount);
		}

		/* Handle data before submission */
		function handleDatabeforeSubmission($thisForm, amount, event) {
			var currency = $thisForm.find("option:selected").val();
			var givingType = $thisForm.data('giving-type');
			var cartId = $thisForm.data('cart-id');
			var clientId = $thisForm.data('client-id');
			var rowID = $thisForm.parents('.paragraph--membership-signup').attr('id');

			if (validateAmount(amount)) {
				$thisForm.find(".form-error").removeClass('show-error');
				nextStepHandler(event, currency, amount, givingType, cartId, clientId, rowID);
			} else {
				$thisForm.find(".form-error").addClass('show-error');
			}
		}

		/* Get money buy value  */
		function getMoneyBuyValue(element) {
			return element.attr("data-amount");
		}

		/* Check and validate amount */
		function validateAmount(amount) {
			if (pattern.test(amount) && (amount >= 1 && amount <= 5000)) {
				return true
			} else {
				return false
			}
		}

		/* Rdirect function for browser support */
		function redirect(url) {
			var ua = navigator.userAgent.toLowerCase(),
				isIE = ua.indexOf('msie') !== -1,
				version = parseInt(ua.substr(4, 2), 10);
				// Internet Explorer 8 and lower
				if (isIE && version < 9) {
					var link = document.createElement('a');
					link.href = url;
					document.body.appendChild(link);
					link.click();
				}
				// All other browsers can use the standard window.location.href (they don't lose HTTP_REFERER like Internet Explorer 8 & lower does)
				else {
					window.location.href = url;
				}
			}
	
			/* Submit data */
			function nextStepHandler(e, currency, amount, givingType, cartId, clientId, rowID) {
				e.preventDefault();
				var url = "https://donation.comicrelief.com/";
				var getUrl =  $('#paragraph--membership-signup-0').data("donation-url");
				var donationLink = getUrl ? getUrl : url;
	
				/* Affiliate value */
				var affiliateValue = getQueryString("affiliate", url_string)? getQueryString("affiliate", url_string) : 'generic';
				
				/* Strip out all params now we've saved our required 'affiliate' value */
				if (url_string.indexOf('?') > -1 ) {
					url_string = url_string.substring(0, url_string.indexOf('?'));
				}
				/* Redirect user to donation */
				redirect(donationLink + "?clientOverride=" + clientId + "&amount=" + amount + "&currency=" + currency + "&givingType=" + givingType + "&cartId=" + cartId + "&affiliate=" + affiliateValue + "&siteurl=" + url_string + '&rowID=' + rowID);
			}
		});
	})(jQuery);
	