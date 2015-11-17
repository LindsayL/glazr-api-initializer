# glazr-persistor

#####Currently supports glazr components:
- glazr-persistor

#####Usage
```
var
  initializer = new (require('glazr-api-initializer'))();

// This will add a glazr-persistor object to this.persistor.
initializer.initComponents('triageForm', orgConfig, this, ['persistor']);
```

### initComponents(apiName, orgConfig, thisObject, requiredComponents
######@param {string} apiName - The name of the api we getting components for.
######@param {object} orgConfig - The complete organization configuration.
######@param {object} thisObject - The "this" object of the api you are initializing.  Will initialize a param in 'this' for each recognized component.
######@param {object} requiredComponents - The components to initialize on the thisObject.

This function attempts to initialize all the requiredComponents of the requested api.  It will first look for details about the components under the api in orgConfig, then it will look for a default config for the component at the top level, otherwise it will use a default configuration.

######Defaults
-persistor: MultiFile type
