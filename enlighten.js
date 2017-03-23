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
      width:             _isNumber(argv.width)             ? argv.width             : 500,
      height:            _isNumber(argv.height)            ? argv.height            : 300,
      backgroundColor:   _isString(argv.backgroundColor)   ? argv.backgroundColor   : '#eee',
      borderRadius:      _isNumber(argv.borderRadius)      ? argv.borderRadius      : 10,
      padding:           _isNumber(argv.padding) || _isArray(argv.padding) ? argv.padding : [5, 20],
      animationType:     _isString(argv.animationType)     ? argv.animationType     : 'bounceIn',
      animationDuration: _isNumber(argv.animationDuration) ? argv.animationDuration : 0.5
    };

    this.ID = _randomString(10);
    
    /* Input Validation */
    if (this.title === undefined) { console.error('"title" property is required!'); return; }
    
    /*
     *  Enlighten Component Schema
     *
     *  - Root
     *    - Box
     *      - Header
     *        - CloseButton
     *        - Title
     *      - Body
     *      - Footer
     */
    
    var _enlightenRoot = {
      element: 'div',
      className: 'enlighten enlighten-root',
      attributes: {
        id: 'enlighten-root-' + this.ID,
        style: _cssJSONStringify({
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          width: '100%',
          height: '100%',
          position: 'fixed',
          left: '0',
          top: '0',
          animation: { type: 'fadeIn', duration: 0.3 }
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
          marginLeft: '-' + (this.style.width / 2) + 'px',
          animation: { type: this.style.animationType, duration: this.style.animationDuration }
        })
      },
      children: []
    };
    _enlightenRoot.children.push(_enlightenBox);

    var _enlightenHeader = {
      element: 'div',
      className: 'enlighten enlighten-header',
      children: []
    };
    _enlightenBox.children.push(_enlightenHeader);

    var _enlightenCloseButton = {
      element: 'a',
      className: 'enlighten enlighten-close-btn',
      attributes: {
        id: 'enlighten-close-btn-' + this.ID,
        href: '#',
        style: _cssJSONStringify({
          display: 'block',
          width: '20px',
          height: '20px',
          fontSize: '20px',
          lineHeight: '20px',
          textAlign: 'center',
          textDecoration: 'none',
          color: 'white',
          backgroundColor: '#333',
          padding: '5px',
          borderRadius: '50%',
          position: 'absolute',
          top: '-' + this.style.borderRadius + 'px',
          right: '-' + this.style.borderRadius + 'px'
        })
      },
      children: ['&times']
    }
    _enlightenHeader.children.push(_enlightenCloseButton);

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

    /* Render Root */
    document.body.appendChild(_jsonToHTML(_enlightenRoot));

    /* Event Settings */
    
    /* Close Button Event */
    var $rootElement = document.getElementById('enlighten-root-' + this.ID);
    var $closeButtonElement = document.getElementById('enlighten-close-btn-' + this.ID);
    $closeButtonElement.addEventListener('click', function(event) {
      event.preventDefault();
      /* Pull out the enlighten root */
      $rootElement.parentNode.removeChild($rootElement);
    });
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
        switch(property) {
          case 'animation':
            var properties = _cssAnimationProperties(cssJSON.animation.type, cssJSON.animation.duration);
            for (var p in properties) {
              result += p + ': ' + properties[p] + '; ';
            }
            break;
          default:
            result += _camelCaseToDash(property) + ': ' + cssJSON[property] + '; ';
            break;
        }
      }
    }
    return result;
  }

  function _cssAnimationProperties(animationType, duration) {
    return {
      '-webkit-animation': animationType + ' ' + duration + 's', /* Safari 4+ */
      '-moz-animation':    animationType + ' ' + duration + 's', /* Fx 5+ */
      '-o-animation':      animationType + ' ' + duration + 's', /* Opera 12+ */
      'animation':         animationType + ' ' + duration + 's', /* IE 10+, Fx 29+ */
    };
  }

  function _camelCaseToDash(string) {
    return string.replace( /([a-z])([A-Z])/g, '$1-$2' ).toLowerCase();
  }
  
  function _randomString(length, chars) {
    var result = '';
    chars = chars && _isString(chars) ? chars : '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'; 
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  }

})();