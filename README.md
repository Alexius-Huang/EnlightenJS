# EnlightenJS
## Simple HTML Lightbox Parser

EnlightenJS is built by Maxwell Alexius, it is a simple JavaScript plugin that can render out HTML pop out lightbox with just a few lines of code.

## <span id="main">Manual</span>
- <a href="#readme-getting-started">Getting Started</a>
- <a href="#readme-enlighten-structure">Enlighten Box Structure</a>
- <a href="#readme-enlighten-image">Enlighten Image</a>

## <span id="readme-getting-started">Getting Started</span>

You can clone this repository and include the JS and CSS file in your HTML document :

```html
<script src="enlighten.js"></script>
<link rel="stylesheet" href="enlighten.css">
```

You can try to add simple code using Enlighten object :

```html
<script>
  Enlighten({
    title: 'Hello World!',
    content: 'You are using EnlightenJS!'
  });
</script>
```

<img src="./img/getting_started_01.png" />

Simple but it can be more useful when it occurs to a confirm box combine with returned `Promise` object :

```js
Enlighten({
  title: 'Are you sure ?',
  content: 'You are going to use EnlightenJS',
  confirmBtn: true,
  cancelBtn: true,
  closeBtn: false,
  allowOutsideClick: false
}).then(function() {
  /* When user clicked confirm button */
  Enlighten({
    title: 'Congratulation!'
  });
}).catch(function() {
  /* When user clicked cancel button */
  Enlighten({
    title: 'Try it again ~ Please ~'
  });
});
```

<img src="./img/getting_started_02.png" />

Check out the <a href="#main">manual</a> to see other features which is provided by EnlightenJS!

## <span id="readme-enlighten-structure">Enlighten Box Structure</span>

Under Construction

## <span id="readme-enlighten-image">Enlighten Image</span>

Add image to Enlighten box is simple, using the `imageURL` attribute and give the URL of the image file, it will automatically help you resize the image and render it in a beautiful format :

```js
Enlighten({
  title: 'A Wonder Cat',
  content: 'Cat is full of wonder ~',
  imageURL: IMAGE_SOURCE_URL
});
```

<img src="./img/enlighten_image_01.png" />

There are other attributes you can use, such as using `width` property to resize the Enlighten box or `imageWidth` to resize the width of the image :

```js
Enlighten({
  title: 'A wonder Cat',
  content: 'Cat is full of wonder ~',
  imageURL: IMAGE_SORCE_URL,
  width: 700,
  imageWidth: 600
});
```

<img src="./img/enlighten_image_02.png" />

<a href="#main">Back To Menu</a>

## <span id="readme-enlighten-form">Enlighten Form</span>

Under Construction
