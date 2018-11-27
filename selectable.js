(function() {
  window.addEventListener('click', function(event) {
    var klass = event.target.attr('class');
    var classes = [
      'stbl-dropdown', 'stbl-chosen-options-wrapper', 'stbl-search',
      'stbl-arrow-down', 'stbl', 'stbl-search-parent',
      'stbl-option-disable',
    ];

    if (classes.indexOf(klass) === -1) {
      hideList();
      defaultState();
    }
  });

  Node.prototype.addClass = function(klass) {
    this.classList.add(klass);
    return this;
  };

  Node.prototype.appendNode = function(child) {
    this.appendChild(child);
    return this;
  };

  Node.prototype.display = function(value) {
    this.style.display = value;
    return this;
  };

  Node.prototype.attr = function(attr, value) {
    if (value !== undefined) {
      this.setAttribute(attr, value);
      return this;
    }
    return this.getAttribute(attr);
  };

  Node.prototype.selectable = function(styles) {
    var name = this.attr('name');
    var parent = this.parentNode;
    var selectable = renderSelectable(this, styles);
    var options = Array.prototype.slice.call(this.children);

    this.display('none');
    this.addClass('stbl-dropdown');
    parent.insertBefore(selectable, this.nextSibling);

    var ulNode = this.nextElementSibling.children[1].lastElementChild.children;
    var selectedOptions = options.reduce(function(optionsObject, option) {
      if (!option.attr('selected')) return optionsObject;
      option.removeAttribute('selected');
      option.attr('selected', 'selected');
      optionsObject[option.value] = option;
      return optionsObject;
    }, {});

    Array.prototype.slice.call(ulNode).forEach(function(li) {
      if (Object.keys(selectedOptions).indexOf(li.attr('data-value')) > -1) {
        li.attr('class', 'stbl-option-disable');
        var option = selectedOptions[li.attr('data-value')];
        var optionsChosenContainer = li
          .parentElement
          .parentElement
          .parentElement
          .firstElementChild;
        handleOptionSelection(option, li, optionsChosenContainer)('loading');
      }
    });
  };

  function build(el) {
    return document.createElement(el);
  }

  function defaultState() {
    listElements = document.querySelectorAll('.stbl ul li');
    listElements.forEach(function(li) {
      li.display('block');
    })
  }

  function handleSearch(list, text) {
    if (text.trim().length === 0) {
      defaultState();
      return;
    }

    Array.prototype.slice.call(list.children).forEach(function(li) {
      if (li.innerText.toLowerCase().indexOf(text.toLowerCase()) === -1) {
        li.display('none');
      } else {
        li.display('block');
      }
    });
  }

  function clearSearch() {
    document.querySelectorAll('.stbl-search').forEach(function(input) {
      input.value = '';
    });
  }

  function hideList() {
    var lists = document.querySelectorAll('.stbl-list-container');
    lists.forEach(function each(list) {
      list.display('none');
      list.parentElement.attr('data-opened', false);
      clearSearch();
    });
  }

  function handleCloseOptionChosen(option, li) {
    return function internal(event) {
      var el = event.target;
      if (el.attr('class') === 'stbl-close-chosen-option') {
        el.parentElement.parentElement.removeChild(el.parentElement);
        option.removeAttribute('selected');
        li.classList.remove('stbl-option-disable');
      }
    }
  }

  function handleOptionSelection(option, li, optionsChosenContainer) {
    return function internal(event) {
      var optionChosen = build('span');
      var closeOptionChosen = build('span');
      var selected = option.attr('selected');

      optionChosen.innerHTML = option.innerHTML;
      closeOptionChosen.innerHTML = '&times;';
      closeOptionChosen.addClass('stbl-close-chosen-option');
      optionChosen.appendNode(closeOptionChosen);
      optionChosen.addClass('stbl-chosen-option');

      if (selected && selected === 'selected' && event !== 'loading') {
        return;
      }

      optionsChosenContainer.appendNode(optionChosen);
      optionChosen.addEventListener(
        'click', handleCloseOptionChosen(option, li)
      );
      option.attr('selected', 'selected');
    }
  }

  function handleSearchTyping(list) {
    return function internal(event) {
      var text = event.target.value;
      handleSearch(list, text);
    }
  }

  function handleSelectableClick(selectable, list, search) {
    return function internal(event) {
      var opened = selectable.attr('data-opened').toString() === 'true';
      var elementClicked = event.target;

      if (elementClicked.nodeName.toLowerCase() === 'span' ||
        elementClicked.nodeName.toLowerCase() === 'input' ||
        elementClicked.classList.value === 'stbl-search-parent') {
        return;
      }

      if (elementClicked.nodeName.toLowerCase() === 'li') {
        if (elementClicked.classList.value !== 'stbl-option-disable') {
          elementClicked.addClass('stbl-option-disable');
        } else {
          return;
        }
      }

      if (opened.toString() === 'true') {
        list.parentElement.display('none');
        selectable.attr('data-opened', false);
      } else {
        hideList();
        defaultState();
        list.parentElement.display('inline-block');
        selectable.attr('data-opened', true);
        search.focus();
      }
    }
  }

  function renderSelectable(select, styles) {
    var selectable = build('div'); // selectable component
    var arrowDown = build('div'); // arrow on selectable component
    var optionsChosenContainer = build('div'); // wrapper of chosen options
    var listContainer = build('div'); // wrapper of list of options
    var list = build('ul'); // list 
    var options = select.children; // list of options from select node
    var searchParent = build('div'); // wrapper of input for searching
    var search = build('input'); // input for searching

    optionsChosenContainer.addClass('stbl-chosen-options-wrapper');
    
    arrowDown.addClass('stbl-arrow-down');
    
    searchParent
      .addClass('stbl-search-parent')
      .appendNode(search);
    
    search
      .addClass('stbl-search')
      .addEventListener('keyup', handleSearchTyping(list));

    listContainer
      .appendNode(searchParent)
      .appendNode(list)
      .display('none')
      .addClass('stbl-list-container');

    selectable
      .attr('data-opened', false)
      .display('inline-block')
      .addClass('stbl')
      .appendNode(optionsChosenContainer)
      .appendNode(listContainer)
      .appendNode(arrowDown)
      .addEventListener(
        'click', handleSelectableClick(selectable, list, search)
      );
    // Build list with options from select element
    Array.prototype.slice.call(options).forEach(function(option) {
      var li = build('li');
      li.attr('data-value', option.attr('value'));
      li.innerHTML = option.innerHTML;
      list.appendNode(li);
      li.addEventListener(
        'click', handleOptionSelection(option, li, optionsChosenContainer)
      );
    });

    for (var key in styles) {
      selectable.style[key] = styles[key];
    }

    return selectable;
  }
})();