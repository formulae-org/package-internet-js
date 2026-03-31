/*
Fōrmulæ internet package. Module for expression definition & visualization.
Copyright (C) 2015-2026 Laurence R. Ugalde

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

'use strict';

export class InternetPackage extends Formulae.Package {}

InternetPackage.URL = class extends Expression.NullaryExpression {
	getTag() { return "Internet.UniformResourceLocator"; }
	getName() { return InternetPackage.messages.nameUniformResourceLocator; }

	set(name, value) {
		switch (name) {
			case "Value"      : this.url         = value; return;
			case "Description": this.description = value; return;
		}

		super.set(name, value);
	}

	get(name) {
		switch (name) {
			case "Value"      : return this.url;
			case "Description": return this.description;
		}

		super.get(name);
	}

	getSerializationNames() {
		return [ "Value", "Description" ];
	}

	async getSerializationStrings() {
		return [ this.url, this.description ];
	}

	setSerializationStrings(strings, promises) {
		this.set("Value",       strings[0]);
		this.set("Description", strings[1]);
	}

	prepareDisplay(context) {
		this.width = Math.round(context.measureText(this.description).width);
		this.height = context.fontInfo.size;
		this.horzBaseline = Math.round(this.height / 2);
		this.vertBaseline = Math.round(this.width / 2);
	}

	display(context, x, y) {
		let bkpFillStyle = context.fillStyle;
		context.fillStyle = "green";
		super.drawText(context, this.description, x, y + context.fontInfo.size);
		context.fillStyle = bkpFillStyle;
	}
}

InternetPackage.setExpressions = function(module) {
	Formulae.setExpression(module, "Internet.UniformResourceLocator", InternetPackage.URL);
};
