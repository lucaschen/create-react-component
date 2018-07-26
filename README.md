# create-react-component

An Atom package for generating React components.

I got sick and tired of typing the following files:

`index.js`:

```js
import ComponentName from "./ComponentName";

export default ComponentName;
```

`ComponentName.js`:

```js
// @flow

import React, { Component } from "react";

import s from "./ComponentName.scss";

export default class ComponentName extends Component<{}> {
  render() {
    return (
      <div>
        <h1>ComponentName</h1>
      </div>
    );
  }
}
```

And also a blank `ComponentName.scss` file, so this package basically does that for you.

Also supports stateless components. React Native support coming soon.
