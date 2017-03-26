(function() {
  
  /* Define Constructor */
  this.Enlighten = function(argv) {
    if (!_isObject(argv)) { console.error('EnlightenJS should pass in an "object" type value'); return; }

    /* Arguments & Settings */
    // Type of Enlighten Box (Planned Implementation)
    // - default : Plain default enlighten box
    // - primary : Blue theme
    // - success : Green theme
    // - info    : Light Blue theme
    // - warning : Yellow theme
    // - danger  : Red theme
    // this.type      = _isString(argv.type)      ? argv.type      : 'default';
    
    // Header Part
    this.title     = _isString(argv.title)     ? argv.title     : undefined;
    this.header    = _isString(argv.header)    ? argv.header    : 'h1';

    // Body Part
    this.content   = _isString(argv.content)   ? argv.content   : undefined;
    this.html      = _isString(argv.html)      ? argv.html      : undefined;
    this.form      = _isObject(argv.form)      ? argv.form      : undefined;
    this.imageURL  = _isString(argv.imageURL)  ? argv.imageURL  : undefined;
    
    /* - Data structure of form property
      Object::form - String::action
                   - String::method
                   - String::name
                   - String::enctype
                   - Array::inputs - EACH -> String::type (default: "text")
                                          -> String::labelName
                                          -> String::name
                                          -> String::value
                                          -> String::placeholder
                                          -> Object::attributes (such as checked)
      Input types planned to support :
        text | textarea | email | password | checkbox | radio
    */

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
    // this.enableStyleElement = _isBoolean(argv.enableStyleElement) ? argv.enableStyleElement : true;

    this.style = {
      width:             _isNumber(argv.width)             ? argv.width             : 500,
      height:            _isNumber(argv.height)            ? argv.height            : 300,
      titleFont:         _isString(argv.titleFont)         ? argv.titleFont         : 'Righteous, cursive',
      bodyFont:          _isString(argv.bodyFont)          ? argv.bodyFont          : 'Quicksand, serif',
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

    /* - When form property is specified, enlarge the width of the Enlighten box when width property is not specified */
    if (!argv.content && !argv.html && argv.form && !argv.width) { this.style.width = 700; }

    /* Enlighten Constants */
    this.ID = _randomString(10);
    this.enlighten = true;
    
    /* Input Validations */
    
    /* - Title property is globally required */
    if (argv.title  === undefined) { console.error('"title" property is required!');  return; }
    
    /* - Warning: Hierarchy of the body part : content > html > form */
    if (argv.content && argv.html) { console.warn('"content" property will override "html" property if both specified at the same time'); }
    if (argv.content && argv.form) { console.warn('"content" property will override "form" property if both specified at the same time'); }
    if (argv.html && argv.form)    { console.warn('"html" property will override "form" property if both specified at the same time');    }

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
     *        - Content | HTML | Form
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
        style: _cssJSONStringify({ fontFamily: this.style.titleFont })
      },
      children: [this.title]
    };
    _enlightenHeader.children.push(_enlightenTitle);

    /* Body section include Content, HTML or Form */
    if (this.content || this.html || this.form) {
      var _enlightenBody = {
        element: 'div',
        className: 'enlighten enlighten-body',
        attributes: { style: _cssJSONStringify({ fontFamily: this.style.bodyFont }) },
        children: []
      };
      _enlightenBox.children.push(_enlightenBody);
    
      /* Content | HTML | Form */
      if (this.content) {
        var _enlightenContent = {
          element: 'p',
          className: 'enlighten enlighten-content',
          attributes: {
            style: _cssJSONStringify({ textAlign: this.style.contentAlign })
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
      } else if (this.form) {
        var _enlightenForm = {
          element: 'form',
          className: 'enlighten enlighten-form',
          attributes: {
            method: _isString(this.form.method) ? this.form.method : 'post',
            action: _isString(this.form.action) ? this.form.action : '' ,
            name: _isString(this.form.name) ? this.form.name : '',
            enctype: _isString(this.form.enctype) ? this.form.enctype : 'application/x-www-form-urlencoded'
          },
          children: _generateFormElements(this.form.inputs)
        };
        _enlightenBody.children.push(_enlightenForm);
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

    /* Render Enlighten Root */
    document.body.appendChild(_jsonToHTML(_enlightenRoot));

    var $rootElement = document.getElementById('enlighten-root-' + this.ID);
    var $boxElement = document.getElementById('enlighten-box-' + this.ID);
    var $imgElement = document.getElementById('enlighten-img-' + this.ID);
    var $closeBtnElement = document.getElementById('enlighten-close-btn-' + this.ID);
    var $confirmBtnElement = document.getElementById('enlighten-confirm-btn-' + this.ID);
    var $cancelBtnElement = document.getElementById('enlighten-cancel-btn-' + this.ID);
    
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

    /* If imageURL presents, check loaded before pop out */
    if (this.imageURL) {
      $imgElement.addEventListener('load', function(event) {
        $rootElement.style.display = 'block';
        _reactifyCSS();
      });
    } else $rootElement.style.display = 'block';

    /*-------------------------------------- Events Setting -------------------------------------------*/

    var _setupEvents = function() {  
      /* Close Button Event */
      if ($closeBtnElement && this.closeBtn) {
        var _closeBtnEvent = function(event) {
          event.preventDefault();
          _removeNode($rootElement);
          this.enlighten = false;
        };
        $closeBtnElement.addEventListener('click', _closeBtnEvent.bind(this));
      }

      /* Close Enlighten Box Outside */
      if ($rootElement && this.allowOutsideClick) {
        var _allowOutsideClickEvent = function(event) {
          if (event.target.id === $rootElement.id && this.enlighten) {
            _removeNode($rootElement);
            this.enlighten = false;
          }
        };
        $rootElement.addEventListener('click', _allowOutsideClickEvent.bind(this));
      }
      
      /* Close Enlighten Box via Escape Key */
      if (this.allowEscapeKey) {
        var _allowEscapeKeyEvent = function(event) {
          if (event.key === 'Escape' && $rootElement && this.enlighten) {
            _removeNode($rootElement);
            this.enlighten = false;
          }
        };
        document.body.addEventListener('keyup', _allowEscapeKeyEvent.bind(this));
      }
    }.bind(this);

    /* Return Promise object when confirm or cancel button triggered in calling mode */
    if (this.confirmBtn || this.cancelBtn) {
      _reactifyCSS();
      _setupEvents();

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
  function _queryNode(selector) { return document.querySelectorAll(selector); }

  function _generateFormElements(inputArray) {
    var _jsonArray = [];
    var _inputCount = 0;
    for (var input of inputArray) {
      _inputCount++;

      var _labelElement = {
        element: 'label',
        className: 'enlighten enlighten-label',
        attributes: {},
        children: [{
          element: 'p',
          className: 'enlighten enlighten-label-title',
          children: [input.labelName]
        }]
      };
      
      var _inputElement = {
        element: 'input',
        className: 'enlighten enlighten-input',
        attributes: {
          name: input.name,
          value: input.value ? input.value : '',
          type: input.type ? input.type : 'text',
          autofocus: _inputCount === 1
        }
      }

      switch(_inputElement.attributes.type) {
        case 'text':
        case 'email':
        case 'password':
          if (_isString(input.placeholder)) { _inputElement.attributes.placeholder = input.placeholder; }
          break;
        
        case 'textarea':
          if (_isString(input.placeholder)) { _inputElement.attributes.placeholder = input.placeholder; }
          if (_isNumber(input.rows) && input.rows > 0) { _inputElement.attributes.rows = input.rows; }
          _inputElement.element = 'textarea';
          break;

        case 'switch':
          var _switchElement = {
            element: 'div',
            className: 'enlighten enlighten-switch-box',
            children: [{
              element: 'div',
              className: 'enlighten enlighten-switch',
            }]
          }
          
          _inputElement.attributes.type  = 'checkbox';
          _inputElement.attributes.style = _cssJSONStringify({
            display: 'none',
            position: 'absolute',
            left: '-1000px'
          });
          _labelElement.attributes.style = _cssJSONStringify({
            width: '80px'
          });
          break;

        case 'checkbox':
        case 'radio':
          if (_isObject(input.values) && input.values.length > 0) {
            var _groupElement = {
              element: 'div',
              className: 'enlighten enlighten-' + input.type + '-group',
              children: [{
                element: 'p',
                className: 'enlighten enlighten-label-title',
                children: [input.labelName]
              }]
            }

            for (var value of input.values) {
              if (_isString(value)) {
                var _inputElement = {
                  element: 'input',
                  className: 'enlighten enlighten-' + input.type,
                  attributes: {
                    type: input.type,
                    name: input.name,
                    value: value,
                    id: 'enlighten-' + input.type + '-' + value
                  }
                };
                var _labelElement = {
                  element: 'label',
                  className: 'enlighten enlighten-' + input.type + '-label',
                  attributes: { for: _inputElement.attributes.id },
                  children: [value]
                };
                _groupElement.children.push(_inputElement);
                _groupElement.children.push(_labelElement);
              } else console.warn('value of the ' + input.type + ' should be type of "string" but not "' + (typeof value) + '"')
            }
            _jsonArray.push(_groupElement);
          } else {
            console.error('"' + input.type + '" type input should specify "values" property in order to generate ' + input.type );
            continue;
          }
          break;

        default:
          console.error('there is no support for "' + input.type + '" type of input')
      }

      /* Exclude from type of 'checkbox' | 'radio' */
      if (input.type !== 'checkbox' && input.type !== 'radio') {
        _labelElement.children.push(_inputElement);
        
        /* When type is switch then push in the switch style elements */
        if (input.type === 'switch') { _labelElement.children.push(_switchElement); }
        
        _jsonArray.push(_labelElement);
      }
    }

    return _jsonArray;
  }

})();