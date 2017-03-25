(function() {
  
  /* Define Constructor */
  this.Enlighten = function(argv) {
    if (!_isObject(argv)) { console.error('Show pass in "object" type value!'); return; }

    /* Arguments & Settings */
    this.bindAt    = _isString(argv.bindAt)    ? argv.bindAt    : undefined;
    this.bindEvent = _isString(argv.bindEvent) ? argv.bindEvent : 'click';
    
    // Header Part
    this.title     = _isString(argv.title)     ? argv.title     : undefined;
    this.header    = _isString(argv.header)    ? argv.header    : 'h1';

    // Body Part
    this.content   = _isString(argv.content)   ? argv.content   : undefined;
    this.html      = _isString(argv.html)      ? argv.html      : undefined;
    this.imageURL  = _isString(argv.imageURL)  ? argv.imageURL  : undefined;
    
    // Footer Part
    this.closeBtn       = _isBoolean(argv.closeBtn)       ? argv.closeBtn       : true;
    this.confirmBtn     = _isBoolean(argv.confirmBtn)     ? argv.confirmBtn     : false;
    this.cancelBtn      = _isBoolean(argv.cancelBtn)      ? argv.cancelBtn      : false;
    this.confirmBtnText = _isString(argv.confirmBtnText)  ? argv.confirmBtnText : 'Confirm';
    this.cancelBtnText  = _isString(argv.cancelBtnText)   ? argv.cancelBtnText  : 'Cancel';
    this.confirmed      = _isFunction(argv.confirmed)     ? argv.confirmed      : false;
    this.cancelled      = _isFunction(argv.cancelled)     ? argv.cancelled      : false;

    this.autoClose         = _isNumber(argv.autoClose)          ? argv.autoClose         : NaN;
    this.allowOutsideClick = _isBoolean(argv.allowOutsideClick) ? argv.allowOutsideClick : true;
    this.allowEscapeKey    = _isBoolean(argv.allowEscapeKey)    ? argv.allowEscapeKey    : true;

    /* Disable it will disable all the pseudo css class style */
    this.enableStyleElement = _isBoolean(argv.enableStyleElement) ? argv.enableStyleElement : true;

    this.style = {
      width:             _isNumber(argv.width)             ? argv.width             : 500,
      height:            _isNumber(argv.height)            ? argv.height            : 300,
      titleFont:         _isString(argv.titleFont)         ? argv.titleFont         : 'Helvetica, serif',
      contentFont:       _isString(argv.contentFont)       ? argv.contentFont       : 'Times New Roman, serif',
      contentAlign:      _isString(argv.contentAlign)      ? argv.contentAlign      : 'center',
      imageWidth:        _isNumber(argv.imageWidth)        ? argv.imageWidth        : '100%',
      imageHeight:       _isNumber(argv.imageHeight)       ? argv.imageHeight       : 'auto',
      borderRadius:      _isNumber(argv.borderRadius)      ? argv.borderRadius      : 10,
      backgroundColor:   _isString(argv.backgroundColor)   ? argv.backgroundColor   : '#eee',
      animationType:     _isString(argv.animationType)     ? argv.animationType     : 'bounceIn',
      animationDuration: _isNumber(argv.animationDuration) ? argv.animationDuration : 0.5
    };

    /* Post Default Setting Modification */
    /* - Set only image height then image width set to "auto" */
    if (argv.imageURL && !argv.imageWidth && argv.imageHeight) { this.imageWidth = 'auto'; }

    /* Enlighten Constants */
    this.ID = _randomString(10);
    this.enlighten = true;
    this.mode = this.bindAt ? 'bind' : 'call';
    
    /* Input Validations */
    /* - Bind mode should have element to bind */
    if (this.mode === 'bind' && !document.getElementById(this.bindAt)) { console.error('cannot locate and bind at element where element ID is "' + this.bindAt + '"'); return; }
    
    /* - Title property is globally required */
    if (argv.title  === undefined) { console.error('"title" property is required!');  return; }
    
    /* - Warning: content will override html property if content and html specified in the same time */
    if (argv.content && argv.html) { console.warn('"content" property will override "html" property if both specified at the same time'); }

    /* - Warning: value of imageWidth and imageHeight are useless since imageURL is not set */
    if (!argv.imageURL && (argv.imageWidth || argv.imageHeight)) { console.warn('"imageWidth" and "imageHeight" properties are useless since no specification of "imageURL" property') }

    /*
     *  Enlighten Component Schema
     *
     *  - Root
     *    - Box
     *      - ImgWrapper
     *        - Img
     *      - Header
     *        - CloseBtn
     *        - Title
     *      - Body
     *        - Content | HTML
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
          display: 'none',
          animation: { type: 'fadeIn', duration: 0.3 }
        })
      },
      children: []
    };

    var _enlightenBox = {
      element: 'div',
      className: 'enlighten enlighten-box',
      attributes: {
        id: 'enlighten-box-' + this.ID,
        style: _cssJSONStringify({
          width: this.style.width + 'px',
          borderRadius: this.style.borderRadius + 'px',
          backgroundColor: this.style.backgroundColor,
          animation: { type: this.style.animationType, duration: this.style.animationDuration }
        })
      },
      children: []
    };
    _enlightenRoot.children.push(_enlightenBox);

    if (this.imageURL) {
      var _enlightenImgWrapper = {
        element: 'div',
        className: 'enlighten enlighten-img-wrapper',
        children: []
      }
      _enlightenBox.children.push(_enlightenImgWrapper);

      var _enlightenImg = {
        element: 'img',
        className: 'enlighten enlighten-img',
        attributes: {
          id: 'enlighten-img-' + this.ID,
          src: this.imageURL,
          style: _cssJSONStringify({
            width: _isNumber(this.style.imageWidth) ? this.style.imageWidth + 'px' : this.style.imageWidth,
            height: _isNumber(this.style.imageHeight) ? this.style.imageHeight + 'px' : this.style.imageHeight,

          })
        }
      }
      _enlightenImgWrapper.children.push(_enlightenImg);
    }

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
          fontFamily: this.titleFont,
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
    
      if (this.content) {
        var _enlightenContent = {
          element: 'p',
          className: 'enlighten enlighten-content',
          attributes: {
            style: _cssJSONStringify({
              textAlign: this.style.contentAlign,
              fontFamily: this.style.contentFont
            })
          },
          children: [this.content]
        };
        _enlightenBody.children.push(_enlightenContent);
      } else if (this.html) {
        var _enlightenHTMLContent = {
          element: 'div',
          className: 'enlighten enlighten-html-content',
          html: this.html
        };
        _enlightenBody.children.push(_enlightenHTMLContent);
      }
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
    var $boxElement = document.getElementById('enlighten-box-' + this.ID);
    var $imgElement = document.getElementById('enlighten-img-' + this.ID);
    var $closeBtnElement = document.getElementById('enlighten-close-btn-' + this.ID);
    var $confirmBtnElement = document.getElementById('enlighten-confirm-btn-' + this.ID);
    var $cancelBtnElement = document.getElementById('enlighten-cancel-btn-' + this.ID);
    var $bindedElement = document.getElementById(this.bindAt);

    /*------------------------------- Afterword CSS Rectification -------------------------------------*/
    
    var _reactifyCSS = function() { 
      /* When imageURL presents, if image width is too big, then extend box */
      if (argv.imageURL && $imgElement.offsetWidth > $boxElement.offsetWidth) {
        $boxElement.style.width = $imgElement.offsetWidth + 'px';
      }
      
      /* Box Position Expect to be Centered Vertically & Horizontally */
      $boxElement.style.marginTop = -$boxElement.offsetHeight / 2 + 'px';
      $boxElement.style.marginLeft = -$boxElement.offsetWidth / 2 + 'px';
      
      /* Button Position Absolute Well Formatting */
      if (this.confirmBtn && this.cancelBtn) {
        var totalWidth = $confirmBtnElement.offsetWidth + $cancelBtnElement.offsetWidth;
        $confirmBtnElement.style.marginLeft = -totalWidth / 2 - 10 + 'px';
        $cancelBtnElement.style.marginLeft = -totalWidth / 2 + $confirmBtnElement.offsetWidth + 'px';
      } else if (this.confirmBtn) {
        $confirmBtnElement.style.marginLeft = -$confirmBtnElement.offsetWidth / 2 + 'px';
      } else if (this.cancelBtn) {
        $cancelBtnElement.style.marginLeft = -$cancelBtnElement.offsetWidth / 2 + 'px';
      }
    }

    /* If imageURL presents, check loaded before pop out when in call mode */
    if (this.mode === 'call' && this.imageURL) {
      $imgElement.addEventListener('load', function(event) {
        $rootElement.style.display = 'block';
        _reactifyCSS();
      });
    } else if (this.mode != 'bind') $rootElement.style.display = 'block';

    /*-------------------------------------- Events Setting -------------------------------------------*/

    var _setupCommonEvents = function() {  
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
      _setupCommonEvents();

      /* Binded Element Event */
      var _bindedElementEvent = function(event) {
        event.preventDefault();
        this.enlighten = true;
        $rootElement.style.display = 'block';
        _reactifyCSS();

        /* Auto Closeing Enlighten Box */
        if (!isNaN(this.autoClose)) {
          setTimeout(function() {
            if (this.enlighten) {
              this.enlighten = false;
              _displayNode($rootElement, 'none');  
            }
          }.bind(this), this.autoClose);
        }

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
      _setupCommonEvents();

      /* Auto Closing the Enlighten Box */
      if (!isNaN(this.autoClose)) {
        setTimeout(function() {
          if (this.enlighten) {
            this.enlighten = false;
            _removeNode($rootElement);
          }
        }.bind(this), this.autoClose);
      }

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
    } else if (json.html) wrapper.innerHTML = json.html;
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