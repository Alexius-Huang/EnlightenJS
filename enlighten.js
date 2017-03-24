(function() {
  
  /* Define Constructor */
  this.Enlighten = function(argv) {
    if (!_isObject(argv)) { console.error('Show pass in "object" type value!'); return; }

    /* Arguments & Settings */
    this.bindAt    = _isString(argv.bindAt)    ? argv.bindAt    : undefined;
    this.bindEvent = _isString(argv.bindEvent) ? argv.bindEvent : 'click';
    
    // Header Part
    this.title     = _isString(argv.title)     ? argv.title     : undefined;
    this.header    = _isString(argv.header)    ? argv.header    : 'h2';

    // Body Part
    this.content   = _isString(argv.content)   ? argv.content   : undefined;
    this.html      = _isString(argv.html)      ? argv.html      : undefined;
    this.imageURL  = _isString(argv.imageURL)  ? argv.imageURL  : undefined;
    this.imageSize = _isString(argv.imageSize) ? argv.imageSize : '300x300';
    
    // Footer Part
    this.closeBtn       = _isBoolean(argv.closeBtn)       ? argv.closeBtn       : true;
    this.confirmBtn     = _isBoolean(argv.confirmBtn)     ? argv.confirmBtn     : false;
    this.cancelBtn      = _isBoolean(argv.cancelBtn)      ? argv.cancelBtn      : false;
    this.confirmBtnText = _isString(argv.confirmBtnText)  ? argv.confirmBtnText : 'Confirm';
    this.cancelBtnText  = _isString(argv.cancelBtnText)   ? argv.cancelBtnText  : 'Cancel';
    this.confirmed      = _isFunction(argv.confirmed)     ? argv.confirmed      : false;
    this.cancelled      = _isFunction(argv.cancelled)     ? argv.cancelled      : false;

    this.allowOutsideClick = _isBoolean(argv.allowOutsideClick) ? argv.allowOutsideClick : true;
    this.allowEscapeKey    = _isBoolean(argv.allowEscapeKey)    ? argv.allowEscapeKey    : true;

    /* Disable it will disable all the pseudo css class style */
    this.enableStyleElement = _isBoolean(argv.enableStyleElement) ? argv.enableStyleElement : true;

    this.style = {
      width:             _isNumber(argv.width)             ? argv.width             : 500,
      height:            _isNumber(argv.height)            ? argv.height            : 300,
      padding:           _isNumber(argv.padding) || _isArray(argv.padding) ? argv.padding : [5, 20],
      headerFont:        _isString(argv.headerFont)        ? argv.headerFont        : null,
      contentFont:       _isString(argv.contentFont)       ? argv.contentFont       : null,
      contentAlign:      _isString(argv.contentAlign)      ? argv.contentAlign      : 'center',
      borderRadius:      _isNumber(argv.borderRadius)      ? argv.borderRadius      : 10,
      backgroundColor:   _isString(argv.backgroundColor)   ? argv.backgroundColor   : '#eee',
      animationType:     _isString(argv.animationType)     ? argv.animationType     : 'bounceIn',
      animationDuration: _isNumber(argv.animationDuration) ? argv.animationDuration : 0.5
    };

    this.ID = _randomString(10);
    this.enlighten = true;
    this.mode = this.bindAt ? 'bind' : 'call';
    
    /* Input Validation */
    if (this.mode === 'bind' && !document.getElementById(this.bindAt)) { console.error('cannot locate and bind at element where element ID is "' + this.bindAt + '"'); return; }
    if (this.title  === undefined) { console.error('"title" property is required!');  return; }
    
    /*
     *  Enlighten Component Schema
     *
     *  - Root
     *    - Box
     *      - Header
     *        - CloseBtn
     *        - Title
     *      - Body
     *      - Footer
     *        - ConfirmBtn
     *        - CancelBtn
     */
    
    var _enlightenRoot = {
      element: 'div',
      className: 'enlighten enlighten-root',
      attributes: {
        id: 'enlighten-root-' + this.ID,
        style: _cssJSONStringify({
          display: this.mode === 'bind' ? 'none' : 'block',
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
          width: this.style.width + 'px',
          borderRadius: this.style.borderRadius + 'px',
          backgroundColor: this.style.backgroundColor,
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

    if (this.closeBtn) {
      var _enlightenCloseBtn = {
        element: 'a',
        className: 'enlighten enlighten-close-btn',
        attributes: {
          id: 'enlighten-close-btn-' + this.ID,
          href: '#',
          style: _cssJSONStringify({
            top: '-' + this.style.borderRadius + 'px',
            right: '-' + this.style.borderRadius + 'px'
          })
        },
        children: ['&times']
      }
      _enlightenHeader.children.push(_enlightenCloseBtn);
    }
    
    var _enlightenTitle = {
      element: this.header,
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

    if (this.content || this.html) {
      var _enlightenBody = {
        element: 'div',
        className: 'enlighten enlighten-body',
        children: []
      };
      _enlightenBox.children.push(_enlightenBody);
    }
    
    if (this.confirmBtn || this.cancelBtn) {
      var _enlightenFooter = {
        element: 'div',
        className: 'enlighten enlighten-footer',
        children: []
      };
      _enlightenBox.children.push(_enlightenFooter);

      if (this.confirmBtn) {
        var _enlightenConfirmBtn = {
          element: 'button',
          className: 'enlighten enlighten-confirm-btn',
          attributes: {
            id: 'enlighten-confirm-btn-' + this.ID,
          },
          children: [this.confirmBtnText]
        };
        _enlightenFooter.children.push(_enlightenConfirmBtn);
      }

      if (this.cancelBtn) {
        var _enlightenCancelBtn = {
          element: 'button',
          className: 'enlighten enlighten-cancel-btn',
          attributes: {
            id: 'enlighten-cancel-btn-' + this.ID
          },
          children: [this.cancelBtnText]
        };
        _enlightenFooter.children.push(_enlightenCancelBtn);
      }

      _enlightenFooter.children.push({
        element: 'div',
        className: 'enlighten-clear'
      });
    }

    /* Render Root unless The Enlighten Box Binded to DOM Element */
    document.body.appendChild(_jsonToHTML(_enlightenRoot));
    if (this.mode === 'bind') this.enlighten = false;

    var $rootElement = document.getElementById('enlighten-root-' + this.ID);
    var $closeBtnElement = document.getElementById('enlighten-close-btn-' + this.ID);
    var $confirmBtnElement = document.getElementById('enlighten-confirm-btn-' + this.ID);
    var $cancelBtnElement = document.getElementById('enlighten-cancel-btn-' + this.ID);
    var $bindedElement = document.getElementById(this.bindAt);

    /*------------------------------- Afterword CSS Rectification -------------------------------------*/
    
    var _reactifyCSS = function() {
      /* Button Position Absolute Well Formatting */
      if (this.confirmBtn && this.cancelBtn) {
        $confirmBtnElement.style.marginLeft = -$confirmBtnElement.offsetWidth - 10 + 'px';
        $cancelBtnElement.style.marginLeft = '10px';
      } else if (this.confirmBtn) {
        $confirmBtnElement.style.marginLeft = -$confirmBtnElement.offsetWidth / 2 + 'px';
      } else if (this.cancelBtn) {
        $cancelBtnElement.style.marginLeft = -$cancelBtnElement.offsetWidth / 2 + 'px';
      }
    }

    /*-------------------------------------- Events Setting -------------------------------------------*/

    var _setupEvents = function() {  
      /* Close Button Event */
      if ($closeBtnElement && this.closeBtn) {
        var _closeBtnEvent = function(event) {
          event.preventDefault();
          this.mode === 'call' ? _removeNode($rootElement) : _displayNode($rootElement, 'none');
          this.enlighten = false;
        };
        $closeBtnElement.addEventListener('click', _closeBtnEvent.bind(this));
      }

      /* Close Enlighten Box Outside */
      if ($rootElement && this.allowOutsideClick) {
        var _allowOutsideClickEvent = function(event) {
          if (event.target.id === $rootElement.id && this.enlighten) {
            this.mode === 'call' ? _removeNode($rootElement) : _displayNode($rootElement, 'none');
            this.enlighten = false;
          }
        };
        $rootElement.addEventListener('click', _allowOutsideClickEvent.bind(this));
      }
      
      /* Close Enlighten Box via Escape Key */
      if (this.allowEscapeKey) {
        var _allowEscapeKeyEvent = function(event) {
          if (event.key === 'Escape' && $rootElement && this.enlighten) {
            this.mode === 'call' ? _removeNode($rootElement) : _displayNode($rootElement, 'none');
            this.enlighten = false;
          }
        };
        document.body.addEventListener('keyup', _allowEscapeKeyEvent.bind(this));
      }
    }.bind(this);

    /* Binded Mode */
    if (this.mode === 'bind' && $bindedElement) {
      _setupEvents();
      var _bindedElementEvent = function(event) {
        event.preventDefault();
        this.enlighten = true;
        $rootElement.style.display = 'block';
        _reactifyCSS();
      };
      $bindedElement.addEventListener('click', _bindedElementEvent.bind(this));

      /* Confirm Button on Click Event */
      if (this.confirmBtn) {
        var _confirmBtnOnClickEvent = function(event) {
          event.preventDefault();
          if (this.enlighten) {
            _displayNode($rootElement, 'none');
            this.enlighten = false;
            if (this.confirmed) {
              this.confirmed.call();
            } else console.warn('"confirmed" property didn\'t setup properly');
          }
        }
        $confirmBtnElement.addEventListener('click', _confirmBtnOnClickEvent.bind(this));
      }
      
      /* Cancel Button on Click Event */
      if (this.cancelBtn) {
        var _cancelBtnOnClickEvent = function(event) {
          event.preventDefault();
          if (this.enlighten) {
            _displayNode($rootElement, 'none');
            this.enlighten = false;
            if (this.cancelled) {
              this.cancelled.call();
            } else console.warn('"cancelled" property didn\'t setup properly')
          }
        }
        $cancelBtnElement.addEventListener('click', _cancelBtnOnClickEvent.bind(this));
      }
    }

    /* Return Promise object when confirm or cancel button triggered in calling mode */
    if (this.mode === 'call' && (this.confirmBtn || this.cancelBtn)) {
      _reactifyCSS();
      return new Promise(function(resolve, reject) {
        /* Confirm Button on Click Event */
        if (this.confirmBtn && this.enlighten) {
          var _confirmBtnOnClickEvent = function(event) {
            event.preventDefault();
            _removeNode($rootElement);
            resolve('confirmed');
          }
          $confirmBtnElement.addEventListener('click', _confirmBtnOnClickEvent.bind(this));
        }
        
        /* Cancel Button on Click Event */
        if (this.cancelBtn && this.enlighten) {
          var _cancelBtnOnClickEvent = function(event) {
            event.preventDefault();
            _removeNode($rootElement);
            reject('rejected');
          }
          $cancelBtnElement.addEventListener('click', _cancelBtnOnClickEvent.bind(this));
        }
      }.bind(this));
    }
  }

  /*--------------------------- Helper Functions ----------------------------*/

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

  function _removeNode(node) { if (node && node instanceof Node) node.parentElement.removeChild(node); }
  function _displayNode(node, mode) { if (node && node instanceof Node) node.style.display = mode; }

})();