(function ($) {

  $('.main-nav').addClass("crNavigation-processed");

  setUpNav();
  
  function setUpNav() {
    $('#main-menu .menu-item a').wrapInner('<span class="menu-item__text"></span>');

    duplicateParentLink();
    toggleMenu();
    stickyNav();

    /* Setup the Smartmenus plugin with our main menu */
    $('#main-menu').smartmenus({
      subIndicatorsText: "",
      keepHighlighted: false,
      hideOnClick: true,
    });

    /* Bind the 'show' function to also hide all the other submenus */
    $('#main-menu').bind('activate.smapi', function (e, menu) {
      $('#main-menu').smartmenus('menuHideAll');
    });
  }

  /* Updates empty duplicate link (added by template) with the parent item's text and link, dynamically */
  function duplicateParentLink() {
    /* Update text and link */
    $('.navigation > .main-nav__items > .menu-item--expanded').each(function () {

      $this = $(this);

      // Allow our duplicate link to 'inherit' all active classes if present
      var activeTrailClass = $this.hasClass('menu-item--active-trail') ? 'menu-item--active-trail' : '';
      var isActiveClass = $this.children('a').hasClass('is-active') ? 'is-active' : '';
    
      $thisDuplicate = $this.children('ul.main-nav__items').find('.menu-item--duplicate');

      $thisLink = $this.children('a');

      $thisDuplicate.addClass(activeTrailClass) // Add activeclass to li item
        .children('a').addClass(isActiveClass) // Add active class to link itself
          .attr('href', $thisLink.attr('href'))  // Add active class and url
            .children('span').text($thisLink.text()); // Add link copy
    });
  }

  function toggleMenu() {
    $('a.main-nav-toggle').on('click', function (e) {

      // Change state for visual effect.
      $(this).toggleClass('is-active');

      // Change state of menu itself.
      $('#main-menu', $(this).parents('.main-nav__wrapper')).toggleClass('menu-open');

      // Close all menus if we've closed the nav
      if (!($(this).hasClass('is-active'))) {
        $('.main-nav__wrapper:not(.main-nav--feature__wrapper) li.item-open').removeClass('item-open');
      };
    });

    toggleSubMenu();
    focusState();        
  }

  function toggleSubMenu() {

    $context = $('.main-nav__wrapper:not(.main-nav--feature__wrapper) .navigation');

    $('li.menu-item--expanded > a', $context).on('click', function (e) {

      // Basic check to see if the mobile nav is use before making
      // the parent link function as a 'button' rather than a link
      if ( $('.main-nav__burger').is(":visible")) {

        e.preventDefault();

        $listItem = $(this).parent('li.menu-item--expanded');
        $listItemParents = $listItem.parents('li.item-open');

        // Remove any 'item-open' classes and add class to clicked item
        $('li.item-open', $context).not($listItem).not($listItemParents).removeClass('item-open');

        $($listItem).toggleClass('item-open');
      }
    });    
  }

  function focusState() {

    // Set our context for non-feature nav
    $context = $('.main-nav__wrapper .navigation');

    // To store the currently focused/blurred anchor
    var $thisAnchor = null;
    var focusState = false;

    // Cache our selectors
    var $subAnchor = $('li.menu-item--expanded > a ~ ul li a', $context);
    var $parentAnchor = $('li.menu-item--expanded > a', $context);
    var $parentLi = $('li.menu-item--expanded', $context);

    $('html body a').on('focus blur', function(e) {
      
      // Cache the anchor being focused/blurred
      $thisAnchor = $(this);

      /* FOCUS event */
      if ( e.type == "focus" ? true : false ) {

        // Focussed on a non-nav anchor? Remove active states
        if (!($thisAnchor.is($('a', $context)))) {
          $parentLi.removeClass("focused"); 
        }

        // If we're focussing on a nav item anchor, add focus class to the parent li, so we can affect all subnav styling
        else {
          
          if ($thisAnchor.is($parentAnchor)) {
            // Unfocus all other focussed parent items
            $parentLi.removeClass("focused");
            $(this).closest( $parentLi ).addClass("focused");
          }

          // Else, check its not a subitem, then remove focus class from all nav item
          else if (!($thisAnchor.is($subAnchor))) {
            $parentLi.removeClass("focused"); 
          }
        }
      }

      /* BLUR event */
      else {

        // If we're blurring away from the last-child subnav item, remove our overall focus class from the menu
        if ($thisAnchor.is($subAnchor)) {
          $thisAnchor.parent('li:last-child').closest('li.focused').removeClass("focused");
        }
      }
    });
  }

  function stickyNav() {

    console.log("stickNav init");

    // Wrap this in a doc ready function so 'page loading' scrolls don't trigger this early
    $(document).ready(function() {

      console.log("stickNav doc ready");

      // Cache the our 'sticky nav' header only
      $thisHeader = $('.navigation.sticky-nav').closest('header').addClass('sticky-nav__header');

      $(window).scroll(function() {
        // Toggle between our 'scrolling' classes to let us add a background colour
        // to the sticky nav once it's being scrolled down the page
        $thisHeader.toggleClass('scrolling', $(window).scrollTop() > 0);
      });
    }
  }
})(jQuery);
