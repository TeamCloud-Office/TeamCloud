(function () {
  const LocalStorage = /** @class */ (function () {

      function LocalStorage(path, prettyPrint) {
          this._path = path;
          this._storageData = loadStorageData(path);
          if (prettyPrint)
              this.encode = (value) => JSON.stringify(value, '', 2);
          else 
              this.encode = (value) => JSON.stringify(value);
      }

      LocalStorage.prototype.getPath = function () {
          return this._path;
      };
      
      LocalStorage.prototype.getData = function () {
          return this._storageData;
      }
      
      LocalStorage.prototype.getKeys = function () {
          return Object.keys(this._storageData);
      }

      LocalStorage.prototype.hasItem = function (key) {
          return key in this._storageData;
      };

      LocalStorage.prototype.setItem = function (key, value) {
          this._storageData[key] = value;
      };

      LocalStorage.prototype.getItem = function (key, /*optional*/ def) {
          if (!def) def = null;

          if (!(key in this._storageData))
              return def;
          return this._storageData[key];
      };
      
      LocalStorage.prototype.removeItem = function (key) {
          if (key in this._storageData)
              delete this._storageData[key];
      }
      
      LocalStorage.prototype.removeIf = function(predicate) {
          for (let key of Object.keys(this._storageData)) {
              if (predicate(key, this._storageData[key]))
                  removeItem(key);
          }
      }

      LocalStorage.prototype.save = function () {
          let file = new java.io.File(this._path);
          if (!file.exists()) {
              file.parentFile.mkdirs();
              file.createNewFile();
          }
          FileStream.write(
              this._path, 
              this.encode(this._storageData)
              );
      };
      
      LocalStorage.prototype.edit = function(block) {
          block.call(this);
          this.save();
      };

      // Private...
      function loadStorageData(filePath) {
          let exists = new java.io.File(filePath).exists();
          if (!exists)
              return {};

          try {
              let raw = FileStream.read(filePath);
              return JSON.parse(raw);
          } catch(e) {
              Log.e("Failed to parse LocalStorage data: " + e);
          }

          return {};
      }

      return LocalStorage;
  }());

  module.exports = {
      LocalStorage: LocalStorage
  };
})();