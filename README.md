# tappivate.js

Ever thought your buttons and lists in your mobile web app feel a bit _clunky_? This Zepto (and jQuery) plugin can help!

## What is this?

Native mobile apps are built with the iOS/Android/WP SDK, which provides a rich  set of UI components. These components have been optimised to work well on touchscreen devices.

Mobile web apps, on the other hand, suffer from a lack of a mobile SDK. As a result, UI components have not been optimised for touchscreen devices and can often feel clunky.

Tappivate is a small Zepto (or jQuery) plugin which aims to emulate the behaviour of two UI components, buttons and lists, in an attempt to make them feel more responsive.

## How does it do that?

Native buttons and lists use certain rules when tapped to feel more responsive. Tappivate emulates these rules in JavaScript, as described below.

## Show me some code!

OK... the following code adds tappivate's functionality to all children of `container`.

```
<div id="container">
  <button data-tap="btn">Tap Me!</button>
  <ul data-tap="list">
    <li>Item 1</li>
    <li>Item 2</li>
    <li>Item 3</li>
  </ul>
  <ul data-tap="list nav">
    <li>Nav Link 1</li>
    <li>Nav Link 2</li>
    <li>Nav Link 3</li>
  </ul>
</div>
```
```
$('#container').tappivate();
```

## Demo me!

Check out [the demo page](http://fiznool.github.com/tappivate/example.html) on an iOS or Android device. Notice the active states on the buttons and list items - they follow the rules listed below.

## What does this all do?

Tappivate searches for buttons and lists marked up with a `data-tap` attribute. Once it finds these elements, it applies the following rules to each, based on touch events on the element. 

These rules are designed to match native buttons and lists. For more information on this, check out [Aanand Prasad's article on jquery.tappable](http://aanandprasad.com/articles/jquery-tappable/).

### Button

`<button data-tap="btn">Tap Me!</button>`

<table>
  <thead>
    <tr>
      <th>Event</th>
      <th>Action</th>
      <th>Delay (ms)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>touchstart</code></td>
      <td><code>addClass('active')</code></td>
      <td>0</td>
    </tr>
    <tr>
      <td><code>touchend</code></td>
      <td><code>removeClass('active')</code></td>
      <td>100</td>
    </tr>
  </tbody>
</table>

When touched, a button will instantly add an `active` class. When the touch ends, the class is retained for a short period of time (100ms) to provide the user with feedback that the button was tapped once his/her finger is removed from the screen.

### List

There are two types of lists: regular list and navigation lists.

#### Regular List

```
<ul data-tap="list">
  <li>Item 1</li>
  <li>Item 2</li>
  <li>Item 3</li>
</ul>
```

This type of list remains active even after a touchend. This is useful in the case where the entire list will be removed from the DOM after an item is tapped, e.g. if you are building a full-page list view which transitions to a full-page detail view.

<table>
  <thead>
    <tr>
      <th>Event</th>
      <th>Action</th>
      <th>Delay (ms)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>touchstart</code></td>
      <td><code>addClass('active')</code></td>
      <td>150</td>
    </tr>
    <tr>
      <td><code>touchmove</code></td>
      <td><code>removeClass('active')</code></td>
      <td>0</td>
    </tr>
  </tbody>
</table>

A list item will not become active the instant it is touched, instead it will wait for a short period of time (150ms) to see if a touchmove (scroll) is registered. A touchmove will prevent the list item being highlighted, otherwise after a short delay the list item will be highlighted on touchstart.

A regular list item remains highlighted to indicate that the selection is chosen, even after touchend.

#### Navigation List

```
<ul data-tap="list nav">
  <li>Nav 1</li>
  <li>Nav 2</li>
  <li>Nav 3</li>
</ul>
```

An extension to a regular list, a nav list adds the touchend handler to deactivate a list item when it is tapped. This is useful for static navigation lists which remain in the DOM, e.g. a fixed nav bar at the top of a page.

A nav list should be targeted with a regular list `data-tap` attribute too, to ensure the touchmove on scrolling is present.

<table>
  <thead>
    <tr>
      <th>Event</th>
      <th>Action</th>
      <th>Delay (ms)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>touchend</code></td>
      <td><code>removeClass('active')</code></td>
      <td>0</td>
    </tr>
  </tbody>
</table>

## Delegated Events

tappivate uses Zepto/jQuery delegated events to ensure that all buttons/lists with the `data-tap` markup nested inside the `container` div will continue to act as described, even those that are added to the DOM after tappivate was initialised. This makes it perfect for use in a single-page app which constantly modifies the DOM. [Unobtrusive JavaScript at its finest](http://blog.socialcast.com/unobtrusive-javascript-2/).

## Where is this used?

It has already been used in production, as part of the [Mobile Backbone Boilerplate](https://github.com/fiznool/mobile-backbone-boilerplate) library. There are probably bugs, though - pull requests are welcome.

## I want some more!

More details on why I wrote this plugin can be found on [my blog](http://fiznool.com/blog/2012/10/11/tappivate-dot-js/).