var Presenter = {
  defaultPresenter: function(xml) {
    if(this.loadingIndicatorVisible) {
      navigationDocument.replaceDocument(xml, this.loadingIndicator);
      this.loadingIndicatorVisible = false;
    } else {
      navigationDocument.pushDocument(xml);
    }
  },

  modalDialogPresenter: function(xml) {
    navigationDocument.presentModal(xml);
  },

  getVideoURL: function(token, id, callback){
    first = -1
    last = -1

    for(i=0; i<token.length;i++) {
      if(i > 4 && i < token.length - 4){
        if(!isNaN(token[i])) {
          if(first < 0) {
            first = i
          } else if(last < 0){
            last = i
          }
        }
      }
    }

    splits = token.split('')
    firstValue = splits[first]
    lastValue = splits[last]
    splits[first] = lastValue
    splits[last] = firstValue

    url = "http://ida.omroep.nl/odi/?prid=" + id + "&puboptions=adaptive&adaptive=yes&part=1&token=" + splits.join('')

    UitzendingGemist.get(url, function(data){
      stream_url = data['streams'][0].split('&')[0]

      UitzendingGemist.get(stream_url, function(data){
        callback(data['url'])
      })
    })
  },

  menuBarItemPresenter: function(xml, element) {
    var feature = element.parentNode.getFeature("MenuBarDocument");
    if (feature) {
      var currentDoc = feature.getDocument(element);
      if (!currentDoc) {
        feature.setDocument(xml, element);
      }
    }
  },

  searchPresenter: function(xml, element) {
    this.menuBarItemPresenter.call(this, xml, element);
    var doc = xml;

    var searchField = doc.getElementsByTagName("searchField").item(0);
    var keyboard = searchField.getFeature("Keyboard");

    keyboard.onTextChange = function() {
      var searchText = keyboard.text;
      console.log('search text changed: ' + searchText);
      buildResults(doc, searchText);
    }
  },

  load: function(event) {
    var self = this,
    element = event.target,

    view = element.getAttribute("view")

    episodeID = element.getAttribute("episode")
    seriesID = element.getAttribute("series")
    
    channel = element.getAttribute("channel")

    switch(view) {
      case "live":
        resourceLoader.loadResource(resourceLoader.BASEURL + "templates/Live.xml.js",
          {},
          function(resource) {
            if (resource) {
              var doc = self.makeDocument(resource);
              doc.addEventListener("select", self.load.bind(self));
              self.menuBarItemPresenter.call(self, doc, element);
            }
          }
        )
      break
      case "popular":
        Episode.popular(function(episodes){
          resourceLoader.loadResource(resourceLoader.BASEURL + "templates/Popular.xml.js",
            episodes,
            function(resource) {
              if (resource) {
                var doc = self.makeDocument(resource);
                doc.addEventListener("select", self.load.bind(self));
                self.menuBarItemPresenter.call(self, doc, element);
              }
            }
          )
        })
      break
      case "recent":
        Episode.recent(function(episodes){
          resourceLoader.loadResource(resourceLoader.BASEURL + "templates/Recent.xml.js",
            episodes,
            function(resource) {
              if (resource) {
                var doc = self.makeDocument(resource);
                doc.addEventListener("select", self.load.bind(self));
                self.menuBarItemPresenter.call(self, doc, element);
              }
            }
          )
        })
      break
      case "search":
        resourceLoader.loadResource(resourceLoader.BASEURL + "templates/Search.xml.js",
          [],
          function(resource) {
            if (resource) {
              var doc = self.makeDocument(resource);
              doc.addEventListener("select", self.load.bind(self));
              self.searchPresenter.call(self, doc, element);
            }
          }
        )
      break
      case "episode":
        self.showLoadingIndicator();

        Episode.find(episodeID, seriesID, function(episode){
          resourceLoader.loadResource(resourceLoader.BASEURL + "templates/Episode.xml.js",
            episode,
            function(resource) {
              if (resource) {
                var doc = self.makeDocument(resource);
                doc.addEventListener("select", self.load.bind(self));
                self.defaultPresenter.call(self, doc);
              }
            }
          )
        })
      break
      case "video":
        var player = new Player();
        var playlist = new Playlist();

        self.getVideoURL(npoplayer.token, episodeID, function(url){
          var mediaItem = new MediaItem("video", url);

          player.playlist = playlist;
          player.playlist.push(mediaItem);
          player.present();
        })
      break
      case "liveVideo":
        var player = new Player();
        var playlist = new Playlist();
        
        var url = "http://l2cm305f07462a00563fbd54000000.d30a0b36ce8eb7a8.smoote2m.npostreaming.nl/d/live/npo/tvlive/ned" + channel + "/ned" + channel + ".isml/ned" + channel + ".m3u8";

        var mediaItem = new MediaItem("video", url);

        player.playlist = playlist;
        player.playlist.push(mediaItem);
        player.present();
      break
    }
  },

  makeDocument: function(resource) {
    if (!Presenter.parser) {
      Presenter.parser = new DOMParser();
    }

    var doc = Presenter.parser.parseFromString(resource, "application/xml");
    return doc;
  },

  showLoadingIndicator: function() {
    if (!this.loadingIndicator) {
      this.loadingIndicator = this.makeDocument(this.loadingTemplate);
    }

    if (!this.loadingIndicatorVisible) {
      navigationDocument.pushDocument(this.loadingIndicator);
      this.loadingIndicatorVisible = true;
    }
  },

  removeLoadingIndicator: function() {
    if (this.loadingIndicatorVisible) {
      navigationDocument.removeDocument(this.loadingIndicator);
      this.loadingIndicatorVisible = false;
    }
  },

  loadingTemplate: `<?xml version="1.0" encoding="UTF-8" ?>
    <document>
      <loadingTemplate>
        <activityIndicator>
          <text>Loading...</text>
        </activityIndicator>
      </loadingTemplate>
    </document>`
}
