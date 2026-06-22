(function() {
	'use strict';

	function Menu() {

		this.titleTxt = null;
		this.startTxt = null;
		this.onLanguageChange = null;
	}

	Menu.prototype = {

		create: function () {

			var x = this.game.width / 2
				, y = this.game.height / 2;


			this.titleTxt = this.add.text(x, y, '', {
				font: 'bold 32px Arial, "Microsoft YaHei", "PingFang SC", sans-serif',
				fill: '#ffffff',
				align: 'center'
			});
			this.titleTxt.anchor.setTo(0.5, 0.5);

			this.startTxt = this.add.text(x, y, '', {
				font: 'bold 18px Arial, "Microsoft YaHei", "PingFang SC", sans-serif',
				fill: '#ffffff',
				align: 'center',
				lineSpacing: 4
			});
			this.startTxt.anchor.setTo(0.5, 0);
			this.updateTexts();

			this.onLanguageChange = this.updateTexts.bind(this);
			window.addEventListener('firsttry:languagechange', this.onLanguageChange);

			this.input.onDown.add(this.onDown, this);
		},

		updateTexts: function () {
			var i18n = window['firsttry'].i18n;

			this.titleTxt.setText(i18n.t('menuTitle'));
			this.startTxt.setText(i18n.t('controls'));
			this.layoutTexts();
		},

		layoutTexts: function () {
			var x = this.game.width / 2
				, y = this.game.height * 0.38;

			this.titleTxt.x = x;
			this.titleTxt.y = y - this.titleTxt.height * 1.2;
			this.startTxt.x = x;
			this.startTxt.y = this.titleTxt.y + this.titleTxt.height + 20;
		},

		update: function () {

			var keyboard = this.input.keyboard;

			if (keyboard.isDown(Phaser.Keyboard.W)) {
				this.game.state.start('game');
			}
		},

		onDown: function () {

			this.game.state.start('game');
		},

		shutdown: function () {

			if (this.onLanguageChange) {
				window.removeEventListener('firsttry:languagechange', this.onLanguageChange);
				this.onLanguageChange = null;
			}
		}
	};

	window['firsttry'] = window['firsttry'] || {};
	window['firsttry'].Menu = Menu;

}());
