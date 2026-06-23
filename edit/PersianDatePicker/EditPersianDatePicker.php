<?php
/**
 * ============================================================
 * EditPersianDatePicker.php
 * Persian Date Picker UserControl for PHPRunner
 * ============================================================
 *
 * Version: 2.0.0
 * Release Date: 2026-06-23
 * Component: EditPersianDatePicker
 *
 * Description:
 * PHPRunner UserControl for Persian/Jalali date input with:
 * - Themeable UI
 * - Smart popup reposition support
 * - Mobile-friendly behavior
 * - Manual date input support
 * - Persian date validation support in JS
 * - Keyboard UX improvements (Enter / Tab / Escape)
 * - Hidden field synchronization for DB storage
 *
 * Expected DB format:
 * - Date only: YYYY/MM/DD
 * - DateTime : YYYY/MM/DD HH:mm:ss
 *
 * Dependencies:
 * - plugins/controles/persiandatepicker/js/persian-date.min.js
 * - plugins/controles/persiandatepicker/js/persian-datepicker.min.js
 * - plugins/controles/persiandatepicker/css/persian-datepicker.min.css
 * - plugins/controles/persiandatepicker/css/persian-datepicker-custom.css
 *
 * Important Notes:
 * 1) JS libraries are merged into:
 *    templates_c/persian-datepicker.min.js
 * 2) If JS changes are not reflected, delete that file manually
 *    and refresh browser using Ctrl + F5
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
 * - Added theme settings
 * - Added UX settings for manual input and smart popup behavior
 * - Added error message container under input
 * - Added calendar open and clear button structure
 * - Updated defaults to Persian date normalized format
 *
 * 1.x
 * - Initial Persian datepicker integration
 * ============================================================
 */

class EditPersianDatePicker extends UserControl
{
	/**
	 * Initialize control settings and expose them to JS
	 */
	public function initUserControl()
	{
		/* ======================================================
		   Base Settings
		   ====================================================== */
		$this->required = isset($this->settings["required"]) ? $this->settings["required"] : false;
		$this->onlySelectOnDate = isset($this->settings["onlySelectOnDate"]) ? $this->settings["onlySelectOnDate"] : true;
		$this->onlyTimePicker = isset($this->settings["onlyTimePicker"]) ? $this->settings["onlyTimePicker"] : false;
		$this->format = isset($this->settings["format"]) ? $this->settings["format"] : 'YYYY/MM/DD';
		$this->minDate = isset($this->settings["minDate"]) ? $this->settings["minDate"] : 0;
		$this->maxDate = isset($this->settings["maxDate"]) ? $this->settings["maxDate"] : 99999999999999;
		$this->endDate = isset($this->settings["endDate"]) ? $this->settings["endDate"] : '';
		$this->autoClose = isset($this->settings["autoClose"]) ? $this->settings["autoClose"] : true;
		$this->btnNextText = isset($this->settings["btnNextText"]) ? $this->settings["btnNextText"] : "‹";
		$this->btnPrevText = isset($this->settings["btnPrevText"]) ? $this->settings["btnPrevText"] : "›";
		$this->timePicker_enabled = isset($this->settings["timePicker_enabled"]) ? $this->settings["timePicker_enabled"] : false;

		/* ======================================================
		   Theme Settings
		   ====================================================== */
		$this->theme = isset($this->settings["theme"]) ? $this->settings["theme"] : "blue";
		$this->themePrimary = isset($this->settings["themePrimary"]) ? $this->settings["themePrimary"] : "#0d6efd";
		$this->themePrimaryHover = isset($this->settings["themePrimaryHover"]) ? $this->settings["themePrimaryHover"] : "#0b5ed7";
		$this->themeSoftBg = isset($this->settings["themeSoftBg"]) ? $this->settings["themeSoftBg"] : "#eef6ff";
		$this->themeText = isset($this->settings["themeText"]) ? $this->settings["themeText"] : "#243447";
		$this->themeTodayBg = isset($this->settings["themeTodayBg"]) ? $this->settings["themeTodayBg"] : "#fff3cd";
		$this->themeTodayText = isset($this->settings["themeTodayText"]) ? $this->settings["themeTodayText"] : "#856404";
		$this->themeBorder = isset($this->settings["themeBorder"]) ? $this->settings["themeBorder"] : "#dbe5f0";
		$this->themeShadow = isset($this->settings["themeShadow"]) ? $this->settings["themeShadow"] : "0 18px 45px rgba(15, 23, 42, 0.16)";
		$this->themeRadius = isset($this->settings["themeRadius"]) ? $this->settings["themeRadius"] : "18px";

		/* ======================================================
		   UX Settings
		   ====================================================== */
		$this->allowManualInput = isset($this->settings["allowManualInput"]) ? $this->settings["allowManualInput"] : true;
		$this->validateOnBlur = isset($this->settings["validateOnBlur"]) ? $this->settings["validateOnBlur"] : true;
		$this->autoReposition = isset($this->settings["autoReposition"]) ? $this->settings["autoReposition"] : true;
		$this->mobileFriendly = isset($this->settings["mobileFriendly"]) ? $this->settings["mobileFriendly"] : true;
		$this->smartPositionMargin = isset($this->settings["smartPositionMargin"]) ? $this->settings["smartPositionMargin"] : 8;

		/* ======================================================
		   Push Settings to JS
		   ====================================================== */
		$this->addJSSetting("required", $this->required);
		$this->addJSSetting("onlySelectOnDate", $this->onlySelectOnDate);
		$this->addJSSetting("onlyTimePicker", $this->onlyTimePicker);
		$this->addJSSetting("format", $this->format);
		$this->addJSSetting("minDate", $this->minDate);
		$this->addJSSetting("maxDate", $this->maxDate);
		$this->addJSSetting("autoClose", $this->autoClose);
		$this->addJSSetting("btnNextText", $this->btnNextText);
		$this->addJSSetting("btnPrevText", $this->btnPrevText);
		$this->addJSSetting("timePicker_enabled", $this->timePicker_enabled);

		$this->addJSSetting("theme", $this->theme);
		$this->addJSSetting("themePrimary", $this->themePrimary);
		$this->addJSSetting("themePrimaryHover", $this->themePrimaryHover);
		$this->addJSSetting("themeSoftBg", $this->themeSoftBg);
		$this->addJSSetting("themeText", $this->themeText);
		$this->addJSSetting("themeTodayBg", $this->themeTodayBg);
		$this->addJSSetting("themeTodayText", $this->themeTodayText);
		$this->addJSSetting("themeBorder", $this->themeBorder);
		$this->addJSSetting("themeShadow", $this->themeShadow);
		$this->addJSSetting("themeRadius", $this->themeRadius);

		$this->addJSSetting("allowManualInput", $this->allowManualInput);
		$this->addJSSetting("validateOnBlur", $this->validateOnBlur);
		$this->addJSSetting("autoReposition", $this->autoReposition);
		$this->addJSSetting("mobileFriendly", $this->mobileFriendly);
		$this->addJSSetting("smartPositionMargin", $this->smartPositionMargin);
	}

	/**
	 * Build control HTML
	 */
	function buildUserControl($value, $mode, $fieldNum = 0, $validate, $additionalCtrlParams, $data)
	{
		$fecha2 = ($value === null || $value === '')
			? ''
			: htmlspecialchars($value, ENT_QUOTES, 'UTF-8');

		$autocomplete = ($mode == MODE_SEARCH) ? 'autocomplete="off" ' : '';
		$alt508 = (($mode == MODE_INLINE_EDIT || $mode == MODE_INLINE_ADD) && $this->is508 == true)
			? 'alt="' . $this->strLabel . '" '
			: '';

		$html  = '';
		$html .= $this->getSetting("label");

		/* Visible input + buttons */
		$html .= '<div class="input-group date edit-persian-date-picker-wrapper" id="wrap_' . $this->cfield . '">';
		$html .= '<input id="' . $this->cfield . '_alter" '
			. $this->inputStyle
			. ' class="form-control edit-persian-date-picker-input"'
			. ' style="text-align:left;"'
			. ' type="text" '
			. $autocomplete
			. $alt508
			. ' name="' . $this->cfield . '_alter" '
			. ' title="' . $this->tooltip . '"'
			. ' value="' . $fecha2 . '">';

		$html .= '<span class="input-group-addon edit-persian-date-picker-clear" id="imgCal_' . $this->cfield . '" style="cursor:pointer">'
			. '<span class="glyphicon glyphicon-remove"></span>'
			. '</span>';

		$html .= '<span class="input-group-addon edit-persian-date-picker-open" id="btnCal_' . $this->cfield . '" style="cursor:pointer">'
			. '<span class="glyphicon glyphicon-calendar"></span>'
			. '</span>';

		$html .= '</div>';

		/* Error message area for manual validation */
		$html .= '<div id="err_' . $this->cfield . '" class="edit-persian-date-picker-error" '
			. 'style="display:none;color:#dc3545;font-size:12px;margin-top:4px;"></div>';

		/* Required marker */
		if ($this->required == true) {
			$html .= '&nbsp;<font color="red">*</font>';
		}

		/* Hidden real field for submit */
		$html .= '<div>';
		$html .= '<input id="' . $this->cfield . '" '
			. $this->inputStyle
			. ' class="form-control"'
			. ' style="text-align:left;"'
			. ' type="hidden" '
			. $autocomplete
			. $alt508
			. ' name="' . $this->cfield . '" '
			. $this->pageObject->pSetEdit->getEditParams($this->field)
			. ' title="' . $this->tooltip . '"'
			. ' value="' . $fecha2 . '">';
		$html .= '</div>';

		echo $html;
	}

	/**
	 * Supported search operators
	 */
	function getUserSearchOptions()
	{
		return array(EQUALS, STARTS_WITH, NOT_EMPTY, NOT_EQUALS);
	}

	/**
	 * Add and merge required JS libraries
	 */
	function addJSFiles()
	{
		$lib = array();
		$lib[] = 'plugins/controles/persiandatepicker/js/persian-date.min.js';
		$lib[] = 'plugins/controles/persiandatepicker/js/persian-datepicker.min.js';

		$dir = str_replace('\\', '/', __DIR__);
		$filename = $dir . '/../../templates_c/persian-datepicker.min.js';
		$fileUrl = 'templates_c//persian-datepicker.min.js';

		/*
		 * Important:
		 * This merged file is created only if it does not exist.
		 * If source JS files change, delete the cached merged file manually:
		 * templates_c/persian-datepicker.min.js
		 */
		if (!file_exists($filename)) {
			$fjs = '';

			for ($i = 0; $i < count($lib); $i++) {
				if (file_exists($lib[$i])) {
					$fjs .= file_get_contents($lib[$i]) . "\n";
				}
			}

			$status = file_put_contents($filename, $fjs);
			if ($status === false) {
				die('Could not write merged JS file. ' . $filename);
			}
		}

		$this->pageObject->AddJSFile($fileUrl);
	}

	/**
	 * Add required CSS files
	 */
	function addCSSFiles()
	{
		$this->pageObject->AddCSSFile("plugins/controles/persiandatepicker/css/persian-datepicker.min.css");
		$this->pageObject->AddCSSFile("plugins/controles/persiandatepicker/css/persian-datepicker-custom.css");
	}
}
?>