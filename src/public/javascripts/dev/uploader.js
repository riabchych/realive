Uploader = {
   options: {
      url: '',
      dropBox: {},
      imageFile: {},
      paramname: {},
      data: {},
      csrf: '',
      chooseButton: {},
      onChange: emptyFunction,
      onDragEnter: emptyFunction,
      onDragLeave: emptyFunction,
      onDragOver: emptyFunction,
      onDrop: emptyFunction,
      onBeforeUpload: emptyFunction,
      onProgress: emptyFunction,
      onLoad: emptyFunction
   },
   over: {},
   leave: {},
   init: function(options) {
      this.options = extend(this.options, options);

      this.options.dropBox = getById(this.options.dropBox);
      this.options.imageFile = getById(this.options.imageFile);
      this.options.chooseButton = getById(this.options.chooseButton);

      this.options.imageFile.addEvent("change", function(e) {
         Uploader.traverseFiles(this.files);
      }, false);

      this.leave = this.options.dropBox.firstChild.nextSibling;
      this.over = this.options.dropBox.lastChild.previousSibling;

      document.addEvent("dragover", function(e) {
         e.preventDefault();
         var target = e.target;
         if (target && target === Uploader.options.dropBox || target.parentNode === Uploader.options.dropBox) {
            Uploader.options.dropBox.className = "over";
            Uploader.leave.style.display = 'none';
            Uploader.over.style.display = 'block';
            Uploader.over.innerHTML = 'РћС‚РїСѓСЃС‚РёС‚Рµ РєРЅРѕРїРєСѓ РјС‹С€Рё С‡С‚РѕР±С‹ Р·Р°РіСЂСѓР·РёС‚СЊ С„РѕС‚РѕРіСЂР°С„РёСЋ';
         } else {
            Uploader.options.dropBox.className = "";
            Uploader.leave.style.display = 'none';
            Uploader.over.style.display = 'block';
            Uploader.over.innerHTML = 'РџРµСЂРµС‚Р°С‰РёС‚Рµ С„РѕС‚РѕРіСЂР°С„РёСЋ СЃСЋРґР°';
         }

      }, false);

      document.addEvent("dragend", function(e) {
         e.preventDefault();
         var target = e.target;
         Uploader.options.dropBox.className = "";
         Uploader.leave.style.display = 'block';
         Uploader.over.style.display = 'none';
      }, false);

      document.addEvent("drop", function(e) {
         e.preventDefault();
         var target = e.target;
         Uploader.options.dropBox.className = "";
         Uploader.leave.style.display = 'block';
         Uploader.over.style.display = 'none';

         if (target && target === Uploader.options.dropBox || target.parentNode === Uploader.options.dropBox) {

            Uploader.options.onDrop(e);
            Uploader.traverseFiles(e.dataTransfer.files);
         }
         this.className = "";
      }, false);
   },

   getBuilder: function(file, filedata, boundary) {
      var dashdash = '--', crlf = '\r\n', builder = '';

      each(this.options.data, function(i, val) {
         if ( typeof val === 'function')
            val = val();
         builder += dashdash;
         builder += boundary;
         builder += crlf;
         builder += 'Content-Disposition: form-data; name="' + i + '"';
         builder += crlf;
         builder += crlf;
         builder += val;
         builder += crlf;
      });

      builder += dashdash;
      builder += boundary;
      builder += crlf;
      builder += 'Content-Disposition: form-data; name="' + this.options.paramname + '"';
      builder += '; filename="' + encodeURI(file.name) + '"';
      builder += crlf;

      builder += 'Content-Type: ' + file.type || 'application/octet-stream';
      builder += crlf;
      builder += crlf;

      builder += filedata;
      builder += crlf;

      builder += dashdash;
      builder += boundary;

      builder += crlf;
      return builder;
   },

   uploadFile: function(file) {
      if (Uploader.checkBrowser() && (/image/i).test(file.type)) {
         var reader = new FileReader();
         Uploader.options.onBeforeUpload(file);
         reader.addEvent('loadend', Uploader.send);
         reader.readAsBinaryString(file);
      }
   },

   checkBrowser: function() {
      return (window.File && window.FileReader) ? true : false;
   },

   send: function(e) {
      xhr = new XMLHttpRequest();
      
      xhr.onreadystatechange = Uploader.onreadystatechange;
    
      start_time = new Date().getTime();
      boundary = '----imageboundary' + (new Date).getTime();
      xhr.upload.file = Uploader.options.imageFile;
      xhr.upload.downloadStartTime = start_time;
      xhr.upload.currentStart = start_time;
      xhr.upload.currentProgress = 0;
      xhr.upload.startData = 0;
      
      builder = e.target.result ? Uploader.getBuilder(xhr.upload.file, e.target.result, boundary) : xhr.upload.file;

      xhr.upload.addEvent("progress", function(e) {
         Uploader.options.onProgress(e);
      }, false);

      xhr.upload.addEvent("load", function(e) {
         try { response = eval("(" + xhr.responseText + ")"); }
        catch(err) { response = {}; }
      }, false);
      xhr.upload.addEvent("error", function(e) {
         Uploader.options.onLoad(xhr.responseText);
      }, false);

      xhr.open("POST", Uploader.options.url);

      xhr.setRequestHeader('Content-type', 'multipart/form-data; boundary="' + boundary + '"');
      xhr.setRequestHeader('Cache-Control', 'no-cache');
      xhr.setRequestHeader('X-File-Name', xhr.upload.file.name);
      xhr.setRequestHeader('X-File-Size', xhr.upload.file.size);
      xhr.setRequestHeader('X-File-Type', xhr.upload.file.type);
      if(Uploader.options.csrf) {
          xhr.setRequestHeader('X-CSRF-Token',Uploader.options.csrf);
      }
      if (xhr.sendAsBinary) {// Gecko
         xhr.sendAsBinary(builder);
      } else {// WebKit with typed arrays support
         var ui8a = new Uint8Array(builder.length);
         for (var i = 0; i < builder.length; i++) {
            ui8a[i] = (builder.charCodeAt(i) & 0xff);
         }
         try {
            xhr.send(ui8a);
        } catch(error) {
            xhr.send(ui8a.buffer);
        }
      }
   },

    onprogress: function(e) {
      if (e.lengthComputable) {
        var percentage = Math.round((e.loaded * 100) / e.total);
        itemUI.progress(percentage);
      }
    },
  
    onComplete: function() {
      var response; 

      if (xhr.status == 201 || xhr.status == 200) {

        try { response = eval("(" + xhr.responseText + ")"); }
        catch(err) { response = {}; }
        this.options.onLoad(response);
      }
    },
  
    onreadystatechange: function() {
      if (xhr.readyState == 4) { Uploader.onComplete(); }
    },

   traverseFiles: function(files) {
      if ( typeof files !== "undefined") {
         for (var i = 0, l = files.length; i < l; i++) {
            this.options.imageFile = files[i];
            this.uploadFile(files[i]);
         }
      } else {
         console.log("No support for the File API in this web");
      }
   }
};