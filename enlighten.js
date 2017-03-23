(function() {
  
  /* Define Constructor */
  this.Enlighten = function(argv) {

    if (!_isObject(argv)) { console.error('Show pass in "object" type value!'); return; }

    /* Arguments & Settings */
    this.title   = _isString(argv.title)   ? argv.title   : undefined;
    this.content = _isString(argv.content) ? argv.content : undefined;
    this.html    = _isString(argv.html)    ? argv.html    : undefined;
    
    this.headerElement = _isString(argv.headerElement) ? argv.headerElement : 'h2';

    this.showCloseButton   = _isBoolean(argv.showCloseButton)   ? argv.showCloseButton   : true;
    this.showConfirmButton = _isBoolean(argv.showConfirmButton) ? argv.showConfirmButton : true;
    this.showCancelButton  = _isBoolean(argv.showCancelButton)  ? argv.showCancelButton  : false;

    this.style = {
      width:           _isNumber(argv.width)           ? argv.width           : 500,
      height:          _isNumber(argv.height)          ? argv.height          : 300,
      backgroundColor: _isString(argv.backgroundColor) ? argv.backgroundColor : '#eee',
      borderRadius:    _isNumber(argv.borderRadius)    ? argv.borderRadius    : 10,
      padding:         _isNumber(argv.padding) || _isArray(argv.padding) ? argv.padding : [5, 20],
    }
    
    /* Input Validation */
    if (this.title === undefined) { console.error('"title" property is required!'); return; }

    
    /*
     *  Component Schema
     *
     *  - Enlighten Background
     *    - Enlighten Box
     *      - Enlighten Header
     *        - Enlighten Footer
     *      - Enlighten Body
     *      - Enlighten Footer
     */
    
    var _enlightenBackground = {
      element: 'div',
      className: 'enlighten enlighten-background',
      attributes: {
        style: _cssJSONStringify({
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          width: '100%',
          height: '100%',
          position: 'fixed',
          left: '0',
          top: '0'
        })
      },
      children: []
    };

    var _enlightenBox = {
      element: 'div',
      className: 'enlighten enlighten-box',
      attributes: {
        style: _cssJSONStringify({
          boxSizing: 'border-box',
          width: this.style.width + 'px',
          borderRadius: this.style.borderRadius + 'px',
          backgroundColor: this.style.backgroundColor,
          position: 'absolute',
          top: '50%',
          left: '50%',
          marginTop: '-' + (this.style.height / 2) + 'px',
          marginLeft: '-' + (this.style.width / 2) + 'px'
        })
      },
      children: []
    };
    _enlightenBackground.children.push(_enlightenBox);

    var _enlightenHeader = {
      element: 'div',
      className: 'enlighten enlighten-header',
      children: []
    };
    _enlightenBox.children.push(_enlightenHeader);

    var _enlightenBody = {
      element: 'div',
      className: 'enlighten enlighten-body',
      children: []
    };
    _enlightenBox.children.push(_enlightenBody);

    var _enlightenFooter = {
      element: 'div',
      className: 'enlighten enlighten-footer',
      children: []
    };
    _enlightenBox.children.push(_enlightenFooter);

    var _enlightenTitle = {
      element: this.headerElement,
      className: 'enlighten enlighten-title',
      attributes: {
        style: _cssJSONStringify({
          textAlign: 'center',
          fontFamily: "'bree serif', serif",
        })
      },
      children: [this.title]
    };
    _enlightenHeader.children.push(_enlightenTitle);

    document.body.appendChild(_jsonToHTML(_enlightenBackground));
  }

  function _isString(variable)   { return typeof variable === 'string';   }
  function _isNumber(variable)   { return typeof variable === 'number';   }
  function _isBoolean(variable)  { return typeof variable === 'boolean';  }
  function _isObject(variable)   { return typeof variable === 'object';   }
  function _isArray(variable)    { return (variable) instanceof Array;    }
  function _isFunction(variable) { return typeof variable === 'function'; }

  function _jsonToHTML(json) {
    var wrapper = document.createElement(json.element);
    if (json.className) wrapper.className = json.className;
    
    if (json.attributes && _isObject(json.attributes)) {
      for (var attribute in json.attributes) {
        if (json.attributes.hasOwnProperty(attribute)) {
          wrapper.setAttribute(attribute, json.attributes[attribute]);
        }
      }
    }

    if (json.children && _isArray(json.children) && json.children.length > 0) {
      for (var child of json.children) {
        if (_isString(child)) wrapper.innerHTML += child;
        else wrapper.append(_jsonToHTML(child));
      }
    }
    return wrapper;
  }

  function _cssJSONStringify(cssJSON) {
    var result = "";
    for (var property in cssJSON) {
      if (cssJSON.hasOwnProperty(property) && cssJSON[property]) {
        result += _camelCaseToDash(property) + ': ' + cssJSON[property] + '; ';
      }
    }
    return result;
  }

  function _camelCaseToDash(string) {
    return string.replace( /([a-z])([A-Z])/g, '$1-$2' ).toLowerCase();
  }

})();