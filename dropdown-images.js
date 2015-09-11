angular.module('xxx', [])
.directive('ngDropdownImg', ['$timeout',
  function ($timeout) {

    return {
      restrict: 'E',
      transclude: true,
      templateUrl: 'bower_components/dropdown-images/templates/dropdown-images.html',
      scope: {
        isDisabled: '=',
        triggerChange: '=change',
        selected: '=selected',
        items: '=items'
      },

      link: function (scope, elem, attr) {
        // Dropdown filter
        scope.search = '';

        function display() {
          // Generate options
          var d = dropDownManager(scope,elem[0]);
          /**
           * This function gets executed when the user changes the selection
           * of an item on the list
           */
          scope.changeItem = function(item) {
            scope.imgSrc = item.imgSrc;
            scope.name= item.name;
            scope.hasCoinSelected = true;
            d.toggleList();

            if (typeof scope.triggerChange === 'function') {
              scope.triggerChange(item);
            }
          };

          // Should we preselect something?
          if ( attr.selected !== undefined ) {
              scope.changeItem( scope.selected );
          }

          // Toogle list of options, clear the filter when toogle
          scope.toggleList = function(){
            clearFilter();
            d.toggleList();
          };

          // Clear keypress filter
          function clearFilter(){
            scope.search    = '';
            scope.filtering = false;
          }
          /**
           * If the user press a key while the component is opened
           * let's start filtering by showing an input text to filter the list
           */
          scope.keypressFilter = function(event) {
            var char = String.fromCharCode(event.which);

            // Only for the first letter, further times user will be typing on the input
            if(scope.search === ''){
                scope.search += char;
            }
            d.filter.focus();
            d.showFilter();
          };
          // Load the component settings
          d.load();
        }

        // Display and compile the dropdown
        display();


        /**
        * Dropdown functionality, not dependent on library
        * Hoover and keypress settings, also contains the css logic
        * for toogle the list of options
        */
        function dropDownManager(scope, elem) {
          return {

            elem: elem,
            /**
            * HTML Element - Storarge for display element
            */
            display: {},
            /**
            * HTML Element - Wrapper for items list
            */
            arrow: {},
            /**
            * HTML Element - Up/down arrow
            */
            container: {},

            filter: {},

            /**
            * Store elements, bind events
            *
            * @param {object} elem Dropdown element
            */
            load: function() {
              this.display = this.elem.querySelector('.display');
              this.arrow = this.elem.querySelector('.arrow');
              this.container = this.elem.querySelector('.container');
              this.filter = this.elem.querySelector('.inputFilter');

              this.addHoverHandlers();
            },

            /**
            * Sets up the hover in and out handlers
            */
            addHoverHandlers: function() {
              var self = this;
              var timeoutId;

              function leave() {
                timeoutId = window.setTimeout(close, 500);
              }
              function enter() {
                window.clearTimeout(timeoutId);
              }
              function close() {
                self.toggleList(true);
              }

              self.display.addEventListener('mouseleave', leave);
              self.filter.addEventListener('mouseleave', leave);
              self.container.addEventListener('mouseleave', leave);
              self.display.addEventListener('mouseenter', enter);
              self.filter.addEventListener('mouseenter', enter);
              self.container.addEventListener('mouseenter', enter);
            },


          /**
          * Hide/show list
          * @param {boolean} boolean to show or close list
          */
          toggleList: function(close) {

            if (this.findClass(this.container, 'show') || close) {
              this.removeClass(this.container, 'show');
              this.removeClass(this.arrow, 'up');
              if (!this.findClass(this.arrow, 'down')) {
                this.addClass(this.arrow, 'down');
              }
              this.hideFilter();
            } else {
            //  this.setImages();
              this.addClass(this.container, 'show');
              this.removeClass(this.arrow, 'down');
              this.addClass(this.arrow, 'up');
            }
          },

          showFilter: function() {
            this.removeClass(this.filter, 'hide');
          },

          hideFilter: function() {
            this.removeClass(this.filter, 'hide');
            this.addClass(this.filter, 'hide');
          },

          /**
          * Adds a class to an element
          *
          * @param {object} elem HTML element
          * @param {string} className Class to add to element
          */
          addClass: function(elem, className) {
            elem.className = elem.className + ' ' + className;
          },
          /**
          * Removes a class to an element
          *
          * @param {object} elem HTML element
          * @param {string} className Class to remove from element
          */
          removeClass: function(elem, className) {
            var re = new RegExp('\\s*\\b' + className + '\\b');
            if ( elem.className !== undefined ){
              elem.className = elem.className.replace(re, '');
            }
          },
          /**
          * Checks to see if element has class
          *
          * @param {object} elem HTML element
          * @param {string} className Class to find
          */
          findClass: function(elem, className) {
            var re = new RegExp('\\s*\\b' + className + '\\b');
            return re.test(elem.className);
          }
        };
      }
    }
  };
}]);
