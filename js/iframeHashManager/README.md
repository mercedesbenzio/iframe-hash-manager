# iframe-hash-manager
Effortlessly synchronize a window's location hash with the hashes of multiple iframes in the site.

<a target="_blank" href="https://image.ibb.co/mCjPD5/Screen_Shot_2017_05_09_at_14_16_43.png">
  <img src="https://image.ibb.co/mCjPD5/Screen_Shot_2017_05_09_at_14_16_43.png" width="300px">
</a>


## Usage
**First: Assign an ID to all your SPA iframes.**

As script from `dist/iframeHashManager.js`:
```html
<iframe id="facebook-killer" class='spa'></iframe>
<iframe id="instagram-killer" class='spa'></iframe>
<script src="js/iframeHashManager.js"></script>
<script >iframeHashManager.default(window)</script>
```

As ES5 module. The second parameter is optional, the selector defaults to 'iframe'.

```js
var iframeHashManager = require('iframeHashManager')
iframeHashManager.default(window, '.spa')
```

or as ES6 module.

```js
import iframeHashManager from 'iframeHashManager'
iframeHashManager(window, '.spa')
```

## Good Luck!
<img src="https://hugelolcdn.com/hugegifs.com/i/687.gif">

TODOS
- add option to sync only one iframe
