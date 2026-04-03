/*
Fōrmulæ internet package. Module for edition.
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

InternetPackage.createHyperlinkForm = function(value, description, f) {
	if (InternetPackage.hyperlinkForm === undefined) {
		let table = document.createElement("table");
		table.classList.add("bordered");
		table.innerHTML =
`
<tr>
<th colspan=2>Link
<tr>
<td>URL
<td><input type="text" size=50>
<tr>
<td>Description
<td><input type="text" size=50>
<tr>
<th colspan=2><button>Ok</button>
`;

		InternetPackage.hyperlinkForm = table;
	}

	let rows = InternetPackage.hyperlinkForm.rows;
	let v  = rows[1].cells[1].firstChild;
	let d  = rows[2].cells[1].firstChild;
	let ok = rows[3].cells[0].firstChild;

	v.value = value;
	d.value = description;

	ok.onclick = () => {
		Formulae.modal.style.display = "none";
		f(v.value, d.value);
	};

	Formulae.modalContent.removeChild(Formulae.modalContent.childNodes[0]);
	Formulae.modalContent.appendChild(InternetPackage.hyperlinkForm);

	Formulae.modal.style.display = "block";
	Formulae.modal.focus();
};

InternetPackage.editionHyperlink = function() {
	InternetPackage.createHyperlinkForm(null, null, (v, d) => {
		let newExpression = Formulae.createExpression("Internet.Hyperlink");
		newExpression.set("Value", v);
		newExpression.set("Description", d);

		Formulae.sExpression.replaceBy(newExpression);
		Formulae.sHandler.prepareDisplay();
		Formulae.sHandler.display();
		Formulae.setSelected(Formulae.sHandler, newExpression, false);
	});
}

InternetPackage.actionJumpHyperlink = {
	isAvailableNow: () => true,
	getDescription: () => InternetPackage.messages.actionOpenHyperlink,
	doAction: () => {
		let win = window.open(Formulae.sExpression.get("Value"), "_blank");
		win.focus();
	}
};

InternetPackage.actionCopyHyperlink = {
	isAvailableNow: () => true,
	getDescription: () => InternetPackage.messages.actionCopyHyperlink,
	doAction: () => navigator.clipboard.writeText(Formulae.sExpression.get("Value"))
};

InternetPackage.actionEditHyperlink = {
	isAvailableNow: () => Formulae.sHandler.type != Formulae.ROW_OUTPUT,
	getDescription: () => InternetPackage.messages.actionEditHyperlink,
	doAction: () => {
		InternetPackage.createHyperlinkForm(Formulae.sExpression.get("Value"), Formulae.sExpression.get("Description"), (v, d) => {
			Formulae.sExpression.set("Value", v);
			Formulae.sExpression.set("Description", d);

			Formulae.sHandler.prepareDisplay();
			Formulae.sHandler.display();
			Formulae.setSelected(Formulae.sHandler, Formulae.sExpression, false);
		});
	}
};

InternetPackage.setEditions = function() {
	Formulae.addEdition(this.messages.pathInternet, null, this.messages.leafHyperlink, InternetPackage.editionHyperlink);
};

InternetPackage.setActions = function() {
	Formulae.addAction("Internet.Hyperlink", InternetPackage.actionJumpHyperlink);
	Formulae.addAction("Internet.Hyperlink", InternetPackage.actionCopyHyperlink);
	Formulae.addAction("Internet.Hyperlink", InternetPackage.actionEditHyperlink);
};
