var View            = require('view');
var ProgressBar     = require('progress-bar');
var NavigationView  = require('nib-components-navigation');

module.exports = View.extend({

  elements: {
    '.js-nav-links':      'linksEl',
    '.js-nav-progress':   'progressEl'
  },

  /**
   * Initialise the view
   */
  init: function() {
    var self = this;

    this.links = new NavigationView({
      el: this.linksEl
    });

    this.progress = new ProgressBar(this.progressEl);

    this.links.on('navigate', function(name) {
      self.emit('navigate', name);
    });

  },

  /**
   * Set the currently selected navigation item
   * @param   {string}    name
   * @returns {View}
   */
  setCurrent: function(name) {

    //update the progress bar value to cover the current nav item - yuck co-ordinate calculation stuff
    var currentNavEl = this.links.findByPage(name);
    var max     = this.links.el.offsetWidth;
    var value   = currentNavEl ? currentNavEl.offsetLeft+currentNavEl.offsetWidth : max; //if it is a page without a nav link then assume its after .: 100%

    //if we're on the last navigation item, then we should show 100% (otherwise it probably won't display at 100% because of the spacing around the last navigation item)
    if (this.links.el.lastElementChild === currentNavEl) {
      value = max;
    }

    this.progress
      .max(max)
      .value(value >= max ? value : value+10)
    ;

    //set the current nav item
    this.links.setCurrent(name);

    //center the current nav item in the nav  - yuck DOM stuff
    for (var i=0; i<this.links.items.length; ++i) {
      var item = this.links.items[i];
      if (item.classList.contains('is-current')) {

        var viewportCenter = this.el.offsetWidth/2;
        var itemCenter = item.offsetLeft+item.offsetWidth/2;

        if (itemCenter > viewportCenter) {
          this.el.scrollLeft = itemCenter-viewportCenter; //scroll left
        } else {
          this.el.scrollLeft = viewportCenter-itemCenter; //scroll right - not tested
        }

      }
    }

    return this;
  },

  /**
   * Set whether the navigation item is displayed disabled
   * @param   {string}    name
   * @param   {boolean}   disabled
   * @returns {View}
   */
  setDisabled: function(name, disabled) {
    this.links.setDisabled(name, disabled);
    return this;
  }

});
