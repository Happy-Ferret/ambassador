/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

function CListBox ()
{

    this.listContainer = document.createElement ("box");
    this.listContainer.setAttribute ("class", "list");
    this.listContainer.setAttribute ("align", "vertical");

}

CListBox.prototype.clear =
function lbox_clear (e)
{
    var obj = this.listContainer.firstChild;

    while (obj)
    {
        this.listContainer.removeChild (obj);
        obj = obj.nextSibling;    
    }    

}

CListBox.prototype.clickHandler =
function lbox_chandler (e)
{
    var lm = this.listManager;
    
    e.target = this;

    if (lm && typeof lm.onClick == "function")
        lm.onClick ({realTarget: this, event: e});
    
}   

CListBox.prototype.onClick =
function lbox_chandler (e)
{ 

    /* Check for the button number first */
    /* FIXME: are there constants for this stuff? */
    if (e.event.button == 2)
    {
        return;
    }

    /* 
     * If the ctrlKey is _not_ set, unselect all currently 
     * selected items 
     */    

    if (!e.event.ctrlKey) 
    {
        this.enumerateElements(this._unselectCallback, e.realTarget);
    }

    /* Check to see whether the item is currently selected */
    var isSelected = e.realTarget.getAttribute("selected");

    /* toggle the value */
    if ("true" == isSelected)
        e.realTarget.setAttribute("selected", "false");    
    else
        e.realTarget.setAttribute("selected", "true");
    
}

CListBox.prototype._unselectCallback =
function (element, ndx, realTarget)
{
    if (element != realTarget)
            element.setAttribute("selected", "false");    
}

CListBox.prototype.add =
function lbox_add (stuff, tag)
{
    /* NOTE: JG using a div here makes the item span the full 
       length and looks better when selected */
    
    var option = document.createElement ("box");
    option.setAttribute ("class", "list-option");
    option.setAttribute ("align", "horizontal");
    option.appendChild (stuff);
    option.onclick = this.clickHandler;
    option.listManager = this;
    option.tag = tag;
    this.listContainer.appendChild (option);
    
    return true;    
}

CListBox.prototype.prepend =
function lbox_prepend (stuff, oldstuff, tag)
{
    
    if (!this.listContainer.firstChild)
        return this.add (stuff, tag);

    var nextOption = this._findOption (oldstuff);
    if (!nextOption)
        return false;
    
    var option = document.createElement ("box");
    option.setAttribute ("align", "horizontal");

    option.appendChild (stuff);
    option.onclick = this.clickHandler;
    option.listManager = this;
    option.tag = tag;
    this.listContainer.insertBefore (option, nextOption);
    
}

CListBox.prototype.insert =
function lbox_Insert (stuff, tag)
{
    this.prepend (stuff, this.listContainer.firstChild, tag);
}

CListBox.prototype.remove =
function lbox_remove (stuff)
{
    var option = this._findOption (stuff);

    if (option)
        this.listContainer.removeChild (option);

    return;
}

CListBox.prototype._findOption =
function lbox_remove (stuff)
{
    var option = this.listContainer.firstChild;

    while (option)
    {
        if (option.firstChild == stuff)
            return option;
        option = option.nextSibling;
    }

    return;
}

CListBox.prototype.enumerateElements =
/* NOTE: JG: added data param so arbitrary data can be passed. */
function lbox_enum (callback, data)
{
    var i = 0;
    var current = this.listContainer.firstChild;
    
    while (current)
    {
        callback (current, i++, data);
        current = current.nextSibling;
    }
    
}

/**
 * Using enumerateElements, this is used just to fill an array
 * with selected nick names.
 * @returns an array of selected nicknames
 */
CListBox.prototype.getSelectedItems =
function lbox_getselecteditems () 
{
    var ary = [];

    this.enumerateElements(this.selectedItemCallback, ary);

    return ary;
}

/**
 * used to build the array of values returned by getSelectedItems.
 */
CListBox.prototype.selectedItemCallback =
function (item, idx, data) 
{
    return item;
}


