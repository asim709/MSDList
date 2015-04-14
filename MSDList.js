/*
 * MSDList
 * ------------------------------------------------------------------------------
 * A filterable multi-select drop down list similar to regular html SELECT that allows the 
 * users to select multiple items.
 * 
 * Author:
 * --------
 * Name		Asim Ishaq
 * Email 	asim709@gmail.com
 * Web	 	http://asimishaq.com
 * 
 * Detail Article for usage information:
 * -------------------------------------
 * http://asimishaq.com/resources/tools/multi-select-dropdown-list/#
 * ------------------------------------------------------------------
 * 
 * Copyright (c) 2013 Asim Ishaq
 *
 * License: GPL v2 or later 
 */

/*
	The second parameter can be an object specifing the following properties:
	{
		filterVisible : true,
		selectAllOption : true,
		emptyMessage : '',
		allSelectedMessage : '',
		responsive:false,
		width : 200,
		height:24
	}
*/
function MSDList(container) {

	var _this = this;

	var options = {};
	if (arguments.length >= 2)
		options = arguments[1];

	// ====================================================================//
	// ========================= PRIVATE PROPERTIES
	// ====================================================================//

	this._container = container;
	this._items = [];
	this._selectAllCheckboxLabel = 'All';
	this._width = 200;
	this._height = 24;
	this._rendered = false;
	this._listVisible = false;
	this._emptyFilterMessage = '[Type here to filter list]';

	if (typeof options.width != 'undefined')
		this._width = options.width;
	else
		this._width = 200;

	if (typeof options.height != 'undefined')
		this._height = options.height;
	else
		this._height = 24;

	if (typeof options.responsive != 'undefined')
		this._responsive = options.responsive;
	else
		this._responsive = false;

	if (typeof options.emptyMessage != 'undefined')
		this._emptyMessage = options.emptyMessage;
	else
		this._emptyMessage = '[Select]';

	if (typeof options.allSelectedMessage != 'undefined')
		this._allSelectedMessage = options.allSelectedMessage;
	else
		this._allSelectedMessage = '[All Selected]';

	if (typeof options.filterVisible != 'undefined')
		this._filterVisible = options.filterVisible;
	else
		this._filterVisible = true;

	if (typeof options.selectAllOption != 'undefined')
		this._selectAllOption = options.selectAllOption;
	else
		this._selectAllOption = true;

	// ====================================================================//
	// ========================= CONSTRUCTOR
	// ====================================================================//

	this._containerNode = document.createElement("div");

	this._selectedValuesNode = document.createElement("input");
	this._inputSectionNode = document.createElement("div");
	this._buttonSectionNode = document.createElement("div");

	this._labelNode = document.createElement("div");
	this._dropDownButton = document.createElement("input");

	this._listNode = document.createElement("div");
	this._listTableNode = document.createElement("table");
	this._listTableHeaderNode = document.createElement("thead");
	this._listTableBodyNode = document.createElement("tbody");
	this._listTableHeaderRowNode = document.createElement("tr");
	this._listTableHeaderRowCheckboxCellNode = document.createElement("td");
	this._listTableHeaderRowLabelCellNode = document.createElement("td");

	// Filter
	this._listTableHeaderFilterRowNode = document.createElement("tr");
	this._listTableHeaderFilterCellNode = document.createElement("td");

	this._filterBoxNode = document.createElement("input");
	this._selectAllCheckBoxNode = document.createElement("input");

	// ====================================================================//
	// ORGANIZE DOM NODES INTO MEANINGFUL STRUCTURE
	// ====================================================================//

	this._containerNode.appendChild(this._selectedValuesNode);
	this._containerNode.appendChild(this._inputSectionNode);
	this._containerNode.appendChild(this._buttonSectionNode);
	this._containerNode.appendChild(this._listNode);

	this._inputSectionNode.appendChild(this._labelNode);

	this._buttonSectionNode.appendChild(this._dropDownButton);

	this._listNode.appendChild(this._listTableNode);
	this._listTableNode.appendChild(this._listTableHeaderNode);
	this._listTableNode.appendChild(this._listTableBodyNode);

	this._listTableHeaderNode.appendChild(this._listTableHeaderFilterRowNode);
	this._listTableHeaderFilterRowNode
			.appendChild(this._listTableHeaderFilterCellNode);
	this._listTableHeaderFilterCellNode.appendChild(this._filterBoxNode);

	this._listTableHeaderNode.appendChild(this._listTableHeaderRowNode);
	this._listTableHeaderRowNode
			.appendChild(this._listTableHeaderRowCheckboxCellNode);
	this._listTableHeaderRowNode
			.appendChild(this._listTableHeaderRowLabelCellNode);
	this._listTableHeaderRowCheckboxCellNode
			.appendChild(this._selectAllCheckBoxNode);

	// ====================================================================//
	// ASSIGN CSS CLASSES TO EACH NODE
	// ====================================================================//

	this._containerNode.className = "MSDList";
	this._inputSectionNode.className = "MSDList_InputSection";
	this._buttonSectionNode.className = "MSDList_ButtonSection";
	this._labelNode.className = "MSDList_Label";
	this._dropDownButton.className = "MSDList_DropDownButton";
	this._listNode.className = "MSDList_List";
	this._listTableNode.className = "MSDList_ListTable";
	this._listTableHeaderNode.className = "MSDList_ListTableHeader";
	this._listTableBodyNode.className = "MSDList_ListTableBody";
	this._listTableHeaderRowNode.className = "MSDList_ListTableHeaderRow MSDList_ListItemRow";
	this._listTableHeaderRowCheckboxCellNode.className = "MSDList_ListTableHeaderRowCheckBoxCell MSDList_ListCheckBoxCell";
	this._listTableHeaderRowLabelCellNode.className = "MSDList_ListTableHeaderRowLabelCell MSDList_ListLabelCell";
	this._listTableHeaderFilterRowNode.className = "MSDList_ListTableHeaderFilterRow";
	this._listTableHeaderFilterCellNode.className = "MSDList_ListTableHeaderFilterCell";
	this._filterBoxNode.className = "MSDList_ListFilterBox_Empty";

	this._selectAllCheckBoxNode.className = "MSDList_ListCheckBox";

	// ====================================================================//
	// SET INITIAL VALUES OF NODES
	// ====================================================================//

	this._selectedValuesNode.setAttribute("name", this._container);
	this._selectedValuesNode.setAttribute("type", "hidden");
	this._selectAllCheckBoxNode.setAttribute("type", "checkbox");
	this._dropDownButton.setAttribute("type", "button");
	this._dropDownButton.setAttribute("value", "");
	this._listNode.style.display = 'none';
	this._listTableNode.setAttribute("cellspacing", "0");
	this._listTableNode.setAttribute("cellpadding", "0");
	this._listTableHeaderRowLabelCellNode.innerHTML = this.getSelectAllLabel();
	this._listTableHeaderFilterCellNode.setAttribute("colspan", "2");
	this._filterBoxNode.setAttribute("type", "text");
	this._filterBoxNode.setAttribute("value", this._emptyFilterMessage);
	this._labelNode.innerHTML = this._emptyMessage;

	if (!this._filterVisible)
		this._listTableHeaderFilterRowNode.style.display = 'none';

	if (!this._selectAllOption)
		this._listTableHeaderRowNode.style.display = 'none';

	// ====================================================================//
	// MODIFY PROTOTYPE OF OTHER OBJECTS
	// ====================================================================//

	String.prototype.toInt = function() {
		return parseInt(this);
	};

	HTMLElement.prototype.cStyle = function() {
		return window.getComputedStyle(this);
	};

	HTMLElement.prototype.getWidth = function() {
		var cs = this.cStyle();
		if (!isNaN(cs.width.toInt())) {
			return cs.width.toInt();
		}
		return this.clientWidth;
	};

	HTMLElement.prototype.getHeight = function() {
		var cs = this.cStyle();
		if (!isNaN(cs.height.toInt())) {
			return cs.height.toInt();
		}
		return this.clientHeight;
	};

	HTMLElement.prototype.getExtraWidth = function() {
		var cs = this.cStyle();
		return cs.paddingLeft.toInt() + cs.paddingRight.toInt()
				+ cs.marginLeft.toInt() + cs.marginRight.toInt()
				+ cs.borderLeftWidth.toInt() + cs.borderRightWidth.toInt();
	};

	HTMLElement.prototype.getExtraHeight = function() {
		var cs = this.cStyle();
		return cs.paddingTop.toInt() + cs.paddingBottom.toInt()
				+ cs.marginTop.toInt() + cs.marginBottom.toInt()
				+ cs.borderTopWidth.toInt() + cs.borderBottomWidth.toInt();
	};

	HTMLElement.prototype.setWidth = function(width) {
		this.style.width = width + 'px';
	};

	HTMLElement.prototype.setHeight = function(height) {
		this.style.height = height + 'px';
	};

	// Taken From:
	// http://stackoverflow.com/questions/1044988/getting-offsettop-of-element-in-a-table
	HTMLElement.prototype.offsetY = function() {
		var elem = this;
		var y = elem.offsetTop;

		while (elem = elem.offsetParent) {
			//y += elem.offsetTop;
		}

		return y;
	};

	HTMLElement.prototype.offsetX = function() {
		var elem = this;

		var x = elem.offsetLeft;

		while (elem = elem.offsetParent) {
			//x += elem.offsetLeft;
		}

		return x;
	};

	// ====================================================================//
	// ATTACH EVENT HANDLERS
	// ====================================================================//

	/*If the list is open and mouse is cliked on anywhere else in document then
	it must close*/

	document.addEventListener("click",function (e) {	
		if (_this._listVisible) {
			
			_this.hideList();

			e = e || window.event;

			if (e.stopPropagation) 
	        	e.stopPropagation();
			else if (e.preventDefault) 
	    		e.preventDefault();
			else 
	        	e.cancelBubble = true;
		}
	});

	document.addEventListener("touchend", function (e) {
		if (_this._listVisible) {

			_this.hideList();

			e = e || window.event;

			if (e.stopPropagation) 
	        	e.stopPropagation();
			else if (e.preventDefault) 
	    		e.preventDefault();
			else 
	        	e.cancelBubble = true;
		}
	});

	this._containerNode.onclick = function(e) {
		e = e || window.event;

		if (e.stopPropagation) 
	        e.stopPropagation();
		else if (e.preventDefault) 
	    	e.preventDefault();
		else 
	        e.cancelBubble = true;
	};

	this._dropDownButton.onclick = function(e) {

		e = e || window.event;

		if (_this._listVisible)
			_this.hideList();
		 else 
			_this.showList();

	};

	this._dropDownButton.ontouchend = function(e) {

		e = e || window.event;

		if (e.stopPropagation) 
	        e.stopPropagation();
		else if (e.preventDefault) 
	    	e.preventDefault();
		else 
	        e.cancelBubble = true;

	};

	this._labelNode.onclick = function(e) {

		e = e || window.event;

		if (_this._listVisible) 
			_this.hideList();
		else
			_this.showList();

	};

	this._labelNode.ontouchend = function(e) {

		e = e || window.event;

		if (e.stopPropagation) 
	        e.stopPropagation();
		else if (e.preventDefault) 
	    	e.preventDefault();
		else 
	        e.cancelBubble = true;

	};

	this._selectAllCheckBoxNode.onclick = function() {
		if (_this._selectAllCheckBoxNode.checked)
			_this.selectAllItems();
		else
			_this.unselectAllItems();
	};

	this._listTableHeaderRowLabelCellNode.onclick = function(e) {
		
		e = e || window.event;

		this.parentNode.firstChild.firstChild.checked = !this.parentNode.firstChild.firstChild.checked;
		_this._selectAllCheckBoxNode.onclick();

	};

	// Filter box events
	this._filterBoxNode.onfocus = function() {
		if (_this._filterBoxNode.value == _this._emptyFilterMessage) {
			_this.setFilterValue('');
		}
		_this._filterBoxNode.className = 'MSDList_ListFilterBox';
	};

	this._filterBoxNode.onblur = function() {
		if (_this._filterBoxNode.value == '') {
			_this.setFilterValue(_this._emptyFilterMessage);
			_this._filterBoxNode.className = 'MSDList_ListFilterBox_Empty';
		}
	};

	this._filterBoxNode.onkeypress = function(e) {
		if (e.keyCode == 13) {
			_this.filterList();
		}
	};

	this._filterBoxNode.onchange = function() {
		_this.filterList();
	};

	// counter: used for z-Index. The counter will increase on new instance and
	// as well whenever layout is called for any instance
	if (typeof MSDList._counter == 'undefined') {
		MSDList._counter = 1;
	} else {
		MSDList._counter++;
	}
}

// ====================================================================//
// GETTERS & SETTERS
// ====================================================================//

MSDList.prototype.setContainer = function(container) {
	this._container = container;
};

MSDList.prototype.getContainer = function() {
	return this._container;
};

MSDList.prototype.setSelectAllLabel = function(selectAllLabel) {
	this._selectAllCheckboxLabel = selectAllLabel;
};

MSDList.prototype.getSelectAllLabel = function() {
	return this._selectAllCheckboxLabel;
};

MSDList.prototype.setEmptyMessage = function(emptyMessage) {
	this._emptyMessage = emptyMessage;
};

MSDList.prototype.getEmptyMessage = function() {
	return this._emptyMessage;
};

MSDList.prototype.setDimension = function(width, height) {
	this._width = width;
	this._height = height;

	if (this._rendered)
		this._layout();
};

MSDList.prototype.getDimension = function() {
	return {
		width : this._width,
		height : this._height
	};
};

MSDList.prototype.setWidth = function(width) {
	this._width = width;

	if (this._rendered)
		this._layout();
};

MSDList.prototype.getWidth = function() {
	return this._width;
};

MSDList.prototype.setHeight = function(height) {
	this._height = height;

	if (this._rendered)
		this._layout();
};

MSDList.prototype.getHeight = function() {
	return this._height;
};

MSDList.prototype.isRendered = function() {
	return this._rendered;
};

MSDList.prototype.showList = function() {
	if (this._rendered == true) {
		this._listVisible = true;
		this._listNode.style.display = '';
		MSDList._counter++;
		this._layoutList();
	}
};

MSDList.prototype.hideList = function() {
	if (this._rendered == true) {
		this._listVisible = false;
		this._listNode.style.display = 'none';
	}
};

MSDList.prototype.isListVisible = function() {
	return this._listVisible;
};

MSDList.prototype.setEmptyFilterMessage = function(message) {
	this._emptyFilterMessage = message;
};

MSDList.prototype.getEmptyFilterMessage = function() {
	return this._emptyFilterMessage;
};

MSDList.prototype.setSelectAllOptionVisible = function(visible) {
	this._selectAllOption = visible;
	if (this._selectAllOption) {
		this._listTableHeaderRowNode.style.display = '';
		this._layoutList();
	} else {
		this._listTableHeaderRowNode.style.display = 'none';
		this._layoutList();
	}
};

MSDList.prototype.isSelectAllOptionVisible = function() {
	return this._selectAllOption;
};

MSDList.prototype.setFilterVisible = function(visible) {
	this._filterVisible = visible;
	if (this._filterVisible) {
		this._listTableHeaderFilterRowNode.style.display = '';
		this._layoutList();
	} else {
		this._listTableHeaderFilterRowNode.style.display = 'none';
		this.setFilterValue(this._emptyFilterMessage);
		this.filterList();
	}
};

MSDList.prototype.isFilterVisible = function() {
	return this._filterVisible;
};

MSDList.prototype.setFilterValue = function(value) {
	this._filterBoxNode.value = value;
	this.filterList();
};

// If the value equals empty filter message then return empty string
MSDList.prototype.getFilterValue = function() {
	return this._filterBoxNode.value == this._emptyFilterMessage ? ''
			: this._filterBoxNode.value;
};

MSDList.prototype.setResponsive = function(responsive) {
	this._responsive = responsive;
	this._layout();
};

MSDList.prototype.isResponsive = function() {
	return this._responsive;
};

// ====================================================================//
// METHODS
// ====================================================================//

//Check if this list element is within a form element then return that form obj
MSDList.prototype.getParentFormElement = function() {
	var node = this._containerNode.parentNode;
	while (node != null) {
		if (node.nodeName == 'FORM')
			return node;
		else
			node = node.parentNode;
	}
	return null;
};

// Returns false if item is not added else true. Duplicate items are not added
MSDList.prototype.addItem = function(id, label) {

	// Do not add item if it already exists
	if (this.hasItem(id))
		return false;

	var item = {
		id : id,
		label : label,
		skey : label.toLowerCase(),
		tr : document.createElement("tr"),
		td1 : document.createElement("td"),
		td2 : document.createElement("td"),
		cbox : document.createElement("input")
	};

	item.cbox.setAttribute("type", "checkbox");
	// item.cbox.setAttribute("name", this._container + '[]');
	item.cbox.setAttribute("value", id);

	item.cbox.className = "MSDList_ListCheckBox";
	item.tr.className = "MSDList_ListItemRow";
	item.td1.className = "MSDList_ListCheckBoxCell";
	item.td2.className = "MSDList_ListLabelCell";

	item.td2.innerHTML = label;

	item.td1.appendChild(item.cbox);
	item.tr.appendChild(item.td1);
	item.tr.appendChild(item.td2);

	this._items.push(item);
	this._listTableBodyNode.appendChild(item.tr);

	this._updateSelection();

	var _this = this;
	item.cbox.onclick = function(e) {
		_this._updateSelection();

		e = e || window.event;

		if (e.stopPropagation) 
	       	e.stopPropagation();
		else if (e.preventDefault) 
	    	e.preventDefault();
		else 
	       	e.cancelBubble = true;
	};

	item.cbox.ontouchend = function(e) {

		_this._updateSelection();

		e = e || window.event;

		if (e.stopPropagation) 
	       	e.stopPropagation();
		else if (e.preventDefault) 
	    	e.preventDefault();
		else 
	       	e.cancelBubble = true;

	};

	item.td2.onclick = function(e) {
		this.parentNode.firstChild.firstChild.checked = !this.parentNode.firstChild.firstChild.checked;
		_this._updateSelection();

		e = e || window.event;

		if (e.stopPropagation) 
	       	e.stopPropagation();
		else if (e.preventDefault) 
	    	e.preventDefault();
		else 
	      	e.cancelBubble = true;
	};

	item.td2.ontouchend = function(e) {
		
		e = e || window.event;

		if (e.stopPropagation) 
	       	e.stopPropagation();
		else if (e.preventDefault) 
	    	e.preventDefault();
		else 
	      	e.cancelBubble = true;

	};

	return true;
};

MSDList.prototype.removeItem = function(id) {
	var idx = -1;
	for ( var i = 0; i < this._items.length; i++) {
		if (this._items[i].id == id) {
			idx = i;
			this._listTableBodyNode.removeChild(this._items[i].tr);
		}
	}

	if (idx > -1) {
		this._items.splice(idx, 1);
	}

	this._updateSelection();

};

MSDList.prototype.removeAllItems = function() {
	for ( var i = 0; i < this._items.length; i++) {
		this._listTableBodyNode.removeChild(this._items[i].tr);
	}
	this._items = [];

	this._updateSelection();
};

MSDList.prototype.hasItem = function(id) {
	for ( var i = 0; i < this._items.length; i++) {
		if (this._items[i].id == id)
			return true;
	}
	return false;
};

MSDList.prototype.selectItem = function(id) {
	for ( var i = 0; i < this._items.length; i++) {
		if (this._items[i].id == id) {
			this._items[i].cbox.checked = true;
		}
	}
	this._updateSelection();
};

MSDList.prototype.unselectItem = function(id) {
	for ( var i = 0; i < this._items.length; i++) {
		if (this._items[i].id == id) {
			this._items[i].cbox.checked = false;
		}
	}
	this._updateSelection();
};

MSDList.prototype.unselectAllItems = function() {
	for ( var i = 0; i < this._items.length; i++) {
		this._items[i].cbox.checked = false;
	}

	this._updateSelection();
};

MSDList.prototype.selectAllItems = function() {
	for ( var i = 0; i < this._items.length; i++) {
		this._items[i].cbox.checked = true;
	}

	this._updateSelection();
};

MSDList.prototype.getSelectedItems = function() {
	var selectedItems = [];

	for ( var i = 0; i < this._items.length; i++) {
		if (this._items[i].cbox.checked)
			selectedItems.push({
				id : this._items[i].id,
				label : this._items[i].label
			});
	}
	return selectedItems;
};

MSDList.prototype.render = function() {

	var node = document.getElementById(this._container);

	if (!node) {
		alert("The container element having ID: " + this._container
				+ " not found in dom.");
	} else {

		node.parentNode.insertBefore(this._containerNode, node);

		// if node is a select then load values
		if (node.nodeName == 'SELECT') {
			for ( var i = 0; i < node.children.length; i++) {
				this.addItem(node.children[i].value, node.children[i].innerText
						|| node.children[i].textContent);
				if (node.children[i].selected) {
					this.selectItem(node.children[i].value);
				}
			}
		}

		node.parentNode.removeChild(node);

		this._layout();
		this._updateSelection();
		this._rendered = true;

		/* If the list is in a form element then reset button will reset the list as well.
			respond to form reset event.*/
		this._formElement = this.getParentFormElement();
		if (this._formElement != null) {
			var _thisRef = this;
			this._formElement.addEventListener("reset", function (e) {
				
				e = e || window.event;

				_thisRef.unselectAllItems();
			});
		}
	}
};

// Layout will adjust dimensions of componnet
MSDList.prototype._layout = function() {

	// Main Container Node
	if (this.isResponsive()) 
		if (typeof this._containerNode.parentNode != 'undefined') 
			this._width = parseInt(this._containerNode.parentNode.clientWidth);

	this._containerNode.setWidth(this._width);
	this._containerNode.setHeight(this._height);

	// Button Section Node
	this._buttonSectionNode.setHeight(this._height);
	// this._buttonSectionNode.setWidth(this._width -
	// this._containerNode.getExtraWidth());

	// Input Section Node
	this._inputSectionNode.setHeight(this._height
			- this._inputSectionNode.getExtraHeight());
	this._inputSectionNode.setWidth(this._width
			- this._buttonSectionNode.getWidth()
			- this._buttonSectionNode.getExtraWidth()
			- this._inputSectionNode.getExtraWidth()
			- this._containerNode.getExtraWidth());

	// Dropdown Button
	this._dropDownButton.setWidth(this._buttonSectionNode.getWidth()
			- this._dropDownButton.getExtraWidth());
	this._dropDownButton.setHeight(this._buttonSectionNode.getHeight()
			- this._dropDownButton.getExtraHeight());

	// Label Node
	this._labelNode.setWidth(this._inputSectionNode.getWidth()
			- this._labelNode.getExtraWidth());
	this._labelNode.setHeight(this._inputSectionNode.getHeight()
			- this._labelNode.getExtraHeight());
	this._labelNode.style.lineHeight = this._labelNode.getHeight() + 'px';

	// Layout list if its vsible
	if (this._listVisible) {
		this._layoutList();
	}

};

MSDList.prototype._layoutList = function() {

	// Adjust list position
	this._listNode.style.top = this._containerNode.getHeight()
			+ this._containerNode.getExtraHeight()
			+ this._containerNode.offsetY() + 'px';
	this._listNode.style.left = this._containerNode.offsetX() + 'px';

	this._listNode.setWidth(this._width);

	if (this._filterVisible) {
		this._filterBoxNode.setWidth(this._listTableHeaderFilterCellNode
				.getWidth()
				- this._filterBoxNode.getExtraWidth());
		this._filterBoxNode.setHeight(this._listTableHeaderFilterCellNode
				.getHeight()
				- this._filterBoxNode.getExtraHeight());
	}

	this._listNode.style.zIndex = 1000 + MSDList._counter;
};

MSDList.prototype._updateSelection = function() {
	var sItems = this.getSelectedItems();
	var sItemsCount = sItems.length;

	if (sItemsCount == this._items.length && sItemsCount > 0) {

		this._selectAllCheckBoxNode.checked = true;
		this._labelNode.innerHTML = this._allSelectedMessage;

	} else if (sItemsCount == 0) {

		this._selectAllCheckBoxNode.checked = false;
		this._labelNode.innerHTML = this._emptyMessage;

	} else if (sItemsCount > 0) {

		this._selectAllCheckBoxNode.checked = false;
		this._labelNode.innerHTML = '';

		// Allow maximum 20 items in the label for fast speed
		for ( var i = 0; i < sItemsCount && i < 20; i++) {
			this._labelNode.innerHTML += sItems[i].label;
			if (i < sItemsCount - 1 && i < 20)
				this._labelNode.innerHTML += ', ';
		}
	}

	// insert selected field ids in hidden form item
	this._selectedValuesNode.value = '';
	for ( var i = 0; i < sItemsCount; i++) {
		this._selectedValuesNode.value += sItems[i].id;
		if (i < sItemsCount - 1) {
			this._selectedValuesNode.value += ',';
		}
	}
};

// Return true if list is filtered
MSDList.prototype.filterList = function() {
	var search = this.getFilterValue().toLowerCase();

	if (search == '') {
		// show all values
		for ( var i = 0; i < this._items.length; i++) {
			this._items[i].tr.style.display = '';
		}
		return false;
	}

	for ( var i = 0; i < this._items.length; i++) {
		if (this._items[i].skey.indexOf(search) == -1) {
			this._items[i].tr.style.display = 'none';
		} else {
			this._items[i].tr.style.display = '';
		}
	}

	return true;
};
