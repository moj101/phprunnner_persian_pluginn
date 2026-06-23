/*!
 * ============================================================
 * EditPersianDatePicker.js
 * Persian Date Picker UserControl for PHPRunner
 * ============================================================
 *
 * Version: 2.0.0
 * Release Date: 2026-06-23
 * Component: EditPersianDatePicker
 * Author: Custom Integrated Build
 * Design By Mojtaba Mohamamdi And ChatGPT 5.4
 
 * Description:
 * This control extends PHPRunner UserControl to provide a
 * Persian/Jalali date picker with improved production-grade UX.
 *
 * Main Features:
 * - Themeable in field settings
 * - Smart popup repositioning
 * - Mobile-friendly popup behavior
 * - Manual date entry support
 * - Persian date validation
 * - Keyboard UX: Enter / Tab / Escape
 * - Hidden real field synchronization
 * - Persian date storage in normalized latin digits
 * - Calendar popup opening by calendar icon
 *
 * Expected DB format:
 * - Date only: YYYY/MM/DD
 * - DateTime : YYYY/MM/DD HH:mm:ss
 *
 * Dependencies:
 * - jQuery
 * - Runner framework
 * - persian-date.min.js
 * - persian-datepicker.min.js
 *
 * Important Notes:
 * 1) If JS changes are not reflected, delete:
 *    templates_c/persian-datepicker.min.js
 * 2) Then hard refresh browser: Ctrl + F5
 *
 * Supported Field Settings:
 * - required
 * - onlySelectOnDate
 * - onlyTimePicker
 * - format
 * - minDate
 * - maxDate
 * - autoClose
 * - btnNextText
 * - btnPrevText
 * - timePicker_enabled
 * - theme
 * - themePrimary
 * - themePrimaryHover
 * - themeSoftBg
 * - themeText
 * - themeTodayBg
 * - themeTodayText
 * - themeBorder
 * - themeShadow
 * - themeRadius
 * - allowManualInput
 * - validateOnBlur
 * - autoReposition
 * - mobileFriendly
 * - smartPositionMargin
 *
 * Changelog:
 * ------------------------------------------------------------
 * 2.0.0
 * - Added smart popup repositioning
 * - Added mobile-friendly full overlay mode
 * - Added manual input validation
 * - Added keyboard support for Enter / Tab / Escape
 * - Added theme support with presets and CSS variables
 * - Added clickable calendar icon open behavior
 * - Improved operational UX
 *
 * 1.x
 * - Initial custom Persian datepicker integration
 * ============================================================
 */

Runner.controls.EditPersianDatePicker = Runner.extend(Runner.controls.Control, {
	constructor: function (cfg) {
		this.addEvent(["change", "keyup"]);
		Runner.controls.EditPersianDatePicker.superclass.constructor.call(this, cfg);

		var $this = this;

		/**
		 * Convert Persian/Arabic digits to English digits
		 */
		function toEnglishDigits(str) {
			if (!str) return str;
			return String(str)
				.replace(/[۰-۹]/g, function (d) {
					return '۰۱۲۳۴۵۶۷۸۹'.indexOf(d);
				})
				.replace(/[٠-٩]/g, function (d) {
					return '٠١٢٣٤٥٦٧٨٩'.indexOf(d);
				});
		}

		/**
		 * Check empty value
		 */
		function isEmpty(val) {
			return val === null || val === undefined || val === '';
		}

		/**
		 * Escape HTML to safely show validation messages
		 */
		function escapeHtml(str) {
			return String(str)
				.replace(/&/g, '&amp;')
				.replace(/</g, '&lt;')
				.replace(/>/g, '&gt;')
				.replace(/"/g, '&quot;')
				.replace(/'/g, '&#039;');
		}

		/**
		 * Built-in theme presets
		 */
		function getThemePreset(themeName) {
			var presets = {
				blue: {
					primary: "#0d6efd",
					primaryHover: "#0b5ed7",
					softBg: "#eef6ff",
					text: "#243447",
					todayBg: "#fff3cd",
					todayText: "#856404",
					border: "#dbe5f0",
					shadow: "0 18px 45px rgba(15, 23, 42, 0.16)",
					radius: "18px"
				},
				green: {
					primary: "#198754",
					primaryHover: "#157347",
					softBg: "#eaf7f0",
					text: "#243447",
					todayBg: "#fff3cd",
					todayText: "#856404",
					border: "#d8e9df",
					shadow: "0 18px 45px rgba(25, 135, 84, 0.14)",
					radius: "18px"
				},
				dark: {
					primary: "#3b82f6",
					primaryHover: "#60a5fa",
					softBg: "#1f2937",
					text: "#e5e7eb",
					todayBg: "#374151",
					todayText: "#fbbf24",
					border: "#334155",
					shadow: "0 18px 45px rgba(0, 0, 0, 0.35)",
					radius: "18px"
				},
				purple: {
					primary: "#7c3aed",
					primaryHover: "#6d28d9",
					softBg: "#f3edff",
					text: "#2f2a44",
					todayBg: "#fff3cd",
					todayText: "#856404",
					border: "#e7dcff",
					shadow: "0 18px 45px rgba(124, 58, 237, 0.16)",
					radius: "18px"
				}
			};

			return presets[themeName] || presets.blue;
		}

		/**
		 * Apply dynamic CSS vars to visible datepicker popup
		 */
		function applyThemeVars() {
			var themeName = $this.getFieldSetting("theme") || "blue";
			var preset = getThemePreset(themeName);

			var primary = $this.getFieldSetting("themePrimary") || preset.primary;
			var primaryHover = $this.getFieldSetting("themePrimaryHover") || preset.primaryHover;
			var softBg = $this.getFieldSetting("themeSoftBg") || preset.softBg;
			var text = $this.getFieldSetting("themeText") || preset.text;
			var todayBg = $this.getFieldSetting("themeTodayBg") || preset.todayBg;
			var todayText = $this.getFieldSetting("themeTodayText") || preset.todayText;
			var border = $this.getFieldSetting("themeBorder") || preset.border;
			var shadow = $this.getFieldSetting("themeShadow") || preset.shadow;
			var radius = $this.getFieldSetting("themeRadius") || preset.radius;

			var $plot = $('.datepicker-container:visible .datepicker-plot-area').last();
			if (!$plot.length) return;

			$plot.css('--pdp-primary', primary);
			$plot.css('--pdp-primary-hover', primaryHover);
			$plot.css('--pdp-soft-bg', softBg);
			$plot.css('--pdp-text', text);
			$plot.css('--pdp-today-bg', todayBg);
			$plot.css('--pdp-today-text', todayText);
			$plot.css('--pdp-border', border);
			$plot.css('--pdp-shadow', shadow);
			$plot.css('--pdp-radius', radius);
		}

		/**
		 * Check Jalali leap year
		 */
		function isPersianLeapYear(jy) {
			var breaks = [-61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097, 2192, 2262, 2324, 2394, 2456, 3178];
			var bl = breaks.length;
			var jp = breaks[0];
			var jm, jump, leap, n, i;

			if (jy < jp || jy >= breaks[bl - 1]) return false;

			for (i = 1; i < bl; i += 1) {
				jm = breaks[i];
				jump = jm - jp;
				if (jy < jm) break;
				jp = jm;
			}
			n = jy - jp;

			if (jump - n < 6) n = n - jump + Math.floor((jump + 4) / 33) * 33;
			leap = (((n + 1) % 33) - 1) % 4;
			if (leap === -1) leap = 4;

			return leap === 0;
		}

		/**
		 * Validate Jalali date parts
		 */
		function isValidPersianDate(y, m, d) {
			y = parseInt(y, 10);
			m = parseInt(m, 10);
			d = parseInt(d, 10);

			if (isNaN(y) || isNaN(m) || isNaN(d)) return false;
			if (y < 1 || m < 1 || m > 12 || d < 1) return false;

			var monthDays = [31,31,31,31,31,31,30,30,30,30,30,(isPersianLeapYear(y) ? 30 : 29)];
			return d <= monthDays[m - 1];
		}

		/**
		 * Normalize free-typed input
		 * Examples:
		 * 1405-3-7  => 1405/3/7
		 * ۱۴۰۵/۰۳/۰۷ => 1405/03/07
		 */
		function normalizeManualDate(str, withTime) {
			if (!str) return '';

			str = toEnglishDigits(str);
			str = String(str).trim();
			str = str.replace(/\-/g, '/');
			str = str.replace(/\s+/g, ' ');
			str = str.replace(/\s*\/\s*/g, '/');
			str = str.replace(/\s*:\s*/g, ':');

			return str;
		}

		/**
		 * Validate manually entered Persian date / datetime
		 */
		function validateManualInput(value, withTime) {
			value = normalizeManualDate(value, withTime);

			if (!value) {
				return { valid: true, normalized: '' };
			}

			var reDate = /^(\d{4})\/(\d{1,2})\/(\d{1,2})$/;
			var reDateTime = /^(\d{4})\/(\d{1,2})\/(\d{1,2})\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?$/;
			var m;

			if (withTime) {
				m = value.match(reDateTime);
				if (!m) {
					return { valid: false, message: 'فرمت تاریخ/زمان صحیح نیست. نمونه: 1405/03/31 14:30:00' };
				}

				var y = m[1], mo = m[2], d = m[3];
				var hh = parseInt(m[4], 10), mi = parseInt(m[5], 10), ss = parseInt(m[6] || '0', 10);

				if (!isValidPersianDate(y, mo, d)) {
					return { valid: false, message: 'تاریخ شمسی معتبر نیست' };
				}
				if (hh < 0 || hh > 23 || mi < 0 || mi > 59 || ss < 0 || ss > 59) {
					return { valid: false, message: 'زمان وارد شده معتبر نیست' };
				}

				return {
					valid: true,
					normalized:
						y + '/' +
						('0' + mo).slice(-2) + '/' +
						('0' + d).slice(-2) + ' ' +
						('0' + hh).slice(-2) + ':' +
						('0' + mi).slice(-2) + ':' +
						('0' + ss).slice(-2)
				};
			} else {
				m = value.match(reDate);
				if (!m) {
					return { valid: false, message: 'فرمت تاریخ صحیح نیست. نمونه: 1405/03/31' };
				}

				var yy = m[1], mm = m[2], dd = m[3];

				if (!isValidPersianDate(yy, mm, dd)) {
					return { valid: false, message: 'تاریخ شمسی معتبر نیست' };
				}

				return {
					valid: true,
					normalized:
						yy + '/' +
						('0' + mm).slice(-2) + '/' +
						('0' + dd).slice(-2)
				};
			}
		}

		/* Selectors */
		var alterSelector = '#' + $this.valContId + "_alter";
		var realSelector = '#' + $this.valContId;
		var openBtnSelector = '#btnCal_' + $this.valContId;
		var clearBtnSelector = '#imgCal_' + $this.valContId;
		var errorSelector = '#err_' + $this.valContId;

		/**
		 * Show validation error under the input
		 */
		function showError(message) {
			$(alterSelector).addClass('pdp-invalid');
			$(errorSelector).html(escapeHtml(message || 'مقدار وارد شده نامعتبر است')).show();
		}

		/**
		 * Clear validation error
		 */
		function clearError() {
			$(alterSelector).removeClass('pdp-invalid');
			$(errorSelector).hide().html('');
		}

		/**
		 * Sync visible input and hidden real field
		 */
		function syncValueToHidden(value) {
			var normalized = toEnglishDigits(value || '');
			$(alterSelector).val(normalized);
			$(realSelector).val(normalized);
		}

		/**
		 * Validate visible input and sync to hidden field
		 */
		function validateAndSyncManualInput() {
			var withTime = !!$this.getFieldSetting("timePicker_enabled");
			var current = $(alterSelector).val();
			var result = validateManualInput(current, withTime);

			if (!result.valid) {
				showError(result.message);
				$(realSelector).val('');
				return false;
			}

			clearError();
			syncValueToHidden(result.normalized);
			$(alterSelector).trigger("change");
			return true;
		}

		/**
		 * Move focus to next focusable field
		 */
		function moveToNextFocusable($current) {
			var focusable = $('a, button, input, textarea, select, [tabindex]')
				.filter(':visible:not([disabled])')
				.filter(function () {
					var tabIndex = $(this).attr('tabindex');
					return tabIndex === undefined || parseInt(tabIndex, 10) >= 0;
				});

			var index = focusable.index($current);
			if (index > -1 && index + 1 < focusable.length) {
				focusable.eq(index + 1).focus();
			}
		}

		/**
		 * Confirm typed input and optionally move to next field
		 */
		function confirmManualInputAndMaybeMove(nextAction) {
			var ok = validateAndSyncManualInput();

			if (!ok) {
				setTimeout(function () {
					$(alterSelector).focus();
					$(alterSelector).select();
				}, 0);
				return false;
			}

			clearError();

			try {
				$(alterSelector).pDatepicker('hide');
			} catch (e) {}

			if (nextAction === 'next') {
				setTimeout(function () {
					moveToNextFocusable($(alterSelector));
				}, 0);
			}

			return true;
		}

		/**
		 * Smart popup repositioning for low viewport / small screens
		 */
		function repositionDatepicker() {
			if (!$this.getFieldSetting("autoReposition")) return;

			var $container = $('.datepicker-container:visible').last();
			var $plot = $container.find('.datepicker-plot-area').last();
			var $input = $(alterSelector);

			if (!$container.length || !$plot.length || !$input.length || !$input.is(':visible')) return;

			var margin = parseInt($this.getFieldSetting("smartPositionMargin"), 10) || 8;
			var inputOffset = $input.offset();
			var inputHeight = $input.outerHeight();
			var dpWidth = $plot.outerWidth();
			var dpHeight = $plot.outerHeight();

			var scrollTop = $(window).scrollTop();
			var scrollLeft = $(window).scrollLeft();
			var winWidth = $(window).width();
			var winHeight = $(window).height();

			var top = inputOffset.top + inputHeight + 6;
			var left = inputOffset.left;

			var freeBelow = (scrollTop + winHeight) - (inputOffset.top + inputHeight);
			var freeAbove = inputOffset.top - scrollTop;

			if (freeBelow < dpHeight + margin && freeAbove > dpHeight + margin) {
				top = inputOffset.top - dpHeight - 6;
			}

			if (top < scrollTop + margin) {
				top = scrollTop + margin;
			}

			if ((left + dpWidth) > (scrollLeft + winWidth - margin)) {
				left = scrollLeft + winWidth - dpWidth - margin;
			}

			if (left < scrollLeft + margin) {
				left = scrollLeft + margin;
			}

			if ($this.getFieldSetting("mobileFriendly") && winWidth <= 768) {
				$container.addClass('pdp-mobile-smart');
				$container.css({
					position: 'fixed',
					top: '0',
					left: '0',
					right: '0',
					bottom: '0'
				});
			} else {
				$container.removeClass('pdp-mobile-smart');
				$container.css({
					position: 'absolute',
					top: top + 'px',
					left: left + 'px',
					right: '',
					bottom: ''
				});
			}
		}

		/* Required validation in PHPRunner */
		if ($this.getFieldSetting('required')) {
			$this.addValidation('IsRequired');
		}

		/* Manual input mode */
		if (!$this.getFieldSetting("allowManualInput")) {
			$(alterSelector).attr('readonly', true);
		} else {
			$(alterSelector).removeAttr('readonly');
			$(alterSelector).attr('dir', 'ltr');
			$(alterSelector).attr('inputmode', $this.getFieldSetting("timePicker_enabled") ? 'text' : 'numeric');
			$(alterSelector).attr('placeholder', $this.getFieldSetting("timePicker_enabled") ? '1405/03/31 14:30:00' : '1405/03/31');
		}

		/* Normalize initial value */
		var initialVal = $(alterSelector).val();
		if (!isEmpty(initialVal)) {
			var normalizedInitialVal = toEnglishDigits(initialVal);
			$(alterSelector).val(normalizedInitialVal);
			$(realSelector).val(normalizedInitialVal);
		}

		/* Clear button */
		$(clearBtnSelector).on("click", function () {
			clearError();
			$(alterSelector).val('');
			$(realSelector).val('');
			$(alterSelector).trigger("change");
		});

		/* Calendar icon open */
		$(openBtnSelector).on("click", function () {
			$(alterSelector).trigger("focus");
			$(alterSelector).trigger("click");

			setTimeout(function () {
				applyThemeVars();
				repositionDatepicker();
			}, 30);
		});

		/* Focus/click behavior */
		$(alterSelector).on("focus click", function () {
			setTimeout(function () {
				applyThemeVars();
				repositionDatepicker();
			}, 30);
		});

		/* Blur validation for manual input */
		if ($this.getFieldSetting("allowManualInput") && $this.getFieldSetting("validateOnBlur")) {
			$(alterSelector).on("blur", function () {
				validateAndSyncManualInput();
			});
		}

		/* Keyboard UX */
		$(alterSelector).on("keydown", function (e) {
			if (!$this.getFieldSetting("allowManualInput")) {
				return;
			}

			var key = e.which || e.keyCode;

			/* Enter => validate + confirm + go next */
			if (key === 13) {
				e.preventDefault();
				e.stopPropagation();

				confirmManualInputAndMaybeMove('next');
				return false;
			}

			/* Tab => validate before leaving field */
			if (key === 9) {
				var ok = validateAndSyncManualInput();

				if (!ok) {
					e.preventDefault();
					e.stopPropagation();

					setTimeout(function () {
						$(alterSelector).focus();
						$(alterSelector).select();
					}, 0);

					return false;
				}

				clearError();

				try {
					$(alterSelector).pDatepicker('hide');
				} catch (e2) {}
			}

			/* Escape => close popup */
			if (key === 27) {
				try {
					$(alterSelector).pDatepicker('hide');
				} catch (e3) {}
			}
		});

		/* Window resize / scroll => reposition popup */
		$(window).on("resize scroll", function () {
			setTimeout(function () {
				repositionDatepicker();
			}, 10);
		});

		/* Initialize Persian datepicker */
		$(alterSelector).pDatepicker({
			"inline": false,
			"format": this.getFieldSetting("format"),
			"viewMode": "day",
			"initialValue": false,
			"initialValueType": "persian",
			"autoClose": this.getFieldSetting("autoClose"),
			"minDate": this.getFieldSetting("minDate"),
			"maxDate": this.getFieldSetting("maxDate"),
			"position": "auto",
			"altField": realSelector,

			"altFieldFormatter": function (unix) {
				var pd = new persianDate(unix);
				var val;

				if ($this.getFieldSetting("timePicker_enabled")) {
					val = pd.format('YYYY/MM/DD HH:mm:ss');
				} else {
					val = pd.format('YYYY/MM/DD');
				}

				return toEnglishDigits(val);
			},

			"onlyTimePicker": this.getFieldSetting("onlyTimePicker"),
			"onlySelectOnDate": this.getFieldSetting("onlySelectOnDate"),
			"calendarType": "persian",
			"inputDelay": 800,
			"observer": true,

			"calendar": {
				"persian": {
					"locale": "fa",
					"showHint": true,
					"leapYearMode": "algorithmic"
				},
				"gregorian": {
					"locale": "en",
					"showHint": true
				}
			},

			"navigator": {
				"enabled": true,
				"scroll": {
					"enabled": true
				},
				"text": {
					"btnNextText": this.getFieldSetting("btnNextText"),
					"btnPrevText": this.getFieldSetting("btnPrevText")
				}
			},

			"toolbox": {
				"enabled": true,
				"calendarSwitch": {
					"enabled": true,
					"format": "MMMM"
				},
				"todayButton": {
					"enabled": true,
					"text": {
						"fa": "امروز",
						"en": "Today"
					}
				},
				"submitButton": {
					"enabled": true,
					"text": {
						"fa": "تایید",
						"en": "Ok"
					}
				},
				"text": {
					"btnToday": "امروز"
				}
			},

			"timePicker": {
				"enabled": this.getFieldSetting("timePicker_enabled"),
				"step": 1,
				"hour": {
					"enabled": true,
					"step": null
				},
				"minute": {
					"enabled": true,
					"step": null
				},
				"second": {
					"enabled": true,
					"step": null
				},
				"meridian": {
					"enabled": false
				}
			},

			"dayPicker": {
				"enabled": true,
				"titleFormat": "YYYY MMMM"
			},
			"monthPicker": {
				"enabled": true,
				"titleFormat": "YYYY"
			},
			"yearPicker": {
				"enabled": true,
				"titleFormat": "YYYY"
			},

			"onShow": function () {
				setTimeout(function () {
					applyThemeVars();
					repositionDatepicker();
				}, 30);
			},

			"onSelect": function () {
				clearError();

				var displayVal = $(alterSelector).val();
				if (!isEmpty(displayVal)) {
					$(alterSelector).val(toEnglishDigits(displayVal));
				}

				var realVal = $(realSelector).val();
				if (!isEmpty(realVal)) {
					$(realSelector).val(toEnglishDigits(realVal));
				}

				setTimeout(function () {
					applyThemeVars();
					repositionDatepicker();
				}, 30);

				$(alterSelector).trigger("change");
			}
		});

		/* Final normalization */
		var currentVal = $(alterSelector).val();
		if (!isEmpty(currentVal)) {
			$(alterSelector).val(toEnglishDigits(currentVal));
		}
	},

	/**
	 * Mark page as modified
	 */
	_onBegin: function () {
		Runner.pages.RunnerPage.prototype.setPageModified(true);
	},

	/**
	 * Return hidden real value for submit
	 */
	getForSubmit: function () {
		if (!this.appearOnPage()) {
			return [];
		}
		return [this.valueElem.clone().val(this.getValue())];
	}
});

/* Register control type */
Runner.controls.constants["EditPersianDatePicker"] = "EditPersianDatePicker";/*!
 * ============================================================
 * EditPersianDatePicker.js
 * Persian Date Picker UserControl for PHPRunner
 * ============================================================
 *
 * Version: 2.0.0
 * Release Date: 2026-06-23
 * Component: EditPersianDatePicker
 * Author: Custom Integrated Build
 *
 * Description:
 * This control extends PHPRunner UserControl to provide a
 * Persian/Jalali date picker with improved production-grade UX.
 *
 * Main Features:
 * - Themeable in field settings
 * - Smart popup repositioning
 * - Mobile-friendly popup behavior
 * - Manual date entry support
 * - Persian date validation
 * - Keyboard UX: Enter / Tab / Escape
 * - Hidden real field synchronization
 * - Persian date storage in normalized latin digits
 * - Calendar popup opening by calendar icon
 *
 * Expected DB format:
 * - Date only: YYYY/MM/DD
 * - DateTime : YYYY/MM/DD HH:mm:ss
 *
 * Dependencies:
 * - jQuery
 * - Runner framework
 * - persian-date.min.js
 * - persian-datepicker.min.js
 *
 * Important Notes:
 * 1) If JS changes are not reflected, delete:
 *    templates_c/persian-datepicker.min.js
 * 2) Then hard refresh browser: Ctrl + F5
 *
 * Supported Field Settings:
 * - required
 * - onlySelectOnDate
 * - onlyTimePicker
 * - format
 * - minDate
 * - maxDate
 * - autoClose
 * - btnNextText
 * - btnPrevText
 * - timePicker_enabled
 * - theme
 * - themePrimary
 * - themePrimaryHover
 * - themeSoftBg
 * - themeText
 * - themeTodayBg
 * - themeTodayText
 * - themeBorder
 * - themeShadow
 * - themeRadius
 * - allowManualInput
 * - validateOnBlur
 * - autoReposition
 * - mobileFriendly
 * - smartPositionMargin
 *
 * Changelog:
 * ------------------------------------------------------------
 * 2.0.0
 * - Added smart popup repositioning
 * - Added mobile-friendly full overlay mode
 * - Added manual input validation
 * - Added keyboard support for Enter / Tab / Escape
 * - Added theme support with presets and CSS variables
 * - Added clickable calendar icon open behavior
 * - Improved operational UX
 *
 * 1.x
 * - Initial custom Persian datepicker integration
 * ============================================================
 */

Runner.controls.EditPersianDatePicker = Runner.extend(Runner.controls.Control, {
	constructor: function (cfg) {
		this.addEvent(["change", "keyup"]);
		Runner.controls.EditPersianDatePicker.superclass.constructor.call(this, cfg);

		var $this = this;

		/**
		 * Convert Persian/Arabic digits to English digits
		 */
		function toEnglishDigits(str) {
			if (!str) return str;
			return String(str)
				.replace(/[۰-۹]/g, function (d) {
					return '۰۱۲۳۴۵۶۷۸۹'.indexOf(d);
				})
				.replace(/[٠-٩]/g, function (d) {
					return '٠١٢٣٤٥٦٧٨٩'.indexOf(d);
				});
		}

		/**
		 * Check empty value
		 */
		function isEmpty(val) {
			return val === null || val === undefined || val === '';
		}

		/**
		 * Escape HTML to safely show validation messages
		 */
		function escapeHtml(str) {
			return String(str)
				.replace(/&/g, '&amp;')
				.replace(/</g, '&lt;')
				.replace(/>/g, '&gt;')
				.replace(/"/g, '&quot;')
				.replace(/'/g, '&#039;');
		}

		/**
		 * Built-in theme presets
		 */
		function getThemePreset(themeName) {
			var presets = {
				blue: {
					primary: "#0d6efd",
					primaryHover: "#0b5ed7",
					softBg: "#eef6ff",
					text: "#243447",
					todayBg: "#fff3cd",
					todayText: "#856404",
					border: "#dbe5f0",
					shadow: "0 18px 45px rgba(15, 23, 42, 0.16)",
					radius: "18px"
				},
				green: {
					primary: "#198754",
					primaryHover: "#157347",
					softBg: "#eaf7f0",
					text: "#243447",
					todayBg: "#fff3cd",
					todayText: "#856404",
					border: "#d8e9df",
					shadow: "0 18px 45px rgba(25, 135, 84, 0.14)",
					radius: "18px"
				},
				dark: {
					primary: "#3b82f6",
					primaryHover: "#60a5fa",
					softBg: "#1f2937",
					text: "#e5e7eb",
					todayBg: "#374151",
					todayText: "#fbbf24",
					border: "#334155",
					shadow: "0 18px 45px rgba(0, 0, 0, 0.35)",
					radius: "18px"
				},
				purple: {
					primary: "#7c3aed",
					primaryHover: "#6d28d9",
					softBg: "#f3edff",
					text: "#2f2a44",
					todayBg: "#fff3cd",
					todayText: "#856404",
					border: "#e7dcff",
					shadow: "0 18px 45px rgba(124, 58, 237, 0.16)",
					radius: "18px"
				}
			};

			return presets[themeName] || presets.blue;
		}

		/**
		 * Apply dynamic CSS vars to visible datepicker popup
		 */
		function applyThemeVars() {
			var themeName = $this.getFieldSetting("theme") || "blue";
			var preset = getThemePreset(themeName);

			var primary = $this.getFieldSetting("themePrimary") || preset.primary;
			var primaryHover = $this.getFieldSetting("themePrimaryHover") || preset.primaryHover;
			var softBg = $this.getFieldSetting("themeSoftBg") || preset.softBg;
			var text = $this.getFieldSetting("themeText") || preset.text;
			var todayBg = $this.getFieldSetting("themeTodayBg") || preset.todayBg;
			var todayText = $this.getFieldSetting("themeTodayText") || preset.todayText;
			var border = $this.getFieldSetting("themeBorder") || preset.border;
			var shadow = $this.getFieldSetting("themeShadow") || preset.shadow;
			var radius = $this.getFieldSetting("themeRadius") || preset.radius;

			var $plot = $('.datepicker-container:visible .datepicker-plot-area').last();
			if (!$plot.length) return;

			$plot.css('--pdp-primary', primary);
			$plot.css('--pdp-primary-hover', primaryHover);
			$plot.css('--pdp-soft-bg', softBg);
			$plot.css('--pdp-text', text);
			$plot.css('--pdp-today-bg', todayBg);
			$plot.css('--pdp-today-text', todayText);
			$plot.css('--pdp-border', border);
			$plot.css('--pdp-shadow', shadow);
			$plot.css('--pdp-radius', radius);
		}

		/**
		 * Check Jalali leap year
		 */
		function isPersianLeapYear(jy) {
			var breaks = [-61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097, 2192, 2262, 2324, 2394, 2456, 3178];
			var bl = breaks.length;
			var jp = breaks[0];
			var jm, jump, leap, n, i;

			if (jy < jp || jy >= breaks[bl - 1]) return false;

			for (i = 1; i < bl; i += 1) {
				jm = breaks[i];
				jump = jm - jp;
				if (jy < jm) break;
				jp = jm;
			}
			n = jy - jp;

			if (jump - n < 6) n = n - jump + Math.floor((jump + 4) / 33) * 33;
			leap = (((n + 1) % 33) - 1) % 4;
			if (leap === -1) leap = 4;

			return leap === 0;
		}

		/**
		 * Validate Jalali date parts
		 */
		function isValidPersianDate(y, m, d) {
			y = parseInt(y, 10);
			m = parseInt(m, 10);
			d = parseInt(d, 10);

			if (isNaN(y) || isNaN(m) || isNaN(d)) return false;
			if (y < 1 || m < 1 || m > 12 || d < 1) return false;

			var monthDays = [31,31,31,31,31,31,30,30,30,30,30,(isPersianLeapYear(y) ? 30 : 29)];
			return d <= monthDays[m - 1];
		}

		/**
		 * Normalize free-typed input
		 * Examples:
		 * 1405-3-7  => 1405/3/7
		 * ۱۴۰۵/۰۳/۰۷ => 1405/03/07
		 */
		function normalizeManualDate(str, withTime) {
			if (!str) return '';

			str = toEnglishDigits(str);
			str = String(str).trim();
			str = str.replace(/\-/g, '/');
			str = str.replace(/\s+/g, ' ');
			str = str.replace(/\s*\/\s*/g, '/');
			str = str.replace(/\s*:\s*/g, ':');

			return str;
		}

		/**
		 * Validate manually entered Persian date / datetime
		 */
		function validateManualInput(value, withTime) {
			value = normalizeManualDate(value, withTime);

			if (!value) {
				return { valid: true, normalized: '' };
			}

			var reDate = /^(\d{4})\/(\d{1,2})\/(\d{1,2})$/;
			var reDateTime = /^(\d{4})\/(\d{1,2})\/(\d{1,2})\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?$/;
			var m;

			if (withTime) {
				m = value.match(reDateTime);
				if (!m) {
					return { valid: false, message: 'فرمت تاریخ/زمان صحیح نیست. نمونه: 1405/03/31 14:30:00' };
				}

				var y = m[1], mo = m[2], d = m[3];
				var hh = parseInt(m[4], 10), mi = parseInt(m[5], 10), ss = parseInt(m[6] || '0', 10);

				if (!isValidPersianDate(y, mo, d)) {
					return { valid: false, message: 'تاریخ شمسی معتبر نیست' };
				}
				if (hh < 0 || hh > 23 || mi < 0 || mi > 59 || ss < 0 || ss > 59) {
					return { valid: false, message: 'زمان وارد شده معتبر نیست' };
				}

				return {
					valid: true,
					normalized:
						y + '/' +
						('0' + mo).slice(-2) + '/' +
						('0' + d).slice(-2) + ' ' +
						('0' + hh).slice(-2) + ':' +
						('0' + mi).slice(-2) + ':' +
						('0' + ss).slice(-2)
				};
			} else {
				m = value.match(reDate);
				if (!m) {
					return { valid: false, message: 'فرمت تاریخ صحیح نیست. نمونه: 1405/03/31' };
				}

				var yy = m[1], mm = m[2], dd = m[3];

				if (!isValidPersianDate(yy, mm, dd)) {
					return { valid: false, message: 'تاریخ شمسی معتبر نیست' };
				}

				return {
					valid: true,
					normalized:
						yy + '/' +
						('0' + mm).slice(-2) + '/' +
						('0' + dd).slice(-2)
				};
			}
		}

		/* Selectors */
		var alterSelector = '#' + $this.valContId + "_alter";
		var realSelector = '#' + $this.valContId;
		var openBtnSelector = '#btnCal_' + $this.valContId;
		var clearBtnSelector = '#imgCal_' + $this.valContId;
		var errorSelector = '#err_' + $this.valContId;

		/**
		 * Show validation error under the input
		 */
		function showError(message) {
			$(alterSelector).addClass('pdp-invalid');
			$(errorSelector).html(escapeHtml(message || 'مقدار وارد شده نامعتبر است')).show();
		}

		/**
		 * Clear validation error
		 */
		function clearError() {
			$(alterSelector).removeClass('pdp-invalid');
			$(errorSelector).hide().html('');
		}

		/**
		 * Sync visible input and hidden real field
		 */
		function syncValueToHidden(value) {
			var normalized = toEnglishDigits(value || '');
			$(alterSelector).val(normalized);
			$(realSelector).val(normalized);
		}

		/**
		 * Validate visible input and sync to hidden field
		 */
		function validateAndSyncManualInput() {
			var withTime = !!$this.getFieldSetting("timePicker_enabled");
			var current = $(alterSelector).val();
			var result = validateManualInput(current, withTime);

			if (!result.valid) {
				showError(result.message);
				$(realSelector).val('');
				return false;
			}

			clearError();
			syncValueToHidden(result.normalized);
			$(alterSelector).trigger("change");
			return true;
		}

		/**
		 * Move focus to next focusable field
		 */
		function moveToNextFocusable($current) {
			var focusable = $('a, button, input, textarea, select, [tabindex]')
				.filter(':visible:not([disabled])')
				.filter(function () {
					var tabIndex = $(this).attr('tabindex');
					return tabIndex === undefined || parseInt(tabIndex, 10) >= 0;
				});

			var index = focusable.index($current);
			if (index > -1 && index + 1 < focusable.length) {
				focusable.eq(index + 1).focus();
			}
		}

		/**
		 * Confirm typed input and optionally move to next field
		 */
		function confirmManualInputAndMaybeMove(nextAction) {
			var ok = validateAndSyncManualInput();

			if (!ok) {
				setTimeout(function () {
					$(alterSelector).focus();
					$(alterSelector).select();
				}, 0);
				return false;
			}

			clearError();

			try {
				$(alterSelector).pDatepicker('hide');
			} catch (e) {}

			if (nextAction === 'next') {
				setTimeout(function () {
					moveToNextFocusable($(alterSelector));
				}, 0);
			}

			return true;
		}

		/**
		 * Smart popup repositioning for low viewport / small screens
		 */
		function repositionDatepicker() {
			if (!$this.getFieldSetting("autoReposition")) return;

			var $container = $('.datepicker-container:visible').last();
			var $plot = $container.find('.datepicker-plot-area').last();
			var $input = $(alterSelector);

			if (!$container.length || !$plot.length || !$input.length || !$input.is(':visible')) return;

			var margin = parseInt($this.getFieldSetting("smartPositionMargin"), 10) || 8;
			var inputOffset = $input.offset();
			var inputHeight = $input.outerHeight();
			var dpWidth = $plot.outerWidth();
			var dpHeight = $plot.outerHeight();

			var scrollTop = $(window).scrollTop();
			var scrollLeft = $(window).scrollLeft();
			var winWidth = $(window).width();
			var winHeight = $(window).height();

			var top = inputOffset.top + inputHeight + 6;
			var left = inputOffset.left;

			var freeBelow = (scrollTop + winHeight) - (inputOffset.top + inputHeight);
			var freeAbove = inputOffset.top - scrollTop;

			if (freeBelow < dpHeight + margin && freeAbove > dpHeight + margin) {
				top = inputOffset.top - dpHeight - 6;
			}

			if (top < scrollTop + margin) {
				top = scrollTop + margin;
			}

			if ((left + dpWidth) > (scrollLeft + winWidth - margin)) {
				left = scrollLeft + winWidth - dpWidth - margin;
			}

			if (left < scrollLeft + margin) {
				left = scrollLeft + margin;
			}

			if ($this.getFieldSetting("mobileFriendly") && winWidth <= 768) {
				$container.addClass('pdp-mobile-smart');
				$container.css({
					position: 'fixed',
					top: '0',
					left: '0',
					right: '0',
					bottom: '0'
				});
			} else {
				$container.removeClass('pdp-mobile-smart');
				$container.css({
					position: 'absolute',
					top: top + 'px',
					left: left + 'px',
					right: '',
					bottom: ''
				});
			}
		}

		/* Required validation in PHPRunner */
		if ($this.getFieldSetting('required')) {
			$this.addValidation('IsRequired');
		}

		/* Manual input mode */
		if (!$this.getFieldSetting("allowManualInput")) {
			$(alterSelector).attr('readonly', true);
		} else {
			$(alterSelector).removeAttr('readonly');
			$(alterSelector).attr('dir', 'ltr');
			$(alterSelector).attr('inputmode', $this.getFieldSetting("timePicker_enabled") ? 'text' : 'numeric');
			$(alterSelector).attr('placeholder', $this.getFieldSetting("timePicker_enabled") ? '1405/03/31 14:30:00' : '1405/03/31');
		}

		/* Normalize initial value */
		var initialVal = $(alterSelector).val();
		if (!isEmpty(initialVal)) {
			var normalizedInitialVal = toEnglishDigits(initialVal);
			$(alterSelector).val(normalizedInitialVal);
			$(realSelector).val(normalizedInitialVal);
		}

		/* Clear button */
		$(clearBtnSelector).on("click", function () {
			clearError();
			$(alterSelector).val('');
			$(realSelector).val('');
			$(alterSelector).trigger("change");
		});

		/* Calendar icon open */
		$(openBtnSelector).on("click", function () {
			$(alterSelector).trigger("focus");
			$(alterSelector).trigger("click");

			setTimeout(function () {
				applyThemeVars();
				repositionDatepicker();
			}, 30);
		});

		/* Focus/click behavior */
		$(alterSelector).on("focus click", function () {
			setTimeout(function () {
				applyThemeVars();
				repositionDatepicker();
			}, 30);
		});

		/* Blur validation for manual input */
		if ($this.getFieldSetting("allowManualInput") && $this.getFieldSetting("validateOnBlur")) {
			$(alterSelector).on("blur", function () {
				validateAndSyncManualInput();
			});
		}

		/* Keyboard UX */
		$(alterSelector).on("keydown", function (e) {
			if (!$this.getFieldSetting("allowManualInput")) {
				return;
			}

			var key = e.which || e.keyCode;

			/* Enter => validate + confirm + go next */
			if (key === 13) {
				e.preventDefault();
				e.stopPropagation();

				confirmManualInputAndMaybeMove('next');
				return false;
			}

			/* Tab => validate before leaving field */
			if (key === 9) {
				var ok = validateAndSyncManualInput();

				if (!ok) {
					e.preventDefault();
					e.stopPropagation();

					setTimeout(function () {
						$(alterSelector).focus();
						$(alterSelector).select();
					}, 0);

					return false;
				}

				clearError();

				try {
					$(alterSelector).pDatepicker('hide');
				} catch (e2) {}
			}

			/* Escape => close popup */
			if (key === 27) {
				try {
					$(alterSelector).pDatepicker('hide');
				} catch (e3) {}
			}
		});

		/* Window resize / scroll => reposition popup */
		$(window).on("resize scroll", function () {
			setTimeout(function () {
				repositionDatepicker();
			}, 10);
		});

		/* Initialize Persian datepicker */
		$(alterSelector).pDatepicker({
			"inline": false,
			"format": this.getFieldSetting("format"),
			"viewMode": "day",
			"initialValue": false,
			"initialValueType": "persian",
			"autoClose": this.getFieldSetting("autoClose"),
			"minDate": this.getFieldSetting("minDate"),
			"maxDate": this.getFieldSetting("maxDate"),
			"position": "auto",
			"altField": realSelector,

			"altFieldFormatter": function (unix) {
				var pd = new persianDate(unix);
				var val;

				if ($this.getFieldSetting("timePicker_enabled")) {
					val = pd.format('YYYY/MM/DD HH:mm:ss');
				} else {
					val = pd.format('YYYY/MM/DD');
				}

				return toEnglishDigits(val);
			},

			"onlyTimePicker": this.getFieldSetting("onlyTimePicker"),
			"onlySelectOnDate": this.getFieldSetting("onlySelectOnDate"),
			"calendarType": "persian",
			"inputDelay": 800,
			"observer": true,

			"calendar": {
				"persian": {
					"locale": "fa",
					"showHint": true,
					"leapYearMode": "algorithmic"
				},
				"gregorian": {
					"locale": "en",
					"showHint": true
				}
			},

			"navigator": {
				"enabled": true,
				"scroll": {
					"enabled": true
				},
				"text": {
					"btnNextText": this.getFieldSetting("btnNextText"),
					"btnPrevText": this.getFieldSetting("btnPrevText")
				}
			},

			"toolbox": {
				"enabled": true,
				"calendarSwitch": {
					"enabled": true,
					"format": "MMMM"
				},
				"todayButton": {
					"enabled": true,
					"text": {
						"fa": "امروز",
						"en": "Today"
					}
				},
				"submitButton": {
					"enabled": true,
					"text": {
						"fa": "تایید",
						"en": "Ok"
					}
				},
				"text": {
					"btnToday": "امروز"
				}
			},

			"timePicker": {
				"enabled": this.getFieldSetting("timePicker_enabled"),
				"step": 1,
				"hour": {
					"enabled": true,
					"step": null
				},
				"minute": {
					"enabled": true,
					"step": null
				},
				"second": {
					"enabled": true,
					"step": null
				},
				"meridian": {
					"enabled": false
				}
			},

			"dayPicker": {
				"enabled": true,
				"titleFormat": "YYYY MMMM"
			},
			"monthPicker": {
				"enabled": true,
				"titleFormat": "YYYY"
			},
			"yearPicker": {
				"enabled": true,
				"titleFormat": "YYYY"
			},

			"onShow": function () {
				setTimeout(function () {
					applyThemeVars();
					repositionDatepicker();
				}, 30);
			},

			"onSelect": function () {
				clearError();

				var displayVal = $(alterSelector).val();
				if (!isEmpty(displayVal)) {
					$(alterSelector).val(toEnglishDigits(displayVal));
				}

				var realVal = $(realSelector).val();
				if (!isEmpty(realVal)) {
					$(realSelector).val(toEnglishDigits(realVal));
				}

				setTimeout(function () {
					applyThemeVars();
					repositionDatepicker();
				}, 30);

				$(alterSelector).trigger("change");
			}
		});

		/* Final normalization */
		var currentVal = $(alterSelector).val();
		if (!isEmpty(currentVal)) {
			$(alterSelector).val(toEnglishDigits(currentVal));
		}
	},

	/**
	 * Mark page as modified
	 */
	_onBegin: function () {
		Runner.pages.RunnerPage.prototype.setPageModified(true);
	},

	/**
	 * Return hidden real value for submit
	 */
	getForSubmit: function () {
		if (!this.appearOnPage()) {
			return [];
		}
		return [this.valueElem.clone().val(this.getValue())];
	}
});

/* Register control type */
Runner.controls.constants["EditPersianDatePicker"] = "EditPersianDatePicker";