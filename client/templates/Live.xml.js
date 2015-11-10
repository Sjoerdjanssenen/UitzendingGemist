var Template = function(episodes) {
  function getChannels(){
    output = ``

    for(i=1; i < 4; i++){
      episode = episodes[i]
      
      var url
      
      if (i == 1) {
	    url = "http://l2cm0196867658005640f79c000000.314190030753f0d3.smoote2g.npostreaming.nl/d/live/npo/tvlive/ned1/ned1.isml/ned1-audio=128000-video=900000.m3u8"
      } else if (i == 2) {
	    url = "http://l2cm16a235ca1900563fc155000000.628e982069e08f14.smoote2h.npostreaming.nl/d/live/npo/tvlive/ned2/ned2.isml/ned2.m3u8"
      } else if (i == 3) {
	    url = "http://l2cm305f07462a00563fbd54000000.d30a0b36ce8eb7a8.smoote2m.npostreaming.nl/d/live/npo/tvlive/ned3/ned3.isml/ned3.m3u8"
      }

      output += `<lockup view="liveVideo" liveURL="`+url+`">
        <img src="`+resourceLoader.BASEURL +`img/npo`+i+`.png" width="460" height="230"/>
        <title>NPO `+i+`</title>
      </lockup>`
    }

    return output;
  }

  return `<?xml version="1.0" encoding="UTF-8" ?>
  <document>
    <stackTemplate>
      <collectionList>
        <grid>
          <header>
            <title>NPO Kanalen</title>
          </header>
          <section>` + getChannels() + `</section>
        </grid>
      </collectionList>
    </stackTemplate>
  </document>`
}
